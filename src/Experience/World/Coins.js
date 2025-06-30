import gsap from 'gsap'

import Experience from '../Experience'

export default class Coins {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.sceneGroup = this.experience.sceneGroup
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.counts = 100
        this.items = {}

        this.terrain = this.experience.world.terrain

        this.setCoin()
        this.setDebug()
    }

    setCoin() {
        const scale = 0.5
        this.coin = this.resources.items.coinModel.scene
        this.scene.add(this.coin)

        this.coin.position.set(0, 1, 3)
        this.coin.scale.set(scale, scale, scale)

        this.coin.traverse((child) => (this.items[child.name] = child))

        // console.log(this.items.Coin_1.material)

        // rotate the record disk
        gsap.to(this.coin.rotation, {
            y: -Math.PI * 2,
            duration: 8,
            ease: 'none',
            repeat: -1,
        })
    }

    update() {}

    setDebug() {
        if (!this.debug.active) return

        this.debugFolder = this.debug.ui.addFolder('🪙🌕 Coins')

        this.debugFolder.add(
            this.items.Coin_1.material,
            'roughness',
            0,
            1,
            0.01
        )

        this.debugFolder.add(
            this.items.Coin_1.material,
            'metalness',
            0,
            1,
            0.01
        )
    }
}
