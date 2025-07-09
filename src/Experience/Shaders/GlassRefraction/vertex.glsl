// Based on Threejs addon library - WaterRefractionShader.js
// https://github.com/mrdoob/three.js/blob/master/examples/jsm/shaders/WaterRefractionShader.js
uniform mat4 textureMatrix;

varying vec2 vUv;
varying vec4 vUvRefraction;

#include <fog_pars_vertex>

void main() {

    vUv = uv;
    vUvRefraction = textureMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

}