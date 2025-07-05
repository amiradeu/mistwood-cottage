import { Box3, Box3Helper, Vector3 } from 'three'

export default class Boundary {
    constructor(mesh) {
        this.mesh = mesh
        this.mesh.updateWorldMatrix(true, true)

        this.box = new Box3().setFromObject(this.mesh)
        this.min = this.box.min
        this.max = this.box.max
        this.position = new Vector3()
        this.box.getCenter(this.position)

        // Wireframe
        this.boxHelper = new Box3Helper(this.box, 0xffff00)
    }

    isInside(mesh) {
        const position = mesh.position
        if (this.box.containsPoint(position)) return true
        return false
    }

    intersectsBox(box) {
        if (this.box.intersectsBox(box)) return true
        return false
    }

    /**
     * (Optional Usage)
     * To visualise wireframe around Box
     */
    update() {
        this.box.setFromObject(this.mesh)
        this.boxHelper.box.copy(this.box)
        this.boxHelper.updateMatrixWorld(true)
    }
}
