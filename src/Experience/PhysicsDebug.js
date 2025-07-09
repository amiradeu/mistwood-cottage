import {
    BufferGeometry,
    LineBasicMaterial,
    LineSegments,
    BufferAttribute,
} from 'three'

import Experience from './Experience.js'

export default class PhysicsDebug {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.physics = this.experience.physics
        this.debug = this.experience.debug

        this.setGeometry()
        this.setMaterial()
        this.setLine()
        this.setDebug()
    }

    setGeometry() {
        this.geometry = new BufferGeometry()
    }

    setMaterial() {
        this.material = new LineBasicMaterial({
            vertexColors: true,
        })
    }

    setLine() {
        this.lineSegments = new LineSegments(this.geometry, this.material)
        this.scene.add(this.lineSegments)
    }

    update() {
        const { vertices, colors } = this.physics.world.debugRender()
        // console.log(
        //     'Vertices:',
        //     vertices.length / 3,
        //     'Colors:',
        //     colors.length / 4
        // )

        this.geometry.setAttribute('position', new BufferAttribute(vertices, 3))

        this.geometry.setAttribute('color', new BufferAttribute(colors, 4))

        this.geometry.attributes.position.needsUpdate = true
        this.geometry.attributes.color.needsUpdate = true
    }

    setDebug() {
        if (!this.debug.active) return

        this.debugFolder = this.debug.ui.addFolder('🏄 Physics').close()
        this.debugFolder.add(this.lineSegments.material, 'visible')
    }
}
