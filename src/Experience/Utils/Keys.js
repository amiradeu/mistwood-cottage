import EventEmitter from './EventEmitter.js'

export default class Key extends EventEmitter {
    constructor() {
        super()

        // Setup

        // Trigger Events
        window.addEventListener('keydown', (event) => {
            if (
                event.key === 'Up' ||
                event.key === 'ArrowUp' ||
                event.key === 'w' ||
                event.key === 'W'
            ) {
                this.trigger('up')
            }
            if (
                event.key === 'Down' ||
                event.key === 'ArrowDown' ||
                event.key === 's' ||
                event.key === 'S'
            ) {
                this.trigger('down')
            }
            if (
                event.key === 'Left' ||
                event.key === 'ArrowLeft' ||
                event.key === 'a' ||
                event.key === 'A'
            ) {
                this.trigger('left')
            }
            if (
                event.key === 'Right' ||
                event.key === 'ArrowRight' ||
                event.key === 'd' ||
                event.key === 'D'
            ) {
                this.trigger('right')
            }
            if (event.key === ' ') {
                this.trigger('jump')
            }
        })
    }

    removeAllListeners() {
        this.off('up')
        this.off('down')
        this.off('left')
        this.off('right')
        this.off('jump')
    }
}
