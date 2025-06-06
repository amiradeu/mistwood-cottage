import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'

import Experience from '../Experience.js'

export default class Player {
    constructor() {
        this.experience = new Experience()
        this.sceneGroup = this.experience.sceneGroup
        this.resources = this.experience.resources
        this.physics = this.experience.physics

        this.options = {
            radius: 3,
            color: '#42ff48',
            initPosition: { x: 0, y: 50, z: -50 },
        }

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        this.setPhysics()
    }

    setMaterial() {
        this.texture = this.resources.items.playerTexture
        this.texture.flipY = false
        this.texture.colorSpace = THREE.SRGBColorSpace

        this.material = new THREE.MeshBasicMaterial({
            // color: this.options.color,
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
        this.rigidBody = this.physics.world.createRigidBody(rigidBodyDesc)

        // Collider
        let colliderDesc = RAPIER.ColliderDesc.ball(this.options.radius)
        this.physics.world.createCollider(colliderDesc, this.rigidBody)

        this.physics.addObject(this.mesh, this.rigidBody)
    }

    update() {}
}
