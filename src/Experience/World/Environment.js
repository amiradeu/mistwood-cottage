import * as THREE from 'three'

import Experience from '../Experience.js'
import { CycleEmissions } from '../Constants.js'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition.js'
import Emissive from '../Materials/Emissive.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sceneGroup = this.experience.world.sceneGroup
        this.sceneCycle = this.experience.cycles
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.emissions = new Emissive({
            name: '💡 Environment Emissive',
            colorA: '#ffaf3c',
            colorB: '#dd3c00',
            radius: 0.8,
            power: 1.2,
        })

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
    }

    setModel() {
        this.model = this.resources.items.environmentModel.scene
        this.sceneGroup.add(this.model)

        this.model.traverse((child) => {
            child.material = this.environmentMaterial
        })

        this.setEmission()
    }

    updateCycle() {
        this.uniforms.uMap0.value = this.texture

        this.setTextures()

        this.environmentMaterial.map = this.texture
        this.environmentMaterial.needsUpdate = true

        this.model.traverse((child) => {
            child.material = this.environmentMaterial
        })

        this.setEmission()

        animateTextureChange(this.uniforms.uMixProgress)
    }

    setEmission() {
        this.emissionState =
            CycleEmissions[this.sceneCycle.currentCycle].environment

        this.model.children.find(
            (child) => child.name === 'wellemission'
        ).material = this.wellEmissionMaterial

        if (this.emissionState.streets) {
            const emissions = this.model.children.find(
                (child) => child.name === 'streetemissions'
            )
            emissions.layers.enable(1)
            // console.log(emissions.isMesh)
            this.emissions.registerEmissive(emissions)
        }
    }
}
