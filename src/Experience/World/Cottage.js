import * as THREE from 'three'
import { Refractor } from 'three/examples/jsm/objects/Refractor.js'

import Experience from '../Experience.js'
import { CycleEmissions } from '../Constants.js'

import glassRefractionVertexShader from '../Shaders/GlassRefraction/vertex.glsl'
import glassRefractionFragmentShader from '../Shaders/GlassRefraction/fragment.glsl'

export default class Cottage {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sceneCycle = this.experience.sceneCycle
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Cottage')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()

        // Update day cycle
        this.sceneCycle.on('cycleChanged', () => {
            this.changeCycle()
        })

        this.removeUnusedMeshes()
    }

    setTextures() {
        this.cottageTexture =
            this.resources.items[this.sceneCycle.textures.cottage]
        this.cottageTexture.flipY = false
        this.cottageTexture.colorSpace = THREE.SRGBColorSpace

        this.glassTexture = this.resources.items.glassTexture
        this.glassTexture.wrapS = THREE.RepeatWrapping
        this.glassTexture.wrapT = THREE.RepeatWrapping
    }

    setMaterials() {
        this.cottageMaterial = new THREE.MeshBasicMaterial({
            map: this.cottageTexture,
        })

        this.emissionMaterial = new THREE.MeshBasicMaterial({
            color: 0xfeee89,
        })
    }

    setModel() {
        this.model = this.resources.items.cottageModel.scene
        this.roof = this.model.children.find(
            (child) => child.name === 'roofglass'
        )
        this.window = this.model.children.find(
            (child) => child.name === 'window'
        )

        this.model.scale.set(0.1, 0.1, 0.1)
        this.model.position.set(0, -2, 0)
        this.scene.add(this.model)

        // Apply baked texture
        this.model.traverse((child) => {
            child.material = this.cottageMaterial
        })

        // Hide Left Side
        this.leftSide = this.model.children.find(
            (child) => child.name === 'CottageLeftMerged'
        )
        this.debugFolder.add(this.leftSide, 'visible').name('left side')

        // Hide Front Side
        this.frontSide = this.model.children.find(
            (child) => child.name === 'CottageFrontMerged'
        )
        this.debugFolder.add(this.frontSide, 'visible').name('front side')

        this.setGlass(this.roof)
        this.setEmissions()
    }

    setEmissions() {
        this.emissionState =
            CycleEmissions[this.sceneCycle.currentCycle].cottage

        if (this.emissionState.front) {
            this.model.children.find(
                (child) => child.name === 'dooremissionfront'
            ).material = this.emissionMaterial
        }
        if (this.emissionState.back) {
            this.model.children.find(
                (child) => child.name === 'dooremissionback'
            ).material = this.emissionMaterial
        }
    }

    setGlass(mesh) {
        const uniforms = {
            color: { value: null },
            time: { value: 0 },
            tDiffuse: { value: null },
            tDudv: { value: this.glassTexture },
            textureMatrix: { value: null },
            strength: { value: 0.5 },
            repeatScale: { value: 2 },
        }

        const glassShader = new THREE.ShaderMaterial({
            vertexShader: glassRefractionVertexShader,
            fragmentShader: glassRefractionFragmentShader,
            uniforms: uniforms,
        })

        // Extract world transform
        // 💡 correct child position when parent model is scaled
        const worldPos = new THREE.Vector3()
        const worldQuat = new THREE.Quaternion()
        const worldScale = new THREE.Vector3()
        mesh.getWorldPosition(worldPos)
        mesh.getWorldQuaternion(worldQuat)
        mesh.getWorldScale(worldScale)

        // 💡 geometry need a default forward vector (0,0,1) for Reflector to work
        mesh.geometry.rotateX(Math.PI * 0.5)

        const offset = 0.001

        const createGlass = (isBack = false) => {
            const refractor = new Refractor(mesh.geometry, {
                color: '#d6ebfd',
                textureWidth: this.sizes.width * this.sizes.pixelRatio,
                textureHeight: this.sizes.height * this.sizes.pixelRatio,
                shader: glassShader,
            })

            // Apply transform
            const finalQuat = worldQuat.clone()
            finalQuat.multiply(
                new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(1, 0, 0),
                    -Math.PI / 2
                )
            )
            if (isBack) {
                finalQuat.multiply(
                    new THREE.Quaternion().setFromAxisAngle(
                        new THREE.Vector3(0, 1, 0),
                        Math.PI
                    )
                )
            }

            refractor.quaternion.copy(finalQuat)
            refractor.scale.copy(worldScale)
            refractor.position.copy(worldPos)
            refractor.position.add(
                refractor
                    .getWorldDirection(new THREE.Vector3())
                    .multiplyScalar(offset)
            )

            this.scene.add(refractor)
            return refractor
        }

        const glassFront = createGlass(false)
        const glassBack = createGlass(true)

        if (this.debug.active) {
            this.debugFolder
                .add(uniforms.strength, 'value')
                .min(0)
                .max(10)
                .step(0.01)
                .name('waveStrength')

            this.debugFolder
                .add(uniforms.repeatScale, 'value')
                .min(0)
                .max(10)
                .step(1)
                .name('repeatScale')
        }
    }

    changeCycle() {
        this.cottageTexture =
            this.resources.items[this.sceneCycle.textures.cottage]
        this.cottageTexture.flipY = false
        this.cottageTexture.colorSpace = THREE.SRGBColorSpace

        this.cottageMaterial.map = this.cottageTexture
        this.cottageMaterial.needsUpdate = true

        this.model.traverse((child) => {
            child.material = this.cottageMaterial
        })

        this.setEmissions()
    }

    removeUnusedMeshes() {
        // Delete Unused Meshes
        this.roof.parent.remove(this.roof)
        this.window.parent.remove(this.window)
    }
}
