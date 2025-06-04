import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        //💡 in 60fps, roughly the time between frame
        this.delta = 16

        // 💡 wait 1 frame
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = (this.current - this.start) * 0.001

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}
