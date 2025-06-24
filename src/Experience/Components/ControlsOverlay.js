import Experience from '../Experience'

const ACTIVE_CLASS = 'active'

export default class ControlsOverlay {
    constructor() {
        this.experience = new Experience()
        this.controls = this.experience.controls

        this.keyW = document.querySelector('.keyW')
        this.keyA = document.querySelector('.keyA')
        this.keyS = document.querySelector('.keyS')
        this.keyD = document.querySelector('.keyD')
        this.keySpace = document.querySelector('.keySpace')
    }

    update() {
        const { forward, backward, left, right, jump } = this.controls.keys.down

        if (forward) this.keyW.classList.add(ACTIVE_CLASS)
        else this.keyW.classList.remove(ACTIVE_CLASS)

        if (backward) this.keyS.classList.add(ACTIVE_CLASS)
        else this.keyS.classList.remove(ACTIVE_CLASS)

        if (left) this.keyA.classList.add(ACTIVE_CLASS)
        else this.keyA.classList.remove(ACTIVE_CLASS)

        if (right) this.keyD.classList.add(ACTIVE_CLASS)
        else this.keyD.classList.remove(ACTIVE_CLASS)

        if (jump) this.keySpace.classList.add(ACTIVE_CLASS)
        else this.keySpace.classList.remove(ACTIVE_CLASS)
    }
}
