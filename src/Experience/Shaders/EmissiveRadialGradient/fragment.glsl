uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uRadius;
uniform float uPower;
uniform float uTime;

varying vec2 vUv2;

#include <fog_pars_fragment>

void main() {
    vec2 uv = vUv2;

    float radialGradient = distance(uv, vec2(0.5));
    
    radialGradient /= uRadius;

    radialGradient = pow(radialGradient, uPower);
    
    radialGradient = smoothstep(0.0, 1.0, radialGradient);
    
    vec3 color = mix(uColorA, uColorB, radialGradient);

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
}