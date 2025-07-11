import Experience from '../Experience.js'
import SceneGroup from '../Utils/SceneGroup.js'
import Room from './Room.js'
import Cottage from './Cottage.js'
import Environment from './Environment.js'
import Terrain from './Terrain.js'
import Background from './Background.js'
import FogAmbient from './Fog.js'
import Bloom from './Bloom.js'
import Player from './Player.js'
import Cursor from '../Utils/Cursor.js'
import Coins from './Coins.js'
import Lights from '../Utils/Lights.js'
import PlayerController from '../Utils/PlayerController.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.sceneCycle = this.experience.cycles
        this.overlay = this.experience.overlay
        this.states = this.experience.states
        this.sfx = this.experience.sfx

        // Setup World
        this.resources.on('ready', () => {
            // console.log('Resources Ready')

            // this.bloom = new Bloom()
            this.fog = new FogAmbient()
            this.background = new Background()
            this.lights = new Lights()

            this.room = new Room()
            this.cottage = new Cottage()
            this.environment = new Environment()
            this.terrain = new Terrain()

            this.player = new Player()
            this.playerController = new PlayerController()

            this.coins = new Coins()
            this.cursor = new Cursor()
        })

        this.sceneCycle.on('cycleChanged', () => {
            this.changeWorldCycle()
        })

        this.states.on('toggleLeft', () => {
            this.toggleLeft()
        })

        this.states.on('toggleFront', () => {
            this.toggleFront()
        })
    }

    // Update based on tick time
    update() {
        if (this.room) this.room.update()
        if (this.cottage) this.cottage.update()
        if (this.environment) this.environment.update()
        if (this.terrain) this.terrain.update()
        if (this.player) this.player.update()
        if (this.playerController) this.playerController.update()
        if (this.cursor) this.cursor.update()
        if (this.coins) this.coins.update()
    }

    // Update based on day cycle
    changeWorldCycle() {
        if (this.room) this.room.updateCycle()
        if (this.cottage) this.cottage.updateCycle()
        if (this.environment) this.environment.updateCycle()
        if (this.terrain) this.terrain.updateCycle()
        if (this.fog) this.fog.updateCycle()
        if (this.player) this.player.updateCycle()
    }

    // Show or Hide Sides of Cottage
    toggleLeft() {
        if (this.cottage) this.cottage.toggleLeft()
    }

    toggleFront() {
        if (this.room) this.room.toggleFront()
        if (this.cottage) this.cottage.toggleFront()
    }
}
