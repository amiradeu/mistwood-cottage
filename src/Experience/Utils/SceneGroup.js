import * as THREE from 'three'

import Experience from '../Experience.js'

export default class SceneGroup {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.instance = new THREE.Group()

        this.instance.scale.set(0.1, 0.1, 0.1)
        // this.instance.position.set(0, -2, 0)

        this.scene.add(this.instance)
    }

    add(mesh) {
        this.instance.add(mesh)
    }
}
