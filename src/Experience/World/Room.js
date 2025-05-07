import * as THREE from 'three'
import Experience from '../Experience'

export default class Room {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sceneCycle = this.experience.sceneCycle
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Room')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()

        this.sceneCycle.on('cycleChanged', () => {
            // console.log('Land Cycle Changed')
            this.updateTextures()
        })
    }

    setTextures() {
        this.texture = {}

        this.texture.roomBig =
            this.resources.items[this.sceneCycle.textures.roomBig]
        this.texture.roomBig.flipY = false
        this.texture.roomBig.colorSpace = THREE.SRGBColorSpace

        this.texture.roomSmall =
            this.resources.items[this.sceneCycle.textures.roomSmall]
        this.texture.roomSmall.flipY = false
        this.texture.roomSmall.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.materials = {}

        this.materials.roomBigMaterial = new THREE.MeshBasicMaterial({
            map: this.texture.roomBig,
        })

        this.materials.roomSmallMaterial = new THREE.MeshBasicMaterial({
            map: this.texture.roomSmall,
        })

        this.materials.emissionMaterial = new THREE.MeshBasicMaterial({
            color: '#fef3e4',
        })
    }

    setModel() {
        this.model = this.resources.items.roomModel.scene
        this.model.scale.set(0.1, 0.1, 0.1)
        this.model.position.set(0, -2, 0)
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if (child.name === 'RoomSmallMerged') {
                child.material = this.materials.roomSmallMaterial
            } else if (child.name === 'RoomBigMerged') {
                child.material = this.materials.roomBigMaterial
            }
        })

        // Emissions Room Small
        this.model.children.find(
            (child) => child.name === 'bulbemissions'
        ).material = this.materials.emissionMaterial
        this.scene.add(this.model)
    }

    updateTextures() {
        this.setTextures()

        // Traverse the model and update materials dynamically
        this.model.traverse((child) => {
            if (child.name === 'RoomSmallMerged') {
                child.material.map = this.texture.roomSmall
                child.material.needsUpdate = true
            } else if (child.name === 'RoomBigMerged') {
                child.material.map = this.texture.roomBig
                child.material.needsUpdate = true
            }
        })
    }
}
