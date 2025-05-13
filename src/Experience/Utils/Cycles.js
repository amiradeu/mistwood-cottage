import { CycleNames, CycleTextures } from '../Constants.js'
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

export default class Cycles extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.debug = this.experience.debug
        this.currentCycle = CycleNames.SUNSET

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
        }
    }

    setTextures() {
        this.textures = {
            roomBig: CycleTextures[this.currentCycle].roomBig,
            roomSmall: CycleTextures[this.currentCycle].roomSmall,
            cottage: CycleTextures[this.currentCycle].cottage,
            environment: CycleTextures[this.currentCycle].environment,
            terrain: CycleTextures[this.currentCycle].terrain,
        }
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
