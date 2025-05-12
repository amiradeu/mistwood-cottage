// Based on Texture Transition by Paul West @prisoner849
// https://jsfiddle.net/prisoner849/bmda176z/

import * as THREE from 'three'
import gsap from 'gsap'

export function addTextureTransition(
    material = new THREE.Material(),
    mixProgress = 0
) {
    const uniforms = {
        // store previous texture
        uMap0: { value: material.map },
        // 0.0 -> 1.0 texture transition
        uMixProgress: { value: mixProgress },
    }
    material.onBeforeCompile = (shader) => {
        shader.uniforms.uMap0 = uniforms.uMap0
        shader.uniforms.uMixProgress = uniforms.uMixProgress

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_pars_fragment>',
            `
            #include <map_pars_fragment>
            uniform sampler2D uMap0;
            uniform float uMixProgress;
            `
        )
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #ifdef USE_MAP
                vec4 texelColor0 = texture2D( uMap0, vMapUv );
                vec4 texelColor1 = texture2D( map, vMapUv );
                vec4 texelColor = mix(texelColor0, texelColor1, uMixProgress);
                diffuseColor *= texelColor;
            #endif
            `
        )
    }

    return uniforms
}

export function animateTextureChange(uniforms) {
    gsap.fromTo(
        uniforms.uMixProgress,
        { value: 0 },
        {
            value: 1.0,
            duration: 2,
        }
    )
}
