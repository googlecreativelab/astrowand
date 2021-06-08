// Copyright 2021 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     https://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as THREE from "three";

import starFieldFragmentShader from "./shaders/particles.frag";
import starFieldVertexShader from "./shaders/particles.vert";
import backgroundFragmentShader from "./shaders/background.frag";
import backgroundVertexShader from "./shaders/background.vert";

import TWEEN from "@tweenjs/tween.js";

import AnimationTriangle from "./AnimationTriangle";
import AnimationCircle from "./AnimationCircle";
import AnimationSquare from "./AnimationSquare";

// Adjust this based on CPU / GPU capabilities
const numParticles = 100000;

// Font (loaded with .load interface)

let starTexture;
let material;
let bgMaterial;
let previousAnimation = null;

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

const sawTooth = (x) => {
  x = x % 1;
  if (x < 0.5) return x * 2;
  return 1 - (x - 0.5) * 2;
};

let canvasCtx;
let canvasTexture;

class ShapeContainer {
  constructor(Animation) {
    this.Animation = Animation;
    this.animations = [];
  }

  createAnimation() {
    const anim = new this.Animation(
      canvasCtx.canvas.width,
      canvasCtx.canvas.height,
      4
    );
    anim.onEnded = () => {
      this.animations = this.animations.filter((a) => a !== anim);
    };
    this.animations.push(anim);
    anim.transitionIn(2);
    setTimeout(()=>{
      if(anim.state === 'TRANSITION_IN'){
        anim.transitionOut(10);
      }
    }, 5000);
    previousAnimation = anim;
  }

  update(ctx) {
    this.animations.forEach((anim) => {
      anim.update();
      ctx.drawImage(anim.canvas, 0, 0);
    });
  }
}


let shapes = {
  triangle: new ShapeContainer(AnimationTriangle),
  square: new ShapeContainer(AnimationSquare),
  circle: new ShapeContainer(AnimationCircle),
};


function setupCanvas() {
  const ctx = document.createElement("canvas").getContext("2d");
  if (false && location.href.includes("localhost")) {
    document.body.appendChild(ctx.canvas);
    Object.assign(ctx.canvas.style, {
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 999,
      // width: "64px",
      // height: "64px",
    });
  }

  ctx.canvas.width = 256;
  ctx.canvas.height = 256;
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  canvasCtx = ctx;

  canvasTexture = new THREE.CanvasTexture(ctx.canvas);
}

function updateCanvas() {

  canvasCtx.fillStyle = "#000";
  canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
  canvasCtx.strokeStyle = `#ffffff`;
  canvasCtx.lineWidth = 7;

  Object.values(shapes).forEach((shape) => {
    shape.update(canvasCtx);
  });

  canvasTexture.needsUpdate = true;
}

// Setup rendering and animation
function setup(container) {
  setupCanvas();

  const startTime = performance.now() * 0.001;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // this basically constitutes the bg color
  scene.fog = new THREE.FogExp2(0x333333, 0.001);

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(numParticles * 3);
  const scales = new Float32Array(numParticles);

  // initial randomization, positioning is more of a seed
  // for random / noise positioning in the shaders
  const randomRange = 400;
  for (let i = 0; i < numParticles * 3; i += 3) {
    const x = randomRange * Math.random() - randomRange * 0.5;
    const y = randomRange * Math.random() - randomRange * 0.5;
    const z = randomRange * Math.random() - randomRange * 0.5;

    positions[i + 0] = x;
    positions[i + 1] = y;
    positions[i + 2] = z;
    scales[i / 3] = 0.5;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

  const rotationMatrix = new THREE.Matrix4();

   material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xfff3bf) },
      uTime: { value: 0 },
      uRotationMatrix: { value: rotationMatrix },
      uTexture: { type: "t", value: starTexture },
      uShapeTex: { type: "t", value: canvasTexture },
      uExtent: { type: "f", value: 400 },
      uResolution: { value: new THREE.Vector2() },
      uZoffset: { value: 0 },
    },
    transparent: true,
    alphaTest: 0,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    vertexShader: starFieldVertexShader,
    fragmentShader: starFieldFragmentShader,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Background
  bgMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { type: "t", value: canvasTexture },
      uEnabled: { value: false },
      uResolution: { value: new THREE.Vector2() },
    },
    vertexShader: backgroundVertexShader,
    fragmentShader: backgroundFragmentShader,
    depthWrite: false,
    depthTest: false,
    alphaTest: 0,
    blending: THREE.AdditiveBlending,
  });

  const quad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    bgMaterial
    
  );
  scene.add(quad);

  
  camera.position.z = 100;

  function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001 - startTime;

    TWEEN.update(performance.now());

    updateCanvas();

    camera.position.x = Math.cos(time * 0.01);
    //rotationMatrix.makeRotationAxis(UP, rotAngle);

    material.uniforms.uTime.value = time - startTime;
    //  material.uniforms.uZoffset.value += 0.1;
    material.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight
    );

    bgMaterial.uniforms.uResolution.value.set(
      window.innerWidth * 8,
      window.innerHeight * 8
    );


    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener(
    "resize",
    function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
  );
  
}

// Set morph target digit and trigger animation
function triggerShape(shape) {

  if(previousAnimation){
    if(previousAnimation.state === 'TRANSITION_IN'){
      previousAnimation.transitionOut();
    }
  }
  
  shapes[shape].createAnimation();

  // if (shapes[shape].tween) {
  //   shapes[shape].tween.stop();
  // }

  // // Make sure we always return to zero, even if we
  // // where interupted mid-tween
  // const toZero = new TWEEN.Tween(shapes)
  //   .to({ [shape]: { strength: 0 } }, 10000)
  //   .easing(TWEEN.Easing.Quadratic.Out)
  //   .onComplete(()=>shapes.animationIn = 0)

  // const tween = new TWEEN.Tween(shapes)
  //   .to({ [shape]: { strength: 1, animationIn: 1 } }, 2000)
  //   .easing(TWEEN.Easing.Exponential.In)
  //   .chain(toZero)
  //   .start();

  new TWEEN.Tween(material.uniforms.uZoffset)
    .to({value: material.uniforms.uZoffset.value + 8}, 15000)
    .easing(TWEEN.Easing.Exponential.Out)

    .start();
  // shapes[shape].tween = tween;
}

function loadTextures() {
  return Promise.all([
    new Promise((resolve, reject) => {
      starTexture = new THREE.TextureLoader().load(
        "images/star.png",
        resolve,
        null,
        reject
      );
      starTexture.minFilter = THREE.NearestFilter;
      starTexture.maxFilter = THREE.NearestFilter;
    }),
  ]);
}

// Load font etc
function load() {
  return Promise.all([loadTextures()]);
}

// export interface
export default {
  triggerShape,
  setup,
  load,
};
