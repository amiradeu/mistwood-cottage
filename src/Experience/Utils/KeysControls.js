import EventEmitter from './EventEmitter.js'

export default class KeysControls extends EventEmitter {
    constructor() {
        super()

        this.setKeys()
        this.addEventListener()
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
    }

    /**
     * Finds a key in the map by code
     * Return
     */
    findKey(key) {
        return this.keys.map.find((mapItem) => mapItem.key.includes(key))
    }

    addEventListener() {
        window.addEventListener('keydown', (event) => {
            const mapItem = this.findKey(event.code)
            // console.log('keydown', event.code, mapItem)
            if (mapItem) {
                this.keys.down[mapItem.name] = true

                if (mapItem.name === 'jump') {
                    this.trigger('jump')
                }
            }
        })

        window.addEventListener('keyup', (event) => {
            const mapItem = this.findKey(event.code)

            if (mapItem) {
                this.keys.down[mapItem.name] = false
            }
        })
    }
}
