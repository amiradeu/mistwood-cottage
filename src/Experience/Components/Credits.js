export default class Credits {
    constructor() {
        this.button = document.querySelector('.credits-button')
        this.content = document.querySelector('.credits-overlay .content')

        this.setListeners()
    }

    setListeners() {
        this.button?.addEventListener('click', () => {
            console.log('credits click')
            this.toggleContent()
        })
    }

    toggleContent() {
        this.content.classList.toggle('open')
        this.button.classList.toggle('open')
    }
}
