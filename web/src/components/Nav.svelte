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

let links=[];

function updateAClass(a, astroPanelTop){
  const top = a.getBoundingClientRect().top;
  if(top > astroPanelTop){
    a.classList.add('invert');
  } else {
    a.classList.remove('invert');
  }
}
  function handleScroll(e){
    const astrowandPanel = document.getElementById('astrowandPanel');
    if(astrowandPanel){
      const panelTop = astrowandPanel.getBoundingClientRect().top;
      links.forEach(a=>{
        updateAClass(a, panelTop)
      });
    }
  }

  onMount(()=>{
    document.addEventListener('scroll',handleScroll,false);
    return ()=>{
      document.removeEventListener('scroll',handleScroll,false);
    }
  })
</script>

<div class="nav">
  <div class="row">
    <a
      bind:this={links[0]}
      href="https://experiments.withgoogle.com/collection/tfliteformicrocontrollers"
      target="_blank">About</a
    >
  </div>
  <div class="row">
    <a bind:this={links[1]} href="https://github.com/googlecreativelab/tf4micro-motion-kit/blob/main/FAQ.md" target="_blank">FAQ</a>
  </div>
</div>

<style lang="scss">
  @import '../scss/vars';
  .row {
    margin-bottom: 2.2rem;
  }
  .nav {
    position: fixed;
    bottom: 9px;
    left: 0;
    a {
      margin: 0;
      display: inline-block;
      transform: rotate(90deg);
      transform-origin: left bottom;
      margin-bottom: 6px;
      transition: color 0.4s;
    }
    :global(a.invert){
      color: $bgColor;
    }
  }
  @media screen and (min-width: 905px) {
    .nav {
      bottom: 9px;
      left: 42px;
      a {
        transform: none;
        margin-bottom: 0;
      }
    }
  }
</style>
