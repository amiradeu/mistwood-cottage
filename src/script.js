import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import gsap from 'gsap'

/**
 * Base
 */
// Debug
// const gui = new GUI({
//     width: 400,
// })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// RGBE Loader
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./envMap/night.hdr', (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = envMap
    scene.environment = envMap
})

/**
 * Fog
 */
const fog = new THREE.Fog(0x262837, 1, 100)
scene.fog = fog

/**
 * Textures
 */
const cottageTexture = textureLoader.load('./cottage/cottageBaked.jpg')
cottageTexture.flipY = false
cottageTexture.colorSpace = THREE.SRGBColorSpace

const earthTexture = textureLoader.load('./cottage/earthBaked.jpg')
earthTexture.flipY = false
earthTexture.colorSpace = THREE.SRGBColorSpace

const gardenTexture = textureLoader.load('./cottage/gardenBaked.jpg')
gardenTexture.flipY = false
gardenTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Materials
 */
// Cottage Baked Material
const cottageBakedMaterial = new THREE.MeshBasicMaterial({
    map: cottageTexture,
})

// Window Light Material
const windowLightMaterial = new THREE.MeshBasicMaterial({ color: 0xfefee4 })

// Pole Light Material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xfeee89 })

// test
// const wallTexture = textureLoader.load('./cottage/wallBaked.jpg')
// wallTexture.flipY = false
// wallTexture.colorSpace = THREE.SRGBColorSpace

// const wallBakedMaterial = new THREE.MeshBasicMaterial({ map: wallTexture })

// gltfLoader.load('cottage/wall.glb', (gltf) => {
//     gltf.scene.traverse((child) => {
//         console.log(child)
//         child.material = wallBakedMaterial
//     })
//     // scene.add(gltf.scene)
//     group.add(gltf.scene)
// })

/**
 * Cottage Model
 */
const group = new THREE.Group()

gltfLoader.load('cottage/cottage.glb', (gltf) => {
    // console.log('loaded')
    gltf.scene.traverse((child) => {
        // console.log(child)
        child.material = cottageBakedMaterial
    })

    const window1Mesh = gltf.scene.children.find(
        (child) => child.name === 'window_emission'
    )

    const window2Mesh = gltf.scene.children.find(
        (child) => child.name === 'window_emission_2'
    )

    const window3Mesh = gltf.scene.children.find(
        (child) => child.name === 'window_emission_3'
    )

    const window4Mesh = gltf.scene.children.find(
        (child) => child.name === 'window_emission_4'
    )

    const poleLightMesh = gltf.scene.children.find(
        (child) => child.name === 'door_lamp_emission'
    )

    window1Mesh.material = windowLightMaterial
    window2Mesh.material = windowLightMaterial
    window3Mesh.material = windowLightMaterial
    window4Mesh.material = windowLightMaterial
    poleLightMesh.material = poleLightMaterial

    // scene.add(gltf.scene)
    group.add(gltf.scene)
})

/**
 * Earth Model
 */
const earthBakedMaterial = new THREE.MeshBasicMaterial({ map: earthTexture })

gltfLoader.load('cottage/earth.glb', (gltf) => {
    gltf.scene.traverse((child) => {
        console.log(child)
        child.material = earthBakedMaterial
    })
    // scene.add(gltf.scene)
    group.add(gltf.scene)
})

/**
 * Garden Model
 */
const gardenBakedMaterial = new THREE.MeshBasicMaterial({ map: gardenTexture })
// console.log(gardenBakedMaterial)
gltfLoader.load('cottage/garden.glb', (gltf) => {
    gltf.scene.traverse((child) => {
        // console.log(child)
        child.material = gardenBakedMaterial
    })

    const poleLightEmission = gltf.scene.children.find(
        (child) => child.name === 'road_lamp_emission'
    )

    const poleLight2Emission = gltf.scene.children.find(
        (child) => child.name === 'road_lamp_emission001'
    )

    const poleLight3Emission = gltf.scene.children.find(
        (child) => child.name === 'road_lamp_emission002'
    )

    poleLightEmission.material = poleLightMaterial
    poleLight2Emission.material = poleLightMaterial
    poleLight3Emission.material = poleLightMaterial

    // scene.add(gltf.scene)
    group.add(gltf.scene)
})

// Stylized Cottage Group
group.position.y = -24
scene.add(group)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    500
)
camera.position.x = 27
camera.position.y = 14
camera.position.z = -37
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Animate Camera
    // group.rotation.y = elapsedTime * 0.01

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    // console.log(camera.position.x, camera.position.y, camera.position.z)
    // console.log(camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

updateCamera()

function updateCamera() {
    const positions = [
        {
            x: -28,
            y: -13,
            z: -26,
        },
        {
            x: 8,
            y: -7,
            z: -19,
        },
        {
            x: 29,
            y: -16,
            z: -32,
        },
    ]

    console.log('update camera')

    var tl = gsap.timeline()

    camera.lookAt(new THREE.Vector3(-100, 0, 0))
    camera.updateProjectionMatrix()
    // tl.to(camera.position, {
    //     duration: 1,
    //     delay: 1,
    //     x: positions[2].x,
    //     y: positions[2].y,
    //     z: positions[2].z,
    // })
    // tl.to(camera.lookAt, {
    //     duration: 1,
    //     delay: 1,
    //     x: -5,
    //     y: 0,
    //     z: 0,
    // })
}
