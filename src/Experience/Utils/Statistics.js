import Stats from 'stats-gl'
import Experience from '../Experience'

export default class Statistics {
    constructor() {
        this.experience = new Experience()
        this.renderer = this.experience.renderer
        this.active = window.location.hash === '#debug'

        if (this.active) {
            this.stats = new Stats({
                trackGPU: true,
            })
            this.stats.init(this.renderer.instance)
            document.querySelector('body').appendChild(this.stats.dom)
        }
    }

    update() {
        if (this.active) {
            this.stats.update()
        }
    }
}
