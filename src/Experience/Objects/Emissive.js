import { ShaderMaterial, DoubleSide, UniformsLib, Color } from 'three'

import Experience from '../Experience'
import emissiveRadialGradientVertexShader from '../Shaders/EmissiveRadialGradient/vertex.glsl'
import emissiveRadialGradientFragmentShader from '../Shaders/EmissiveRadialGradient/fragment.glsl'
import emissiveLinearGradientVertexShader from '../Shaders/EmissiveLinearGradient/vertex.glsl'
import emissiveLinearGradientFragmentShader from '../Shaders/EmissiveLinearGradient/fragment.glsl'

export const EMISSIVE_TYPE = {
    RADIAL: 'radial',
    LINEAR: 'linear',
}
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
            type: EMISSIVE_TYPE.RADIAL,
            debug: null,
        }

        this.options = {
            ...defaultOptions,
            ...options,
        }

        this.setMaterial()
        this.setDebug()
    }

    setMaterial() {
        if (this.options.type === EMISSIVE_TYPE.RADIAL) {
            this.material = new ShaderMaterial({
                vertexShader: emissiveRadialGradientVertexShader,
                fragmentShader: emissiveRadialGradientFragmentShader,
                side: DoubleSide,
                fog: true,
                uniforms: {
                    ...UniformsLib['fog'],
                    uColorA: { value: new Color(this.options.colorA) },
                    uColorB: { value: new Color(this.options.colorB) },
                    uTime: { value: 0 },
                    uRadius: { value: this.options.radius },
                    uPower: { value: this.options.power },
                },
            })
        }

        if (this.options.type === EMISSIVE_TYPE.LINEAR) {
            this.material = new ShaderMaterial({
                vertexShader: emissiveLinearGradientVertexShader,
                fragmentShader: emissiveLinearGradientFragmentShader,
                side: DoubleSide,
                fog: true,
                uniforms: {
                    ...UniformsLib['fog'],
                    uColorA: { value: new Color(this.options.colorA) },
                    uColorB: { value: new Color(this.options.colorB) },
                    uTime: { value: 0 },
                    uRadius: { value: this.options.radius },
                    uPower: { value: this.options.power },
                },
            })
        }
    }

    setDebug() {
        if (!this.debug.active) return

        if (this.options.debug)
            this.debugFolder = this.options.debug
                .addFolder(this.options.name)
                .close()
        else
            this.debugFolder = this.debug.ui
                .addFolder(this.options.name)
                .close()

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

    registerEmissive(mesh) {
        mesh.material = this.material
    }
}
