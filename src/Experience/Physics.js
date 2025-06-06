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

        // Create the ground
        let groundColliderDesc = RAPIER.ColliderDesc.cuboid(100.0, 0.1, 100.0)
        groundColliderDesc.setFriction(0.1)
        this.world.createCollider(groundColliderDesc)
    }

    createTrimesh(geometry) {}

    addObject(mesh, body) {
        this.objectsToUpdate.push({
            visual: mesh,
            physical: body,
        })
    }

    update() {
        this.world.timestep = this.time.delta / 1000
        this.world.step()

        for (const object of this.objectsToUpdate) {
            object.visual.position.copy(object.physical.translation())
            object.visual.quaternion.copy(object.physical.rotation())
        }
    }
}
