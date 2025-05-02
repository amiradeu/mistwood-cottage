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

        this.texture.land = this.resources.items.landTextureDaylight
        this.texture.land.flipY = false
        this.texture.land.colorSpace = THREE.SRGBColorSpace

        this.texture.mountain = this.resources.items.mountainTextureDaylight
        this.texture.mountain.flipY = false
        this.texture.mountain.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.material = {}

        this.material.land = new THREE.MeshBasicMaterial({
            map: this.texture.land,
        })

        this.material.mountain = new THREE.MeshBasicMaterial({
            map: this.texture.mountain,
        })
    }

    setModel() {
        this.land = this.resources.items.landModel.scene
        this.land.scale.set(0.1, 0.1, 0.1)
        this.land.position.set(0, -2, 0)

        this.land.traverse((child) => {
            child.material = this.material.land
        })
        this.scene.add(this.land)

        this.mountain = this.resources.items.mountainModel.scene
        this.mountain.scale.set(0.1, 0.1, 0.1)
        this.mountain.position.set(0, -2, 0)

        this.mountain.traverse((child) => {
            child.material = this.material.mountain
        })
        this.scene.add(this.mountain)
    }
}
