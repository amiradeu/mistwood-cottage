import {
    SRGBColorSpace,
    MeshBasicMaterial,
    Quaternion,
    Euler,
    Raycaster,
    Vector3,
} from 'three'
import RAPIER from '@dimforge/rapier3d'

import Experience from '../Experience'
import {
    addTextureTransition,
    animateTextureChange,
} from '../Shaders/addTextureTransition'
import Pond from '../Objects/Pond'
import CausticsFloor from '../Objects/CausticsFloor'
import Boundary from '../Utils/Boundary'

export default class Terrain {
    constructor() {
        this.experience = new Experience()
        this.sceneGroup = this.experience.sceneGroup
        this.sceneCycle = this.experience.cycles
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.physics = this.experience.physics

        // GLB Model
        this.setTextures()
        this.setMaterials()
        this.setModel()
        this.setDebug()
        this.setBoundary()

        // Custom & lights
        this.setCustom()

        // Physics
        this.setPhysics()

        this.raycaster = new Raycaster()
        this.downDirection = new Vector3(0, -1, 0)
        this.originRay = new Vector3(0, 1000, 0) // shoot ray from high above
    }

    setTextures() {
        this.texture = this.resources.items[this.sceneCycle.textures.terrain]
        this.texture.flipY = false
        this.texture.colorSpace = SRGBColorSpace
    }

    setMaterials() {
        this.material = new MeshBasicMaterial({
            map: this.texture,
            // wireframe: true,
        })
        this.uniforms = addTextureTransition(this.material)
    }

    setModel() {
        this.items = {}

        this.model = this.resources.items.terrainModel.scene
        this.sceneGroup.add(this.model)

        this.model.traverse((child) => {
            this.items[child.name] = child
        })

        this.setBaked()
    }

    setBoundary() {
        this.pondArea = new Boundary(this.items.PondGround)
        this.terrainArea = new Boundary(this.items.Land)
    }

    setPhysics() {
        /**
         * Land & Mountains
         */
        this.physics.glbToTrimesh(this.items.Land)
        this.physics.glbToTrimesh(this.items.PondGround)

        /**
         * Surrounding Borders
         */
        const width = 0.5
        const height = 8
        const length = 18.0
        let colliderDesc = RAPIER.ColliderDesc.cuboid(width, height, length)
        colliderDesc.setFriction(0.5)

        const { x: minX, z: minZ } = this.terrainArea.min
        const { x: maxX, z: maxZ } = this.terrainArea.max

        // right, left
        this.physics.world
            .createCollider(colliderDesc)
            .setTranslation({ x: maxX, y: 5, z: -4 })
        this.physics.world
            .createCollider(colliderDesc)
            .setTranslation({ x: minX, y: 5, z: -4 })

        // rotate collider
        const rotation = new Quaternion().setFromEuler(
            new Euler(0, Math.PI * 0.5, 0)
        )
        colliderDesc.setRotation(rotation)

        // front, back
        this.physics.world
            .createCollider(colliderDesc)
            .setTranslation({ x: 0, y: 5, z: minZ })
        this.physics.world
            .createCollider(colliderDesc)
            .setTranslation({ x: 0, y: 5, z: maxZ })
    }

    setBaked() {
        this.items.Land.material = this.material
        this.items.LandBase.material = this.material
    }

    setCustom() {
        this.pond = new Pond(this.items.Water, {
            debug: this.debugFolder,
        })

        this.pondGround = new CausticsFloor(this.items.PondGround, {
            texture: this.texture,
            debug: this.debugFolder,
        })
    }

    updateUniforms() {
        this.uniforms.uMap0.value = this.texture
    }

    updateMaterials() {
        this.material.map = this.texture
        this.material.needsUpdate = true
    }

    updateCycle() {
        this.updateUniforms()
        this.setTextures()
        this.updateMaterials()

        animateTextureChange(this.uniforms.uMixProgress)

        if (this.pondGround) this.pondGround.updateCycle(this.texture)
    }

    // Calculate object elevation from terrain with raycasting
    getElevationFromTerrain(x, z) {
        this.originRay.x = x
        this.originRay.z = z
        this.raycaster.set(this.originRay, this.downDirection)

        const intersects = this.raycaster.intersectObjects(
            [this.items.Land, this.items.PondGround],
            true
        )
        if (intersects.length > 0) {
            return intersects[0].point.y // This is the elevation
        }

        return null // No terrain hit
    }

    update() {
        if (this.pond) this.pond.update()
        if (this.pondGround) this.pondGround.update()
    }

    setDebug() {
        if (!this.debug.active) return
        this.debugFolder = this.debug.ui.addFolder('⛰️ Terrain').close()
    }
}
