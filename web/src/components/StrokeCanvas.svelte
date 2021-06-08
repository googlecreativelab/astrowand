<script>
  import { strokeData } from "../store";

  let canvas;

  $: if ($strokeData) {
    handleStrokeData($strokeData);
  }

  function handleStrokeData(strokeData) {
    if (!canvas) return;

    const state = strokeData.state;
    if (state !== 1) return;

    const strokePoints = strokeData.points;
    const length = strokeData.length;

    const ctx = canvas.getContext("2d");

    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var halfHeight = canvasHeight / 2;
    var halfWidth = canvasWidth / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    for (var i = 0; i < length; ++i) {
      if (i >= strokePoints.length) {
        console.warn("stroke overflow", strokePoints.length, length);
        return;
      }
      var x = strokePoints[i].x;
      var y = strokePoints[i].y;

      var xCanvas = halfWidth + x * canvasWidth;
      var yCanvas = halfHeight - y * canvasHeight;

      if (i === 0) {
        ctx.moveTo(xCanvas, yCanvas);
      } else if (i == length - 1) {
        ctx.lineTo(xCanvas + 5, yCanvas + 5);
        ctx.lineTo(xCanvas - 5, yCanvas - 5);
        ctx.moveTo(xCanvas + 5, yCanvas - 5);
        ctx.moveTo(xCanvas - 5, yCanvas + 5);
      } else {
        ctx.lineTo(xCanvas, yCanvas);
      }
    }
    ctx.stroke();
  }
</script>

<div class="strokeCanvas_bg" />
<canvas id="strokeCanvas" bind:this={canvas} width="256" height="256" />

<style lang="scss">
  .strokeCanvas_bg,
  #strokeCanvas {
    position: absolute;
    right: 42px;
    bottom: 42px;
    width: 128px;
    height: 128px;
    border-radius: 50%;
  }
  .strokeCanvas_bg {
    z-index: 8;
    background-size: 7px 7px;
    background-image: linear-gradient(
        to right,
        rgba(0, 255, 0, 0.05) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, rgba(0, 255, 0, 0.05) 1px, transparent 1px);
  }
  #strokeCanvas {
    z-index: 9;
    border: 1px solid #fff;
    background: radial-gradient(#00000000, #00000082);
  }
</style>
