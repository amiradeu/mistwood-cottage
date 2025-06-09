import * as THREE from 'three'

import Experience from '../Experience'
import { CyclesSettings } from '../Constants.js'
import gsap from 'gsap'
export default class Fog {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.cycles = this.experience.cycles

        this.addFog()
        this.setupDebug()
    }

    addFog() {
        this.options = {
            color: '#dfe9f3',
            near: 1,
            far: 30,
            density: 0.015,
        }

        this.fog = new THREE.Fog(
            this.options.color,
            this.options.near,
            this.options.far
        )
        this.scene.fog = this.fog
    }

    setupDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('💨 Fog')

            this.debugFolder.addColor(this.options, 'color').onChange(() => {
                this.fog.color.set(this.options.color)
            })
            this.debugFolder.add(this.fog, 'near', -30, 10, 0.01)
            this.debugFolder.add(this.fog, 'far', 5, 100, 0.001)
        }
    }

    updateCycle() {
        gsap.to(this.fog, {
            duration: 2,
            far: CyclesSettings[this.cycles.currentCycle].fog,
        })
    }
}
