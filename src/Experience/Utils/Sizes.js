import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // Resize event
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            // Trigger Event
            this.trigger('resize')
        })
    }

    normalise(pixelCoords) {
        const minSize = Math.min(this.width, this.height)
        return {
            x: pixelCoords.x / minSize,
            y: pixelCoords.y / minSize,
        }
    }
}
