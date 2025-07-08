export default [
    // Room
    {
        name: 'roomModel',
        type: 'gltfModel',
        path: 'models/Room/Room.glb',
    },
    {
        name: 'roomPlainTextureSunrise',
        type: 'texture',
        path: 'models/Room/RoomPlain-sunrise.webp',
    },
    {
        name: 'roomPlainTextureDaylight',
        type: 'texture',
        path: 'models/Room/RoomPlain-daylight.webp',
    },
    {
        name: 'roomPlainTextureSunset',
        type: 'texture',
        path: 'models/Room/RoomPlain-sunset.webp',
    },
    {
        name: 'roomPlainTextureNight',
        type: 'texture',
        path: 'models/Room/RoomPlain-night.webp',
    },
    {
        name: 'roomPatternTextureSunrise',
        type: 'texture',
        path: 'models/Room/RoomPattern-sunrise.webp',
    },
    {
        name: 'roomPatternTextureDaylight',
        type: 'texture',
        path: 'models/Room/RoomPattern-daylight.webp',
    },
    {
        name: 'roomPatternTextureSunset',
        type: 'texture',
        path: 'models/Room/RoomPattern-sunset.webp',
    },
    {
        name: 'roomPatternTextureNight',
        type: 'texture',
        path: 'models/Room/RoomPattern-night.webp',
    },

    // Cottage
    {
        name: 'cottageModel',
        type: 'gltfModel',
        path: 'models/Cottage/Cottage.glb',
    },
    {
        name: 'cottageTextureSunrise',
        type: 'texture',
        path: 'models/Cottage/Cottage-sunrise.webp',
    },
    {
        name: 'cottageTextureDaylight',
        type: 'texture',
        path: 'models/Cottage/Cottage-daylight.webp',
    },
    {
        name: 'cottageTextureSunset',
        type: 'texture',
        path: 'models/Cottage/Cottage-sunset.webp',
    },
    {
        name: 'cottageTextureNight',
        type: 'texture',
        path: 'models/Cottage/Cottage-night.webp',
    },

    // Environment
    {
        name: 'environmentModel',
        type: 'gltfModel',
        path: 'models/Environment/Environment.glb',
    },
    {
        name: 'environmentTextureSunrise',
        type: 'texture',
        path: 'models/Environment/Environment-sunrise.webp',
    },
    {
        name: 'environmentTextureDaylight',
        type: 'texture',
        path: 'models/Environment/Environment-daylight.webp',
    },
    {
        name: 'environmentTextureSunset',
        type: 'texture',
        path: 'models/Environment/Environment-sunset.webp',
    },
    {
        name: 'environmentTextureNight',
        type: 'texture',
        path: 'models/Environment/Environment-night.webp',
    },

    // Terrain
    {
        name: 'terrainModel',
        type: 'gltfModel',
        path: 'models/Terrain/Terrain.glb',
    },
    {
        name: 'terrainTextureSunrise',
        type: 'texture',
        path: 'models/Terrain/Terrain-sunrise.webp',
    },
    {
        name: 'terrainTextureDaylight',
        type: 'texture',
        path: 'models/Terrain/Terrain-daylight.webp',
    },
    {
        name: 'terrainTextureNight',
        type: 'texture',
        path: 'models/Terrain/Terrain-night.webp',
    },
    {
        name: 'terrainTextureSunset',
        type: 'texture',
        path: 'models/Terrain/Terrain-sunset.webp',
    },

    // Coins
    {
        name: 'coinModel',
        type: 'gltfModel',
        path: 'models/Coin/Coin.glb',
    },
    {
        name: 'specialCoinModel',
        type: 'gltfModel',
        path: 'models/Coin/SpecialCoin.glb',
    },

    // Other Textures
    {
        name: 'glassTexture',
        type: 'texture',
        path: 'textures/Glass/glass_block_normal.jpg',
    },
    {
        name: 'glassFrostedBaseTexture',
        type: 'texture',
        path: 'textures/GlassFrosted/Surface_Imperfection_001_basecolor.jpg',
    },
    {
        name: 'glassFrostedNormalTexture',
        type: 'texture',
        path: 'textures/GlassFrosted/Surface_Imperfection_001_normal.jpg',
    },
    {
        name: 'environmentMapTexture',
        type: 'exrTexture',
        path: 'textures/EnvironmentMap/aerial-canadian-mountain-sunset_1K.exr',
    },
    {
        name: 'environmentMapTexture2',
        type: 'rgbeTexture',
        path: 'textures/EnvironmentMap/spaichingen_hill_1k.hdr',
    },
    {
        name: 'perlinNoiseTexture',
        type: 'texture',
        path: 'textures/Noise/perlin.png',
    },

    // Images to fill Room Wall Frames
    {
        name: 'artImage0',
        type: 'texture',
        path: 'textures/Arts/0.jpg',
    },
    {
        name: 'artImage1',
        type: 'texture',
        path: 'textures/Arts/1.jpg',
    },
    {
        name: 'artImage2',
        type: 'texture',
        path: 'textures/Arts/2.jpg',
    },
    {
        name: 'artImage3',
        type: 'texture',
        path: 'textures/Arts/3.jpg',
    },
    {
        name: 'artImage4',
        type: 'texture',
        path: 'textures/Arts/4.jpg',
    },
    {
        name: 'artImage5',
        type: 'texture',
        path: 'textures/Arts/5.jpg',
    },

    // Sound Effects
    {
        name: 'jumpSound',
        type: 'audio',
        path: './sounds/jump.mp3',
    },
    {
        name: 'coinSound',
        type: 'audio',
        path: './sounds/coin.mp3',
    },
    {
        name: 'walkOnGrassSound',
        type: 'audio',
        path: './sounds/walk-on-grass.mp3',
    },
    {
        name: 'walkOnWoodSound',
        type: 'audio',
        path: './sounds/walk-on-wood.mp3',
    },
    {
        name: 'swimSound',
        type: 'audio',
        path: './sounds/swim.mp3',
    },
    {
        name: 'underwaterSound',
        type: 'audio',
        path: './sounds/underwater.mp3',
    },
    {
        name: 'insectSound',
        type: 'audio',
        path: './sounds/summer-insects.mp3',
    },
    {
        name: 'jazzSound',
        type: 'audio',
        path: './sounds/jazz-piano.mp3',
    },
    {
        name: 'selectSound',
        type: 'audio',
        path: './sounds/select.mp3',
    },
]
