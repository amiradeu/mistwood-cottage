import Experience from '../Experience.js'
import Cottage from './Cottage.js'
import Environment from './Environment.js'
import Terrain from './Terrain.js'
import Room from './Room.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.overlay = this.experience.overlay

        // Setup World
        this.resources.on('ready', () => {
            // console.log('Resources Ready')
            this.room = new Room()
            this.cottage = new Cottage()
            this.environment = new Environment()
            this.terrain = new Terrain()
        })
    }

    update() {}
}
