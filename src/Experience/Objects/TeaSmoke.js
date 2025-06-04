import * as THREE from 'three'

import Experience from '../Experience'
import teaSmokeVertexShader from '../Shaders/TeaSmoke/vertex.glsl'
import teaSmokeFragmentShader from '../Shaders/TeaSmoke/fragment.glsl'

export default class TeaSmoke {
    constructor(mesh, options = {}) {
        this.experience = new Experience()
        this.sceneGroup = this.experience.world.sceneGroup
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.mesh = mesh

        this.defaultOptions = {
            waterColor: '#421e08',
            // Smoke
            smokeColor: '#ffe7dd',
            smokeStretchX: 0.5,
            smokeStretchY: 0.9,
            smokeSpeed: 0.06,
            // Wind
            twistFrequency: 0.3,
            twistIntensity: 18.0,
            twistSpeed: 0.03,
            windStrength: 10.0,
            windSpeed: 0.01,
        }

        this.options = {
            ...this.defaultOptions,
            ...options,
        }

        this.setTextures()
        this.setMaterials()
        this.setModel()
        this.setDebug()
    }

    update() {
        this.smokeMaterial.uniforms.uTime.value = this.time.elapsed
    }

    setTextures() {
        this.perlinTexture = this.resources.items.perlinNoiseTexture
        this.perlinTexture.wrapS = THREE.RepeatWrapping
        this.perlinTexture.wrapT = THREE.RepeatWrapping
    }

    setMaterials() {
        this.smokeMaterial = new THREE.ShaderMaterial({
            vertexShader: teaSmokeVertexShader,
            fragmentShader: teaSmokeFragmentShader,
            side: THREE.DoubleSide,
            // wireframe: true,
            depthWrite: false, // do not occlude anything behind it, including itself
            transparent: true,
            fog: true,
            uniforms: {
                ...THREE.UniformsLib['fog'],
                uPerlinTexture: new THREE.Uniform(this.perlinTexture),
                uTime: new THREE.Uniform(0),

                // Smoke
                uSmokeColor: new THREE.Uniform(
                    new THREE.Color(this.options.smokeColor)
                ),
                uSmokeStretchX: new THREE.Uniform(this.options.smokeStretchX),
                uSmokeStretchY: new THREE.Uniform(this.options.smokeStretchY),
                uSmokeSpeed: new THREE.Uniform(this.options.smokeSpeed),

                // Wind
                uTwistFrequency: new THREE.Uniform(this.options.twistFrequency),
                uTwistIntensity: new THREE.Uniform(this.options.twistIntensity),
                uTwistSpeed: new THREE.Uniform(this.options.twistSpeed),
                uWindStrength: new THREE.Uniform(this.options.windStrength),
                uWindSpeed: new THREE.Uniform(this.options.windSpeed),
            },
        })

        this.waterMaterial = new THREE.MeshBasicMaterial({
            color: this.options.waterColor,
            reflectivity: 1.0,
        })
    }

    setModel() {
        this.mesh.material = this.waterMaterial
        this.sceneGroup.add(this.mesh)

        this.smoke = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1, 16, 64),
            this.smokeMaterial
        )
        this.smoke.geometry.scale(0.7, 3, 1)
        this.smoke.position.copy(this.mesh.position)
        this.smoke.position.y += 1.5
        this.smoke.rotation.y = -Math.PI * 0.5
        this.sceneGroup.add(this.smoke)
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('☕️ Tea Smoke').close()

            this.debugFolder.add(this.smokeMaterial, 'wireframe')
            this.debugFolder
                .add(this.smoke.rotation, 'y', 0, Math.PI * 2.0)
                .name('Rotation')

            this.debugFolder
                .addColor(this.options, 'waterColor')
                .onChange(() => {
                    this.waterMaterial.color.set(this.options.waterColor)
                })

            this.debugFolder
                .addColor(this.options, 'smokeColor')
                .onChange(() => {
                    this.smokeMaterial.uniforms.uSmokeColor.value.set(
                        this.options.smokeColor
                    )
                })
            this.debugFolder
                .add(
                    this.smokeMaterial.uniforms.uSmokeStretchX,
                    'value',
                    0,
                    2,
                    0.1
                )
                .name('Smoke Stretch X')
            this.debugFolder
                .add(
                    this.smokeMaterial.uniforms.uSmokeStretchY,
                    'value',
                    0,
                    2,
                    0.1
                )
                .name('Smoke Stretch Y')
            this.debugFolder
                .add(
                    this.smokeMaterial.uniforms.uSmokeSpeed,
                    'value',
                    0,
                    0.1,
                    0.001
                )
                .name('Smoke Speed')

            this.debugFolder
                .add(this.smokeMaterial.uniforms.uTwistFrequency, 'value', 0, 1)
                .name('Twist Frequency')
            this.debugFolder
                .add(
                    this.smokeMaterial.uniforms.uTwistIntensity,
                    'value',
                    0,
                    20
                )
                .name('Twist Intensity')
            this.debugFolder
                .add(this.smokeMaterial.uniforms.uTwistSpeed, 'value', 0, 0.1)
                .name('Twist Speed')
            this.debugFolder
                .add(this.smokeMaterial.uniforms.uWindStrength, 'value', 0, 20)
                .name('Wind Strength')
            this.debugFolder
                .add(this.smokeMaterial.uniforms.uWindSpeed, 'value', 0, 0.1)
                .name('Wind Speed')
        }
    }
}
