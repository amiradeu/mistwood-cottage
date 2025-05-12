import * as THREE from 'three'

import Experience from '../Experience'
import emissiveGradientVertexShader from '../Shaders/EmissiveGradient/vertex.glsl'
import emissiveGradientFragmentShader from '../Shaders/EmissiveGradient/fragment.glsl'

export default class Emissive {
    constructor(name = '💡 Emissive') {
        this.experience = new Experience()
        this.debug = this.experience.debug

        this.options = {
            name: name,
            colorA: '#e2910b',
            colorB: '#e72b00',
        }

        this.setMaterial()
        this.setDebug()
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            vertexShader: emissiveGradientVertexShader,
            fragmentShader: emissiveGradientFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uColorA: { value: new THREE.Color(this.options.colorA) },
                uColorB: { value: new THREE.Color(this.options.colorB) },
                uTime: { value: 0 },
            },
        })
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(this.options.name)

            this.debugFolder.addColor(this.options, 'colorA').onChange(() => {
                this.material.uniforms.uColorA.value.set(this.options.colorA)
            })

            this.debugFolder.addColor(this.options, 'colorB').onChange(() => {
                this.material.uniforms.uColorB.value.set(this.options.colorB)
            })
        }
    }

    registerEmissive(mesh) {
        mesh.material = this.material
    }
}
