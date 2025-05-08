import Experience from '../Experience.js'
import Cottage from './Cottage.js'
import Environment from './Environment.js'
import Terrain from './Terrain.js'
import Room from './Room.js'
import SceneGroup from './SceneGroup.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.overlay = this.experience.overlay

        // Setup World
        this.resources.on('ready', () => {
            // console.log('Resources Ready')

            this.sceneGroup = new SceneGroup()

            this.room = new Room()
            this.cottage = new Cottage()
            this.environment = new Environment()
            this.terrain = new Terrain()
        })
    }

    update() {}
}
