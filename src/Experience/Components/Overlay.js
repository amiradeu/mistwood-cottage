import { gsap } from 'gsap'
import SplitType from 'split-type'

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
        this.begin()
        this.resources.on('loading', () => this.update())
        this.resources.on('ready', () => this.ready())
    }

    setInstance() {
        // HTML Elements
        this.overlay = document.querySelector('.overlay')

        this.headings = document.querySelector('.headings')
        this.intro = document.querySelector('.intro-split')

        this.progressBar = document.querySelector('.loading-progress')
        this.enterButton = document.querySelector('.enter-button')
    }

    setEventListeners() {
        this.enterButton.addEventListener('click', () => {
            this.click()
        })
    }

    begin() {
        // Animation
        this.splitText = new SplitType(this.intro)
        this.text = this.splitText.chars

        this.tlBegin = gsap.timeline()

        // headings
        this.tlBegin.fromTo(
            this.headings,
            {
                opacity: 0,
                willChange: 'filter, transform',
                filter: 'blur(12px)',
            },
            {
                ease: 'power2.inOut',
                opacity: 1,
                filter: 'blur(0px)',
                duration: 2,
            }
        )

        // intro
        this.tlBegin.fromTo(
            this.text,
            {
                opacity: 0,
                skewX: -20,
                willChange: 'filter, transform',
                filter: 'blur(8px)',
            },
            {
                ease: 'sine',
                opacity: 1,
                skewX: 0,
                filter: 'blur(0px)',
                stagger: 0.04,
                duration: 2,
                onComplete: () => {
                    this.splitText.revert()
                },
            },
            '<1'
        )
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
        console.log('enter click')
        this.tlEnd = gsap.timeline()

        if (this.tlBegin && this.tlBegin.isActive()) {
            this.tlBegin.invalidate().kill()

            this.tlEnd.to(this.text, {
                ease: 'sine',
                opacity: 1,
                skewX: 0,
                filter: 'blur(0px)',
                duration: 1,
                onComplete: () => {
                    this.splitText.revert()
                },
            })
        }

        this.tlEnd.to(
            this.overlay,
            {
                // opacity: 0,
                borderRadius: '100%',
            },
            '<'
        )
    }

    // re-split text if container width changes
    resize() {
        console.log('before resize', this.text)
        this.splitText.split()
        this.text = this.splitText.chars

        console.log('after resize', this.text)
    }
}
