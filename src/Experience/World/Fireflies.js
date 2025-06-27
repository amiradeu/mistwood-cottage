import {
    Spherical,
    Vector3,
    BufferGeometry,
    Float32BufferAttribute,
    ShaderMaterial,
    AdditiveBlending,
    Color,
    Uniform,
    Points,
} from 'three'

import Experience from '../Experience.js'
import firefliesVertexShader from '../Shaders/Fireflies/vertex.glsl'
import firefliesFragmentShader from '../Shaders/Fireflies/fragment.glsl'

export const AREA_TYPE = {
    SPHERE: 'Sphere',
    CUBE: 'Cube',
}

export default class Fireflies {
    constructor(options = {}) {
        this.experience = new Experience()
        this.sceneGroup = this.experience.sceneGroup
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.setOptions(options)
        this.setMaterial()
        this.setGeometry()
        this.setModel()
        this.setDebug()
    }

    setOptions(options) {
        const defaultOptions = {
            area: AREA_TYPE.SPHERE,
            positions: new Vector3(0, 0, 0),
            cubeSize: {
                x: 10,
                y: 10,
                z: 10,
            },

            color: '#ffd009',
            count: 200,
            size: 60,
            radius: 3.5,
            fillRadius: 0.4, // outer percent of circle to fill

            // Movement
            moveRatio: 0.8, // 0-none, 1.0-all
            moveSpeed: 0.1,
            pathSize: 3.5,
            frequencyA: 2,
            frequencyB: 5,

            // Flicker
            flickerSpeed: 1.8,
            flickerSync: 80,

            name: '🐞 Fireflies',
            debug: null,
        }

        this.options = {
            ...defaultOptions,
            ...options,
        }
    }

    setGeometry() {
        const positionsArray = new Float32Array(this.options.count * 3)
        const randomness = new Float32Array(this.options.count * 1)
        const randomMove = new Float32Array(this.options.count * 1)

        // Geometry
        for (let i = 0; i < this.options.count; i++) {
            const i3 = i * 3

            // Place in a spherical randomness, instead of cube
            // radius, phi, theta
            const spherical = new Spherical(
                this.options.radius *
                    (1 -
                        this.options.fillRadius +
                        Math.random() * this.options.fillRadius),
                Math.random() * Math.PI,
                Math.random() * Math.PI * 2
            )

            const position = new Vector3()
            position.setFromSpherical(spherical)

            if (this.options.area === AREA_TYPE.SPHERE) {
                // Random spherical position
                positionsArray[i3] = position.x
                positionsArray[i3 + 1] = position.y
                positionsArray[i3 + 2] = position.z
            }

            if (this.options.area === AREA_TYPE.CUBE) {
                // Random cube position
                positionsArray[i3] =
                    Math.random() * this.options.cubeSize.x -
                    this.options.cubeSize.x / 2
                positionsArray[i3 + 1] =
                    Math.random() * this.options.cubeSize.y -
                    this.options.cubeSize.y / 2
                positionsArray[i3 + 2] =
                    Math.random() * this.options.cubeSize.z -
                    this.options.cubeSize.z / 2
            }

            randomness[i] = Math.random()
            randomMove[i] = Math.random()
        }

        this.geometry = new BufferGeometry()
        this.geometry.setAttribute(
            'position',
            new Float32BufferAttribute(positionsArray, 3)
        )
        this.geometry.setAttribute(
            'aRandomness',
            new Float32BufferAttribute(randomness, 1)
        )
        this.geometry.setAttribute(
            'aRandomMove',
            new Float32BufferAttribute(randomMove, 1)
        )
    }

    setMaterial() {
        this.material = new ShaderMaterial({
            depthWrite: false,
            transparent: true,
            blending: AdditiveBlending,
            vertexShader: firefliesVertexShader,
            fragmentShader: firefliesFragmentShader,
            uniforms: {
                uPixelRatio: { value: this.sizes.pixelRatio },
                uTime: {
                    value: 0,
                },

                // Fireflies
                uColor: new Uniform(new Color(this.options.color)),
                uSize: new Uniform(this.options.size),

                uMoveRatio: new Uniform(this.options.moveRatio),
                uMoveSpeed: new Uniform(this.options.moveSpeed),
                uFrequencyA: new Uniform(this.options.frequencyA),
                uFrequencyB: new Uniform(this.options.frequencyB),
                uPathSize: new Uniform(this.options.pathSize),

                uFlickerSpeed: new Uniform(this.options.flickerSpeed),
                uFlickerSync: new Uniform(this.options.flickerSync),
            },
        })
    }

    setModel() {
        this.fireflies = new Points(this.geometry, this.material)
        this.fireflies.position.set(
            this.options.positions.x,
            this.options.positions.y,
            this.options.positions.z
        )
        this.sceneGroup.add(this.fireflies)
    }

    update() {
        if (this.material)
            this.material.uniforms.uTime.value = this.time.elapsed
    }

    setDebug() {
        if (!this.debug.active) return

        if (this.options.debug)
            this.debugFolder = this.options.debug
                .addFolder(this.options.name)
                .close()
        else
            this.debugFolder = this.debug.ui
                .addFolder(this.options.name)
                .close()

        this.debugFolder.addColor(this.options, 'color').onChange(() => {
            this.material.uniforms.uColor.value.set(this.options.color)
        })
        this.debugFolder
            .add(this.options, 'count')
            .min(1)
            .max(1000)
            .step(1)
            .onChange((ev) => {
                // if (ev.last) generateFireflies()
            })
        this.debugFolder
            .add(this.options, 'radius')
            .name('radius')
            .min(0.1)
            .max(5)
            .step(0.01)
            .onChange((ev) => {
                // if (ev.last) generateFireflies()
            })
        this.debugFolder
            .add(this.options, 'fillRadius')
            .name('fill inside')
            .min(0.0)
            .max(5)
            .step(0.01)
            .onChange((ev) => {
                // if (ev.last) generateFireflies()
            })
        this.debugFolder
            .add(this.options, 'size')
            .name('Size')
            .min(1)
            .max(100)
            .step(1)
            .onChange(() => {
                this.material.uniforms.uSize.value = this.options.size
            })

        // Movement
        this.moveGUI = this.debugFolder.addFolder('Movement')
        this.moveGUI
            .add(this.options, 'moveRatio')
            .name('move ratio')
            .min(0)
            .max(1)
            .step(0.1)
            .onChange(() => {
                this.material.uniforms.uMoveRatio.value = this.options.moveRatio
            })
        this.moveGUI
            .add(this.options, 'moveSpeed')
            .name('speed')
            .min(0)
            .max(1)
            .step(0.01)
            .onChange(() => {
                this.material.uniforms.uMoveSpeed.value = this.options.moveSpeed
            })
        this.moveGUI
            .add(this.options, 'pathSize')
            .name('path size')
            .min(0)
            .max(5)
            .step(0.01)
            .onChange(() => {
                this.material.uniforms.uPathSize.value = this.options.pathSize
            })
        this.moveGUI
            .add(this.options, 'frequencyA')
            .name('Freq A')
            .min(1)
            .max(10)
            .step(1)
            .onChange(() => {
                this.material.uniforms.uFrequencyA.value =
                    this.options.frequencyA
            })
        this.moveGUI
            .add(this.options, 'frequencyB')
            .name('Freq B')
            .min(1)
            .max(10)
            .step(1)
            .onChange(() => {
                this.material.uniforms.uFrequencyB.value =
                    this.options.frequencyB
            })

        // Flicker
        this.flickerGUI = this.debugFolder.addFolder('Flicker')
        this.flickerGUI
            .add(this.options, 'flickerSpeed')
            .name('Speed')
            .min(0)
            .max(5)
            .step(0.01)
            .onChange(() => {
                this.material.uniforms.uFlickerSpeed.value =
                    this.options.flickerSpeed
            })
        this.flickerGUI
            .add(this.options, 'flickerSync')
            .name('Sync')
            .min(0)
            .max(200)
            .step(1)
            .onChange(() => {
                this.material.uniforms.uFlickerSync.value =
                    this.options.flickerSync
            })
    }
}
