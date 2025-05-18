varying vec2 vUv;
varying vec2 vUv2;

// For specific meshes that uses multiple UV
// Special Use Case Note:
// Emission OFF - default uv uses BSDF bake with texture
// Emission ON - uv2 unwrap to fill the whole space
attribute vec2 uv2;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vUv2 = uv2;
}