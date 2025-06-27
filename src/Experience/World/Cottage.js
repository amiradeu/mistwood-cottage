import { SRGBColorSpace, MeshBasicMaterial } from 'three'

import EventEmitter from '../Utils/EventEmitter.js'
import Experience from '../Experience.js'
import { CycleEmissions } from '../Constants.js'
import RoofGlass from '../Objects/RoofGlass.js'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition.js'
import Emissive from '../Objects/Emissive.js'
import Window from '../Objects/Window.js'
import { toggleFade } from '../Utils/Animation.js'
import Fireflies from './Fireflies.js'

export default class Cottage extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.sceneGroup = this.experience.sceneGroup
        this.sceneCycle = this.experience.cycles
        this.resources = this.experience.resources
        this.physics = this.experience.physics
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug
        this.states = this.experience.states
        this.camera = this.experience.camera.instance

        this.setTextures()
        this.setMaterials()
        this.setModel()
        this.setDebug()

        this.setCustom()
        this.setEmission()

        this.setPhysics()
    }

    setTextures() {
        this.texture = this.resources.items[this.sceneCycle.textures.cottage]
        this.texture.flipY = false
        this.texture.colorSpace = SRGBColorSpace
    }

    setMaterials() {
        this.material = new MeshBasicMaterial({
            map: this.texture,
            transparent: true,
        })
        this.materialLeft = this.material.clone()
        this.materialFront = this.material.clone()

        this.uniforms = addTextureTransition(this.material)
        this.uniformsLeft = addTextureTransition(this.materialLeft)
        this.uniformsFront = addTextureTransition(this.materialFront)
    }

    setModel() {
        this.items = {}

        this.model = this.resources.items.cottageModel.scene
        this.sceneGroup.add(this.model)

        this.model.traverse((child) => {
            this.items[child.name] = child
        })

        this.setBaked()
    }

    setPhysics() {
        this.physics.glbToTrimesh(this.items.PhysicsCottageMainMerged)
        this.physics.glbToTrimesh(this.items.PhysicsCottageLeftMerged)
        this.physics.glbToTrimesh(this.items.PhysicsCottageFrontMerged)
    }

    setBaked() {
        this.items.CottageMainMerged.material = this.material
        this.items.PhysicsCottageMainMerged.material = this.material
        this.items.CottageLeftMerged.material = this.materialLeft
        this.items.PhysicsCottageLeftMerged.material = this.materialLeft
        this.items.CottageFrontMerged.material = this.materialFront
        this.items.PhysicsCottageFrontMerged.material = this.materialFront
        this.items.dooremissionfront.material = this.materialFront
        this.items.dooremissionback.material = this.material
    }

    setCustom() {
        this.roofGlass = new RoofGlass(this.items.roofglass)
        this.windows = new Window(this.items.windows, {
            name: '🪟 Back Windows',
            debug: this.debugFolder,
        })
        this.leftwindow = new Window(this.items.leftwindow, {
            name: '🪟 Left Window',
            debug: this.debugFolder,
        })
        this.frontwindows = new Window(this.items.frontwindows, {
            name: '🪟 Front Windows',
            debug: this.debugFolder,
        })
        this.firefliesFront = new Fireflies({
            positions: this.items.dooremissionfront.position,
            debug: this.debugFolder,
        })
        this.firefliesBack = new Fireflies({
            positions: this.items.dooremissionback.position,
            debug: this.debugFolder,
        })
    }

    setEmission() {
        this.emissions = new Emissive({
            name: '💡 Cottage Emissive',
            colorA: '#d8d284',
            colorB: '#be731c',
            radius: 0.8,
            power: 0.8,
            debug: this.debugFolder,
        })

        this.updateEmission()
    }

    updateEmission() {
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
        this.updateEmission()

        animateTextureChange(this.uniforms.uMixProgress)
        animateTextureChange(this.uniformsFront.uMixProgress)
        animateTextureChange(this.uniformsLeft.uMixProgress)
    }

    toggleLeft() {
        toggleFade(
            this.items.CottageLeftMerged.material,
            this.states.instance.leftVisibility
        )
        toggleFade(
            this.items.leftwindow.material,
            this.states.instance.leftVisibility,
            this.leftwindow.options.opacity
        )
    }

    toggleFront() {
        toggleFade(
            this.items.CottageFrontMerged.material,
            this.states.instance.frontVisibility
        )
        toggleFade(
            this.items.frontwindows.material,
            this.states.instance.frontVisibility,
            this.frontwindows.options.opacity
        )
        toggleFade(
            this.items.dooremissionfront.material,
            this.states.instance.frontVisibility
        )
    }

    update() {
        if (this.firefliesFront) this.firefliesFront.update()
        if (this.firefliesBack) this.firefliesBack.update()
    }

    setDebug() {
        if (!this.debug.active) return

        this.debugFolder = this.debug.ui.addFolder('🏡 Cottage').close()
    }
}
