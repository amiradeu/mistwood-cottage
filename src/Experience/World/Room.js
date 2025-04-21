import * as THREE from 'three'
import Experience from '../Experience'

export default class Room {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Room')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()
    }

    setTextures() {
        this.textures = []

        this.textures.roomBigTexture = this.resources.items.roomBigTexture
        this.textures.roomBigTexture.flipY = false
        this.textures.roomBigTexture.colorSpace = THREE.SRGBColorSpace

        this.textures.roomSmallTexture = this.resources.items.roomSmallTexture
        this.textures.roomSmallTexture.flipY = false
        this.textures.roomSmallTexture.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.materials = []

        this.materials.roomBigMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.roomBigTexture,
        })

        this.materials.roomSmallMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.roomSmallTexture,
        })

        this.materials.emissionMaterial = new THREE.MeshBasicMaterial({
            color: '#fef3e4',
        })
    }

    setModel() {
        this.model = this.resources.items.roomBigModel.scene
        this.model.scale.set(0.1, 0.1, 0.1)
        this.model.position.set(0, -2, 0)
        this.model.traverse((child) => {
            child.material = this.materials.roomBigMaterial
        })
        // Emissions Room Big
        this.emissions = []
        this.emissions.push(
            this.model.children.find((child) => child.name === 'roomemission')
        )
        this.emissions.forEach((item) => {
            item.material = this.materials.emissionMaterial
        })
        this.scene.add(this.model)

        this.model = this.resources.items.roomSmallModel.scene
        this.model.scale.set(0.1, 0.1, 0.1)
        this.model.position.set(0, -2, 0)
        this.model.traverse((child) => {
            child.material = this.materials.roomSmallMaterial
        })
        // Emissions Room Small
        this.emissions = []
        this.emissions.push(
            this.model.children.find((child) => child.name === 'bulbemission'),
            this.model.children.find(
                (child) => child.name === 'bulbemission001'
            ),
            this.model.children.find(
                (child) => child.name === 'bulbemission002'
            ),
            this.model.children.find(
                (child) => child.name === 'bulbemission003'
            ),
            this.model.children.find(
                (child) => child.name === 'bulbemission004'
            ),
            this.model.children.find(
                (child) => child.name === 'bulbemission005'
            ),
            this.model.children.find(
                (child) => child.name === 'bulbemission006'
            ),
            this.model.children.find((child) => child.name === 'bedemission'),
            this.model.children.find(
                (child) => child.name === 'bedsideemission'
            ),
            this.model.children.find((child) => child.name === 'deskemission'),
            this.model.children.find(
                (child) => child.name === 'kitchenemission'
            )
        )
        this.emissions.forEach((item) => {
            item.material = this.materials.emissionMaterial
        })
        this.scene.add(this.model)
    }
}
