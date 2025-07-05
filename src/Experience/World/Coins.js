import {
    Box3,
    DynamicDrawUsage,
    Euler,
    InstancedMesh,
    MathUtils,
    Matrix4,
    Mesh,
    Object3D,
    Vector3,
} from 'three'

import Experience from '../Experience'
import Boundary from '../Utils/Boundary'

export default class Coins {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.sceneGroup = this.experience.sceneGroup
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.states = this.experience.states
        this.sfx = this.experience.sfx

        this.terrain = this.experience.world.terrain
        this.playerController = this.experience.world.playerController
        this.playerBox = this.experience.world.player.playerBox
        this.playerPosition = this.experience.world.player.mesh.position

        this.items = {}
        this.count = this.states.totalCoins
        this.scale = 40
        this.dummy = new Object3D()
        this.matrix4 = new Matrix4()
        this.instanceRotations = []
        this.coinBoxes = []

        this.setCoin()
        this.setDebug()

        // Perform checking only when player moves
        this.playerController.on('playerMoving', () => {
            console.log('moving')
            this.checkCoins()
        })
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

        const { x: minX, z: minZ } = this.terrain.terrainArea.min
        const { x: maxX, z: maxZ } = this.terrain.terrainArea.max

        // console.log(minX, maxX)
        // console.log(minZ, maxZ)

        for (let i = 0; i < this.count; i++) {
            // Positions
            this.dummy.position.x = MathUtils.lerp(minX, maxX, Math.random())
            this.dummy.position.z = MathUtils.lerp(minZ, maxZ, Math.random())

            const elevation = this.terrain.getElevationFromTerrain(
                this.dummy.position.x,
                this.dummy.position.z
            )

            // land position + [0.5-1.5]
            this.dummy.position.y = elevation + Math.random() * 0.5 + 0.5

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

            // Box
            const _coin1 = new Mesh(_geometry1, _material1)
            _coin1.position.copy(this.dummy.position)
            _coin1.scale.copy(this.dummy.scale)
            _coin1.quaternion.copy(this.dummy.quaternion)

            const coinBox = new Boundary(_coin1)
            this.coinBoxes.push(coinBox)
            this.scene.add(coinBox.boxHelper)
        }

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

    checkCoins() {
        for (let i = 0; i < this.count; i++) {
            // 🌞 Broad-phase detection
            // Skip checking coins that are far away from player
            if (
                this.playerPosition.distanceToSquared(
                    this.coinBoxes[i].position
                ) > 4.0
            )
                continue

            // Check if coin & player intersects
            if (this.coinBoxes[i].intersectsBox(this.playerBox))
                this.onCoinCollected(i)
        }
    }

    onCoinCollected(index) {
        // Play sound
        this.sfx.playCoinSound()

        // Move to far
    }

    setDebug() {
        if (!this.debug.active) return

        this.debugFolder = this.debug.ui.addFolder('🪙🌕 Coins')
    }
}
