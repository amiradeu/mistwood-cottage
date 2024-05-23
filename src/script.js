import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

import ArrowsVertexShader from './shaders/Arrows/vertex.glsl'
import ArrowsFragmentShader from './shaders/Arrows/fragment.glsl'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const hdriLoader = new RGBELoader()

// Debug
const gui = new dat.GUI()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight('#ffffff', 2.4)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(10).step(0.1).name('Ambient')

// Directional Light
const directionalLight = new THREE.DirectionalLight('#ff0000', 1.8)
directionalLight.position.set(1, 1, 1)
scene.add(directionalLight)
gui.add(directionalLight, 'intensity')
    .min(0)
    .max(10)
    .step(0.1)
    .name('Directional')

const directionalLight2 = new THREE.DirectionalLight('#000dff', 1.8)
directionalLight2.position.set(-1, -1, -1)
scene.add(directionalLight2)
gui.add(directionalLight2, 'intensity')
    .min(0)
    .max(10)
    .step(0.1)
    .name('Directional')

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
)
camera.position.set(0, 0, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setClearColor('#ffffff')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Balls
 */
const parameters = {}
parameters.balls = 1
parameters.scale = 1

const balls = new THREE.Group()
scene.add(balls)

const ballGeometry = new THREE.SphereGeometry(1, 256, 256)
ballGeometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(ballGeometry.attributes.uv.array, 2)
)

const ballMaterial = new THREE.MeshStandardMaterial({
    color: '#fcfcfc',
    // transparent: true,
    side: THREE.DoubleSide,

    metalness: 1,
    roughness: 0.2,

    // color map
    map: textureLoader.load('./metal/02/basecolor.jpg'),

    // use the red channel
    aoMap: textureLoader.load('./metal/02/ambientOcclusion.jpg'),
    aoMapIntensity: 1,

    // affect the vertices of mesh vertices
    displacementMap: textureLoader.load('./metal/02/height.jpg'),
    displacementScale: 0.02,

    metalnessMap: textureLoader.load('./metal/02/metallic.jpg'),
    roughnessMap: textureLoader.load('./metal/02/roughness.jpg'),

    // change the way color is lit
    normalMap: textureLoader.load('./metal/02/normal.jpg'),
    normalScale: new THREE.Vector2(0.5, 0.5),

    // grayscale texture: black transparent -> white opaque
    alphaMap: textureLoader.load('./metal/02/opacity.jpg'),
})

const ball = new THREE.Mesh(ballGeometry, ballMaterial)
ball.scale.set(parameters.scale, parameters.scale, parameters.scale)
balls.add(ball)

// for (let i = -parameters.balls; i < parameters.balls; i++) {
//     for (let j = -parameters.balls; j < parameters.balls; j++) {
//         const ball = new THREE.Mesh(ballGeometry, ballMaterial)
//         ball.position.x = i
//         ball.position.y = j
//         ball.scale.set(parameters.scale, parameters.scale, parameters.scale)
//         balls.add(ball)
//     }
// }

/**
 * Environment Map
 */
const pmremGenerator = new THREE.PMREMGenerator(renderer)
hdriLoader.load('./environment/01.hdr', (texture) => {
    // console.log('success')
    const envMap = pmremGenerator.fromEquirectangular(texture).texture
    // console.log(envMap)
    texture.dispose()
    // scene.environment = envMap
    // scene.environmentIntensity = 0.4
    // scene.background = envMap
    ball.material.envMap = envMap
})

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again for the next frame
    window.requestAnimationFrame(tick)
}

tick()
