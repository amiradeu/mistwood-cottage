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

        // Setup
        this.setTextures()
        this.setMaterials()
        this.setModel()
    }

    setTextures() {
        this.texture = {}
        this.texture.daylight = this.resources.items.landTextureDaylight
        this.texture.daylight.flipY = false
        this.texture.daylight.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture.daylight,
        })
    }

    setModel() {
        this.model = this.resources.items.landModel.scene
        this.model.scale.set(0.1, 0.1, 0.1)
        this.model.position.set(0, -2, 0)

        this.model.traverse((child) => {
            child.material = this.material
        })
        this.scene.add(this.model)
    }
}
