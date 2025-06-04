import * as THREE from 'three'
import { Refractor } from 'three/examples/jsm/objects/Refractor.js'

import Experience from '../Experience'

import glassRefractionVertexShader from '../Shaders/GlassRefraction/vertex.glsl'
import glassRefractionFragmentShader from '../Shaders/GlassRefraction/fragment.glsl'

export default class RoofGlass {
    constructor(mesh) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug
        this.mesh = mesh

        this.setTextures()
        this.setMaterials()
        this.setModel()
        this.clearMesh()
    }

    setTextures() {
        this.texture = this.resources.items.glassTexture
        this.texture.wrapS = THREE.RepeatWrapping
        this.texture.wrapT = THREE.RepeatWrapping
    }

    setMaterials() {
        this.uniforms = {
            color: { value: null },
            time: { value: 0 },
            tDiffuse: { value: null },
            tDudv: { value: this.texture },
            textureMatrix: { value: null },
            strength: { value: 0.5 },
            repeatScale: { value: 2 },
        }

        this.material = new THREE.ShaderMaterial({
            fog: true,
            vertexShader: glassRefractionVertexShader,
            fragmentShader: glassRefractionFragmentShader,
            uniforms: {
                ...THREE.UniformsLib['fog'],
                ...this.uniforms,
            },
        })
    }

    setModel() {
        // Extract world transform
        // 💡 correct child position when parent model is scaled
        this.worldPos = new THREE.Vector3()
        this.worldQuat = new THREE.Quaternion()
        this.worldScale = new THREE.Vector3()
        this.mesh.getWorldPosition(this.worldPos)
        this.mesh.getWorldQuaternion(this.worldQuat)
        this.mesh.getWorldScale(this.worldScale)

        // 💡 geometry need a default forward vector (0,0,1) for Reflector to work
        this.mesh.geometry.rotateX(Math.PI * 0.5)

        this.createGlass(false)
        this.createGlass(true)
    }

    createGlass(isBack = false) {
        const offset = 0.001
        const refractor = new Refractor(this.mesh.geometry, {
            color: '#d6ebfd',
            textureWidth: this.sizes.width * this.sizes.pixelRatio,
            textureHeight: this.sizes.height * this.sizes.pixelRatio,
            shader: this.material,
        })

        // Apply transform
        const finalQuat = this.worldQuat.clone()
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
        refractor.scale.copy(this.worldScale)
        refractor.position.copy(this.worldPos)
        refractor.position.add(
            refractor
                .getWorldDirection(new THREE.Vector3())
                .multiplyScalar(offset)
        )

        this.scene.add(refractor)
        return refractor
    }

    clearMesh() {
        this.mesh.parent.remove(this.mesh)
    }
}
