import * as THREE from 'three'

import Experience from '../Experience'

export default class Fog {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('💨 Fog')
        }

        this.addFog()
    }

    addFog() {
        this.fogOptions = {
            color: '#dfe9f3',
            near: 1,
            far: 40,
            density: 0.015,
        }
        this.fog = new THREE.Fog(
            this.fogOptions.color,
            this.fogOptions.near,
            this.fogOptions.far
        )
        this.scene.fog = this.fog

        if (this.debug.active) {
            this.debugFolder.addColor(this.fogOptions, 'color').onChange(() => {
                this.fog.color.set(this.fogOptions.color)
            })
            this.debugFolder.add(this.fog, 'near', -30, 10, 0.01)
            this.debugFolder.add(this.fog, 'far', 5, 100, 0.001)
        }
    }
}
