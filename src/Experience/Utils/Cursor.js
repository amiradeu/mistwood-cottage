import { Box3, Vector3, Raycaster } from 'three'

import Experience from '../Experience'

export default class Cursor {
    constructor() {
        this.experience = new Experience()
        this.controls = this.experience.controls
        this.camera = this.experience.camera.instance
        this.states = this.experience.states
        this.physics = this.experience.physics
        this.sfx = this.experience.sfx

        this.raycaster = new Raycaster()
        this.raycastObjects = null

        // Object involved with cursor interaction
        this.cottage = this.experience.world.cottage
        this.wallFront = this.cottage.physicsFront
        this.wallLeft = this.cottage.physicsLeft
        this.player = this.experience.world.player

        this.setCottageObjects()

        // Trigger events
        this.controls.on('pointerdown', () => {
            this.toggleCottageVisibility()
        })

        // Reduce raycasting by checking only when cursor moves
        this.controls.on('pointermove', () => {
            this.updateRaycastObjects()
        })
    }

    // Cursor styles
    openHand() {
        document.body.style.cursor = `url('/image/hand_open.svg'), auto`
    }

    grabHand() {
        document.body.style.cursor = `url('/image/hand_closed.svg'), auto`
    }

    pointHand() {
        document.body.style.cursor = `url('/image/hand_point.svg'), auto`
    }

    lookEye() {
        document.body.style.cursor = `url('/image/look_eye.svg'), auto`
    }

    setCottageObjects() {
        // Wall Meshes
        this.frontObjects = [
            this.cottage.items.CottageFrontMerged,
            this.cottage.items.PhysicsCottageFrontMerged,
        ]
        this.leftObjects = [
            this.cottage.items.CottageLeftMerged,
            this.cottage.items.PhysicsCottageLeftMerged,
        ]
    }

    updateRaycastObjects() {
        this.raycaster.setFromCamera(
            this.controls.pointer.coordinate,
            this.camera
        )

        const intersects = this.raycaster.intersectObjects([
            ...this.frontObjects,
            ...this.leftObjects,
        ])

        this.raycastObjects = intersects[0]?.object || null
    }

    toggleCottageVisibility() {
        if (!this.raycastObjects) {
            return
        }

        // Disable toggle if player is within cottage bounding box
        if (this.cottage.cottageArea.isInside(this.player.mesh)) {
            // console.log('Player is inside the cottage!')
            return
        }

        this.sfx.playSelectSound()

        // Toggle front cottage
        if (
            this.frontObjects.find(
                (item) => item.name === this.raycastObjects.name
            )
        ) {
            // console.log('Front cottage clicked')
            this.states.toggleFrontVisbility()
            this.updatePhysicsFront()
        }

        // Toggle left cottage
        if (
            this.leftObjects.find(
                (item) => item.name === this.raycastObjects.name
            )
        ) {
            // console.log('Left cottage clicked')
            this.states.toggleLeftVisbility()
            this.updatePhysicsLeft()
        }
    }

    updatePhysicsLeft() {
        if (!this.states.instance.leftVisibility) {
            this.physics.world.removeCollider(this.wallLeft.collider)
            // console.log('remove left')
        } else {
            this.wallLeft.collider = this.physics.world.createCollider(
                this.wallLeft.colliderDesc,
                this.wallLeft.rigidBody
            )
            // console.log('add left')
        }
    }

    updatePhysicsFront() {
        if (!this.states.instance.frontVisibility) {
            this.physics.world.removeCollider(this.wallFront.collider)
        } else {
            this.wallFront.collider = this.physics.world.createCollider(
                this.wallFront.colliderDesc,
                this.wallFront.rigidBody
            )
        }
    }

    update() {
        if (!this.raycastObjects) {
            if (this.controls.pointer.down) {
                // console.log('dragging')
                this.grabHand()
            } else {
                this.openHand()
            }
            return
        }

        // Disable cursor changes when player inside cottage boundary box
        if (this.cottage.cottageArea.isInside(this.player.mesh)) {
            if (this.controls.pointer.down) {
                // console.log('dragging')
                this.grabHand()
            } else {
                this.openHand()
            }
            return
        }

        /**
         * Cursor hovering over objects
         */
        if (
            this.frontObjects.find(
                (item) => item.name === this.raycastObjects.name
            )
        ) {
            if (this.states.instance.frontVisibility) this.pointHand()
            else this.lookEye()
        }

        if (
            this.leftObjects.find(
                (item) => item.name === this.raycastObjects.name
            )
        ) {
            if (this.states.instance.leftVisibility) this.pointHand()
            else this.lookEye()
        }
    }
}
