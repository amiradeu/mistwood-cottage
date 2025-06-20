import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

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
        // this.setOrbitControls()
        // this.setPointerLockControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.01,
            200
        )
        this.instance.position.set(-10, 4, 20)

        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.maxPolarAngle = Math.PI * 0.55
        this.controls.maxDistance = 45
    }

    setPointerLockControls() {
        this.velocity = new THREE.Vector3()
        this.direction = new THREE.Vector3()
        this.moveDelta = 0.00005 * this.time.delta

        this.pointerLockControls = new PointerLockControls(
            this.instance,
            this.canvas
        )

        // start capturing mouse
        this.overlay.on('enter', () => {
            this.pointerLockControls.lock()
        })

        this.blocker = document.querySelector('.blocker')
        this.instructions = document.querySelector('.instructions')

        // start capturing mouse
        this.instructions.addEventListener('click', () => {
            this.pointerLockControls.lock()
        })

        // hide instructions
        this.pointerLockControls.addEventListener('lock', () => {
            this.blocker.style.display = 'none'
        })

        // show instructions
        this.pointerLockControls.addEventListener('unlock', () => {
            this.blocker.style.display = 'revert'
        })
    }

    resize() {
        // Resize camera
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        // Update Controls
        if (this.controls) this.controls.update()

        // Update Pointer Lock Controls
        if (this.pointerLockControls && this.pointerLockControls.isLocked) {
            // Keys States
            const { forward, backward, left, right } =
                this.keysControls.keys.down

            // Friction - movement decay to a stop slowly
            this.velocity.x -= this.velocity.x * 10 * this.moveDelta
            this.velocity.z -= this.velocity.z * 10 * this.moveDelta

            // Direction -
            this.direction.z = forward - backward
            this.direction.x = right - left
            // ensures consistent movements in all directions
            this.direction.normalize()

            // Acceleration - increases speed on keydown
            if (forward || backward) {
                this.velocity.z -= this.direction.z * 400 * this.moveDelta
            }
            if (left || right) {
                this.velocity.x -= this.direction.x * 400 * this.moveDelta
            }

            // Update camera movement
            this.pointerLockControls.moveForward(
                -this.velocity.z * this.moveDelta
            )
            this.pointerLockControls.moveRight(
                -this.velocity.x * this.moveDelta
            )
        }

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
