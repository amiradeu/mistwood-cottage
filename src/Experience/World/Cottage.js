import * as THREE from 'three'
import Experience from '../Experience'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

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
        // this.frontSide.visible = false

        this.setEmissionMaterial()
        this.setMirrorMaterial()

        this.scene.add(this.model)

        this.mirrors.forEach((item) => {
            item.parent.remove(item)
            this.scene.remove(item)
        })
    }

    setEmissionMaterial() {
        // Window Light Emissions
        this.windows = []
        this.windows.push(
            this.model.children.find(
                (child) => child.name === 'windowemission002'
            ),
            this.model.children.find(
                (child) => child.name === 'windowemission003'
            )
        )
        this.windows.forEach((item) => {
            item.material = this.windowLightMaterial
        })

        // Door Light Emissions
        this.poleLamps = []
        this.poleLamps.push(
            this.model.children.find((child) => child.name === 'dooremission'),
            this.model.children.find(
                (child) => child.name === 'dooremission001'
            )
        )
        this.poleLamps.forEach((item) => {
            item.material = this.poleLightMaterial
        })
    }

    setMirrorMaterial() {
        // Reflective Mirrors
        this.mirrors = []
        this.mirrors.push(
            this.model.children.find(
                (child) => child.name === 'windowreflection002'
            ),
            this.model.children.find(
                (child) => child.name === 'windowreflection003'
            )
        )

        // 💡 Get correct child position when parent model is scaled
        const worldPos = new THREE.Vector3()

        // Update meshes to
        this.mirrors.forEach((item) => {
            item.getWorldPosition(worldPos)
            // console.log('position', worldPos)

            // 💡 geometry need a default forward vector (0,0,1) for Reflector to work
            item.geometry.rotateZ(Math.PI)
            item.geometry.rotateX(Math.PI * 0.5)

            // Glass
            const glass = new Reflector(item.geometry, {
                color: 0xcbcbcb,
                textureWidth: this.sizes.width * this.sizes.pixelRatio,
                textureHeight: this.sizes.height * this.sizes.pixelRatio,
            })
            glass.rotation.x = Math.PI
            glass.rotation.z = Math.PI
            glass.scale.copy(this.model.scale)
            glass.position.copy(worldPos)

            //💡 Prevent z-fighting from placing at same position
            const offset = 0.001
            glass.position.add(
                glass
                    .getWorldDirection(new THREE.Vector3())
                    .multiplyScalar(offset)
            )
            this.scene.add(glass)
        })
    }

    addHelpers() {
        // Axes Helper
        this.axesHelper = new THREE.AxesHelper(10)
        this.scene.add(this.axesHelper)

        // Test Cube
        this.cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            this.poleLightMaterial
        )
        this.cube.position.set(0, 0, 2)
        this.scene.add(this.cube)
    }
}
