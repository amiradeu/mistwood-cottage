import { gsap } from 'gsap'

import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'

export default class Overlay extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.resources = this.experience.resources

        this.setInstance()

        this.begin()
        this.resources.on('ready', () => this.ready())
        this.resources.on('loading', () => this.update())
        this.enterButton.addEventListener('click', () => this.click())
    }

    setInstance() {
        // HTML Elements
        this.overlay = document.querySelector('.overlay')
        this.overlayContents = document.querySelectorAll('.overlay-content')

        this.progressBar = document.querySelector('.loading-progress')
        this.enterButton = document.querySelector('.enter-button')

        this.intro = document.querySelector('.intro')
    }

    begin() {
        this.timeline = gsap.timeline()
        console.log(this.overlayContents)
        this.timeline.from(this.overlayContents, {
            opacity: 0,
            stagger: {
                each: 0.5,
            },
        })
    }

    ready() {
        this.overlay.classList.add('ready')
    }

    update() {
        let progress = Math.floor(
            (this.resources.loaded / this.resources.toLoad) * 100
        )
        this.progressBar.innerHTML = `${progress}%`
    }

    click() {
        // console.log('enter')
        this.overlay.style.display = 'none'
    }
}
