import * as THREE from 'three'
import { Refractor } from 'three/examples/jsm/objects/Refractor.js'

import Experience from '../Experience'
import glassRefractionVertexShader from '../Shaders/GlassRefraction/vertex.glsl'
import glassRefractionFragmentShader from '../Shaders/GlassRefraction/fragment.glsl'
export default class Cottage {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Cottage')
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()
        // this.addHelpers()
    }

    setTextures() {
        this.textures = {}

        this.textures.cottage = this.resources.items.cottageTexture
        this.textures.cottage.flipY = false
        this.textures.cottage.colorSpace = THREE.SRGBColorSpace

        this.textures.glass = this.resources.items.glassTexture
        this.textures.glass.wrapS = THREE.RepeatWrapping
        this.textures.glass.wrapT = THREE.RepeatWrapping
    }

    setMaterials() {
        this.cottageMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.cottage,
        })

        this.emissionMaterial = new THREE.MeshBasicMaterial({
            color: 0xfeee89,
        })
    }

    setModel() {
        this.model = this.resources.items.cottageModel.scene
        this.model.scale.set(0.1, 0.1, 0.1)
        this.model.position.set(0, -2, 0)

        // Apply baked texture
        this.model.traverse((child) => {
            child.material = this.cottageMaterial
        })

        // Hide Left Side
        this.leftSide = this.model.children.find(
            (child) => child.name === 'CottageLeftMerged'
        )
        this.leftSide.visible = false

        // Hide Front Side
        this.frontSide = this.model.children.find(
            (child) => child.name === 'CottageFrontMerged'
        )
        this.frontSide.visible = false

        // Set Custom Materials
        this.setEmissionMaterial()

        const roof1 = this.model.children.find(
            (child) => child.name === 'roofglass'
        )
        const window = this.model.children.find(
            (child) => child.name === 'window'
        )

        this.setGlassMaterial(roof1)

        this.scene.add(this.model)

        // Delete Unused Meshes
        roof1.parent.remove(roof1)
        window.parent.remove(window)
    }

    setEmissionMaterial() {
        // Emissions
        // this.model.children.find(
        //     (child) => child.name === 'cottageemissions'
        // ).material = this.emissionMaterial
    }

    setGlassMaterial(mesh) {
        const uniforms = {
            color: { value: null },
            time: { value: 0 },
            tDiffuse: { value: null },
            tDudv: { value: this.textures.glass },
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

    addHelpers() {
        // Axes Helper
        this.axesHelper = new THREE.AxesHelper(10)
        this.scene.add(this.axesHelper)

        // Test Cube
        this.cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            this.emissionMaterial
        )
        this.cube.position.set(0, 0, 2)
        this.scene.add(this.cube)
    }
}
