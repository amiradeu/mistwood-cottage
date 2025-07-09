import Experience from '../Experience'

const ACTIVE_CLASS = 'active'

export default class ControlsOverlay {
    constructor() {
        this.experience = new Experience()
        this.controls = this.experience.controls

        this.map = [
            {
                ui: document.querySelector('.keyW'),
                name: this.controls.keys.map[0].name,
            },
            {
                ui: document.querySelector('.keyS'),
                name: this.controls.keys.map[1].name,
            },
            {
                ui: document.querySelector('.keyA'),
                name: this.controls.keys.map[2].name,
            },
            {
                ui: document.querySelector('.keyD'),
                name: this.controls.keys.map[3].name,
            },
            {
                ui: document.querySelector('.keySpace'),
                name: this.controls.keys.map[4].name,
            },
        ]
        this.keyW = document.querySelector('.keyW')
        this.keyA = document.querySelector('.keyA')
        this.keyS = document.querySelector('.keyS')
        this.keyD = document.querySelector('.keyD')
        this.keySpace = document.querySelector('.keySpace')

        this.setEventListeners()
    }

    setEventListeners() {
        // Control with cursor
        this.map.forEach((item) => {
            item.ui.addEventListener('pointerdown', () => {
                // console.log(item.name)
                this.controls.keys.down[item.name] = true
            })
        })
        this.map.forEach((item) => {
            item.ui.addEventListener('pointerup', () => {
                // console.log(item.name)
                this.controls.keys.down[item.name] = false
            })
        })

        // Accessibility - control with keyboard enter key
        this.map.forEach((item) => {
            item.ui.addEventListener('keydown', (event) => {
                // console.log(item.name)
                if (event.key === 'Enter')
                    this.controls.keys.down[item.name] = true
            })
        })
        this.map.forEach((item) => {
            item.ui.addEventListener('keyup', (event) => {
                // console.log(item.name)
                if (event.key === 'Enter')
                    this.controls.keys.down[item.name] = false
            })
        })
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
