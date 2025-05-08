import * as THREE from 'three'

import Experience from '../Experience.js'
import { CycleEmissions } from '../Constants.js'

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
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        // Setup
        // this.setFog()
        this.setEnvironmentMap()
        this.setTextures()
        this.setMaterials()
        this.setModel()

        this.sceneCycle.on('cycleChanged', () => {
            // console.log('Land Cycle Changed')
            this.changeCycle()
        })
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

    setFog() {
        this.fog = new THREE.Fog(0x262837, 1, 100)
        this.scene.fog = this.fog
    }

    setEnvironmentMap() {
        this.environmentMap = {}
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.mapping =
            THREE.EquirectangularReflectionMapping

        this.scene.environment = this.environmentMap.texture
        this.scene.background = this.environmentMap.texture
    }

    changeCycle() {
        this.setTextures()

        this.environmentMaterial.map = this.texture
        this.environmentMaterial.needsUpdate = true

        this.model.traverse((child) => {
            child.material = this.environmentMaterial
        })

        this.setEmission()
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
