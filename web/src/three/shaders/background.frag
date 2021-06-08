uniform sampler2D	uTexture;
uniform vec2 uResolution;
uniform bool uEnabled;
varying vec2 vUv;


void main(void) 
{
	if(!uEnabled){
		gl_FragColor = vec4(0);
		return;
	}

	float aspectFix = (uResolution.x / uResolution.y);
	vec2 uv = vec2((vUv.x - .5) * aspectFix + .5, vUv.y);
	gl_FragColor = vec4( texture2D(uTexture, uv).rgb, 0.5 );
}