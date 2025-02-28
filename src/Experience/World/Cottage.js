import * as THREE from 'three'
import Experience from '../Experience'

export default class Cottage {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Cottage')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()
    }

    setTextures() {
        this.textures = {}

        this.textures.cottage = this.resources.items.cottageTexture
        this.textures.cottage.flipY = false
        this.textures.cottage.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.cottageMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.cottage,
        })

        this.windowLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xfefee4,
        })

        this.poleLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xfeee89,
        })
    }

    setModel() {
        this.model = this.resources.items.cottageModel.scene
        this.model.scale.set(0.1, 0.1, 0.1)

        this.model.traverse((child) => {
            child.material = this.cottageMaterial
        })

        this.windows = []
        this.windows.push(
            this.model.children.find(
                (child) => child.name === 'window_emission'
            ),
            this.model.children.find(
                (child) => child.name === 'window_emission_2'
            ),
            this.model.children.find(
                (child) => child.name === 'window_emission_3'
            ),
            this.model.children.find(
                (child) => child.name === 'window_emission_4'
            )
        )
        this.windows.forEach((item) => {
            item.material = this.windowLightMaterial
        })

        this.poleLamps = []
        this.poleLamps.push(
            this.model.children.find(
                (child) => child.name === 'door_lamp_emission'
            )
        )
        this.poleLamps.forEach((item) => {
            item.material = this.poleLightMaterial
        })

        this.scene.add(this.model)
    }
}
