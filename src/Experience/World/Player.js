import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'

import Experience from '../Experience.js'
import playerVertexShader from '../Shaders/Player/vertex.glsl'
import playerFragmentShader from '../Shaders/Player/fragment.glsl'
import { CyclesSettings } from '../Constants.js'
import CameraThirdPerson from '../CameraThirdPerson.js'

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

        this.options = {
            // Visual
            radius: 0.15,
            height: 0.4,
            initPosition: { x: -0.6, y: -0.6, z: 5 },
            color: CyclesSettings[this.cycle.currentCycle].playerColor,
            sunShadeColor: '#332951',
            sunPosition: new THREE.Vector3(
                CyclesSettings[this.cycle.currentCycle].sunPosition
            ),

            // Physics
            speed: 0.01,
            jumpStrength: 0.03,
            gravity: 0.005,
        }

        this.movementDirection = { x: 0, y: 0, z: 0 }

        // Visual
        this.setTexture()
        this.setMaterial()
        this.setGeometry()
        this.setMesh()

        // Physics
        this.setPhysics()
        this.setCharacterController()

        // POV Camera
        this.cameraPOV = new CameraThirdPerson(this.mesh)

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

        this.physics.addObject(this.mesh, this.rigidBody)
    }

    setCharacterController() {
        this.characterController =
            this.physics.world.createCharacterController(0.01)
        // when <stepHeight, >width
        this.characterController.enableAutostep(1.0, 1, true)
        // when <heightToGround
        // low value to prevent awkward fast snapping
        // ensure body attach to ground when slide down slope
        this.characterController.enableSnapToGround(0.1)

        // climb slopes
        this.characterController.slideEnabled(true)
        // Don’t allow climbing >145 degrees.
        this.characterController.setMaxSlopeClimbAngle((145 * Math.PI) / 180)
    }

    updateController() {
        this.characterController.computeColliderMovement(
            this.collider, // The collider we would like to move.
            this.movementDirection
        )

        let movement = this.characterController.computedMovement()
        let newPos = this.rigidBody.translation()
        newPos.x += movement.x
        newPos.y += movement.y
        newPos.z += movement.z
        this.rigidBody.setNextKinematicTranslation(newPos)
    }

    update() {
        /**
         * Camera Follow
         */
        if (this.cameraPOV) {
            this.cameraPOV.update()
        }

        /**
         * Check and Update Key Controls
         */

        if (this.characterController) {
            // downward gravity
            this.movementDirection.y = -this.options.gravity

            if (this.controls.keys.down.forward) {
                this.movementDirection.z = -this.options.speed
            }

            if (this.controls.keys.down.backward) {
                this.movementDirection.z = this.options.speed
            }

            if (this.controls.keys.down.left) {
                this.movementDirection.x = -this.options.speed
            }

            if (this.controls.keys.down.right) {
                this.movementDirection.x = this.options.speed
            }

            if (
                !this.controls.keys.down.forward &&
                !this.controls.keys.down.backward
            ) {
                this.movementDirection.z = 0
            }

            if (
                !this.controls.keys.down.left &&
                !this.controls.keys.down.right
            ) {
                this.movementDirection.x = 0
            }

            // moving any direction
            const isMoving =
                this.controls.keys.down.forward ||
                this.controls.keys.down.backward ||
                this.controls.keys.down.left ||
                this.controls.keys.down.right

            if (isMoving) {
                this.sfx.playWalkingSound()
            } else {
                this.sfx.stopWalkingSound()
            }

            if (this.controls.keys.down.jump) {
                this.movementDirection.y = this.options.jumpStrength
                this.sfx.playJumpSound()
            }

            // console.log(this.movementDirection)
            this.updateController()
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
