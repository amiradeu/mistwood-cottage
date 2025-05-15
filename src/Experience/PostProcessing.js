import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import Experience from './Experience.js'

export default class PostProcessing {
    constructor() {
        this.experience = new Experience()
        this.renderer = this.experience.renderer.instance
        this.camera = this.experience.camera.instance
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes

        this.composers = []
        this.effects = []

        this.setInstance()
    }

    setInstance() {
        this.effectComposer = new EffectComposer(this.renderer)
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)

        this.renderPass = new RenderPass(this.scene, this.camera)
        this.effectComposer.addPass(this.renderPass)
    }

    resize() {
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {
        this.effectComposer.render()
    }

    addPass(pass) {
        this.effectComposer.addPass(pass)
    }
}
