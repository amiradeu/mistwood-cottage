import * as THREE from 'three'

import Experience from '../Experience.js'
import { CycleEmissions } from '../Constants.js'
import Glass from '../Materials/Glass.js'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition.js'
import Emissive from './Emissive.js'
import GlassFrosted from '../Materials/GlassFrosted.js'
import EventEmitter from '../Utils/EventEmitter.js'

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

        this.emissions = new Emissive({
            name: '💡 Cottage Emissive',
            colorA: '#d8d284',
            colorB: '#be731c',
            radius: 0.8,
            power: 0.8,
        })

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
        })
        this.uniforms = addTextureTransition(this.material)
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
        this.items.CottageLeftMerged.material = this.material
        this.items.CottageFrontMerged.material = this.material
    }

    setCustom() {
        new Glass(this.items.roofglass)
        new GlassFrosted([
            this.items.windows,
            this.items.leftwindow,
            this.items.frontwindows,
        ])
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

    updateCycle() {
        this.uniforms.uMap0.value = this.texture

        this.setTextures()

        this.material.map = this.texture
        this.material.needsUpdate = true

        this.setBaked()
        this.setEmissions()

        animateTextureChange(this.uniforms.uMixProgress)
    }

    toggleLeft() {
        this.items.CottageLeftMerged.visible = this.states.leftVisibility
        this.items.leftwindow.visible = this.states.leftVisibility
    }

    toggleFront() {
        this.items.CottageFrontMerged.visible = this.states.frontVisibility
        this.items.frontwindows.visible = this.states.frontVisibility
        this.items.dooremissionfront.visible = this.states.frontVisibility
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🏡 Cottage')
        }
    }
}
