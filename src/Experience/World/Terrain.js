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
        this.texture = this.resources.items[this.sceneCycle.textures.terrain]
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
        this.sceneGroup.add(this.model)

        this.model.traverse((child) => {
            if (child.name !== 'Water') child.material = this.material
        })
    }

    updateTextures() {
        this.setTextures()
        this.model.traverse((child) => {
            if (child.name !== 'Water') child.material.map = this.texture
        })
    }
}
