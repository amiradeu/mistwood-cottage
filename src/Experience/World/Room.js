import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

import Experience from '../Experience.js'
import { CycleEmissions } from '../Constants.js'

export default class Room {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sceneCycle = this.experience.sceneCycle
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Room')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()

        this.sceneCycle.on('cycleChanged', () => {
            this.changeCycle()
        })

        this.removeUnusedMeshes()
    }

    setTextures() {
        this.roomBigTexture =
            this.resources.items[this.sceneCycle.textures.roomBig]
        this.roomBigTexture.flipY = false
        this.roomBigTexture.colorSpace = THREE.SRGBColorSpace

        this.roomSmallTexture =
            this.resources.items[this.sceneCycle.textures.roomSmall]
        this.roomSmallTexture.flipY = false
        this.roomSmallTexture.colorSpace = THREE.SRGBColorSpace
    }

    setMaterials() {
        this.roomBigMaterial = new THREE.MeshBasicMaterial({
            map: this.roomBigTexture,
        })

        this.roomSmallMaterial = new THREE.MeshBasicMaterial({
            map: this.roomSmallTexture,
        })

        this.emissionMaterial = new THREE.MeshBasicMaterial({
            color: '#fef3e4',
        })
    }

    setMirrorMaterial(mesh) {
        const offset = 0.001

        const worldPos = new THREE.Vector3()
        const worldQuat = new THREE.Quaternion()
        const worldScale = new THREE.Vector3()
        mesh.getWorldPosition(worldPos)
        mesh.getWorldQuaternion(worldQuat)
        mesh.getWorldScale(worldScale)

        mesh.geometry.rotateX(Math.PI * 0.5)

        const mirror = new Reflector(mesh.geometry, {
            color: 0xcbcbcb,
            textureWidth: this.sizes.width * this.sizes.pixelRatio,
            textureHeight: this.sizes.height * this.sizes.pixelRatio,
        })
        mirror.quaternion.copy(worldQuat)
        mirror.rotateX(Math.PI * -0.5)

        mirror.scale.copy(worldScale)
        mirror.position.copy(worldPos)
        mirror.position.add(
            mirror.getWorldDirection(new THREE.Vector3()).multiplyScalar(offset)
        )
        this.scene.add(mirror)
    }

    setImages() {
        const imagePlane = this.model.children.find(
            (child) => child.name === 'pictureframecontent'
        )
        console.log('Image Plane:', imagePlane)
        // const planeAspect =
        //     imagePlane.geometry.parameters.width /
        //     imagePlane.geometry.parameters.height
        // console.log('Plane Aspect Ratio:', planeAspect)

        // const image0Aspect =
        //     this.resources.items.roomImage0.image.width /
        //     this.resources.items.roomImage0.image.height
        // console.log('Image Aspect Ratio:', image0Aspect)

        // if (planeAspect < image0Aspect) {
        //     this.texture.image0.matrix.setUvTransform(
        //         0,
        //         0,
        //         planeAspect / image0Aspect,
        //         1,
        //         0,
        //         0.5,
        //         0.5
        //     )
        // } else {
        //     this.texture.image0.matrix.setUvTransform(
        //         0,
        //         0,
        //         1,
        //         image0Aspect / planeAspect,
        //         0,
        //         0.5,
        //         0.5
        //     )
        // }

        // this.model.traverse((child) => {
        //     if (child.name === 'pictureframecontent') {
        //         child.material = this.materials.imageMaterial
        //     } else if (child.name === 'pictureframecontent001') {
        //         this.materials.imageMaterial.map =
        //             this.resources.items.roomImage1
        //         child.material = this.materials.imageMaterial
        //     }
        // })
    }

    setModel() {
        this.model = this.resources.items.roomModel.scene

        this.model.scale.set(0.1, 0.1, 0.1)
        this.model.position.set(0, -2, 0)

        this.scene.add(this.model)

        this.model.traverse((child) => {
            if (
                child.name === 'RoomBigMerged' ||
                child.name === 'roomemission'
            ) {
                child.material = this.roomBigMaterial
            } else if (
                child.name === 'RoomSmallMerged' ||
                child.name === 'deskemission' ||
                child.name === 'kitchenemission' ||
                child.name === 'bedsideemission' ||
                child.name === 'bedemission'
            ) {
                child.material = this.roomSmallMaterial
            }
        })

        this.setEmissions()

        this.mirror = this.model.children.find(
            (child) => child.name === 'wallmirror'
        )
        this.setMirrorMaterial(this.mirror)

        this.setImages()
    }

    setEmissions() {
        this.emissionState = CycleEmissions[this.sceneCycle.currentCycle].room

        this.model.children.find(
            (child) => child.name === 'bulbemissions'
        ).material = this.emissionMaterial

        if (this.emissionState.kitchen) {
            this.model.children.find(
                (child) => child.name === 'kitchenemission'
            ).material = this.emissionMaterial
        }
    }

    changeCycle() {
        this.setTextures()

        this.roomSmallMaterial.map = this.roomSmallTexture
        this.roomSmallMaterial.needsUpdate = true
        this.roomBigMaterial.map = this.roomBigTexture
        this.roomBigMaterial.needsUpdate = true

        this.model.traverse((child) => {
            if (
                child.name === 'RoomBigMerged' ||
                child.name === 'roomemission'
            ) {
                child.material = this.roomBigMaterial
            } else if (
                child.name === 'RoomSmallMerged' ||
                child.name === 'deskemission' ||
                child.name === 'kitchenemission' ||
                child.name === 'bedsideemission' ||
                child.name === 'bedemission'
            ) {
                child.material = this.roomSmallMaterial
            }
        })
    }

    removeUnusedMeshes() {
        this.mirror.parent.remove(this.mirror)
    }
}
