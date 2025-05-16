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

        this.setDebug()
    }

    toggleLeft() {
        this.trigger('toggleLeft')
    }

    toggleFront() {
        this.trigger('toggleFront')
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🗂️ States')

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
}
