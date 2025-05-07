import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from './Experience.js'

export default class Camera {
    constructor() {
        // Singleton
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setOrbitControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.01,
            200
        )
        this.instance.position.set(5, 5, -5)
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.maxPolarAngle = Math.PI * 0.55
    }

    resize() {
        // Resize camera
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        // Update Controls
        this.controls.update()

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
