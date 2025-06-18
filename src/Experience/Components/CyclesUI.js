import Experience from '../Experience'

export default class CyclesUI {
    constructor() {
        this.experience = new Experience()
        this.dayCycle = this.experience.cycles

        this.setInstance()
    }

    setInstance() {
        this.cycles = document.querySelectorAll('.cycles-item-button')
    }

    updateActiveStates(index) {
        this.cycles.forEach((item) => item.classList.remove('active'))
        this.cycles[index].classList.add('active')
    }
}
