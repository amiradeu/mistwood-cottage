import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'

import Experience from '../Experience.js'

export default class Player {
    constructor() {
        this.experience = new Experience()
        // this.sceneGroup = this.experience.sceneGroup
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.physics = this.experience.physics
        this.time = this.experience.time
        this.keys = this.experience.keys
        this.camera = this.experience.camera.instance

        this.options = {
            radius: 0.2,
            color: '#42ff48',
            initPosition: { x: 0, y: 10, z: 5 },
            impulseStrength: 0.003,
            torqueStrength: 0.005,
        }

        this.addAxesHelper()
        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        this.setPhysics()
        this.handleKeys()
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
        this.geometry = new THREE.IcosahedronGeometry(1, 1)
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        const { x, y, z } = this.options.initPosition
        this.mesh.position.set(x, y, z)
        this.mesh.scale.set(
            this.options.radius,
            this.options.radius,
            this.options.radius
        )
        this.scene.add(this.mesh)
    }

    setPhysics() {
        const { x, y, z } = this.options.initPosition

        // Body
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        rigidBodyDesc.setTranslation(x, y, z)
        rigidBodyDesc.setLinearDamping(0.5)
        rigidBodyDesc.setAngularDamping(0.5)
        this.rigidBody = this.physics.world.createRigidBody(rigidBodyDesc)

        // Collider
        let colliderDesc = RAPIER.ColliderDesc.ball(this.options.radius)
        colliderDesc.setRestitution(0.5) // Bounciness
        colliderDesc.setFriction(1.0) // Friction
        this.physics.world.createCollider(colliderDesc, this.rigidBody)

        this.physics.addObject(this.mesh, this.rigidBody)
    }

    handleKeys() {
        this.keys.on('up', () => {
            console.log('up')
            this.moveForward()
        })

        this.keys.on('down', () => {
            console.log('down')
            this.moveBackward()
        })

        this.keys.on('right', () => {
            console.log('right')
            this.moveRight()
        })

        this.keys.on('left', () => {
            console.log('left')
            this.moveLeft()
        })

        this.keys.on('jump', () => {
            console.log('jump')
            this.jump()
        })
    }

    moveForward() {
        // forces in 3d dimensions
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        impulse.z -= this.options.impulseStrength
        torque.x -= this.options.torqueStrength

        // apply forces on ball
        this.rigidBody.applyImpulse(impulse, true)
        this.rigidBody.applyTorqueImpulse(torque)
    }

    moveBackward() {
        // forces in 3d dimensions
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        impulse.z = this.options.impulseStrength
        torque.x = this.options.torqueStrength

        // apply forces on ball
        this.rigidBody.applyImpulse(impulse, true)
        this.rigidBody.applyTorqueImpulse(torque)
    }

    moveRight() {
        // forces in 3d dimensions
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        impulse.x = this.options.impulseStrength
        torque.z -= this.options.torqueStrength

        // apply forces on ball
        this.rigidBody.applyImpulse(impulse, true)
        this.rigidBody.applyTorqueImpulse(torque)
    }

    moveLeft() {
        // forces in 3d dimensions
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        impulse.x -= this.options.impulseStrength
        torque.z = this.options.torqueStrength

        // apply forces on ball
        this.rigidBody.applyImpulse(impulse, true)
        this.rigidBody.applyTorqueImpulse(torque)
    }

    jump() {
        const impulse = { x: 0, y: 0.2, z: 0 }
        this.rigidBody.applyImpulse(impulse, true)
    }

    applyImpulse() {
        this.rigidBody.applyImpulse(this.impulse)
        this.rigidBody.applyTorqueImpulse(this.torque)
    }

    update() {
        /**
         * Camera Follow
         */
        const meshPosition = this.mesh.position
        // meshPosition.applyMatrix4(this.mesh.matrixWorld)
        console.log('Player Position:', meshPosition)

        // Camera Position
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(meshPosition)
        // Offset the camera position slightly above the player
        cameraPosition.y += 3
        cameraPosition.z += 5

        // Camera Target
        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(meshPosition)
        cameraTarget.y += 0.25

        // -10, 4, 20
        this.camera.position.copy(cameraPosition)
        this.camera.lookAt(cameraTarget)

        console.log('Camera Position:', this.camera.position)
    }
}
