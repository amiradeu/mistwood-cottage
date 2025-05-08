import * as THREE from 'three'

import Experience from '../Experience.js'
import { CycleEmissions } from '../Constants.js'
import Glass from './Glass.js'

export default class Cottage {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sceneCycle = this.experience.sceneCycle
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug

        this.setTextures()
        this.setMaterials()
        this.setModel()

        // Update day cycle
        this.sceneCycle.on('cycleChanged', () => {
            this.changeCycle()
        })

        this.addDebug()
        this.removeUnusedMeshes()
    }

    setTextures() {
        this.texture = this.resources.items[this.sceneCycle.textures.cottage]
        this.texture.flipY = false
        this.texture.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.cottageMaterial = new THREE.MeshBasicMaterial({
            map: this.texture,
        })

        this.emissionMaterial = new THREE.MeshBasicMaterial({
            color: 0xfeee89,
        })
    }

    setModel() {
        this.model = this.resources.items.cottageModel.scene

        this.window = this.model.children.find(
            (child) => child.name === 'window'
        )

        this.model.scale.set(0.1, 0.1, 0.1)
        this.model.position.set(0, -2, 0)
        this.scene.add(this.model)

        // Apply baked texture
        this.model.traverse((child) => {
            child.material = this.cottageMaterial
        })

        // Hide Left Side
        this.leftSide = this.model.children.find(
            (child) => child.name === 'CottageLeftMerged'
        )

        // Hide Front Side
        this.frontSide = this.model.children.find(
            (child) => child.name === 'CottageFrontMerged'
        )

        this.roof = this.model.children.find(
            (child) => child.name === 'roofglass'
        )
        this.glass = new Glass(this.roof)

        this.setEmissions()
    }

    setEmissions() {
        this.emissionState =
            CycleEmissions[this.sceneCycle.currentCycle].cottage

        if (this.emissionState.front) {
            this.model.children.find(
                (child) => child.name === 'dooremissionfront'
            ).material = this.emissionMaterial
        }
        if (this.emissionState.back) {
            this.model.children.find(
                (child) => child.name === 'dooremissionback'
            ).material = this.emissionMaterial
        }
    }

    changeCycle() {
        this.texture = this.resources.items[this.sceneCycle.textures.cottage]
        this.texture.flipY = false
        this.texture.colorSpace = THREE.SRGBColorSpace

        this.cottageMaterial.map = this.texture
        this.cottageMaterial.needsUpdate = true

        this.model.traverse((child) => {
            child.material = this.cottageMaterial
        })

        this.setEmissions()
    }

    removeUnusedMeshes() {
        // Delete Unused Meshes
        this.window.parent.remove(this.window)
    }

    addDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Cottage')

            this.debugFolder.add(this.leftSide, 'visible').name('left side')

            this.debugFolder.add(this.frontSide, 'visible').name('front side')
        }
    }
}
