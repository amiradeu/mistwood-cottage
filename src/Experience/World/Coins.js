import {
    DynamicDrawUsage,
    Euler,
    InstancedMesh,
    Matrix4,
    Mesh,
    Object3D,
    Quaternion,
} from 'three'

import Experience from '../Experience'

export default class Coins {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.sceneGroup = this.experience.sceneGroup
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.terrain = this.experience.world.terrain

        this.items = {}
        this.count = 100
        this.scale = 40
        this.dummy = new Object3D()
        this.matrix4 = new Matrix4()
        this.instanceRotations = []

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

        // Matrix
        const euler = new Euler()

        for (let i = 0; i < this.count; i++) {
            // Positions
            this.dummy.position.x = (Math.random() - 0.5) * 10
            this.dummy.position.z = (Math.random() - 0.5) * 10
            this.dummy.position.y = 1

            // Rotations
            euler.x = Math.PI * 0.5
            euler.y = 0
            euler.z = (Math.random() - 0.5) * Math.PI * 2
            this.dummy.setRotationFromEuler(euler)

            // Store Rotation
            this.instanceRotations.push(euler.clone())

            // Scale
            this.dummy.scale.x =
                this.dummy.scale.y =
                this.dummy.scale.z =
                    this.scale

            // Update changes on Matrix
            this.dummy.updateMatrix()

            // Apply Matrix on Meshes
            this.coin1.setMatrixAt(i, this.dummy.matrix)
            this.coin2.setMatrixAt(i, this.dummy.matrix)
        }

        console.log(this.instanceRotations)

        this.coin1.instanceMatrix.setUsage(DynamicDrawUsage)
        this.coin2.instanceMatrix.setUsage(DynamicDrawUsage)

        this.scene.add(this.coin1)
        this.scene.add(this.coin2)
    }

    update() {
        // Update meshes
        for (let i = 0; i < this.count; i++) {
            this.updateMatrix(i)
        }

        this.coin1.instanceMatrix.needsUpdate = true
        this.coin2.instanceMatrix.needsUpdate = true
    }

    updateMatrix(index) {
        this.coin1.getMatrixAt(index, this.matrix4)
        this.matrix4.decompose(
            this.dummy.position,
            this.dummy.quaternion,
            this.dummy.scale
        )

        // Rotate on world's y-axis line
        this.instanceRotations[index].z += 0.01
        this.dummy.quaternion.setFromEuler(this.instanceRotations[index])

        this.dummy.updateMatrix()

        this.coin1.setMatrixAt(index, this.dummy.matrix)
        this.coin2.setMatrixAt(index, this.dummy.matrix)
    }

    setDebug() {
        if (!this.debug.active) return

        this.debugFolder = this.debug.ui.addFolder('🪙🌕 Coins')
    }
}
