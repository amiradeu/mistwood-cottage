import { Group } from 'three'

import Experience from '../Experience.js'

export default class SceneGroup {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.instance = new Group()

        this.scale = 0.1

        this.instance.scale.set(this.scale, this.scale, this.scale)
        this.instance.position.set(0, -1, 0)
        this.instance.rotation.y = Math.PI

        this.scene.add(this.instance)
    }

    add(mesh) {
        this.instance.add(mesh)
    }
}
