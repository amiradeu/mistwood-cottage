import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

import Experience from '../Experience.js'

export default class Mirror {
    constructor(mesh) {
        this.experience = new Experience()
        this.sceneGroup = this.experience.world.sceneGroup
        this.sizes = this.experience.sizes

        this.mesh = mesh

        this.setModel()
        this.clearMesh()
    }

    setModel() {
        const worldPos = new THREE.Vector3()
        const worldQuat = new THREE.Quaternion()
        this.mesh.getWorldPosition(worldPos)
        this.mesh.getWorldQuaternion(worldQuat)

        this.mesh.geometry.rotateX(Math.PI * 0.5)

        const mirror = new Reflector(this.mesh.geometry, {
            color: 0xcbcbcb,
            textureWidth: this.sizes.width * this.sizes.pixelRatio,
            textureHeight: this.sizes.height * this.sizes.pixelRatio,
        })
        mirror.quaternion.copy(worldQuat)
        mirror.rotateX(Math.PI * -0.5)
        mirror.position.copy(this.mesh.position)
        this.sceneGroup.add(mirror)
    }

    clearMesh() {
        this.mesh.parent.remove(this.mesh)
    }
}
