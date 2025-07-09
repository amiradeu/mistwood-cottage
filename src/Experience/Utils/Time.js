import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.start = Date.now() / 1000
        this.current = this.start
        this.elapsed = 0
        this.delta = 16 / 1000
        this.fixedDelta = 1 / 60 // 60fps

        // 💡 wait 1 frame
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        const currentTime = Date.now() / 1000

        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        /**
         * Semi-fixed timestamp
         * https://gafferongames.com/post/fix_your_timestep/
         * */
        if (this.delta > this.fixedDelta) {
            this.delta = this.fixedDelta
        }
        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}
