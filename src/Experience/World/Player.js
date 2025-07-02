import {
    Vector3,
    Uniform,
    Color,
    ShaderMaterial,
    UniformsLib,
    CapsuleGeometry,
    Mesh,
} from 'three'
import RAPIER from '@dimforge/rapier3d'

import Experience from '../Experience.js'
import playerVertexShader from '../Shaders/Player/vertex.glsl'
import playerFragmentShader from '../Shaders/Player/fragment.glsl'
import { CyclesSettings } from '../Constants.js'
import CameraThirdPerson from '../CameraThirdPerson.js'
import PlayerController from '../Utils/PlayerController.js'
import Boundary from '../Utils/Boundary.js'

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
        this.overlay = this.experience.overlay

        // Interaction with other models
        this.terrain = this.experience.world.terrain
        this.cottage = this.experience.world.cottage

        // Visual
        this.options = {
            radius: 0.15,
            height: 0.4,
            initPosition: { x: -0.6, y: -0.6, z: 5 },
            color: CyclesSettings[this.cycle.currentCycle].playerColor,
            sunShadeColor: '#b17412',
            sunPosition: new Vector3(
                CyclesSettings[this.cycle.currentCycle].sunPosition
            ),
        }

        // Visual
        this.setMaterial()
        this.setGeometry()
        this.setMesh()
        this.setBoundary()
        this.setDebug()

        // Physics
        this.setPhysics()

        // Third Person Camera
        this.cameraPOV = new CameraThirdPerson(this.mesh, this.debugFolder)

        this.soundReady = false
        this.overlay.on('enter', () => {
            this.soundReady = true
        })
    }

    setMaterial() {
        this.uniforms = {
            uSunPosition: new Uniform(this.options.sunPosition),
            uColor: new Uniform(new Color(this.options.color)),
            uSunShadeColor: new Uniform(new Color(this.options.sunShadeColor)),
        }

        this.material = new ShaderMaterial({
            fog: true,
            vertexShader: playerVertexShader,
            fragmentShader: playerFragmentShader,
            uniforms: {
                ...UniformsLib['fog'],
                ...this.uniforms,
            },
        })
    }

    setGeometry() {
        this.geometry = new CapsuleGeometry(
            this.options.radius,
            this.options.height
        )
    }

    setMesh() {
        this.mesh = new Mesh(this.geometry, this.material)

        const { x, y, z } = this.options.initPosition
        this.mesh.position.set(x, y, z)
        this.scene.add(this.mesh)
    }

    setBoundary() {
        this.playerBox = new Boundary(this.mesh)
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
    }

    update() {
        /**
         * Camera Follow
         */
        if (this.cameraPOV) {
            this.cameraPOV.update()
        }

        /**
         * Background Sound
         */
        if (this.soundReady) {
            if (this.cottage.cottageArea.isInside(this.mesh)) {
                this.sfx.stopInsectSound()
                this.sfx.stopUnderwaterSound()
                this.sfx.playJazzSound()
            } else if (this.terrain.pondArea.isInside(this.mesh)) {
                this.sfx.stopInsectSound()
                this.sfx.stopJazzSound()
                this.sfx.playUnderwaterSound()
            } else {
                this.sfx.stopJazzSound()
                this.sfx.stopUnderwaterSound()
                this.sfx.playInsectSound()
            }
        }
    }

    updateCycle() {
        // Change Sun Position
        this.material.uniforms.uSunPosition.value = new Vector3(
            CyclesSettings[this.cycle.currentCycle].sunPosition
        )

        // Change player color
        this.material.uniforms.uColor.value.set(
            CyclesSettings[this.cycle.currentCycle].playerColor
        )
    }

    setDebug() {
        if (!this.debug.active) return
        this.debugFolder = this.debug.ui.addFolder('🕴🏻Player').close()

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
