/**
Copyright 2021 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
* @author Rikard Lindstrom <rlindstrom@google.com>
*/

attribute float scale;
uniform float uTime;
uniform mat4 uRotationMatrix;
uniform vec2 uResolution;
uniform float uZoffset;

uniform vec3 uColor;
uniform sampler2D uShapeTex;
uniform float uExtent;
varying float alpha;
varying vec3 color;
flat varying int starTexture;

float hash21(vec2 p){
    return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    float rand = hash21(position.yx);

    alpha = 1.0;
    //  alpha = smoothstep(0., .7,  hash21(position.xy));
  

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // mvPosition.z += uTime * 300.0;
    mvPosition.z += uZoffset;
    mvPosition.z = mod(mvPosition.z, uExtent) - uExtent;

    vec4 screenSpacePosition = projectionMatrix * mvPosition;
    vec3 ndc = screenSpacePosition.xyz / screenSpacePosition.w; //perspective divide/normalize
    ndc.x *= uResolution.x / uResolution.y;
    
    vec2 uv = ndc.xy * 0.5 + 0.5; //ndc is -1 to 1 in GL. scale for 0 to 1

    mvPosition.z +=  texture2D(uShapeTex, uv).r * 130.0;

    bool sparkle = true;//hash21(position.xy + floor(uTime)) > .9;


    vec3 colorization = vec3(.6 + rand, .9, .6 + hash21(uv));
   
    // color = mix(uColor, vec3(1), rand * rand) * (50.0 / - mvPosition.z);
    float zz = (120.0 / - mvPosition.z);
    
    color = mix(colorization, vec3(1), rand) * zz * zz;
    

     if(sparkle){
        color *= 1. - max(0., cos(rand * 137. + uTime) - 0.98) * 50.0;
    }

    gl_PointSize = scale * ( 100.0 / - mvPosition.z ) + step(.2, hash21(position.xy) * 1.);
    gl_PointSize *= rand > .9 ? 10. : 5.;
    //if(mvPosition.z < -uExtent * 0.7){

    starTexture = rand > .5 ? 1 : 0;

//        vec2 viewportPixelCoord = viewportCoord * vec2();
        color *= 0.4;

        // color *= 1.0 + texture2D(uShapeTex, position.xy * 0.01 + 0.5).r * 10.0;
        // gl_PointSize += texture2D(uShapeTex, position.xy * 0.01 + 0.5).r * 10.;


        // color *= 1.0 + texture2D(uShapeTex, uv).r * 20.0;
        // gl_PointSize += texture2D(uShapeTex, uv).r * 10.;
    // } else {
    //     
    // }
    if( starTexture == 0 ) {
        gl_PointSize *= 0.2;
    }

    gl_PointSize = min(30.0, gl_PointSize);

color *= vec3(1., 0.95, 0.8);
    alpha = 1.0;//min(1.0,length(color));

    gl_Position = screenSpacePosition;
}