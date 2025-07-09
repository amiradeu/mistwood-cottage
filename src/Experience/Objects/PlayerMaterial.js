import { ShaderMaterial, Uniform, Vector3, Color } from 'three'

import Experience from '../Experience.js'
import playerVertexShader from '../Shaders/Player/vertex.glsl'
import playerFragmentShader from '../Shaders/Player/fragment.glsl'

export default class PlayerMaterial {
    constructor() {
        this.experience = new Experience()
        this.debug = this.experience.debug

        this.options = {
            color: '#af58bb',
            sunShadeColor: '#332951',
        }

        this.setMaterial()
        this.setDebug()
    }

    setMaterial() {
        this.material = new ShaderMaterial({
            vertexShader: playerVertexShader,
            fragmentShader: playerFragmentShader,
            uniforms: {
                uSunPosition: new Uniform(new Vector3(-0.5, -0.5, -0.5)),
                uColor: new Uniform(new Color(this.options.color)),
                uSunShadeColor: new Uniform(
                    new Color(this.options.sunShadeColor)
                ),
            },
        })
    }

    setDebug() {
        if (!this.debug.active) return
        this.debugFolder = this.debug.ui.addFolder('🕴🏻Player')

        this.debugFolder.addColor(this.options, 'color').onChange(() => {
            this.material.uniforms.uColor.value.set(this.options.color)
        })

        this.debugFolder
            .addColor(this.options, 'sunShadeColor')
            .onChange(() => {
                this.material.uniforms.uSunShadeColor.value.set(
                    this.options.sunShadeColor
                )
            })
    }
}
