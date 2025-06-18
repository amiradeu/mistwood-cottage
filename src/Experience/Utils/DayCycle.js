import { CycleNames, CycleTextures } from '../Constants.js'
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

export default class DayCycle extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.cycleSequence = [
            CycleNames.SUNRISE,
            CycleNames.DAYLIGHT,
            CycleNames.SUNSET,
            CycleNames.NIGHT,
        ]
        this.currentCycleIndex = 0
        this.currentCycle = this.cycleSequence[this.currentCycleIndex]

        this.duration = 10 // how long each cycle last (seconds)
        this.triggerTime = this.duration

        this.setTextures()

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🌞 Day Cycles')
            this.debugFolder
                .add(this, 'currentCycle')
                .options(CycleNames)
                .name('Current Cycle')
                .onChange((value) => {
                    this.changeCycle(value)
                })

            this.debugFolder
                .add(this, 'duration', 5, 15, 1)
                .onChange((value) => this.setInterval(value))
        }
    }

    update() {
        if (this.time.elapsed >= this.triggerTime) {
            console.log(this.time.elapsed, 'do something')
            this.triggerTime += this.duration
            this.advanceCycle()
        }
    }

    advanceCycle() {
        this.currentCycleIndex =
            (this.currentCycleIndex + 1) % this.cycleSequence.length
        this.currentCycle = this.cycleSequence[this.currentCycleIndex]
        this.setTextures()
        this.trigger('cycleChanged')
    }

    setTextures() {
        this.textures = {
            roomPattern: CycleTextures[this.currentCycle].roomPattern,
            roomPlain: CycleTextures[this.currentCycle].roomPlain,
            cottage: CycleTextures[this.currentCycle].cottage,
            environment: CycleTextures[this.currentCycle].environment,
            terrain: CycleTextures[this.currentCycle].terrain,
        }
    }

    setInterval(interval) {
        this.interval = interval

        // Ensure next trigger is after current time
        this.triggerTime =
            Math.ceil(this.time.elapsed / this.interval) * this.interval
        console.log(
            `🔄 Interval changed to ${interval}s, next trigger at ${this.triggerTime}s`
        )
    }

    changeCycle(cycle) {
        if (!CycleNames[cycle.toUpperCase()]) {
            console.error(`Invalid cycle name: ${cycle}`)
            return
        }

        this.currentCycle = cycle
        this.setTextures()
        this.trigger('cycleChanged')
    }
}
