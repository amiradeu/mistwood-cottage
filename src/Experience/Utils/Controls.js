import Experience from '../Experience'
import EventEmitter from './EventEmitter'

export default class Controls extends EventEmitter {
    constructor() {
        super()
        this.experience = new Experience()
        this.sizes = this.experience.sizes

        this.setKeys()
        this.setPointer()
    }

    /**
     * Set up key codes and names for movement controls.
     * Stores key down states
     */
    setKeys() {
        this.keys = {}

        this.keys.map = [
            {
                key: ['ArrowUp', 'KeyW'],
                name: 'forward',
            },
            {
                key: ['ArrowDown', 'KeyS'],
                name: 'backward',
            },
            {
                key: ['ArrowLeft', 'KeyA'],
                name: 'left',
            },
            {
                key: ['ArrowRight', 'KeyD'],
                name: 'right',
            },
            {
                key: ['Space'],
                name: 'jump',
            },
        ]

        // Down Keys State
        this.keys.down = {}
        for (const item of this.keys.map) {
            this.keys.down[item.name] = false
        }

        this.addKeysEventListener()
    }

    /**
     * Finds a key in the map by code
     * Return
     */
    findKey(key) {
        return this.keys.map.find((mapItem) => mapItem.key.includes(key))
    }

    addKeysEventListener() {
        window.addEventListener('keydown', (event) => {
            const mapItem = this.findKey(event.code)
            // console.log('keydown', event.code, mapItem)
            if (mapItem) {
                this.keys.down[mapItem.name] = true
            }
        })

        window.addEventListener('keyup', (event) => {
            const mapItem = this.findKey(event.code)

            if (mapItem) {
                this.keys.down[mapItem.name] = false
            }
        })
    }

    /**
     * Pointer controls for mouse movement
     */
    setPointer() {
        this.pointer = {}
        this.pointer.down = false
        this.pointer.coordinate = { x: 0, y: 0 }
        this.pointer.deltaTemp = { x: 0, y: 0 }
        this.pointer.delta = { x: 0, y: 0 }

        // used to check if dragging happens
        this.pointer.start = { x: 0, y: 0 }
        this.pointer.end = { x: 0, y: 0 }

        this.addPointerEventListener()
    }

    addPointerEventListener() {
        window.addEventListener('pointerdown', (event) => {
            // console.log('pointerdown')
            this.pointer.down = true

            this.pointer.start.x = event.clientX
            this.pointer.start.y = event.clientY

            this.trigger('pointerdown')
        })

        window.addEventListener('pointermove', (event) => {
            // console.log('pointermove')
            this.pointer.deltaTemp.x += event.movementX
            this.pointer.deltaTemp.y += event.movementY

            // [-1, 1]
            this.pointer.coordinate.x =
                (event.clientX / this.sizes.width) * 2 - 1
            this.pointer.coordinate.y =
                -(event.clientY / this.sizes.height) * 2 + 1

            this.trigger('pointermove')
        })

        window.addEventListener('pointerup', (event) => {
            // console.log('pointerup')
            this.pointer.down = false

            this.pointer.end.x = event.clientX
            this.pointer.end.y = event.clientY

            this.trigger('pointerup')
        })
    }

    update() {
        // Update pointer
        this.pointer.delta.x = this.pointer.deltaTemp.x
        this.pointer.delta.y = this.pointer.deltaTemp.y

        this.pointer.deltaTemp.x = 0
        this.pointer.deltaTemp.y = 0

        // console.log(this.pointer.delta.x, this.pointer.delta.y)
    }
}
