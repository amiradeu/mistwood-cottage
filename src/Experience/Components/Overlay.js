import { gsap } from 'gsap'

import EventEmitter from '../Utils/EventEmitter.js'
import Experience from '../Experience.js'

export default class Overlay extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.resources = this.experience.resources

        // Setup
        this.setInstance()
        this.setEventListeners()

        // State
        this.animateStart()
        this.resources.on('loading', () => this.update())
        this.resources.on('ready', () => this.animateReady())
    }

    setInstance() {
        // HTML Elements
        this.overlay = document.querySelector('.intro-overlay')
        this.wrapper = this.overlay.querySelector('.wrapper')

        this.headings = this.overlay.querySelectorAll('.headings > *')

        this.introWrapper = this.overlay.querySelector('.intro-wrapper')
        this.intros = this.overlay.querySelectorAll('.intro-wrapper > *')

        this.loadings = this.overlay.querySelectorAll('.loading > *')
        this.progressBar = this.overlay.querySelector('.loading-progress')
        this.enterButton = this.overlay.querySelector('.enter-button')
    }

    setEventListeners() {
        this.enterButton.addEventListener('click', () => {
            this.animateEnd()
            this.trigger('enter')
        })
    }

    animateStart() {
        const tween = gsap.timeline()

        tween.set(this.wrapper, {
            opacity: 1,
        })

        // loaders
        tween.from(this.loadings, {
            y: 50,
            opacity: 0,
            ease: 'power4.inOut',
        })

        // headings
        tween.from([...this.headings, ...this.intros], {
            opacity: 0,
            y: 30,
            willChange: 'filter, transform',
            filter: 'blur(12px)',
            ease: 'power2.out',
            stagger: 0.2,
            duration: 4,
        })
    }

    animateReady() {
        let tween = gsap.timeline()

        tween.to(this.loadings, {
            y: 50,
            opacity: 0,
            willChange: 'filter, transform',
            filter: 'blur(12px)',
            duration: 2,
            display: 'none',
            ease: 'power4.inOut',
        })

        tween.fromTo(
            this.enterButton,
            {
                willChange: 'filter, transform',
                filter: 'blur(12px)',
            },
            {
                display: 'revert',
                opacity: 1,
                filter: 'blur(0px)',
                duration: 1.5,
                ease: 'power4.inOut',
            }
        )
    }

    update() {
        let progress = Math.floor(
            (this.resources.loaded / this.resources.toLoad) * 100
        )
        this.progressBar.innerHTML = `${progress}%`
    }

    animateEnd() {
        // console.log('enter experience')
        let tween = gsap.timeline()

        tween.to(this.overlay, {
            opacity: 0,
            duration: 2,
            ease: 'power2.out',
            onComplete: () => {
                this.overlay.style.visibility = 'hidden'
            },
        })
    }
}
