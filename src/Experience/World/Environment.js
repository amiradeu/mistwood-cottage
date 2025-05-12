import * as THREE from 'three'

import Experience from '../Experience.js'
import { CycleEmissions } from '../Constants.js'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sceneGroup = this.experience.world.sceneGroup
        this.sceneCycle = this.experience.sceneCycle
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🌳 Environment')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()
    }

    setTextures() {
        this.texture =
            this.resources.items[this.sceneCycle.textures.environment]
        this.texture.flipY = false
        this.texture.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.materials = []

        this.environmentMaterial = new THREE.MeshBasicMaterial({
            map: this.texture,
        })

        this.uniforms = addTextureTransition(this.environmentMaterial)

        this.wellEmissionMaterial = new THREE.MeshBasicMaterial({
            color: '#9110d2',
        })

        this.streetEmissionMaterial = new THREE.MeshBasicMaterial({
            color: '#f27527',
        })
    }

    setModel() {
        this.model = this.resources.items.environmentModel.scene
        this.sceneGroup.add(this.model)

        this.model.traverse((child) => {
            child.material = this.environmentMaterial
        })

        this.setEmission()
    }

    updateTextures() {
        this.uniforms.uMap0.value = this.texture

        this.setTextures()

        this.environmentMaterial.map = this.texture
        this.environmentMaterial.needsUpdate = true

        this.model.traverse((child) => {
            child.material = this.environmentMaterial
        })

        this.setEmission()

        animateTextureChange(this.uniforms)
    }

    setEmission() {
        this.emissionState =
            CycleEmissions[this.sceneCycle.currentCycle].environment

        this.model.children.find(
            (child) => child.name === 'wellemission'
        ).material = this.wellEmissionMaterial

        if (this.emissionState.streets) {
            this.model.children.find(
                (child) => child.name === 'streetemissions'
            ).material = this.streetEmissionMaterial
        }
    }
}
