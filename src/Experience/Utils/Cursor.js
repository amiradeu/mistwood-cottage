import { Raycaster } from 'three'

import Experience from '../Experience'

export default class Cursor {
    constructor() {
        this.experience = new Experience()
        this.controls = this.experience.controls
        this.camera = this.experience.camera.instance
        this.states = this.experience.states

        this.raycaster = new Raycaster()

        // Object involved with cursor interaction
        this.cottage = this.experience.world.cottage
        this.setCottageObjects()

        // Trigger events
        this.controls.on('pointerdown', () => {
            this.checkCottage()
        })

        this.controls.on('pointermove', () => {
            this.checkRaycastObjects()

            if (this.controls.pointer.down) {
                console.log('dragging')
                this.grabHand()
            }
        })

        this.controls.on('pointerup', () => {
            this.openHand()
        })
    }

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

    checkRaycastObjects() {
        this.raycaster.setFromCamera(
            this.controls.pointer.coordinate,
            this.camera
        )

        this.intersects = this.raycaster.intersectObjects([
            ...this.frontObjects,
            ...this.leftObjects,
        ])

        this.openHand()

        // Cursor change icon
        if (this.intersects.length) {
            // Check if the front cottage
            if (
                this.frontObjects.find(
                    (item) => item.name === this.intersects[0].object.name
                )
            ) {
                if (this.states.instance.frontVisibility) this.pointHand()
                else this.lookEye()
            }

            if (
                this.leftObjects.find(
                    (item) => item.name === this.intersects[0].object.name
                )
            ) {
                if (this.states.instance.leftVisibility) this.pointHand()
                else this.lookEye()
            }
        }
    }

    checkCottage() {
        if (this.intersects.length) {
            // console.log('Front raycast hit:', this.intersects[0])

            // Check if the front cottage is clicked
            if (
                this.frontObjects.find(
                    (item) => item.name === this.intersects[0].object.name
                )
            ) {
                console.log('Front cottage clicked')
                this.states.toggleFrontVisbility()
            }

            // Check if the left cottage is clicked
            if (
                this.leftObjects.find(
                    (item) => item.name === this.intersects[0].object.name
                )
            ) {
                console.log('Left cottage clicked')
                this.states.toggleLeftVisbility()
            }
        }
    }
}
