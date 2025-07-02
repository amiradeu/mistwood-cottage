import { Box3 } from 'three'

export default class Boundary {
    constructor(mesh) {
        this.mesh = mesh
        this.mesh.updateWorldMatrix(true, true)

        this.boundary = new Box3().setFromObject(this.mesh)
        this.min = this.boundary.min
        this.max = this.boundary.max
    }

    isInside(mesh) {
        const position = mesh.position
        if (this.boundary.containsPoint(position)) return true
        return false
    }
}
