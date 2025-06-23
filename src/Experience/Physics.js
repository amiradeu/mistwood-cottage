import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'

import Experience from './Experience.js'

export default class Physics {
    constructor() {
        this.experience = new Experience()
        this.time = this.experience.time

        this.objectsToUpdate = []

        this.setInstance()
    }

    setInstance() {
        const gravity = { x: 0.0, y: -9.82, z: 0.0 }
        this.world = new RAPIER.World(gravity)
    }

    testGround() {
        // Create the ground
        let groundColliderDesc = RAPIER.ColliderDesc.cuboid(100.0, 0.1, 100.0)
        groundColliderDesc.setFriction(0.1)
        this.world.createCollider(groundColliderDesc)
    }

    /**
     * Sourced from https://github.com/dimforge/rapier.js/blob/master/testbed3d/src/demos/glbToTrimesh.ts
     */
    glbToTrimesh(mesh) {
        const geometry = mesh.geometry
        const vertices = []
        const indices = new Uint32Array(geometry.index.array)
        const positionAttribute = geometry.attributes.position

        mesh.updateWorldMatrix(true, true)

        // Convert vertices to world space
        // This is necessary because the mesh might be transformed (position, rotation, scale)
        // and we need the vertices in world space for the physics engine
        const v = new THREE.Vector3()
        for (let i = 0, l = positionAttribute.count; i < l; i++) {
            v.fromBufferAttribute(positionAttribute, i)
            v.applyMatrix4(mesh.matrixWorld)
            vertices.push(v.x, v.y, v.z)
        }
        const verticesArray = new Float32Array(vertices)

        // Body
        const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
        const rigidBody = this.world.createRigidBody(rigidBodyDesc)

        // Collider
        const colliderDesc = RAPIER.ColliderDesc.trimesh(verticesArray, indices)
        colliderDesc.setFriction(0.5) // Friction
        this.world.createCollider(colliderDesc, rigidBody)
    }

    glbToConvexHull(mesh) {
        const geometry = mesh.geometry
        const vertices = []
        const indices = new Uint32Array(geometry.index.array)
        const positionAttribute = geometry.attributes.position

        mesh.updateWorldMatrix(true, true)

        // Convert vertices to world space
        // This is necessary because the mesh might be transformed (position, rotation, scale)
        // and we need the vertices in world space for the physics engine
        const v = new THREE.Vector3()
        for (let i = 0, l = positionAttribute.count; i < l; i++) {
            v.fromBufferAttribute(positionAttribute, i)
            v.applyMatrix4(mesh.matrixWorld)
            vertices.push(v.x, v.y, v.z)
        }
        const verticesArray = new Float32Array(vertices)

        // Body
        const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
        const rigidBody = this.world.createRigidBody(rigidBodyDesc)

        // Collider
        const colliderDesc = RAPIER.ColliderDesc.convexHull(verticesArray)
        colliderDesc.setFriction(0.5) // Friction
        this.world.createCollider(colliderDesc, rigidBody)
    }

    addObject(mesh, body, offset = 0) {
        this.objectsToUpdate.push({
            visual: mesh,
            physical: body,
            offset: offset,
        })
    }

    update() {
        this.world.timestep = this.time.delta / 1000
        this.world.step()

        for (const object of this.objectsToUpdate) {
            const { x, y, z } = object.physical.translation()
            object.visual.position.set(x, y + object.offset, z)
            object.visual.quaternion.copy(object.physical.rotation())
        }
    }
}
