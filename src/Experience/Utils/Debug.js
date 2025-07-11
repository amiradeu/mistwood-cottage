import * as dat from 'lil-gui'

export default class Debug {
    constructor() {
        // console.log(window.location.hash)
        this.active = window.location.hash === '#debug'
        this.folders = {}

        if (this.active) {
            this.ui = new dat.GUI()
        }
    }
}
