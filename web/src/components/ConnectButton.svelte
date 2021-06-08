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
  import {
    isConnected,
    lastInference,
    onboardingStep,
    strokeData,
  } from "../store";
  import soundManager from "../soundManager";
  import bleManager from "../ble/manager";

  async function handleConnect() {
    soundManager.userInit();
    await bleManager.connect((event, data) => {
      switch (event) {
        case "inference":
          console.log("inference", data);
          $lastInference = data;
          break;
        case "strokes":
          $strokeData = data;
          break;
        default:
          throw new Error(`Unknown event: ${event}`);
      }
    });
    $isConnected = true;
    $onboardingStep = 1;
  }
</script>

<div class:inverted={$onboardingStep === 0}>
  <button on:click={handleConnect} class="connect-button">
    {$isConnected ? "Connected" : "Connect"}
  </button>
</div>

<style lang="scss">
  @import "../scss/vars";
</style>
