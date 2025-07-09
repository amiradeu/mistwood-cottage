uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uRadius;
uniform float uPower;
uniform float uTime;

varying vec2 vUv2;

#include <fog_pars_fragment>

void main() {
    vec2 uv = vUv2;
    
    // [0,1] -> [-0.5, 0.5] -> [0.5, 0, 0.5]
    float linearGradient = abs(uv.y - 0.5);

    linearGradient = pow(linearGradient, uPower);
    
    vec3 color = mix(uColorA, uColorB, linearGradient);

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
}