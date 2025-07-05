import Experience from '../Experience'

export default class SoundEffects {
    constructor() {
        this.experience = new Experience()
        this.overlay = this.experience.overlay
        this.resources = this.experience.resources

        this.setSounds()

        // start playing background ambience
        this.overlay.on('enter', () => {
            this.playInsectSound()
        })
    }

    setSounds() {
        // Interactions
        this.jumpSound = this.resources.items.jumpSound
        this.jumpSound.volume = 0.3

        this.coinSound = this.resources.items.coinSound
        this.coinSound.volume = 1.0

        // Moving
        this.walkOnGrassSound = this.resources.items.walkOnGrassSound
        this.walkOnGrassSound.volume = 0.8

        this.walkOnWoodSound = this.resources.items.walkOnWoodSound
        this.walkOnWoodSound.volume = 1.0

        this.swimSound = this.resources.items.swimSound
        this.swimSound.volume = 0.8

        // Background
        this.underwaterSound = this.resources.items.underwaterSound
        this.underwaterSound.volume = 0.8
        this.underwaterSound.loop = true

        this.insectSound = this.resources.items.insectSound
        this.insectSound.volume = 1.0
        this.insectSound.loop = true

        this.jazzSound = this.resources.items.jazzSound
        this.jazzSound.volume = 0.6
        this.jazzSound.loop = true

        // UI
        this.selectSound = this.resources.items.selectSound
    }

    playJumpSound() {
        // console.log('Play jump sound')
        this.jumpSound.currentTime = 0
        this.jumpSound.play()
    }

    playCoinSound() {
        // console.log('Play coin sound')
        this.coinSound.currentTime = 0
        this.coinSound.play()
    }

    playWalkingSound() {
        // play only when it's not already
        if (this.walkOnGrassSound.paused || this.walkOnGrassSound.ended) {
            // console.log('Play walking sound')
            // 0 - 10
            this.walkOnGrassSound.currentTime = Math.random() * 10
            this.walkOnGrassSound.play()
        }
    }

    stopWalkingSound() {
        if (!this.walkOnGrassSound.paused) {
            // console.log('Stop walking sound')
            this.walkOnGrassSound.pause()
        }
    }

    playWalkOnWoodSound() {
        // play only when it's not already
        if (this.walkOnWoodSound.paused || this.walkOnWoodSound.ended) {
            // console.log('Play walking sound')
            // 0 - 8s
            this.walkOnWoodSound.currentTime = Math.random() * 8
            this.walkOnWoodSound.play()
        }
    }

    stopWalkOnWoodSound() {
        if (!this.walkOnWoodSound.paused) {
            // console.log('Stop walking sound')
            this.walkOnWoodSound.pause()
        }
    }

    playSwimSound() {
        // play only when it's not already
        if (this.swimSound.paused || this.swimSound.ended) {
            // console.log('Play walking sound')
            // 0 - 10
            this.swimSound.currentTime = Math.random() * 10
            this.swimSound.play()
        }
    }

    stopSwimSound() {
        if (!this.swimSound.paused) {
            // console.log('Stop walking sound')
            this.swimSound.pause()
        }
    }

    playInsectSound() {
        if (this.insectSound.paused || this.insectSound.ended) {
            // console.log('Play insect sound')
            this.insectSound.currentTime = 0
            this.insectSound.play()
        }
    }

    stopInsectSound() {
        if (!this.insectSound.paused) {
            // console.log('Stop insect sound')
            this.insectSound.pause()
        }
    }

    playUnderwaterSound() {
        if (this.underwaterSound.paused || this.underwaterSound.ended) {
            // console.log('Play underwater sound')
            this.underwaterSound.play()
        }
    }

    stopUnderwaterSound() {
        if (!this.underwaterSound.paused) {
            // console.log('Stop underwater sound')
            this.underwaterSound.pause()
        }
    }

    playJazzSound() {
        if (this.jazzSound.paused || this.jazzSound.ended) {
            // console.log('Play jazz sound')
            this.jazzSound.currentTime = 0
            this.jazzSound.play()
        }
    }

    stopJazzSound() {
        if (!this.jazzSound.paused) {
            // console.log('Stop jazz sound')
            this.jazzSound.pause()
        }
    }

    playSelectSound() {
        this.selectSound.play()
    }
}
