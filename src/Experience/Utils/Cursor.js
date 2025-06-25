import { Raycaster } from 'three'

import Experience from '../Experience'

export default class Cursor {
    constructor() {
        this.experience = new Experience()
        this.controls = this.experience.controls
        this.camera = this.experience.camera.instance
        this.states = this.experience.states

        this.raycaster = new Raycaster()
        this.raycastObjects = null

        // Object involved with cursor interaction
        this.cottage = this.experience.world.cottage
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

        // Toggle front cottage
        if (
            this.frontObjects.find(
                (item) => item.name === this.raycastObjects.name
            )
        ) {
            // console.log('Front cottage clicked')
            this.states.toggleFrontVisbility()
        }

        // Toggle left cottage
        if (
            this.leftObjects.find(
                (item) => item.name === this.raycastObjects.name
            )
        ) {
            // console.log('Left cottage clicked')
            this.states.toggleLeftVisbility()
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
