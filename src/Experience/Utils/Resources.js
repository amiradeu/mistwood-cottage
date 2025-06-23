import { TextureLoader, CubeTextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'

import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'

export default class Resources extends EventEmitter {
    constructor(sources) {
        super()

        this.experience = new Experience()

        // Options
        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}

        this.loaders.dracoLoader = new DRACOLoader()
        this.loaders.dracoLoader.setDecoderPath('draco/')
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)

        this.loaders.textureLoader = new TextureLoader()
        this.loaders.cubeTextureLoader = new CubeTextureLoader()
        this.loaders.rgbeLoader = new RGBELoader()
        this.loaders.exrLoader = new EXRLoader()
    }

    startLoading() {
        // Loop each source
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        // console.log(source, file)
                        this.sourceLoaded(source, file)
                    },
                    () => {},
                    (error) => {
                        console.error(`Model "${source.path}" not found.`)
                        console.error(error)
                    }
                )
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        // console.log(source, file)
                        this.sourceLoaded(source, file)
                    },
                    () => {},
                    (error) => {
                        console.error(`Texture "${source.path}" not found.`)
                        console.error(error)
                    }
                )
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(source.path, (file) => {
                    // console.log(source, file)
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'rgbeTexture') {
                this.loaders.rgbeLoader.load(source.path, (file) => {
                    // console.log(source, file)
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'exrTexture') {
                this.loaders.exrLoader.load(source.path, (file) => {
                    // console.log(source, file)
                    this.sourceLoaded(source, file)
                })
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file

        this.loaded++
        this.trigger('loading')

        if (this.loaded === this.toLoad) {
            // console.log('Resources ready')
            this.trigger('ready')
        }
    }
}
