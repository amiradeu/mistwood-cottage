// Sourced from Infinite World by Bruno Simon
// (https://github.com/brunosimon/infinite-world)

uniform vec3 uSunPosition;
uniform vec3 uColor;
uniform vec3 uSunShadeColor;

varying vec3 vGameNormal;

#include ../includes/getSunShade.glsl;
#include ../includes/getSunShadeColor.glsl;

void main()
{
    vec3 baseColor = uColor;
    vec3 shadeColor = uSunShadeColor;

    float sunShade = getSunShade(vGameNormal);
    vec3 color = mix(baseColor, shadeColor, sunShade);
    
    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}