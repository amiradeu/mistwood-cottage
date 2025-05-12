uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uTime;

varying vec2 vUv2;

void main() {
    vec2 uv = vUv2;

    float radialGradient = distance(uv, vec2(0.5));
    vec3 color = vec3(radialGradient);
    
    color = mix(uColorA, uColorB, color);

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}