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

/**
 * @author Rikard Lindstrom <rlindstrom@google.com>
 */

import CanvasAnimation from "./CanvasAnimation";
const TWO_PI = 2 * Math.PI;

export default class AnimationCircle extends CanvasAnimation {
  constructor(w, h) {
    super(w, h, 4);
  }

  get radius(){
    return this.width / 3;
  }

  drawIn(ctx, progress) {
    //this.clear();
   
    const radius = this.radius;
    const { x, y } = this.center;
    ctx.strokeStyle = `rgba(255,255,255,${0.01})`;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, progress * Math.PI * 10);
    ctx.stroke();
    // if(progress <= 0.5){
    //   const transitionProgress = progress * 2;
    
    //   ctx.fillStyle = `rgba(255,255,255,1)`;
    //   ctx.lineWidth = 7;
      
    //   const p = transitionProgress * TWO_PI;
    //   const cx = Math.cos(p) * radius;
    //   const cy = Math.sin(p) * radius;
    //   ctx.fillRect(x + cx, y + cy, 5, 5);

    // } else{
    //    ctx.strokeStyle = `rgba(255,255,255,${0.01})`;
    //   ctx.strokeWidth = 6;
    //   ctx.beginPath();
    //   ctx.arc(x, y, radius, 0, Math.PI * 2);
    //   ctx.stroke();
    // }
  }

  drawOut(ctx, progress){
    this.clear();
    const radius = this.radius;
    const { x, y } = this.center;
    ctx.strokeStyle = `rgba(255,255,255,${1. - progress})`;
    ctx.lineWidth = 8 * (1 - progress);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}
