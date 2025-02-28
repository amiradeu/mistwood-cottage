import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        // Setup
        this.setFog()
        this.setEnvironmentMap()
    }

    setFog() {
        this.fog = new THREE.Fog(0x262837, 1, 100)
        this.scene.fog = this.fog
    }

    setEnvironmentMap() {
        this.environmentMap = {}
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.mapping =
            THREE.EquirectangularReflectionMapping

        this.scene.environment = this.environmentMap.texture
        this.scene.background = this.environmentMap.texture
    }
}
