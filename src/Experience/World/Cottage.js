import * as THREE from 'three'

import EventEmitter from '../Utils/EventEmitter.js'
import Experience from '../Experience.js'
import { CycleEmissions } from '../Constants.js'
import RoofGlass from '../Objects/RoofGlass.js'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition.js'
import Emissive from '../Objects/Emissive.js'
import DustyGlass from '../Objects/DustyGlass.js'
import { toggleFade } from '../Utils/Animation.js'
import Fireflies from './Fireflies.js'

export default class Cottage extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.sceneGroup = this.experience.world.sceneGroup
        this.sceneCycle = this.experience.cycles
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug
        this.states = this.experience.states.instance

        this.setTextures()
        this.setMaterials()
        this.setModel()
        this.setDebug()
    }

    setTextures() {
        this.texture = this.resources.items[this.sceneCycle.textures.cottage]
        this.texture.flipY = false
        this.texture.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
        })
        this.materialLeft = this.material.clone()
        this.materialFront = this.material.clone()

        this.uniforms = addTextureTransition(this.material)
        this.uniformsLeft = addTextureTransition(this.materialLeft)
        this.uniformsFront = addTextureTransition(this.materialFront)

        this.emissions = new Emissive({
            name: '💡 Cottage Emissive',
            colorA: '#d8d284',
            colorB: '#be731c',
            radius: 0.8,
            power: 0.8,
        })
    }

    setModel() {
        this.items = {}

        this.model = this.resources.items.cottageModel.scene
        this.sceneGroup.add(this.model)

        this.model.traverse((child) => {
            this.items[child.name] = child
        })

        this.setBaked()
        this.setCustom()
        this.setEmissions()
    }

    setBaked() {
        this.items.CottageMainMerged.material = this.material
        this.items.CottageLeftMerged.material = this.materialLeft
        this.items.CottageFrontMerged.material = this.materialFront
        this.items.dooremissionfront.material = this.materialFront
        this.items.dooremissionback.material = this.material
    }

    setCustom() {
        this.roofGlass = new RoofGlass(this.items.roofglass)
        this.windows = new DustyGlass(this.items.windows, {
            name: '🪟 Back Windows',
        })
        this.leftwindow = new DustyGlass(this.items.leftwindow, {
            name: '🪟 Left Window',
        })
        this.frontwindows = new DustyGlass(this.items.frontwindows, {
            name: '🪟 Front Windows',
        })
        this.firefliesFront = new Fireflies({
            positions: this.items.dooremissionfront.position,
        })
        this.firefliesBack = new Fireflies({
            positions: this.items.dooremissionback.position,
        })
    }

    setEmissions() {
        this.emissionState =
            CycleEmissions[this.sceneCycle.currentCycle].cottage

        if (this.emissionState.front) {
            this.emissions.registerEmissive(this.items.dooremissionfront)
        }

        if (this.emissionState.back) {
            this.emissions.registerEmissive(this.items.dooremissionback)
        }
    }

    updateUniforms() {
        this.uniforms.uMap0.value = this.texture
        this.uniformsFront.uMap0.value = this.texture
        this.uniformsLeft.uMap0.value = this.texture
    }

    updateMaterials() {
        this.material.map = this.texture
        this.material.needsUpdate = true
        this.materialLeft.map = this.texture
        this.materialLeft.needsUpdate = true
        this.materialFront.map = this.texture
        this.materialFront.needsUpdate = true
    }

    updateCycle() {
        this.updateUniforms()
        this.setTextures()
        this.updateMaterials()
        this.setBaked()
        this.setEmissions()

        animateTextureChange(this.uniforms.uMixProgress)
        animateTextureChange(this.uniformsFront.uMixProgress)
        animateTextureChange(this.uniformsLeft.uMixProgress)
    }

    toggleLeft() {
        toggleFade(
            this.items.CottageLeftMerged.material,
            this.states.leftVisibility
        )
        toggleFade(
            this.items.leftwindow.material,
            this.states.leftVisibility,
            this.leftwindow.options.opacity
        )
    }

    toggleFront() {
        toggleFade(
            this.items.CottageFrontMerged.material,
            this.states.frontVisibility
        )
        toggleFade(
            this.items.frontwindows.material,
            this.states.frontVisibility,
            this.frontwindows.options.opacity
        )
        toggleFade(
            this.items.dooremissionfront.material,
            this.states.frontVisibility
        )
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🏡 Cottage').close()
        }
    }

    update() {
        if (this.firefliesFront) this.firefliesFront.update()
        if (this.firefliesBack) this.firefliesBack.update()
    }
}
