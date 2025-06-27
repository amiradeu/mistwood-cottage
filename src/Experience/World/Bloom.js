import { Layers, Mesh } from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'

import Experience from '../Experience'

const BLOOM_SCENE = 1

export default class Bloom {
    constructor() {
        this.experience = new Experience()
        this.renderer = this.experience.renderer.instance
        this.effectComposer = this.experience.effectComposer
        this.debug = this.experience.debug

        this.options = {
            strength: 0.2,
            radius: 0,
            threshold: 0,
        }

        this.setLayer()
        this.setBloom()
        this.setDebug()
    }

    setLayer() {
        this.layer = new Layers()
        this.layer.set(BLOOM_SCENE)
    }

    setBloom() {
        this.pass = new UnrealBloomPass()

        this.pass.strength = this.options.strength
        this.pass.radius = this.options.radius
        this.pass.threshold = this.options.threshold

        this.composer = new EffectComposer(this.renderer)
        this.composer.renderToScreen = false

        this.effectComposer.addPass(this.pass)
    }

    // Add objects causing bloom
    addBloom(mesh = new Mesh()) {
        mesh.layers.enable(BLOOM_SCENE)
    }

    setDebug() {
        if (!this.debug.active) return
        this.debugFolder = this.debug.ui.addFolder('✨ Bloom')

        this.debugFolder.add(this.pass, 'enabled')

        this.debugFolder.add(this.pass, 'strength').min(0).max(2).step(0.001)

        this.debugFolder.add(this.pass, 'radius').min(0).max(2).step(0.001)

        this.debugFolder.add(this.pass, 'threshold').min(0).max(1).step(0.001)
    }
}
