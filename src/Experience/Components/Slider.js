import gsap from 'gsap'
import Experience from '../Experience'

export default class Slider {
    constructor(element) {
        this.experience = new Experience()
        this.states = this.experience.states

        this.camera = element

        this.slider = document.querySelector('.slider-input')
        this.sliderValue = document.querySelector('.slider-value')

        const minDistance = this.states.minDistance
        const maxDistance = this.states.maxDistance
        const stepDistance = 0.001

        // Value
        this.sliderValue.innerHTML = this.camera.distance

        // Slider
        this.slider.value = this.camera.distance
        this.slider.min = minDistance
        this.slider.max = maxDistance
        this.slider.step = stepDistance

        this.slider.addEventListener('input', () => {
            gsap.to(this.camera, {
                distance: this.slider.value,
            })
            this.sliderValue.innerHTML = Math.round(this.slider.value)
        })
    }
}
