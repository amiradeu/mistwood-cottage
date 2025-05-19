/**
* Based on Bruno Simon's Three.js Journey
* Coffee Smoke Lesson
*/
uniform float uTime;
uniform sampler2D uPerlinTexture;
uniform float uTwistFrequency;
uniform float uTwistIntensity;
uniform float uTwistSpeed;
uniform float uWindStrength;
uniform float uWindSpeed;

varying vec2 vUv;

#include ../includes/rotate2D.glsl

void main() {

    vec3 newPosition = position;

    // Twist
    // value change according to elevation only
    float twistPerlin = texture(
        uPerlinTexture, 
        vec2(0.5, uv.y * uTwistFrequency - uTime * uTwistSpeed)
        ).r;
    float angle = twistPerlin * uTwistIntensity;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind
    // [0, 1] -> [0, 0.6] -> [-0.2, 0.4]
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime * uWindSpeed)).r * 0.6 - 0.2,
        texture(uPerlinTexture, vec2(0.75, uTime * uWindSpeed)).r * 0.6 - 0.2
    );
    // keep the bottom at initial position
    windOffset *= pow(uv.y, 2.0) * uWindStrength;
    newPosition.xz += windOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vUv = uv;
}