import * as THREE from 'three'
import Experience from '../Experience'

export default class Garden {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Garden')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()
    }

    setTextures() {
        this.textures = {}

        this.textures.garden = this.resources.items.gardenTexture
        this.textures.garden.flipY = false
        this.textures.garden.colorSpace = THREE.SRGBColorSpace

        this.textures.earth = this.resources.items.earthTexture
        this.textures.earth.flipY = false
        this.textures.earth.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.gardenMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.garden,
        })

        this.earthMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.earth,
        })

        this.poleLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xfeee89,
        })
    }

    setModel() {
        this.gardenModel = this.resources.items.gardenModel.scene
        this.gardenModel.scale.set(0.1, 0.1, 0.1)

        this.gardenModel.traverse((child) => {
            child.material = this.gardenMaterial
        })

        this.scene.add(this.gardenModel)

        this.earthModel = this.resources.items.earthModel.scene
        this.earthModel.scale.set(0.1, 0.1, 0.1)

        this.earthModel.traverse((child) => {
            child.material = this.earthMaterial
        })

        this.poleLamps = []
        this.poleLamps.push(
            this.gardenModel.children.find(
                (child) => child.name === 'road_lamp_emission'
            ),
            this.gardenModel.children.find(
                (child) => child.name === 'road_lamp_emission001'
            ),
            this.gardenModel.children.find(
                (child) => child.name === 'road_lamp_emission002'
            )
        )

        this.poleLamps.forEach((item) => {
            item.material = this.poleLightMaterial
        })

        // this.scene.add(this.earthModel)
    }
}
