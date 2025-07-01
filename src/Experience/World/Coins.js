import {
    DynamicDrawUsage,
    Euler,
    InstancedMesh,
    Matrix4,
    Quaternion,
    Vector3,
} from 'three'

import Experience from '../Experience'

export default class Coins {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.sceneGroup = this.experience.sceneGroup
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.count = 200
        this.items = {}

        this.terrain = this.experience.world.terrain

        this.setCoin()
        this.setDebug()
    }

    setCoin() {
        this.coin = this.resources.items.coinModel.scene
        this.coin.traverse((child) => (this.items[child.name] = child))

        // Extract geometries & materials
        const _geometry1 = this.items.Coin_1.geometry.clone()
        const _geometry2 = this.items.Coin_2.geometry.clone()
        const _material1 = this.items.Coin_1.material
        const _material2 = this.items.Coin_2.material

        /**
         * Instanced Mesh
         */
        this.coin1 = new InstancedMesh(_geometry1, _material1, this.count)
        this.coin2 = new InstancedMesh(_geometry2, _material2, this.count)

        // // Matrix
        const matrix = new Matrix4()
        const position = new Vector3()
        const quaternion = new Quaternion()
        const scale = new Vector3()
        const euler = new Euler()
        const _scale = 50

        for (let i = 0; i < this.count; i++) {
            position.x = (Math.random() - 0.5) * 10
            position.z = (Math.random() - 0.5) * 10
            position.y = 1

            euler.x = Math.PI * 0.5
            euler.y = 0
            euler.z = (Math.random() - 0.5) * Math.PI * 2
            quaternion.setFromEuler(euler)

            scale.x = scale.y = scale.z = _scale

            matrix.makeRotationFromQuaternion(quaternion)
            matrix.setPosition(position)
            matrix.scale(scale)

            this.coin1.setMatrixAt(i, matrix)
            this.coin2.setMatrixAt(i, matrix)
        }

        this.coin1.instanceMatrix.setUsage(DynamicDrawUsage)
        this.coin2.instanceMatrix.setUsage(DynamicDrawUsage)

        this.scene.add(this.coin1)
        this.scene.add(this.coin2)
    }

    update() {
        // Update meshes
    }

    setDebug() {
        if (!this.debug.active) return

        this.debugFolder = this.debug.ui.addFolder('🪙🌕 Coins')
    }
}
