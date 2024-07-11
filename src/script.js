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
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0,
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width
    cursor.y = event.clientY / sizes.height
    // console.log(cursor.x, cursor.y)
})

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(10).step(0.1).name('Ambient')

// Directional Light
const directionalLight = new THREE.DirectionalLight('#ff0000', 1.8)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)
gui.add(directionalLight, 'intensity')
    .min(0)
    .max(10)
    .step(0.1)
    .name('Directional')

const directionalLight2 = new THREE.DirectionalLight('#000dff', 1.8)
directionalLight2.position.set(-1, -1, 0)
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
camera.position.set(0, 0, 0.8)
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
renderer.setClearColor('#1e1e1e')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Balls
 */
const parameters = {}
parameters.balls = 1
parameters.scale = 0.2

const ballGeometry = new THREE.SphereGeometry(1, 64, 64)

const colorTexture = textureLoader.load('./metal/02/basecolor.jpg')
colorTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping
colorTexture.repeat.x = 2
colorTexture.repeat.y = 1

const heightTexture = textureLoader.load('./metal/02/height.jpg')
heightTexture.wrapS = THREE.RepeatWrapping
heightTexture.wrapT = THREE.RepeatWrapping
heightTexture.repeat.x = 2
heightTexture.repeat.y = 1

const aoTexture = textureLoader.load('./metal/02/ambientOcclusion.jpg')
aoTexture.wrapS = THREE.RepeatWrapping
aoTexture.wrapT = THREE.RepeatWrapping
aoTexture.repeat.x = 2
aoTexture.repeat.y = 1

const metalnessTexture = textureLoader.load('./metal/02/metallic.jpg')
metalnessTexture.wrapS = THREE.RepeatWrapping
metalnessTexture.wrapT = THREE.RepeatWrapping
metalnessTexture.repeat.x = 2
metalnessTexture.repeat.y = 1

const roughnessTexture = textureLoader.load('./metal/02/roughness.jpg')
roughnessTexture.wrapS = THREE.RepeatWrapping
roughnessTexture.wrapT = THREE.RepeatWrapping
roughnessTexture.repeat.x = 2
roughnessTexture.repeat.y = 1

const normalTexture = textureLoader.load('./metal/02/normal.jpg')
normalTexture.wrapS = THREE.RepeatWrapping
normalTexture.wrapT = THREE.RepeatWrapping
normalTexture.repeat.x = 2
normalTexture.repeat.y = 1

const alphaTexture = textureLoader.load('./metal/02/opacity.jpg')
alphaTexture.wrapS = THREE.RepeatWrapping
alphaTexture.wrapT = THREE.RepeatWrapping
alphaTexture.repeat.x = 2
alphaTexture.repeat.y = 1

const ballMaterial = new THREE.MeshStandardMaterial({
    color: '#fcfcfc',
    // transparent: true,
    side: THREE.DoubleSide,
    // wireframe: true,

    metalness: 1.0,
    roughness: 1.0,

    // color map
    map: colorTexture,

    // use the red channel
    aoMap: aoTexture,
    aoMapIntensity: 1,

    // affect the vertices of mesh vertices
    displacementMap: heightTexture,
    displacementScale: 0.02,

    metalnessMap: metalnessTexture,
    roughnessMap: roughnessTexture,

    // change the way color is lit
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(0.5, 0.5),

    // grayscale texture: black transparent -> white opaque
    alphaMap: alphaTexture,
})

// const ball = new THREE.Mesh(ballGeometry, ballMaterial)
// ball.scale.set(parameters.scale, parameters.scale, parameters.scale)
// scene.add(ball)
const balls = []

const ball = new THREE.Mesh(ballGeometry, ballMaterial)
ball.scale.set(parameters.scale, parameters.scale, parameters.scale)
balls.push(ball)
scene.add(ball)

// for (let i = -parameters.balls; i < parameters.balls; i++) {
//     for (let j = -parameters.balls; j < parameters.balls; j++) {
//         const ball = new THREE.Mesh(ballGeometry, ballMaterial)
//         ball.position.x = i
//         ball.position.y = j
//         ball.scale.set(parameters.scale, parameters.scale, parameters.scale)
//         balls.push(ball)
//         scene.add(ball)
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
    balls.forEach((ball) => {
        ball.material.envMap = envMap
    })
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Rotate object
    balls.forEach((ball) => {
        // ball.rotation.x = Math.PI * cursor.y * 1.0
        // ball.rotation.y = Math.PI * cursor.x * 1.0
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again for the next frame
    window.requestAnimationFrame(tick)
}

tick()
