import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
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
            this.updateTextures()
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

        this.materials.environment = new THREE.MeshBasicMaterial({
            map: this.texture,
        })

        this.materials.wellEmission = new THREE.MeshBasicMaterial({
            color: '#9110d2',
        })

        this.materials.streetEmissions = new THREE.MeshBasicMaterial({
            color: '#f27527',
        })
    }

    setModel() {
        this.model = this.resources.items.environmentModel.scene
        this.model.scale.set(0.1, 0.1, 0.1)
        this.model.position.set(0, -2, 0)

        this.model.traverse((child) => {
            child.material = this.materials.environment
        })

        // Well
        this.model.children.find(
            (child) => child.name === 'wellemission'
        ).material = this.materials.wellEmission

        // Street Lamps - during night
        // this.model.children.find(
        //     (child) => child.name === 'streetemissions'
        // ).material = this.materials.streetEmissions

        this.scene.add(this.model)
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

    updateTextures() {
        this.setTextures()

        this.model.traverse((child) => {
            child.material.map = this.texture
            child.material.needsUpdate = true
        })
    }
}
