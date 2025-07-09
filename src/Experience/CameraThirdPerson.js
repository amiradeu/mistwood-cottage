/**
 * Camera Orbit around the Player
 * Based on CameraThirdPerson by Bruno Simon in Infinite World
 * (https://github.com/brunosimon/infinite-world/blob/master/sources/Game/State/CameraThirdPerson.js)
 */
import { Vector3, Quaternion, Matrix4 } from 'three'
import Experience from './Experience'
import Slider from './Components/Slider'

export default class CameraThirdPerson {
    constructor(player, debug = null) {
        this.experience = new Experience()
        this.camera = this.experience.camera.instance
        this.pointer = this.experience.controls.pointer
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug

        this.player = player
        this.target = new Vector3()
        this.position = new Vector3()
        this.quaternion = new Quaternion()

        this.debugFolder = debug

        this.distance = 4 // how far the camera stays from the player
        this.phi = Math.PI * 0.45 // vertical angle (elevation)
        this.theta = -Math.PI * 0.25 // horizontal angle (azimuth)
        this.aboveOffset = 0.5 // how much above the player the camera looks
        this.phiLimits = { min: 0.1, max: Math.PI - 0.1 }
        this.up = new Vector3(0, 1, 0) // Camera +y up-axis

        this.smoothFactor = 0.1 // smooth camera movement
        this.smoothCameraPosition = new Vector3()

        // UI
        this.ui = new Slider(this)

        this.setDebug()
    }

    updateCameraDistance() {
        // this.distance =
    }

    update() {
        // 🌀 Mouse-based Orbiting
        if (this.pointer.down) {
            // for consistent movement speed across different screen sizes
            const normalisedPointer = this.sizes.normalise(this.pointer.delta)

            this.phi -= normalisedPointer.y * 2.0
            this.theta -= normalisedPointer.x * 2.0

            // Clamp phi to avoid flipping camera upside down
            if (this.phi < this.phiLimits.min) this.phi = this.phiLimits.min
            if (this.phi > this.phiLimits.max) this.phi = this.phiLimits.max

            // console.log(`phi=${this.phi}, theta=${this.theta}`)
        }

        // 🧮 Spherical Coordinate → camera position
        const sinPhiRadius = Math.sin(this.phi) * this.distance
        const sphericalOffset = new Vector3(
            sinPhiRadius * Math.sin(this.theta),
            Math.cos(this.phi) * this.distance,
            sinPhiRadius * Math.cos(this.theta)
        )
        // Camera position = player position + spherical offset
        this.position.copy(this.player.position).add(sphericalOffset)

        // 🎯 Look at player
        this.target.set(
            this.player.position.x,
            this.player.position.y + this.aboveOffset,
            this.player.position.z
        )

        // Camera quaternion (eye, target, up)
        const targetMatrix = new Matrix4()
        targetMatrix.lookAt(this.position, this.target, this.up)
        this.quaternion.setFromRotationMatrix(targetMatrix)

        // ⛰️ Clamp Camera to Stay Above Terrain
        const elevation = this.experience.world.terrain.getElevationFromTerrain(
            this.position.x,
            this.position.z
        )
        // console.log(
        //     `Camera elevation: ${elevation}, position.y: ${this.position.y}`
        // )
        if (elevation !== null && this.position.y < elevation + 0.2) {
            this.position.y = elevation + 0.2
        }

        // Lerping OFF when pointer is down to prevent jitterimg
        if (this.pointer.down) this.smoothFactor = 1.0

        //  🕹️ Smooth Camera Movement
        this.smoothCameraPosition.lerp(this.position, this.smoothFactor)

        // Update camera position and rotation
        this.camera.position.copy(this.smoothCameraPosition)
        this.camera.quaternion.copy(this.quaternion)
    }

    setDebug() {
        if (!this.debug.active) return

        const name = '📹 Camera Third Person'
        if (this.debugFolder)
            this.debugFolder = this.debugFolder.addFolder(name).close()
        else this.debugFolder = this.debug.ui.addFolder(name).close()

        this.debugFolder
            .add(this, 'distance', 0, 20.0, 0.01)
            .name('Camera Distance')
    }
}
