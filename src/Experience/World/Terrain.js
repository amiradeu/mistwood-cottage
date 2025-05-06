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

        this.texture.base = this.resources.items.baseTextureDaylight
        this.texture.base.flipY = false
        this.texture.base.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.material = {}

        this.material.land = new THREE.MeshBasicMaterial({
            map: this.texture.land,
        })

        this.material.mountain = new THREE.MeshBasicMaterial({
            map: this.texture.mountain,
        })

        this.material.base = new THREE.MeshBasicMaterial({
            map: this.texture.base,
        })
    }

    setModel() {
        this.terrain = this.resources.items.terrainModel.scene
        this.terrain.scale.set(0.1, 0.1, 0.1)
        this.terrain.position.set(0, -2, 0)
        this.scene.add(this.terrain)

        this.land = this.terrain.children.find((child) => child.name == 'Land')
        this.land.material = this.material.land

        this.mountain = this.terrain.children.find(
            (child) => child.name == 'Mountain'
        )
        this.mountain.material = this.material.mountain

        this.base = this.terrain.children.find(
            (child) => child.name == 'LandBase'
        )
        this.base.material = this.material.base
    }
}
