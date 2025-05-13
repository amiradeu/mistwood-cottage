import * as THREE from 'three'

import Experience from '../Experience.js'
import { CycleEmissions } from '../Constants.js'
import Glass from './Glass.js'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition.js'
import Emissive from './Emissive.js'

export default class Cottage {
    constructor() {
        this.experience = new Experience()
        this.sceneGroup = this.experience.world.sceneGroup
        this.sceneCycle = this.experience.cycles
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug

        this.emissions = new Emissive({
            name: '💡 Cottage Emissive',
        })

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🏡 Cottage')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()

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
        this.uniforms = addTextureTransition(this.cottageMaterial)
    }

    setModel() {
        this.model = this.resources.items.cottageModel.scene
        this.sceneGroup.add(this.model)

        this.window = this.model.children.find(
            (child) => child.name === 'window'
        )

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

        if (this.debug.active) {
            this.debugFolder.add(this.leftSide, 'visible').name('left side')
            this.debugFolder.add(this.frontSide, 'visible').name('front side')
        }

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
            const emissionFront = this.model.children.find(
                (child) => child.name === 'dooremissionfront'
            )

            this.emissions.registerEmissive(emissionFront)
        }
        if (this.emissionState.back) {
            const emissionBack = this.model.children.find(
                (child) => child.name === 'dooremissionback'
            )
            this.emissions.registerEmissive(emissionBack)
        }
    }

    updateTextures() {
        this.uniforms.uMap0.value = this.texture

        this.setTextures()

        this.cottageMaterial.map = this.texture
        this.cottageMaterial.needsUpdate = true

        this.model.traverse((child) => {
            child.material = this.cottageMaterial
        })

        this.setEmissions()

        animateTextureChange(this.uniforms.uMixProgress)
    }

    removeUnusedMeshes() {
        // Delete Unused Meshes
        this.window.parent.remove(this.window)
    }
}
