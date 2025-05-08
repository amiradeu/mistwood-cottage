import * as THREE from 'three'

import Experience from '../Experience.js'

export default class Ambiance {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('☁️ Ambiance')
        }

        this.setTextures()
        this.setFog()
        this.setEnvironmentMap()
    }

    setTextures() {
        this.environmentMapTexture = this.resources.items.environmentMapTexture
        this.environmentMapTexture.mapping =
            THREE.EquirectangularReflectionMapping
    }

    setFog() {
        this.options = {
            color: '#1E222F',
            near: 1,
            far: 50,
        }
        this.fog = new THREE.Fog(
            this.options.color,
            this.options.near,
            this.options.far
        )
        this.scene.fog = this.fog

        if (this.debug.active) {
            this.debugFolder.addColor(this.options, 'color').onChange(() => {
                this.fog.color.set(this.options.color)
            })
            this.debugFolder.add(this.fog, 'near', -20, 1, 1)
            this.debugFolder.add(this.fog, 'far', 2, 100, 1)
        }
    }

    setEnvironmentMap() {
        this.scene.environment = this.environmentMapTexture
        this.scene.background = this.environmentMapTexture
        this.scene.backgroundRotation.y = 3.12

        if (this.debug.active) {
            this.debugFolder.add(this.scene, 'environmentIntensity', 0, 1, 0.1)
            this.debugFolder.add(this.scene, 'backgroundIntensity', 0, 1, 0.1)

            this.debugFolder.add(
                this.scene.backgroundRotation,
                'y',
                0,
                Math.PI * 2.0,
                0.01
            )
        }
    }
}
