import * as THREE from 'three'

import Experience from '../Experience.js'
import causticsVertexShader from '../Shaders/Caustics/vertex.glsl'
import causticsFragmentShader from '../Shaders/Caustics/fragment.glsl'
import { animateTextureChange } from '../Shaders/addTextureTransition.js'

export default class CausticsGround {
    constructor(mesh, options = {}) {
        this.experience = new Experience()
        this.sceneGroup = this.experience.world.sceneGroup
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.mesh = mesh

        const defaultOptions = {
            texture: null,

            opacity: 0.27,

            causticsColor: '#f0f0f0',
            causticsIntensity: 0.2,
            causticsScale: 33.0,
            causticsSpeed: 0.5,
            causticsThickness: 0.3,
            causticsOffset: 0.75,
        }

        this.options = {
            ...defaultOptions,
            ...options,
        }

        this.setMaterial()
        this.setModel()
        this.setDebug()
    }

    setMaterial() {
        this.uniforms = {
            // texture transition
            uMap0: { value: this.options.texture },
            uMap: { value: this.options.texture },
            uMixProgress: new THREE.Uniform(0),

            uTime: new THREE.Uniform(0),

            // caustics
            uOpacity: new THREE.Uniform(this.options.opacity),
            uCausticsColor: new THREE.Uniform(
                new THREE.Color(this.options.causticsColor)
            ),
            uCausticsIntensity: new THREE.Uniform(
                this.options.causticsIntensity
            ),
            uCausticsScale: new THREE.Uniform(this.options.causticsScale),
            uCausticsSpeed: new THREE.Uniform(this.options.causticsSpeed),
            uCausticsThickness: new THREE.Uniform(
                this.options.causticsThickness
            ),
            uCausticsOffset: new THREE.Uniform(this.options.causticsOffset),
        }

        this.material = new THREE.ShaderMaterial({
            transparent: true,
            depthTest: true,
            fog: true,
            // wireframe: true,
            vertexShader: causticsVertexShader,
            fragmentShader: causticsFragmentShader,
            uniforms: {
                ...THREE.UniformsLib['fog'],
                ...this.uniforms,
            },
        })
    }

    setModel() {
        this.mesh.material = this.material
    }

    updateCycle(texture) {
        this.uniforms.uMap0.value = this.uniforms.uMap.value
        this.uniforms.uMap.value = texture

        animateTextureChange(this.uniforms.uMixProgress)
    }

    update() {
        this.material.uniforms.uTime.value = this.time.elapsed
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🌊 Caustics')

            this.debugFolder
                .add(this.material.uniforms.uOpacity, 'value')
                .min(0)
                .max(1)
                .step(0.01)
                .name('opacity')

            this.debugFolder
                .addColor(this.options, 'causticsColor')
                .onChange(() => {
                    this.material.uniforms.uCausticsColor.value.set(
                        this.options.causticsColor
                    )
                })

            this.debugFolder
                .add(this.material.uniforms.uCausticsIntensity, 'value')
                .min(0)
                .max(2)
                .step(0.001)
                .name('intensity')

            this.debugFolder
                .add(this.material.uniforms.uCausticsScale, 'value')
                .min(0)
                .max(200)
                .step(1)
                .name('scale')

            this.debugFolder
                .add(this.material.uniforms.uCausticsSpeed, 'value')
                .min(0)
                .max(1)
                .step(0.01)
                .name('speed')

            this.debugFolder
                .add(this.material.uniforms.uCausticsThickness, 'value')
                .min(0)
                .max(2)
                .step(0.01)
                .name('thickness')

            this.debugFolder
                .add(this.material.uniforms.uCausticsOffset, 'value')
                .min(0)
                .max(1)
                .step(0.01)
                .name('offset')
        }
    }
}
