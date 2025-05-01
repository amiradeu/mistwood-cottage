import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
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
    }

    setTextures() {
        this.textures = []

        this.textures.daylight = this.resources.items.environmentTextureDaylight
        this.textures.daylight.flipY = false
        this.textures.daylight.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.materials = []

        this.materials.daylight = new THREE.MeshBasicMaterial({
            map: this.textures.daylight,
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
            child.material = this.materials.daylight
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
}
