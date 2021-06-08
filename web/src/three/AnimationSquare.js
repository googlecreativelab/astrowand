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

export default class AnimationSquare extends CanvasAnimation {
  constructor(w, h, duration) {
    super(w, h, duration);
  }

  drawIn(ctx, progress) {
    this.clear();
    const size = this.width * 0.625;
    ctx.strokeStyle = `rgba(255,255,255,${progress})`;
    ctx.lineWidth = 8;
    const { x, y } = this.center;
    const offset = size * 0.5;
    ctx.strokeRect(x - offset, y - offset, offset * 2, offset * 2);
  }
  drawOut(ctx, progress) {
    this.clear();
    const size = this.width * 0.625;
    ctx.strokeStyle = `rgba(255,255,255,${1 - progress})`;
    const { x, y } = this.center;
    const offset = size * 0.5;
    ctx.strokeRect(x - offset, y - offset, offset * 2, offset * 2);
  }
}
