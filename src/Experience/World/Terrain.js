import * as THREE from 'three'
import Experience from '../Experience'

export default class Terrain {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Terrain')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()
    }

    setTextures() {
        this.texture = this.resources.items.terrainTexture
        this.texture.flipY = false
        this.texture.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
        })
    }

    setModel() {
        this.model = this.resources.items.terrainModel.scene
        this.model.scale.set(0.1, 0.1, 0.1)

        this.model.traverse((child) => {
            child.material = this.material
        })
        this.scene.add(this.model)
    }
}
