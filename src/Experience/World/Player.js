import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'

import Experience from '../Experience.js'

export default class Player {
    constructor() {
        this.experience = new Experience()
        this.sceneGroup = this.experience.sceneGroup
        this.resources = this.experience.resources
        this.physics = this.experience.physics
        this.time = this.experience.time
        this.keys = this.experience.keys

        this.options = {
            radius: 2,
            color: '#42ff48',
            initPosition: { x: 0, y: 50, z: -50 },
        }

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        this.setPhysics()
        this.handleKeys()
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
        this.sceneGroup.add(this.mesh)
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
        colliderDesc.setRestitution(1) // Bounciness
        colliderDesc.setFriction(0.1) // Friction
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

        const impulseStrength = 5.0 * this.time.delta
        const torqueStrength = 2.0 * this.time.delta

        impulse.z = impulseStrength
        torque.x = torqueStrength

        // apply forces on ball
        this.rigidBody.applyImpulse(impulse, true)
        this.rigidBody.applyTorqueImpulse(torque)
    }

    moveBackward() {
        // forces in 3d dimensions
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 5.0 * this.time.delta
        const torqueStrength = 2.0 * this.time.delta

        impulse.z -= impulseStrength
        torque.x -= torqueStrength

        // apply forces on ball
        this.rigidBody.applyImpulse(impulse, true)
        this.rigidBody.applyTorqueImpulse(torque)
    }

    moveRight() {
        // forces in 3d dimensions
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 5.0 * this.time.delta
        const torqueStrength = 2.0 * this.time.delta

        impulse.x -= impulseStrength
        torque.z = torqueStrength

        // apply forces on ball
        this.rigidBody.applyImpulse(impulse, true)
        this.rigidBody.applyTorqueImpulse(torque)
    }

    moveLeft() {
        // forces in 3d dimensions
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 5.0 * this.time.delta
        const torqueStrength = 2.0 * this.time.delta

        impulse.x = impulseStrength
        torque.z -= torqueStrength

        // apply forces on ball
        this.rigidBody.applyImpulse(impulse, true)
        this.rigidBody.applyTorqueImpulse(torque)
    }

    jump() {
        const impulse = { x: 0, y: 80 * this.time.delta, z: 0 }
        this.rigidBody.applyImpulse(impulse, true)
    }

    applyImpulse() {
        this.rigidBody.applyImpulse(this.impulse)
        this.rigidBody.applyTorqueImpulse(this.torque)
    }

    update() {}
}
