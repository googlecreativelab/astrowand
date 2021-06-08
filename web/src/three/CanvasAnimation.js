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

const TRANSITION_IN = 'TRANSITION_IN';
const TRANSITION_OUT = 'TRANSITION_OUT';
const STOPPED = 'STOPPED';

export default class CanvasAnimation {
  constructor(w, h) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = w;
    this.canvas.height = h;
    this.transitionInDuration = 1;
    this.transitionOutDuration = 1;
    this.started = false;
    this.progress = 0;
    this.state = STOPPED;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get currentDuration(){
    if(!this.started) return 0;
    if(this.state === TRANSITION_IN) return this.transitionInDuration;
    if(this.state === TRANSITION_OUT) return this.transitionInDuration;
  }

  get center() {
    return {
      x: this.width / 2,
      y: this.height / 2,
    };
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  transitionIn(duration = 1) {
    this.started = true;
    this.state = TRANSITION_IN;
    this.transitionInDuration = duration;
    this.progress = 0;
    this.lastUpdateTime = performance.now();
  }

  transitionOut(duration = 1){
    this.transitionOutDuration = duration;
    this.state = TRANSITION_OUT;
    this.started = true;
    this.progress = 0;
    this.lastUpdateTime = performance.now();
  }

  update() {
    if (!this.started) return;
    const now = performance.now();
    const deltaTime = now - this.lastUpdateTime;
    this.lastUpdateTime = now;
    this.progress += (deltaTime * 0.001) / this.currentDuration;
    this.progress = Math.min(1, this.progress);

    switch (this.state) {
      case TRANSITION_IN:
        this.drawIn(this.ctx, this.progress);
        if (this.progress === 1) {
          this.started = false;
        }
        break;
      case TRANSITION_OUT:
        this.drawOut(this.ctx, this.progress);

        if (this.progress === 1) {
          this.started = false;
          this.state = STOPPED;
          this.onEnded && this.onEnded();
        }
        break;
      default:
        throw new Error("Unknown state");
    }
  }
}
