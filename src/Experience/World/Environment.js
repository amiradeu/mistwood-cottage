import * as THREE from 'three'

import Experience from '../Experience.js'
import { CycleEmissions } from '../Constants.js'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition.js'
import Emissive from '../Objects/Emissive.js'
import Fireflies, { AREA_TYPE } from './Fireflies.js'

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

        this.setTextures()
        this.setMaterials()
        this.setModel()
        this.setDebug()
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
        this.items = {}

        this.model = this.resources.items.environmentModel.scene
        this.sceneGroup.add(this.model)

        this.model.traverse((child) => {
            this.items[child.name] = child
            child.material = this.environmentMaterial
        })

        this.setEmission()
        this.setCustom()
    }

    setCustom() {
        this.fireflies = new Fireflies({
            area: AREA_TYPE.CUBE,
            cubeSize: {
                x: 200,
                y: 30,
                z: 200,
            },
            positions: new THREE.Vector3(0, 10, 0),
            count: 500,
            radius: 50,
            size: 100,
        })
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

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🌳 Environment').close()
        }
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

    update() {
        if (this.fireflies) this.fireflies.update()
    }
}
