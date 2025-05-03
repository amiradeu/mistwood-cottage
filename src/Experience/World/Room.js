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
        this.textures = {}

        this.textures.bigDaylightTexture =
            this.resources.items.roomBigTextureDaylight
        this.textures.bigDaylightTexture.flipY = false
        this.textures.bigDaylightTexture.colorSpace = THREE.SRGBColorSpace

        this.textures.smallDaylightTexture =
            this.resources.items.roomSmallTextureDaylight
        this.textures.smallDaylightTexture.flipY = false
        this.textures.smallDaylightTexture.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.materials = {}

        this.materials.roomBigMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.bigDaylightTexture,
        })

        this.materials.roomSmallMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.smallDaylightTexture,
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
        this.scene.add(this.model)

        this.model = this.resources.items.roomSmallModel.scene
        this.model.scale.set(0.1, 0.1, 0.1)
        this.model.position.set(0, -2, 0)
        this.model.traverse((child) => {
            child.material = this.materials.roomSmallMaterial
        })

        // Emissions Room Small
        this.model.children.find(
            (child) => child.name === 'bulbemissions'
        ).material = this.materials.emissionMaterial
        this.scene.add(this.model)
    }
}
