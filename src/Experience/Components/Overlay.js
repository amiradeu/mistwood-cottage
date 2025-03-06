import { gsap } from 'gsap'
import SplitType from 'split-type'

import EventEmitter from '../Utils/EventEmitter.js'
import Experience from '../Experience.js'

export default class Overlay extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes

        // Setup
        this.setInstance()
        this.setEventListeners()

        // State
        this.begin()
        this.resources.on('loading', () => this.update())
        this.resources.on('ready', () => this.ready())
        this.sizes.on('resize', () => {
            this.resize()
        })
    }

    setInstance() {
        // HTML Elements
        this.overlay = document.querySelector('.overlay')

        this.headings = document.querySelector('.headings')
        this.intro = document.querySelector('.intro-split')

        this.loadingText = document.querySelector('.loading-text')
        this.progressBar = document.querySelector('.loading-progress')
        this.enterButton = document.querySelector('.enter-button')

        this.introWrapper = document.querySelector('.intro-wrapper')
        this.previousContainerWidth = Math.floor(this.introWrapper.clientWidth)
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

        // loaders
        this.tlBegin.from([this.loadingText, this.progressBar], {
            y: 50,
            opacity: 0,
            ease: 'power4.inOut',
        })

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
        this.animateIntro()
    }

    ready() {
        let tween = gsap.timeline()
        tween.to([this.loadingText, this.progressBar], {
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

    click() {
        console.log('enter click')
        this.tlEnd = gsap.timeline()

        if (this.introTween && this.introTween.isActive()) {
            this.introTween.invalidate().kill()
            // this.tlBegin.progress(1.0)

            this.tlEnd.to(this.text, {
                ease: 'sine',
                opacity: 1,
                skewX: 0,
                filter: 'blur(0px)',
                duration: 3,
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

    // re-split text if text container width changes
    resize() {
        const width = Math.floor(this.introWrapper.clientWidth)

        if (
            this.previousContainerWidth &&
            this.previousContainerWidth !== width &&
            this.introTween.progress() !== 1 // not yet ended
        ) {
            this.previousContainerWidth = width
            // console.log('progress', this.introTween.progress())
            // console.log('splitting')

            this.splitText.split()
            this.text = this.splitText.chars

            this.lastIntroTweenTime = this.introTween.totalTime()
            // console.log('lastTime', this.lastIntroTweenTime)

            this.introTween.kill()
            this.animateIntro()
        }
    }

    animateIntro() {
        this.introTween = gsap.timeline()
        this.introTween.fromTo(
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
        // continue animation at time before resize
        if (this.lastIntroTweenTime) {
            this.introTween.totalTime(this.lastIntroTweenTime)
        }
    }
}
