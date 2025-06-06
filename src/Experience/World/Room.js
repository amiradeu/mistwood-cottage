import * as THREE from 'three'

import Experience from '../Experience.js'
import Mirror from '../Objects/Mirror.js'
import { CycleEmissions } from '../Constants.js'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition.js'
import Emissive, { EMISSIVE_TYPE } from '../Objects/Emissive.js'
import { toggleFade } from '../Utils/Animation.js'
import TeaSmoke from '../Objects/TeaSmoke.js'
import gsap from 'gsap'

export default class Room {
    constructor() {
        this.experience = new Experience()
        this.sceneGroup = this.experience.sceneGroup
        this.cycles = this.experience.cycles
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug
        this.states = this.experience.states.instance

        this.setTextures()
        this.setMaterials()
        this.setModel()
        this.setDebug()
    }

    update() {
        this.teasmoke.update()
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

        // Art Images
        this.art0Texture = this.resources.items.artImage0
        this.art0Texture.flipY = false
        this.art0Texture.colorSpace = THREE.SRGBColorSpace

        this.art1Texture = this.resources.items.artImage1
        this.art1Texture.flipY = false
        this.art1Texture.colorSpace = THREE.SRGBColorSpace

        this.art2Texture = this.resources.items.artImage2
        this.art2Texture.flipY = false
        this.art2Texture.colorSpace = THREE.SRGBColorSpace

        this.art3Texture = this.resources.items.artImage3
        this.art3Texture.flipY = false
        this.art3Texture.colorSpace = THREE.SRGBColorSpace

        this.art4Texture = this.resources.items.artImage4
        this.art4Texture.flipY = false
        this.art4Texture.colorSpace = THREE.SRGBColorSpace

        this.art5Texture = this.resources.items.artImage5
        this.art5Texture.flipY = false
        this.art5Texture.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.roomPatternMaterial = new THREE.MeshBasicMaterial({
            map: this.roomPatternTexture,
        })
        this.uniformsPattern = addTextureTransition(this.roomPatternMaterial)

        this.roomPlainMaterial = new THREE.MeshBasicMaterial({
            map: this.roomPlainTexture,
            transparent: true,
        })
        this.uniformsPlain = addTextureTransition(this.roomPlainMaterial)

        this.pictureframesMaterial = this.roomPlainMaterial.clone()
        this.uniformsPictureframes = addTextureTransition(
            this.pictureframesMaterial
        )

        this.whiteEmission = new Emissive({
            name: '💡 Room White Bulbs',
            colorA: '#ffeab6',
            colorB: '#fccf5b',
        })

        this.orangeEmission = new Emissive({
            name: '💡 Room Orange Bulbs',
            colorA: '#d86d1a', // '#e67830'
            colorB: '#de3000',
            power: 0.8,
            type: EMISSIVE_TYPE.LINEAR,
        })

        this.recordMaterial = new THREE.MeshBasicMaterial({
            color: '#7e8385',
            transparent: true,
            opacity: 0.5,
        })

        this.art0Material = new THREE.MeshBasicMaterial({
            map: this.art0Texture,
            transparent: true,
        })

        this.art1Material = new THREE.MeshBasicMaterial({
            map: this.art1Texture,
            transparent: true,
        })

        this.art2Material = new THREE.MeshBasicMaterial({
            map: this.art2Texture,
            transparent: true,
        })

        this.art3Material = new THREE.MeshBasicMaterial({
            map: this.art3Texture,
            transparent: true,
        })

        this.art4Material = new THREE.MeshBasicMaterial({
            map: this.art4Texture,
            transparent: true,
        })

        this.art5Material = new THREE.MeshBasicMaterial({
            map: this.art5Texture,
            transparent: true,
        })
    }

    setModel() {
        this.items = {}

        this.model = this.resources.items.roomModel.scene
        this.sceneGroup.add(this.model)

        this.model.traverse((child) => {
            this.items[child.name] = child
        })

        // rotate the record disk
        gsap.to(this.items.recorddisk.rotation, {
            y: -Math.PI * 2,
            duration: 8,
            ease: 'none',
            repeat: -1,
        })

        this.setCustom()
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
        this.items.recorddisk.material = this.roomPlainMaterial
        this.items.pictureframes.material = this.pictureframesMaterial
    }

    setCustom() {
        // Reflections
        this.mirror = new Mirror(this.items.wallmirror)
        this.items.recordcover.material = this.recordMaterial

        // Wall Arts
        this.items.bigart.material = this.art0Material
        this.items.smallart.material = this.art1Material
        this.items.smallart001.material = this.art2Material
        this.items.smallart002.material = this.art3Material
        this.items.smallart003.material = this.art4Material
        this.items.smallart004.material = this.art5Material

        // Smokes
        this.teasmoke = new TeaSmoke(this.items.teawater)
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
        this.roomPatternMaterial.map = this.roomPatternTexture
        this.roomPatternMaterial.needsUpdate = true
        this.roomPlainMaterial.map = this.roomPlainTexture
        this.roomPlainMaterial.needsUpdate = true
        this.pictureframesMaterial.map = this.roomPlainTexture
        this.pictureframesMaterial.needsUpdate = true
    }

    toggleFront() {
        this.model.traverse((child) => {
            if (child.name.includes('smallart')) {
                toggleFade(child.material, this.states.frontVisibility)
            }
        })
        toggleFade(
            this.items.pictureframes.material,
            this.states.frontVisibility
        )
    }

    updateCycle() {
        this.uniformsPattern.uMap0.value = this.roomPatternTexture
        this.uniformsPlain.uMap0.value = this.roomPlainTexture
        this.uniformsPictureframes.uMap0.value = this.roomPlainTexture

        this.setTextures()
        this.updateMaterials()
        this.setBaked()
        this.setEmissions()

        animateTextureChange(this.uniformsPattern.uMixProgress)
        animateTextureChange(this.uniformsPlain.uMixProgress)
        animateTextureChange(this.uniformsPictureframes.uMixProgress)
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🛋️ Room').close()
        }
    }
}
