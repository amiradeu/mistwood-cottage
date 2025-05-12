import * as THREE from 'three'

import Experience from '../Experience'
import emissiveGradientVertexShader from '../Shaders/EmissiveGradient/vertex.glsl'
import emissiveGradientFragmentShader from '../Shaders/EmissiveGradient/fragment.glsl'

export default class Emissive {
    constructor(options = {}) {
        this.experience = new Experience()
        this.debug = this.experience.debug

        const defaultOptions = {
            name: '💡 Emissive',
            colorA: '#ddc55f',
            colorB: '#cc5b0f',
            radius: 0.6,
            power: 0.6,
        }

        this.options = {
            ...defaultOptions,
            ...options,
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
                uRadius: { value: this.options.radius },
                uPower: { value: this.options.power },
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

            this.debugFolder
                .add(this.material.uniforms.uRadius, 'value')
                .min(0)
                .max(1)
                .step(0.01)
                .name('radius')

            this.debugFolder
                .add(this.material.uniforms.uPower, 'value')
                .min(0)
                .max(2)
                .step(0.01)
                .name('power')
        }
    }

    registerEmissive(mesh) {
        mesh.material = this.material
    }
}
