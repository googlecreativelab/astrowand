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

#define USE_MAP
uniform sampler2D uTexture;
varying vec3 color;
varying float alpha;
flat varying int starTexture;

void main() {
    if ( alpha <= 0.01 || length(color) < 0.5 ){
        discard;
    }
    if(starTexture == 1){
        vec4 tex = texture2D(uTexture, gl_PointCoord * 1.);
        gl_FragColor = vec4(tex.rgb * color, tex.a * alpha);
    } else {
        float l = length( gl_PointCoord - vec2( 0.5, 0.5 ) );
        if ( alpha <= 0.01 || l > 0.5 ) discard;
        float fade = (1. - (l / 0.5));
        gl_FragColor = vec4(color, alpha * pow(fade, 6.));
    }

}
