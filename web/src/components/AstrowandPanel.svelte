<!--
====================================================================
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
========================================================================

@autor Rikard Lindstrom <rlindstrom@google.com>

-->
<script>
  import { onMount } from "svelte";
  import { lastInference, sounds } from "../store";
  import soundManager from "../soundManager";
  import threeView from "../three/threeView";
  import StrokeCanvas from "./StrokeCanvas.svelte";

  let containerEl;

  $: if ($lastInference && $lastInference.label) {
    handleInference($lastInference);
  }

  function handleInference() {
    // const index = $lastInference.index;
    if ($lastInference.score > 60) {
      threeView.triggerShape($lastInference.label);
      if($sounds[$lastInference.label]){
        soundManager.playSound($sounds[$lastInference.label].url, 127, 0.9);
      }
      //  soundManager.playSound($sounds[$lastInference.label].url, 127, 0.9 * 0.5);
    }
  }

  function handleDocKeyDown(e) {
    const shapeMap = {
      o: "circle",
      t: "triangle",
      s: "square",
    };
    if (Object.keys(shapeMap).includes(e.key)) {
      soundManager.userInit();
      $lastInference = {
        label: shapeMap[e.key],
        score: 100,
      };
    }
  }

  onMount(async () => {
    await threeView.load();
    document.addEventListener("keydown", handleDocKeyDown, false);
    threeView.setup(containerEl);
    return () => {
      document.removeEventListener("keydown", handleDocKeyDown, false);
    };
  });
</script>

<div id="astrowandPanel" class="panel">
  <div class="container" bind:this={containerEl}>
    <StrokeCanvas />
  </div>
</div>


<style lang="scss">

  .panel {
    background: linear-gradient(to top, #223647, #000a17);
    height: 100vh;
    min-height: 800px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    .container {
      position: relative;
      padding: 0;
      max-width: 100%;
    }
  }
</style>
