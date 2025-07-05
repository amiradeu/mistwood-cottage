import Experience from '../Experience'
import EventEmitter from './EventEmitter'

export default class States extends EventEmitter {
    constructor() {
        super()
        this.experience = new Experience()
        this.debug = this.experience.debug

        this.instance = {
            leftVisibility: true,
            frontVisibility: true,
        }

        // Collect Coins Game
        this.totalCoins = 200
        this.coinsCollected = 0

        this.counter = document.querySelector('.coins-overlay .counter')
        this.total = document.querySelector('.coins-overlay .total')

        this.total.innerHTML = this.totalCoins

        this.setDebug()
    }

    /**
     * Used by UI
     * Set state value
     * Trigger event action
     */
    toggleLeftVisbility() {
        this.instance.leftVisibility = !this.instance.leftVisibility
        this.trigger('toggleLeft')
    }

    toggleFrontVisbility() {
        this.instance.frontVisibility = !this.instance.frontVisibility
        this.trigger('toggleFront')
    }

    /**
     * Used by debug
     * Trigger event action
     */
    toggleLeft() {
        this.trigger('toggleLeft')
    }

    toggleFront() {
        this.trigger('toggleFront')
    }

    /**
     * Coins
     */
    incrementCollectedCoins() {
        this.coinsCollected += 1
        this.counter.innerHTML = this.coinsCollected
    }

    setDebug() {
        if (!this.debug.active) return
        this.debugFolder = this.debug.ui.addFolder('🗂️ States').close()

        this.debugFolder
            .add(this.instance, 'leftVisibility')
            .name('left visibility')
            .onChange(() => {
                this.toggleLeft()
            })

        this.debugFolder
            .add(this.instance, 'frontVisibility')
            .name('front visibility')
            .onChange(() => {
                this.toggleFront()
            })
    }
}
