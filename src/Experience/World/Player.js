import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'

import Experience from '../Experience.js'
import playerVertexShader from '../Shaders/Player/vertex.glsl'
import playerFragmentShader from '../Shaders/Player/fragment.glsl'
import { CyclesSettings } from '../Constants.js'

export default class Player {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.physics = this.experience.physics
        this.time = this.experience.time
        this.keysControls = this.experience.keysControls
        this.camera = this.experience.camera.instance
        this.debug = this.experience.debug
        this.cycle = this.experience.cycles

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
            speed: 0.02,
            jumpStrength: 0.03,
            gravity: 0.005,
        }

        this.smoothCameraPosition = new THREE.Vector3(10, 10, 10)
        this.smoothCameraTarget = new THREE.Vector3()
        this.movementDirection = { x: 0, y: 0, z: 0 }

        // Visual
        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        // Physics
        this.setPhysics()
        this.setController()

        this.setDebug()
    }

    setMaterial() {
        this.texture = this.resources.items.playerTexture
        this.texture.flipY = false
        this.texture.colorSpace = THREE.SRGBColorSpace

        this.material = new THREE.ShaderMaterial({
            vertexShader: playerVertexShader,
            fragmentShader: playerFragmentShader,
            uniforms: {
                uSunPosition: new THREE.Uniform(this.options.sunPosition),
                uColor: new THREE.Uniform(new THREE.Color(this.options.color)),
                uSunShadeColor: new THREE.Uniform(
                    new THREE.Color(this.options.sunShadeColor)
                ),
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
        let colliderDesc = RAPIER.ColliderDesc.cylinder(
            this.options.height / 2,
            this.options.radius
        )
        this.collider = this.physics.world.createCollider(
            colliderDesc,
            this.rigidBody
        )

        this.physics.addObject(this.mesh, this.rigidBody)
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

    setController() {
        this.controller = this.physics.world.createCharacterController(0.01)
        // when <stepHeight, >width
        this.controller.enableAutostep(1.0, 1, true)
        // when <heightToGround
        this.controller.enableSnapToGround(2.0)

        // climb slopes
        this.controller.slideEnabled(true)
        // Don’t allow climbing >145 degrees.
        this.controller.setMaxSlopeClimbAngle((145 * Math.PI) / 180)
    }

    updateController() {
        this.controller.computeColliderMovement(
            this.collider, // The collider we would like to move.
            this.movementDirection
        )

        let movement = this.controller.computedMovement()
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
        const meshPosition = this.mesh.position

        // Camera Position
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(meshPosition)
        // Offset the camera position slightly above the player
        cameraPosition.y += 0.6
        cameraPosition.z += 3.2

        // Camera Target
        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(meshPosition)
        cameraTarget.y += 0.55

        // Lerping
        this.smoothCameraPosition.lerp(cameraPosition, 0.05)
        this.smoothCameraTarget.lerp(cameraTarget, 0.05)
        // console.log(cameraPosition, this.smoothCameraPosition)

        this.camera.position.copy(this.smoothCameraPosition)
        this.camera.lookAt(this.smoothCameraTarget)

        /**
         * Check and Update Key Controls
         */

        // downward gravity
        this.movementDirection.y = -this.options.gravity

        if (this.keysControls.keys.down.forward) {
            this.movementDirection.z = -this.options.speed
        }

        if (this.keysControls.keys.down.backward) {
            this.movementDirection.z = this.options.speed
        }

        if (this.keysControls.keys.down.left) {
            this.movementDirection.x = -this.options.speed
        }

        if (this.keysControls.keys.down.right) {
            this.movementDirection.x = this.options.speed
        }

        if (
            !this.keysControls.keys.down.forward &&
            !this.keysControls.keys.down.backward
        ) {
            this.movementDirection.z = 0
        }

        if (
            !this.keysControls.keys.down.left &&
            !this.keysControls.keys.down.right
        ) {
            this.movementDirection.x = 0
        }

        if (this.keysControls.keys.down.jump) {
            this.movementDirection.y = this.options.jumpStrength
        }

        // console.log(this.movementDirection)
        this.updateController()
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

        if (this.debug.active) this.debugFolder.updateDisplay()
    }
}
