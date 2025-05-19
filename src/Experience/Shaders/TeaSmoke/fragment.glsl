/**
* Based on Bruno Simon's Three.js Journey
* Coffee Smoke Lesson
*/
uniform sampler2D uPerlinTexture;
uniform float uTime;
uniform vec3 uSmokeColor;
uniform float uSmokeStretchX;
uniform float uSmokeStretchY;
uniform float uSmokeSpeed;

varying vec2 vUv;

void main() {

    // Scale & Animate UV
    vec2 smokeUv = vUv;
    smokeUv.x *= uSmokeStretchX;
    smokeUv.y *= uSmokeStretchY;
    smokeUv.y -= uTime * uSmokeSpeed;

    // Smoke
    float smoke = texture(uPerlinTexture, smokeUv).r;

    // Remap - more sporadic smoke
    smoke = smoothstep(.4, 1.0, smoke);

    // Edges
    smoke *= smoothstep(0.0, 0.2, vUv.x);
    smoke *= smoothstep(1.0, 0.8, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= smoothstep(1.0, 0.8, vUv.y);

    gl_FragColor = vec4(uSmokeColor, smoke);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}