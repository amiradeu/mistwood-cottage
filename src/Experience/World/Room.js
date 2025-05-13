import * as THREE from 'three'

import Experience from '../Experience.js'
import Mirror from './Mirror.js'
import { CycleEmissions } from '../Constants.js'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition.js'

export default class Room {
    constructor() {
        this.experience = new Experience()
        this.sceneGroup = this.experience.world.sceneGroup
        this.sceneCycle = this.experience.cycles
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🛋️ Room')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()
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
        this.uniformsBig = addTextureTransition(this.roomBigMaterial)

        this.roomSmallMaterial = new THREE.MeshBasicMaterial({
            map: this.roomSmallTexture,
        })
        this.uniformsSmall = addTextureTransition(this.roomSmallMaterial)

        this.emissionMaterial = new THREE.MeshBasicMaterial({
            color: '#fef3e4',
        })
    }

    setImages() {
        const imagePlane = this.model.children.find(
            (child) => child.name === 'pictureframecontent'
        )
        // console.log('Image Plane:', imagePlane)
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
        this.sceneGroup.add(this.model)

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

        const mirror = this.model.children.find(
            (child) => child.name === 'wallmirror'
        )
        this.mirror = new Mirror(mirror)

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

    updateTextures() {
        this.uniformsBig.uMap0.value = this.roomBigTexture
        this.uniformsSmall.uMap0.value = this.roomSmallTexture

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

        animateTextureChange(this.uniformsBig.uMixProgress)
        animateTextureChange(this.uniformsSmall.uMixProgress)
    }
}
