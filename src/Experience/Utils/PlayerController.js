import * as THREE from 'three'
import Experience from '../Experience'

export default class PlayerController {
    constructor(body, collider) {
        this.experience = new Experience()
        this.physics = this.experience.physics
        this.controls = this.experience.controls
        this.time = this.experience.time
        this.sfx = this.experience.sfx
        this.debug = this.experience.debug

        this.rigidBody = body
        this.collider = collider

        // Movement settings
        this.speed = 0.3
        this.jumpStrength = 0.02
        this.gravity = 0.05
        this.moveDelta = 0.0005 * this.time.delta
        this.decaySpeed = 24

        // Movement state
        this.movementDirection = { x: 0, y: 0, z: 0 }
        this.velocity = new THREE.Vector3()
        this.direction = new THREE.Vector3()

        this.setController()
        this.setDebug()
    }

    setController() {
        this.controller = this.physics.world.createCharacterController(0.02)
        // when <stepHeight, >width
        this.controller.enableAutostep(5.0, 0.1, true)
        // when <heightToGround
        // low value to prevent awkward fast snapping
        // ensure body attach to ground when slide down slope
        this.controller.enableSnapToGround(0.1)

        // climb slopes
        this.controller.slideEnabled(true)
        // Don’t allow climbing >145 degrees.
        this.controller.setMaxSlopeClimbAngle((145 * Math.PI) / 180)
    }

    update() {
        // Keys States
        const { forward, backward, left, right, jump } = this.controls.keys.down

        // Friction - movement decay to a stop slowly
        this.velocity.x -= this.velocity.x * this.decaySpeed * this.moveDelta
        this.velocity.z -= this.velocity.z * this.decaySpeed * this.moveDelta

        // // Direction
        this.direction.z = forward - backward
        this.direction.x = left - right
        // ensures consistent movements in all directions
        this.direction.normalize()

        // // Acceleration - increases speed on keydown
        if (forward || backward) {
            this.velocity.z -= this.direction.z * this.speed * this.moveDelta
        }
        if (left || right) {
            this.velocity.x -= this.direction.x * this.speed * this.moveDelta
        }

        // moving any direction
        const isMoving = forward || backward || left || right

        if (isMoving) {
            if (this.controller.computedGrounded()) this.sfx.playWalkingSound()
        } else {
            this.sfx.stopWalkingSound()
        }

        // Player is grounded
        if (this.controller.computedGrounded()) {
            if (jump) {
                // ⛰️ Jump only if player is on the ground
                this.sfx.playJumpSound()
                this.velocity.y = this.jumpStrength
            } else {
                // Reset vertical velocity when grounded
                this.velocity.y = 0
            }
        } else {
            // Apply gravity if in air
            this.velocity.y -= this.gravity * this.moveDelta
        }

        console.log('velocity', this.velocity)
        this.updateController()
    }

    updateController() {
        this.controller.computeColliderMovement(
            this.collider, // The collider we would like to move.
            this.velocity
        )

        let movement = this.controller.computedMovement()
        let newPos = this.rigidBody.translation()
        newPos.x += movement.x
        newPos.y += movement.y
        newPos.z += movement.z
        this.rigidBody.setNextKinematicTranslation(newPos)
    }

    setDebug() {
        if (!this.debug.active) return

        this.debugFolder = this.debug.ui.addFolder('🕹️Player Controller')
        this.debugFolder.add(this, 'speed', 0, 1.0, 0.0001).name('Speed')
        this.debugFolder.add(this, 'gravity', 0, 0.1, 0.0001).name('Gravity')
        this.debugFolder
            .add(this, 'jumpStrength', 0, 0.1, 0.0001)
            .name('Jump Strength')
    }
}
