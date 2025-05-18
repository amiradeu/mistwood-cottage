import * as THREE from 'three'

import Experience from '../Experience'

export default class GlassFrosted {
    constructor(mesh, options = {}) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug
        this.mesh = mesh

        const defaultOptions = {
            scale: 1.0,
            opacity: 0.8,
            color: '#464851',
            name: '🪟 Window Glass Frosted',
        }

        this.options = {
            ...defaultOptions,
            ...options,
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()
        this.setDebug()
    }

    setTextures() {
        this.texture = this.resources.items.glassFrostedBaseTexture
        this.texture.wrapS = THREE.RepeatWrapping
        this.texture.wrapT = THREE.RepeatWrapping
        this.texture.rotation = Math.PI
        this.texture.repeat.x = this.options.scale
        this.texture.repeat.y = this.options.scale

        this.textureNormal = this.resources.items.glassFrostedNormalTexture
        this.textureNormal.wrapS = THREE.RepeatWrapping
        this.textureNormal.wrapT = THREE.RepeatWrapping
        this.textureNormal.rotation = Math.PI
        this.textureNormal.repeat.x = this.options.scale
        this.textureNormal.repeat.y = this.options.scale
    }

    setMaterials() {
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            opacity: this.options.opacity,
            color: this.options.color,
            map: this.texture,
            alphaMap: this.textureNormal,
        })
    }

    setModel() {
        this.mesh.material = this.material
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(this.options.name)

            this.debugFolder
                .add(this.options, 'opacity', 0, 1, 0.01)
                .onChange(() => {
                    this.material.opacity = this.options.opacity
                })

            this.debugFolder.addColor(this.options, 'color').onChange(() => {
                this.material.color.set(this.options.color)
            })

            this.debugFolder
                .add(this.options, 'scale', 0, 2.0, 0.01)
                .onChange(() => {
                    this.texture.repeat.x = this.options.scale
                    this.texture.repeat.y = this.options.scale

                    this.textureNormal.repeat.x = this.options.scale
                    this.textureNormal.repeat.y = this.options.scale
                })
        }
    }
}
