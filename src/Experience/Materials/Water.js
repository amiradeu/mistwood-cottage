import * as THREE from 'three'

import Experience from '../Experience.js'
import waterVertexShader from '../Shaders/Water/vertex.glsl'
import waterFragmentShader from '../Shaders/Water/fragment.glsl'

export default class Water {
    constructor(mesh, options = {}) {
        this.experience = new Experience()
        this.sceneGroup = this.experience.world.sceneGroup
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.mesh = mesh

        const defaultOptions = {
            opacity: 0.8,

            troughColor: '#186691',
            surfaceColor: '#9bd8c0',
            peakColor: '#bbd8e0',

            amplitude: 0.025,
            frequency: 1.07,
            persistence: 0.3,
            lacunarity: 2.18,
            iterations: 8,
            speed: 0.4,

            peakThreshold: 0.08,
            peakTransition: 0.05,
            troughThreshold: -0.01,
            troughTransition: 0.15,
            fresnelScale: 0.8,
            fresnelPower: 0.5,
        }

        this.options = {
            ...defaultOptions,
            ...options,
        }

        this.setMaterial()
        this.setModel()
        this.setDebug()
    }

    setMaterial() {
        this.environmentMap = this.resources.items.environmentMapTexture2

        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: true,
            // wireframe: true,
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader,
            uniforms: {
                uTime: new THREE.Uniform(0),
                uOpacity: new THREE.Uniform(this.options.opacity),
                uEnvironmentMap: new THREE.Uniform(this.environmentMap),

                uWavesAmplitude: new THREE.Uniform(0.025),
                uWavesFrequency: new THREE.Uniform(1.07),
                uWavesPersistence: new THREE.Uniform(0.3),
                uWavesLacunarity: new THREE.Uniform(2.18),
                uWavesIterations: new THREE.Uniform(8),
                uWavesSpeed: new THREE.Uniform(0.4),

                uTroughColor: new THREE.Uniform(
                    new THREE.Color(this.options.troughColor)
                ),
                uSurfaceColor: new THREE.Uniform(
                    new THREE.Color(this.options.surfaceColor)
                ),
                uPeakColor: new THREE.Uniform(
                    new THREE.Color(this.options.peakColor)
                ),

                uPeakThreshold: new THREE.Uniform(0.08),
                uPeakTransition: new THREE.Uniform(0.05),
                uTroughThreshold: new THREE.Uniform(-0.01),
                uTroughTransition: new THREE.Uniform(0.15),
                uFresnelScale: new THREE.Uniform(0.8),
                uFresnelPower: new THREE.Uniform(0.5),
            },
        })
    }

    setModel() {
        // remove original water plane
        this.mesh.parent.remove(this.mesh)

        // create water plane
        this.water = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1, 256, 256),
            this.material
        )

        this.water.position.copy(this.mesh.position)
        this.water.rotation.x = -Math.PI * 0.5
        this.water.scale.set(130, 130)
        this.sceneGroup.add(this.water)
    }

    update() {
        this.material.uniforms.uTime.value = this.time.elapsed
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🌊 Pond')

            this.debugFolder
                .add(this.material.uniforms.uOpacity, 'value')
                .min(0)
                .max(1)
                .step(0.1)
                .name('opacity')

            this.debugFolder
                .addColor(this.options, 'troughColor')
                .onChange(() => {
                    this.material.uniforms.uTroughColor.value.set(
                        this.options.troughColor
                    )
                })
            this.debugFolder
                .addColor(this.options, 'surfaceColor')
                .onChange(() => {
                    this.material.uniforms.uSurfaceColor.value.set(
                        this.options.surfaceColor
                    )
                })
            this.debugFolder
                .addColor(this.options, 'peakColor')
                .onChange(() => {
                    this.material.uniforms.uPeakColor.value.set(
                        this.options.peakColor
                    )
                })

            this.debugFolder
                .add(this.material.uniforms.uWavesAmplitude, 'value')
                .min(0)
                .max(0.1)
                .step(0.001)
                .name('amplitude')
            this.debugFolder
                .add(this.material.uniforms.uWavesFrequency, 'value')
                .min(0.1)
                .max(10)
                .step(0.001)
                .name('frequency')
            this.debugFolder
                .add(this.material.uniforms.uWavesPersistence, 'value')
                .min(0)
                .max(1)
                .step(0.001)
                .name('persistence')
            this.debugFolder
                .add(this.material.uniforms.uWavesLacunarity, 'value')
                .min(0)
                .max(3)
                .step(0.001)
                .name('lacunarity')
            this.debugFolder
                .add(this.material.uniforms.uWavesIterations, 'value')
                .min(1)
                .max(10)
                .step(1)
                .name('iterations')
            this.debugFolder
                .add(this.material.uniforms.uWavesSpeed, 'value')
                .min(0)
                .max(1)
                .step(0.001)
                .name('speed')

            this.debugFolder
                .add(this.material.uniforms.uPeakThreshold, 'value')
                .min(0)
                .max(0.5)
                .step(0.001)
                .name('threshold')
            this.debugFolder
                .add(this.material.uniforms.uPeakTransition, 'value')
                .min(0)
                .max(0.5)
                .step(0.001)
                .name('PeakTransition')
            this.debugFolder
                .add(this.material.uniforms.uTroughThreshold, 'value')
                .min(-0.5)
                .max(0)
                .step(0.001)
                .name('TroughThreshold')
            this.debugFolder
                .add(this.material.uniforms.uTroughTransition, 'value')
                .min(0)
                .max(0.5)
                .step(0.001)
                .name('TroughTransition')
            this.debugFolder
                .add(this.material.uniforms.uFresnelScale, 'value')
                .min(0)
                .max(1)
                .step(0.001)
                .name('FresnelScale')
            this.debugFolder
                .add(this.material.uniforms.uFresnelPower, 'value')
                .min(0)
                .max(3)
                .step(0.001)
                .name('FresnelPower')

            this.positionFolder = this.debugFolder.addFolder('Position').close()
            this.positionFolder
                .add(this.water.position, 'x')
                .min(-100)
                .max(100)
                .step(0.1)
                .name('x')
            this.positionFolder
                .add(this.water.position, 'z')
                .min(-100)
                .max(100)
                .step(0.1)
                .name('z')
            this.positionFolder
                .add(this.water.position, 'y')
                .min(-100)
                .max(100)
                .step(0.1)
                .name('y')

            this.scaleFolder = this.debugFolder.addFolder('Scale').close()
            this.scaleFolder
                .add(this.water.scale, 'x')
                .min(1)
                .max(300)
                .step(0.1)
                .name('x')
            this.scaleFolder
                .add(this.water.scale, 'y')
                .min(1)
                .max(300)
                .step(0.1)
                .name('y')
        }
    }
}
