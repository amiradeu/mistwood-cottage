import { CycleNames, CycleTextures } from '../Constants.js'
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

export default class DayCycle extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.ui = this.experience.cyclesUI

        this.cycleSequence = [
            CycleNames.SUNRISE,
            CycleNames.DAYLIGHT,
            CycleNames.SUNSET,
            CycleNames.NIGHT,
        ]
        this.currentCycleIndex = 0
        this.currentCycle = this.cycleSequence[this.currentCycleIndex]

        this.duration = 30 // how long each cycle last (seconds)
        this.triggerTime = this.duration

        this.setTextures()
        this.setEventListeners()
        this.setDebug()
    }

    setEventListeners() {
        this.ui.cycles.forEach((item) => {
            item.addEventListener('click', () => {
                // console.log('button click')

                const index = item.dataset.index
                // use data-index value from html
                this.ui.updateActiveStates(index)
                this.advanceToSpecificCycle(index)
            })
        })
    }

    update() {
        // Automatic Cycle Update by Duration
        if (this.time.elapsed >= this.triggerTime) {
            // console.log(this.time.elapsed, 'change cycle')
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

        // ui
        this.ui.updateActiveStates(this.currentCycleIndex)
    }

    advanceToSpecificCycle(index) {
        // ensure acceptable cycle
        if (index < 0 || index >= this.cycleSequence.length) {
            console.warn(`Invalid cycle index: ${index}`)
            return
        }

        this.setDuration(this.duration)
        this.currentCycleIndex = index
        this.currentCycle = this.cycleSequence[this.currentCycleIndex]
        this.setTextures()

        this.trigger('cycleChanged')

        // ui
        this.ui.updateActiveStates(this.currentCycleIndex)
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

    setDuration(duration) {
        this.duration = duration

        // Restart next trigger time
        this.triggerTime = this.time.elapsed + this.duration

        // console.log(
        //     `🔄 Duration changed to ${duration}s, next trigger at ${this.triggerTime}s`
        // )
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

    setDebug() {
        if (!this.debug.active) return

        this.debugFolder = this.debug.ui.addFolder('🌞 Day Cycles')
        this.debugFolder
            .add(this, 'currentCycle')
            .options(CycleNames)
            .name('Current Cycle')
            .onChange((value) => {
                this.changeCycle(value)
            })

        this.debugFolder
            .add(this, 'duration', 5, 30, 1)
            .onChange((value) => this.setDuration(value))
    }
}
