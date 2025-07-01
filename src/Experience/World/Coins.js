import gsap from 'gsap'

import Experience from '../Experience'
import { Euler, Mesh, Quaternion } from 'three'

export default class Coins {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.sceneGroup = this.experience.sceneGroup
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.count = 1
        this.items = {}

        this.terrain = this.experience.world.terrain

        this.setCoin()
        this.setDebug()
    }

    setCoin() {
        const _scale = 100

        this.coin = this.resources.items.coinModel.scene
        this.scene.add(this.coin)

        this.coin.position.set(0, 1, 3)
        // this.coin.scale.set(_scale, _scale, _scale)

        this.coin.traverse((child) => {
            console.log(
                child.name,
                child.type,
                child.scale,
                child.rotation,
                child.position
            )
            this.items[child.name] = child
        })

        // console.log(this.items.Coin_1.material)

        // rotate the record disk
        // gsap.to(this.coin.rotation, {
        //     y: -Math.PI * 2,
        //     duration: 8,
        //     ease: 'none',
        //     repeat: -1,
        // })

        const _geometry1 = this.items.Coin_1.geometry.clone()
        const _geometry2 = this.items.Coin_2.geometry.clone()

        const _material1 = this.items.Coin_1.material
        const _material2 = this.items.Coin_2.material

        const _mesh1 = new Mesh(_geometry1, _material1)
        const _mesh2 = new Mesh(_geometry2, _material2)

        const options = {
            x: Math.PI * 0.5,
            y: 0,
            z: 0,
        }
        const _euler = new Euler(options.x, options.y, options.z)
        const _quaternion = new Quaternion()
        _quaternion.setFromEuler(_euler)

        _mesh1.setRotationFromQuaternion(_quaternion)
        _mesh2.setRotationFromQuaternion(_quaternion)
        _mesh1.scale.set(_scale, _scale, _scale)
        _mesh2.scale.set(_scale, _scale, _scale)
        _mesh1.position.set(0, 1, 4)
        _mesh2.position.set(0, 1, 4)

        this.scene.add(_mesh1)
        this.scene.add(_mesh2)

        if (this.debug.active) {
            this.debug.ui
                .add(options, 'x', -Math.PI, Math.PI, 0.01)
                .onChange(() => {
                    const _euler = new Euler(options.x, options.y, options.z)
                    const _quaternion = new Quaternion()
                    _quaternion.setFromEuler(_euler)

                    _mesh1.setRotationFromQuaternion(_quaternion)
                    _mesh2.setRotationFromQuaternion(_quaternion)
                })

            this.debug.ui
                .add(options, 'y', -Math.PI, Math.PI, 0.01)
                .onChange(() => {
                    const _euler = new Euler(options.x, options.y, options.z)
                    const _quaternion = new Quaternion()
                    _quaternion.setFromEuler(_euler)

                    _mesh1.setRotationFromQuaternion(_quaternion)
                    _mesh2.setRotationFromQuaternion(_quaternion)
                })

            this.debug.ui
                .add(options, 'z', -Math.PI, Math.PI, 0.01)
                .onChange(() => {
                    const _euler = new Euler(options.x, options.y, options.z)
                    const _quaternion = new Quaternion()
                    _quaternion.setFromEuler(_euler)

                    _mesh1.setRotationFromQuaternion(_quaternion)
                    _mesh2.setRotationFromQuaternion(_quaternion)
                })
        }
    }

    update() {}

    setDebug() {
        if (!this.debug.active) return

        this.debugFolder = this.debug.ui.addFolder('🪙🌕 Coins')
    }
}
