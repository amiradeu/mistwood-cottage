import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import Experience from '../Experience.js'

export default class Player {
    constructor() {
        this.experience = new Experience()
        this.sceneGroup = this.experience.world.sceneGroup
        this.physics = this.experience.physics

        this.options = {
            radius: 3,
        }

        this.setMaterial()
        this.setGeometry()
        this.setMesh()
        this.setPhysics()
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            color: '#fff715',
        })
    }

    setGeometry() {
        this.geometry = new THREE.IcosahedronGeometry(1, 1)
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        this.mesh.position.set(0, 50, -50)
        this.mesh.scale.set(
            this.options.radius,
            this.options.radius,
            this.options.radius
        )
        this.sceneGroup.add(this.mesh)
    }

    setPhysics() {
        const shape = new CANNON.Sphere(this.options.radius)
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 10, 0),
            shape: shape,
        })
        body.position.copy(this.mesh.position)

        this.physics.addObject(this.mesh, body)
    }

    update() {}
}
