import * as THREE from 'three'
import Experience from '../Experience'

export default class Terrain {
    constructor() {
        this.experience = new Experience()
        this.sceneGroup = this.experience.world.sceneGroup
        this.sceneCycle = this.experience.sceneCycle
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('⛰️ Terrain')
        }

        // Setup
        this.setTextures()
        this.setMaterials()
        this.setModel()

        // Update cycle
        this.sceneCycle.on('cycleChanged', () => {
            // console.log('Land Cycle Changed')
            this.updateTextures()
        })
    }

    setTextures() {
        this.texture = {}

        this.texture.land = this.resources.items[this.sceneCycle.textures.land]
        this.texture.land.flipY = false
        this.texture.land.colorSpace = THREE.SRGBColorSpace

        this.texture.mountain =
            this.resources.items[this.sceneCycle.textures.mountain]
        this.texture.mountain.flipY = false
        this.texture.mountain.colorSpace = THREE.SRGBColorSpace

        this.texture.base = this.resources.items[this.sceneCycle.textures.base]
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
        this.model = this.resources.items.terrainModel.scene
        this.sceneGroup.add(this.model)

        this.land = this.model.children.find((child) => child.name == 'Land')
        this.land.material = this.material.land

        this.mountain = this.model.children.find(
            (child) => child.name == 'Mountain'
        )
        this.mountain.material = this.material.mountain

        this.base = this.model.children.find(
            (child) => child.name == 'LandBase'
        )
        this.base.material = this.material.base
    }

    updateTextures() {
        this.setTextures()

        // Traverse the model and update materials dynamically
        this.model.traverse((child) => {
            if (child.name === 'Land') {
                child.material.map = this.texture.land
                child.material.needsUpdate = true
            } else if (child.name === 'Mountain') {
                child.material.map = this.texture.mountain
                child.material.needsUpdate = true
            } else if (child.name === 'LandBase') {
                child.material.map = this.texture.base
                child.material.needsUpdate = true
            }
        })
    }
}
