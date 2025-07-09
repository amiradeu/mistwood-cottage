import { SRGBColorSpace, MeshBasicMaterial, Vector3 } from 'three'

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
        this.physics = this.experience.physics
        this.sceneGroup = this.experience.sceneGroup
        this.sceneCycle = this.experience.cycles
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // GLB Model
        this.setTextures()
        this.setMaterials()
        this.setModel()
        this.setDebug()

        // Custom & Lights
        this.setCustom()
        this.setEmission()

        // Physics mechanism
        this.setPhysics()
    }

    setTextures() {
        this.texture =
            this.resources.items[this.sceneCycle.textures.environment]
        this.texture.flipY = false
        this.texture.colorSpace = SRGBColorSpace
    }

    setMaterials() {
        this.material = new MeshBasicMaterial({
            map: this.texture,
        })
        this.uniforms = addTextureTransition(this.material)

        this.wellEmissionMaterial = new MeshBasicMaterial({
            color: '#9110d2',
        })
    }

    setModel() {
        this.items = {}

        this.model = this.resources.items.environmentModel.scene
        this.sceneGroup.add(this.model)

        this.model.traverse((child) => {
            this.items[child.name] = child
        })

        this.setBaked()
    }

    setBaked() {
        this.items.EnvironmentMerged.material = this.material
        this.items.Well.material = this.material
        this.items.NoPhysics.material = this.material
        this.items.streetemissions.material = this.material
    }

    setEmission() {
        this.emissions = new Emissive({
            name: '💡 Environment Emissive',
            colorA: '#ffaf3c',
            colorB: '#dd3c00',
            radius: 0.8,
            power: 1.2,
            debug: this.debugFolder,
        })

        this.updateEmission()
    }

    updateEmission() {
        this.emissionState =
            CycleEmissions[this.sceneCycle.currentCycle].environment

        this.items.wellemission.material = this.wellEmissionMaterial

        if (this.emissionState.streets) {
            this.emissions.registerEmissive(this.items.streetemissions)
        }
    }

    setCustom() {
        this.fireflies = new Fireflies({
            area: AREA_TYPE.CUBE,
            cubeSize: {
                x: 200,
                y: 30,
                z: 200,
            },
            positions: new Vector3(0, 10, 0),
            count: 500,
            radius: 50,
            size: 100,

            debug: this.debugFolder,
        })
    }

    setPhysics() {
        this.physics.glbToTrimesh(this.items.EnvironmentMerged)
        this.physics.glbToConvexHull(this.items.Well)
    }

    updateCycle() {
        this.uniforms.uMap0.value = this.texture

        this.setTextures()

        this.material.map = this.texture
        this.material.needsUpdate = true

        this.setBaked()
        this.updateEmission()

        animateTextureChange(this.uniforms.uMixProgress)
    }

    update() {
        if (this.fireflies) this.fireflies.update()
    }

    setDebug() {
        if (!this.debug.active) return
        this.debugFolder = this.debug.ui.addFolder('🌳 Environment').close()
    }
}
