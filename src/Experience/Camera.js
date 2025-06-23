import { PerspectiveCamera } from 'three'

import Experience from './Experience.js'

export default class Camera {
    constructor() {
        // Singleton
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.overlay = this.experience.overlay
        this.keysControls = this.experience.controls

        this.setInstance()
    }

    setInstance() {
        this.instance = new PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.01,
            200
        )
        this.instance.position.set(-10, 4, 20)

        this.scene.add(this.instance)
    }

    resize() {
        // Resize camera
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        // console.log(
        //     'camera. x:',
        //     this.instance.position.x,
        //     ' y:',
        //     this.instance.position.y,
        //     ' z:',
        //     this.instance.position.z
        // )
    }
}
