import { Color, EquirectangularReflectionMapping } from 'three'

import Experience from '../Experience.js'

export default class Background {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.setBackground()
        this.setDebug()
        // this.setEnvironmentMap()
    }

    setBackground() {
        this.options = {
            color: '#dfe9f3',
        }

        this.scene.background = new Color(this.options.color)
    }

    setTextures() {
        this.environmentMapTexture = this.resources.items.environmentMapTexture2
        this.environmentMapTexture.mapping = EquirectangularReflectionMapping
    }

    setEnvironmentMap() {
        this.setTextures()

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

    setDebug() {
        if (!this.debug.active) return
        this.debugFolder = this.debug.ui.addFolder('☁️ Sky').close()

        this.debugFolder
            .addColor(this.options, 'color')
            .onChange(() => {
                this.scene.background.set(this.options.color)
            })
            .name('background')
    }
}
