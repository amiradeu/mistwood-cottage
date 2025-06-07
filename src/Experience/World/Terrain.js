import * as THREE from 'three'

import Experience from '../Experience'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition'
import Pond from '../Objects/Pond'
import CausticsFloor from '../Objects/CausticsFloor'

export default class Terrain {
    constructor() {
        this.experience = new Experience()
        this.sceneGroup = this.experience.sceneGroup
        this.sceneCycle = this.experience.cycles
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.physics = this.experience.physics

        // Setup
        this.setTextures()
        this.setMaterials()
        this.setModel()
        this.setPhysics()
        this.setDebug()
    }

    setTextures() {
        this.texture = this.resources.items[this.sceneCycle.textures.terrain]
        this.texture.flipY = false
        this.texture.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            // wireframe: true,
        })
        this.uniforms = addTextureTransition(this.material)
    }

    setModel() {
        this.items = {}

        this.model = this.resources.items.terrainModel.scene
        this.sceneGroup.add(this.model)

        this.model.traverse((child) => {
            this.items[child.name] = child
        })

        this.setBaked()
        this.setCustom()
    }

    setPhysics() {
        this.physics.glbToTrimesh(this.items.Land)
        this.physics.glbToTrimesh(this.items.PondGround)
    }

    setBaked() {
        this.items.Land.material = this.material
        this.items.LandBase.material = this.material
        this.items.Mountain.material = this.material
    }

    setCustom() {
        this.pond = new Pond(this.items.Water)
        this.pondGround = new CausticsFloor(this.items.PondGround, {
            texture: this.texture,
        })
    }

    updateUniforms() {
        this.uniforms.uMap0.value = this.texture
    }

    updateMaterials() {
        this.material.map = this.texture
        this.material.needsUpdate = true
    }

    updateCycle() {
        this.updateUniforms()
        this.setTextures()
        this.updateMaterials()

        animateTextureChange(this.uniforms.uMixProgress)

        if (this.pondGround) this.pondGround.updateCycle(this.texture)
    }

    update() {
        if (this.pond) this.pond.update()
        if (this.pondGround) this.pondGround.update()
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('⛰️ Terrain').close()
        }
    }
}
