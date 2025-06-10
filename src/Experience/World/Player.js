import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'

import Experience from '../Experience.js'

export default class Player {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.physics = this.experience.physics
        this.time = this.experience.time
        this.keysControls = this.experience.keysControls
        this.camera = this.experience.camera.instance

        this.options = {
            // Visual
            radius: 0.15,
            height: 0.6,
            color: '#42ff48',
            initPosition: { x: -0.6, y: -0.6, z: 5 },

            // Physics
            impulseStrength: 0.005,
            torqueStrength: 0.005,
            speed: 0.03,
        }

        this.smoothCameraPosition = new THREE.Vector3(10, 10, 10)
        this.smoothCameraTarget = new THREE.Vector3()
        this.movementDirection = { x: 0, y: 0, z: 0 }

        this.addAxesHelper()
        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        this.setPhysics()
        this.setController()
    }

    addAxesHelper() {
        const axesHelper = new THREE.AxesHelper(10)
        this.scene.add(axesHelper)
    }

    setMaterial() {
        this.texture = this.resources.items.playerTexture
        this.texture.flipY = false
        this.texture.colorSpace = THREE.SRGBColorSpace

        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
        })
    }

    setGeometry() {
        this.geometry = new THREE.CylinderGeometry(
            this.options.radius,
            this.options.radius,
            // add height for visual to overlap ground
            this.options.height + 0.1
        )
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        const { x, y, z } = this.options.initPosition
        this.mesh.position.set(x, y, z)
        this.scene.add(this.mesh)
    }

    setPhysics() {
        const { x, y, z } = this.options.initPosition

        // Body
        let rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
        rigidBodyDesc.setTranslation(x, y, z)
        this.rigidBody = this.physics.world.createRigidBody(rigidBodyDesc)

        // Collider
        let colliderDesc = RAPIER.ColliderDesc.cylinder(
            this.options.height / 2,
            this.options.radius
        )
        this.collider = this.physics.world.createCollider(
            colliderDesc,
            this.rigidBody
        )

        this.physics.addObject(this.mesh, this.rigidBody)
    }

    setController() {
        this.controller = this.physics.world.createCharacterController(0.01)
        // when <stepHeight, >width
        this.controller.enableAutostep(1.0, 0.2, true)
        // when <heightToGround
        this.controller.enableSnapToGround(2.0)
    }

    handleKeys() {
        this.keysControls.on('forward', () => {
            // console.log('forward')
            this.movementDirection = {
                x: 0,
                y: -0.1,
                z: -this.options.speed,
            }
            this.updateController()
        })

        this.keysControls.on('backward', () => {
            // console.log('backward')
            this.movementDirection = {
                x: 0,
                y: -0.1,
                z: this.options.speed,
            }
            this.updateController()
        })
        this.keysControls.on('left', () => {
            // console.log('left')
            console.log(this.keysControls.keys.down)
            this.movementDirection = {
                x: -this.options.speed,
                y: -0.1,
                z: 0,
            }
            this.updateController()
        })
        this.keysControls.on('right', () => {
            // console.log('right')
            this.movementDirection = {
                x: this.options.speed,
                y: -0.1,
                z: 0,
            }
            this.updateController()
        })
        this.keysControls.on('jump', () => {
            // console.log('jump')
            this.movementDirection = { x: 0, y: this.options.speed, z: 0 }
            this.updateController()
        })
    }

    updateController() {
        this.controller.computeColliderMovement(
            this.collider, // The collider we would like to move.
            this.movementDirection
        )

        let movement = this.controller.computedMovement()
        let newPos = this.rigidBody.translation()
        newPos.x += movement.x
        newPos.y += movement.y
        newPos.z += movement.z
        this.rigidBody.setNextKinematicTranslation(newPos)
    }

    update() {
        /**
         * Camera Follow
         */
        const meshPosition = this.mesh.position

        // Camera Position
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(meshPosition)
        // Offset the camera position slightly above the player
        cameraPosition.y += 0.6
        cameraPosition.z += 3.2

        // Camera Target
        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(meshPosition)
        cameraTarget.y += 0.55

        // Lerping
        this.smoothCameraPosition.lerp(cameraPosition, 0.05)
        this.smoothCameraTarget.lerp(cameraTarget, 0.05)
        // console.log(cameraPosition, this.smoothCameraPosition)

        this.camera.position.copy(this.smoothCameraPosition)
        this.camera.lookAt(this.smoothCameraTarget)

        /**
         * Check and Update Key Controls
         */
        if (this.keysControls.keys.down.forward) {
            this.movementDirection = {
                x: 0,
                y: -0.01,
                z: -this.options.speed,
            }
            this.updateController()
        }
        if (this.keysControls.keys.down.backward) {
            this.movementDirection = {
                x: 0,
                y: -0.01,
                z: this.options.speed,
            }
            this.updateController()
        }
        if (this.keysControls.keys.down.left) {
            this.movementDirection = {
                x: -this.options.speed,
                y: -0.01,
                z: 0,
            }
            this.updateController()
        }
        if (this.keysControls.keys.down.right) {
            this.movementDirection = {
                x: this.options.speed,
                y: -0.01,
                z: 0,
            }
            this.updateController()
        }
    }
}
