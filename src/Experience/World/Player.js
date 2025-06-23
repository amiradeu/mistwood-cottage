import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'

import Experience from '../Experience.js'
import playerVertexShader from '../Shaders/Player/vertex.glsl'
import playerFragmentShader from '../Shaders/Player/fragment.glsl'
import { CyclesSettings } from '../Constants.js'
import CameraThirdPerson from '../CameraThirdPerson.js'
import PlayerController from '../Utils/PlayerController.js'

export default class Player {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.physics = this.experience.physics
        this.time = this.experience.time
        this.controls = this.experience.controls
        this.camera = this.experience.camera.instance
        this.debug = this.experience.debug
        this.cycle = this.experience.cycles
        this.sfx = this.experience.sfx

        // Visual
        this.options = {
            radius: 0.15,
            height: 0.4,
            initPosition: { x: -0.6, y: -0.6, z: 5 },
            color: CyclesSettings[this.cycle.currentCycle].playerColor,
            sunShadeColor: '#b17412',
            sunPosition: new THREE.Vector3(
                CyclesSettings[this.cycle.currentCycle].sunPosition
            ),
        }

        // Visual
        this.setTexture()
        this.setMaterial()
        this.setGeometry()
        this.setMesh()

        // Physics
        this.setPhysics()

        // Third Person Camera
        this.cameraPOV = new CameraThirdPerson(this.mesh)

        // Debug
        this.setDebug()
    }

    setTexture() {
        this.texture = this.resources.items.playerTexture
        this.texture.flipY = false
        this.texture.colorSpace = THREE.SRGBColorSpace
    }

    setMaterial() {
        this.uniforms = {
            uSunPosition: new THREE.Uniform(this.options.sunPosition),
            uColor: new THREE.Uniform(new THREE.Color(this.options.color)),
            uSunShadeColor: new THREE.Uniform(
                new THREE.Color(this.options.sunShadeColor)
            ),
        }

        this.material = new THREE.ShaderMaterial({
            fog: true,
            vertexShader: playerVertexShader,
            fragmentShader: playerFragmentShader,
            uniforms: {
                ...THREE.UniformsLib['fog'],
                ...this.uniforms,
            },
        })
    }

    setGeometry() {
        this.geometry = new THREE.CapsuleGeometry(
            this.options.radius,
            this.options.height
        )
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        const { x, y, z } = this.options.initPosition
        this.mesh.position.set(x, y, z)
        this.scene.add(this.mesh)
    }

    setPhysics() {
        const { x, y, z } = this.options.initPosition

        // Body
        let rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
        rigidBodyDesc.setTranslation(x, y, z)
        this.rigidBody = this.physics.world.createRigidBody(rigidBodyDesc)

        // Collider
        let colliderDesc = RAPIER.ColliderDesc.ball(this.options.radius)
        this.collider = this.physics.world.createCollider(
            colliderDesc,
            this.rigidBody
        )

        // Physics update pipeline
        this.physics.addDynamicObject(this.mesh, this.rigidBody, 0.1)

        // Character Controller
        this.playerController = new PlayerController(
            this.rigidBody,
            this.collider
        )
    }

    update() {
        /**
         * Camera Follow
         */
        if (this.cameraPOV) {
            this.cameraPOV.update()
        }

        /**
         * Player movement and sound
         */
        if (this.playerController) {
            this.playerController.update()
        }
    }

    updateCycle() {
        // Change Sun Position
        this.material.uniforms.uSunPosition.value = new THREE.Vector3(
            CyclesSettings[this.cycle.currentCycle].sunPosition
        )

        // Change player color
        this.material.uniforms.uColor.value.set(
            CyclesSettings[this.cycle.currentCycle].playerColor
        )

        // if (this.debug.active) this.debugFolder.updateDisplay()
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🕴🏻Player')

            this.debugFolder.addColor(this.options, 'color').onChange(() => {
                this.material.uniforms.uColor.value.set(this.options.color)
            })

            this.debugFolder
                .addColor(this.options, 'sunShadeColor')
                .onChange(() => {
                    this.material.uniforms.uSunShadeColor.value.set(
                        this.options.sunShadeColor
                    )
                })
        }
    }
}
