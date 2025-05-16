import * as THREE from 'three'

import Experience from '../Experience.js'
import Mirror from './Mirror.js'
import { CycleEmissions } from '../Constants.js'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition.js'
import Emissive from './Emissive.js'

export default class Room {
    constructor() {
        this.experience = new Experience()
        this.sceneGroup = this.experience.world.sceneGroup
        this.cycles = this.experience.cycles
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🛋️ Room')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()
    }

    setTextures() {
        this.roomPatternTexture =
            this.resources.items[this.cycles.textures.roomPattern]
        this.roomPatternTexture.flipY = false
        this.roomPatternTexture.colorSpace = THREE.SRGBColorSpace

        this.roomPlainTexture =
            this.resources.items[this.cycles.textures.roomPlain]
        this.roomPlainTexture.flipY = false
        this.roomPlainTexture.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.roomPatternMaterial = new THREE.MeshBasicMaterial({
            map: this.roomPatternTexture,
        })
        this.uniformsPattern = addTextureTransition(this.roomPatternMaterial)

        this.roomPlainMaterial = new THREE.MeshBasicMaterial({
            map: this.roomPlainTexture,
        })
        this.uniformsPlain = addTextureTransition(this.roomPlainMaterial)

        this.whiteEmission = new Emissive({
            name: '💡 Room White Bulbs',
            colorA: '#ffeab6',
            colorB: '#fccf5b',
        })

        this.orangeEmission = new Emissive({
            name: '💡 Room Orange Bulbs',
            colorA: '#de3000',
            colorB: '#db5d11',
        })
    }

    setModel() {
        this.items = {}

        this.model = this.resources.items.roomModel.scene
        this.sceneGroup.add(this.model)

        this.model.traverse((child) => {
            this.items[child.name] = child
        })

        this.mirror = new Mirror(this.items.wallmirror)
        this.setBaked()
        this.setEmissions()
    }

    setBaked() {
        this.items.RoomPatternMerged.material = this.roomPatternMaterial
        this.items.RoomPlainMerged.material = this.roomPlainMaterial
        this.items.bedemission.material = this.roomPlainMaterial
        this.items.bedsideemission.material = this.roomPlainMaterial
        this.items.deskemission.material = this.roomPlainMaterial
        this.items.kitchenemission.material = this.roomPlainMaterial
        this.items.roomemission.material = this.roomPlainMaterial
        this.items.pictureframes.material = this.roomPlainMaterial
    }

    setEmissions() {
        this.emissionState = CycleEmissions[this.cycles.currentCycle].room

        this.items.bulbemissions.material = this.orangeEmission
        this.orangeEmission.registerEmissive(this.items.bulbemissions)

        if (this.emissionState.room) {
            this.items.roomemission.material = this.whiteEmission
            this.whiteEmission.registerEmissive(this.items.roomemission)
        }

        if (this.emissionState.bed) {
            this.items.bedemission.material = this.whiteEmission
            this.whiteEmission.registerEmissive(this.items.bedemission)
        }

        if (this.emissionState.bedside) {
            this.items.bedsideemission.material = this.whiteEmission
            this.whiteEmission.registerEmissive(this.items.bedsideemission)
        }

        if (this.emissionState.desk) {
            this.items.deskemission.material = this.orangeEmission
            this.orangeEmission.registerEmissive(this.items.deskemission)
        }

        if (this.emissionState.kitchen) {
            this.items.kitchenemission.material = this.whiteEmission
            this.whiteEmission.registerEmissive(this.items.kitchenemission)
        }
    }

    updateMaterials() {
        this.roomPlainMaterial.map = this.roomPlainTexture
        this.roomPlainMaterial.needsUpdate = true
        this.roomPatternMaterial.map = this.roomPatternTexture
        this.roomPatternMaterial.needsUpdate = true
    }

    toggleFront() {
        this.model.traverse((child) => {
            if (child.name.includes('pictureframecontent'))
                child.visible = false
        })
        this.items.pictureframes.visible = false
    }

    updateCycle() {
        this.uniformsPattern.uMap0.value = this.roomPatternTexture
        this.uniformsPlain.uMap0.value = this.roomPlainTexture

        this.setTextures()
        this.updateMaterials()
        this.setBaked()
        this.setEmissions()

        animateTextureChange(this.uniformsPattern.uMixProgress)
        animateTextureChange(this.uniformsPlain.uMixProgress)
    }
}
