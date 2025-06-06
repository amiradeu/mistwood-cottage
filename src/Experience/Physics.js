import * as CANNON from 'cannon-es'

import Experience from './Experience.js'

export default class Physics {
    constructor() {
        this.experience = new Experience()
        this.time = this.experience.time

        this.objectsToUpdate = []

        this.setInstance()
    }

    setInstance() {
        this.world = new CANNON.World()
        this.world.gravity.set(0, -9.82, 0)

        // Improve performance
        this.world.broadphase = new CANNON.SAPBroadphase(this.world)
        this.world.allowSleep = true
    }

    createTrimesh(geometry) {
        const position = geometry.attributes.position
        const index = geometry.index

        const vertices = Array.from(position.array)
        const indices = index
            ? Array.from(index.array)
            : this.generateIndices(vertices)

        return new CANNON.Trimesh(vertices, indices)
    }

    generateIndices(vertices) {
        const indices = []
        for (let i = 0; i < vertices.length / 3; i++) {
            indices.push(i)
        }
        return indices
    }

    addObject(mesh, body) {
        this.world.addBody(body)

        this.objectsToUpdate.push({
            mesh,
            body,
        })
    }

    update() {
        this.world.step(1 / 60, this.time.elapsed, 3)

        for (const object of this.objectsToUpdate) {
            object.mesh.position.copy(object.body.position)
            object.mesh.quaternion.copy(object.body.quaternion)
        }
    }
}
