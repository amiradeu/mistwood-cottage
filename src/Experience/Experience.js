import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './sources.js'
import Debug from './Utils/Debug.js'
import Statistics from './Utils/Statistics.js'
import Overlay from './Components/Overlay.js'
import SceneCycles from './Utils/SceneCycles.js'

// Singleton
let instance = null

export default class Experience {
    constructor(canvas) {
        // Singleton
        if (instance) {
            return instance
        }

        instance = this

        // Allow Global access
        window.experience = this

        // Options
        this.canvas = canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.stats = new Statistics()
        this.sceneCycle = new SceneCycles()
        this.world = new World()
        this.overlay = new Overlay()

        // Adding Listener to events
        // 💡 using arrow function to keep the context
        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
        this.stats.update()
    }

    destroy() {
        // Removing Listeners
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                for (const key in child.material) {
                    const value = child.material[key]

                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active) {
            this.debug.ui.destroy()
        }
    }
}
