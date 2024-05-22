import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
)
camera.position.set(0, 0, 18)
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
renderer.setClearColor('#181818')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Particles
 */
const parameters = {}
parameters.count = 1000

// const particlesGeometry = new THREE.PlaneGeometry(10, 10, 64, 64)
const particlesGeometry = new THREE.BufferGeometry()
const count = 64
const positions = new Float32Array(count * 3)
// const colors = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
    const i3 = i * 3

    positions[i3] = (Math.random() - 0.5) * 10
    positions[i3 + 1] = (Math.random() - 0.5) * 10
    positions[i3 + 2] = 0
    // colors[i] = Math.random()
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

// particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.4,
    sizeAttenuation: true,
    color: '#fa01bc',
    alphaMap: textureLoader.load('./arrow.png'),
    transparent: true,
})
// const particlesMaterial = new THREE.ShaderMaterial({
//     vertexShader: ArrowsVertexShader,
//     fragmentShader: ArrowsFragmentShader,
//     uniforms: {
//         uResolution: new THREE.Uniform(
//             new THREE.Vector2(
//                 sizes.width * sizes.pixelRatio,
//                 sizes.height * sizes.pixelRatio
//             )
//         ),
//         uPictureTexture: new THREE.Uniform(textureLoader.load('./glow.png')),
//     },
// })
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
