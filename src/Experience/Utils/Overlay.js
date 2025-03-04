import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'

export default class Overlay extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.resources = this.experience.resources

        // HTML Elements
        this.overlay = document.querySelector('.loading-overlay')
        this.overlayText = document.querySelector('.loading-text')
        this.progressBar = document.querySelector('.loading-progress')
        this.startButton = document.querySelector('.enter-experience-button')

        this.resources.on('ready', () => {
            // console.log('Resources Ready')
            this.startButton.style.display = 'block'
            this.overlayText.innerHTML = 'Your experience is ready to begin.'
        })

        this.resources.on('loading', () => {
            var progress = Math.floor(
                (this.resources.loaded / this.resources.toLoad) * 100
            )
            this.progressBar.innerHTML = `${progress}%`
        })

        // Enter experience event
        this.startButton.addEventListener('click', () => {
            // console.log('enter')
            this.overlay.style.display = 'none'
        })
    }
}
