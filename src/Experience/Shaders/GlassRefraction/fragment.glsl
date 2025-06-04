// Based on Threejs addon library - WaterRefractionShader.js
// https://github.com/mrdoob/three.js/blob/master/examples/jsm/shaders/WaterRefractionShader.js

uniform vec3 color;
uniform float time;
uniform sampler2D tDiffuse;
uniform sampler2D tDudv;
uniform float repeatScale;
uniform float strength;

varying vec2 vUv;
varying vec4 vUvRefraction;

#include <fog_pars_fragment>

float blendOverlay( float base, float blend ) {
    return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
}

vec3 blendOverlay( vec3 base, vec3 blend ) {
    return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ),blendOverlay( base.b, blend.b ) );
}

void main() {

    float waveSpeed = 0.03;

    vec2 uv = vUv;

    // Tiles the normal map
    uv = uv * repeatScale;

    // simple distortion (ripple) via dudv map (see https://www.youtube.com/watch?v=6B7IF6GOu7s)
    vec2 distortedUv = texture2D( tDudv, vec2( uv.x + time * waveSpeed, uv.y ) ).rg * strength;
    distortedUv = uv.xy + vec2( distortedUv.x, distortedUv.y + time * waveSpeed );
    vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 2.0 - 1.0 ) * strength;

    // new uv coords
    vec4 finalUV = vec4( vUvRefraction );
    finalUV.xy += distortion;

    vec4 base = texture2DProj( tDiffuse, finalUV );

    gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

    #include <fog_fragment>
    #include <tonemapping_fragment>
    #include <colorspace_fragment>

}