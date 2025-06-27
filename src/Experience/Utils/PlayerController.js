/**
 * Based on Rapier's Character Controller
 * (https://github.com/dimforge/rapier.js/blob/master/testbed3d/src/demos/characterController.ts)
 */
import { Vector3 } from 'three'
import Experience from '../Experience'

export default class PlayerController {
    constructor(body, collider, debug = null) {
        this.experience = new Experience()
        this.camera = this.experience.camera.instance
        this.controls = this.experience.controls
        this.debug = this.experience.debug
        this.physics = this.experience.physics
        this.sfx = this.experience.sfx
        this.time = this.experience.time

        this.rigidBody = body
        this.collider = collider
        this.debugFolder = debug

        // Movement settings
        this.speed = 0.5
        this.jumpStrength = 5.0
        this.gravity = 0.1
        this.decaySpeed = 24

        // Camera direction
        this.cameraForward = new Vector3()
        this.cameraRight = new Vector3()
        this.cameraUp = new Vector3(0, 1, 0)

        // Movement state
        this.velocity = new Vector3()
        this.direction = new Vector3()

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
        // Forward is based on camera direction
        this.camera.getWorldDirection(this.cameraForward)
        this.cameraForward.y = 0 // Ignore vertical direction
        this.cameraForward.normalize()
        // console.log(this.cameraForward)

        // Friction - movement decay to a stop slowly
        this.velocity.x -= this.velocity.x * this.decaySpeed * this.time.delta
        this.velocity.z -= this.velocity.z * this.decaySpeed * this.time.delta

        // Get right vector by rotating forward vector 90° counterclockwise
        this.cameraRight
            .crossVectors(this.cameraForward, this.cameraUp)
            .normalize()

        // Keys States
        const { forward, backward, left, right, jump } = this.controls.keys.down

        // Input direction
        this.direction.x = (left ? -1 : 0) + (right ? 1 : 0)
        this.direction.y = 0
        this.direction.z = (forward ? 1 : 0) + (backward ? -1 : 0)
        this.direction.normalize()

        // Rotate movement direction to match camera orientation
        const moveDir = new Vector3()
        moveDir
            .addScaledVector(this.cameraForward, this.direction.z)
            .addScaledVector(this.cameraRight, this.direction.x)
            .normalize()

        // Apply acceleration
        this.velocity.x += moveDir.x * this.speed * this.time.delta
        this.velocity.z += moveDir.z * this.speed * this.time.delta

        this.handleSFX()

        // Player is grounded
        if (this.controller.computedGrounded()) {
            if (jump) {
                // ⛰️ Jump only if player is on the ground
                this.sfx.playJumpSound()
                this.velocity.y = this.jumpStrength * this.time.delta
            } else {
                // Reset vertical velocity when grounded
                // ⭐️ Prevents controller from getting stuck with small obstacles
                this.velocity.y = 0
            }
        } else {
            // Apply gravity if in air
            this.velocity.y -= this.gravity * this.time.delta
        }

        // console.log('velocity', this.velocity)
        this.updateController()
    }

    handleSFX() {
        const { forward, backward, left, right, jump } = this.controls.keys.down

        // moving any direction
        const isMoving = forward || backward || left || right

        if (isMoving) {
            if (this.controller.computedGrounded()) this.sfx.playWalkingSound()
        } else {
            this.sfx.stopWalkingSound()
        }
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

        const name = '🕹️Player Controller'
        if (this.debugFolder)
            this.debugFolder = this.debugFolder.addFolder(name).close()
        else this.debugFolder = this.debug.ui.addFolder(name).close()

        this.debugFolder.add(this, 'speed', 0, 2.0, 0.01).name('Speed')
        this.debugFolder.add(this, 'gravity', 0, 2.0, 0.01).name('Gravity')
        this.debugFolder
            .add(this, 'jumpStrength', 0, 10, 0.01)
            .name('Jump Strength')
    }
}
