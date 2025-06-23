export default class Controls {
    constructor() {
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
        this.pointer.deltaTemp = { x: 0, y: 0 }
        this.pointer.delta = { x: 0, y: 0 }

        this.addPointerEventListener()
    }

    addPointerEventListener() {
        window.addEventListener('pointerdown', (event) => {
            this.pointer.down = true
            // console.log('pointerdown')
        })

        window.addEventListener('pointermove', (event) => {
            this.pointer.deltaTemp.x += event.movementX
            this.pointer.deltaTemp.y += event.movementY
            // console.log('pointermove')
        })

        window.addEventListener('pointerup', () => {
            this.pointer.down = false
            // console.log('pointerup')
        })
    }

    update() {
        // Update pointer
        this.pointer.delta.x = this.pointer.deltaTemp.x
        this.pointer.delta.y = this.pointer.deltaTemp.y

        this.pointer.deltaTemp.x = 0
        this.pointer.deltaTemp.y = 0
    }
}
