export default class SoundEffects {
    constructor() {
        this.setSounds()
    }

    setSounds() {
        this.jumpSound = new Audio('./audio/jump.mp3')
        this.jumpSound.volume = 0.4

        this.walkingSound = new Audio('./audio/walking-through-grass.mp3')
        this.walkingSound.volume = 0.8

        this.insectSound = new Audio('./audio/summer-insects.mp3')
        this.insectSound.volume = 1.0
        this.insectSound.loop = true
    }

    playJumpSound() {
        console.log('Play jump sound')
        this.jumpSound.currentTime = 0
        this.jumpSound.play()
    }

    playWalkingSound() {
        // play only when it's not already
        if (this.walkingSound.paused || this.walkingSound.ended) {
            // console.log('Play walking sound')
            // 2 - 12
            this.walkingSound.currentTime = Math.random() * 10 + 2
            this.walkingSound.play()
        }
    }

    stopWalkingSound() {
        if (!this.walkingSound.paused) {
            // console.log('Stop walking sound')
            this.walkingSound.pause()
        }
    }

    playInsectSound() {
        console.log('Play insect sound')

        this.insectSound.currentTime = 0
        this.insectSound.play()
    }
}
