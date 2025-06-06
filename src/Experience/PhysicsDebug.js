import * as THREE from 'three'

import Experience from './Experience.js'

export default class PhysicsDebug {
    constructor() {
        this.experience = new Experience()
        this.sceneGroup = this.experience.sceneGroup
        this.physics = this.experience.physics

        this.setGeometry()
        this.setMaterial()
        this.setLine()
    }

    setGeometry() {
        this.geometry = new THREE.BufferGeometry()
    }

    setMaterial() {
        this.material = new THREE.LineBasicMaterial({
            vertexColors: true,
        })
    }

    setLine() {
        this.lineSegments = new THREE.LineSegments(this.geometry, this.material)
        this.sceneGroup.add(this.lineSegments)
    }

    update() {
        const { vertices, colors } = this.physics.world.debugRender()
        // console.log(
        //     'Vertices:',
        //     vertices.length / 3,
        //     'Colors:',
        //     colors.length / 4
        // )

        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(vertices, 3)
        )

        this.geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(colors, 4)
        )

        this.geometry.attributes.position.needsUpdate = true
        this.geometry.attributes.color.needsUpdate = true
    }
}
