import * as THREE from 'three'

import Experience from '../Experience.js'
import causticsVertexShader from '../Shaders/Caustics/vertex.glsl'
import causticsFragmentShader from '../Shaders/Caustics/fragment.glsl'

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
            causticsColor: '#ffffff',
            causticsIntensity: 0.2,
            causticsScale: 20.0,
            causticsSpeed: 1.0,
            causticsThickness: 0.4,
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
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: true,
            // wireframe: true,
            vertexShader: causticsVertexShader,
            fragmentShader: causticsFragmentShader,
            uniforms: {
                uTime: new THREE.Uniform(0),
                uTexture: { value: this.options.texture },

                uCausticsColor: new THREE.Uniform(
                    new THREE.Color(this.options.causticsColor)
                ),
                uCausticsIntensity: new THREE.Uniform(0.2),
                uCausticsScale: new THREE.Uniform(20.0),
                uCausticsSpeed: new THREE.Uniform(1.0),
                uCausticsThickness: new THREE.Uniform(0.4),
                uCausticsOffset: new THREE.Uniform(0.75),
            },
        })
    }

    setModel() {
        this.mesh.material = this.material
    }

    update() {
        this.material.uniforms.uTime.value = this.time.elapsed
    }

    setDebug() {}
}
