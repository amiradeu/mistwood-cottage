export const CycleNames = {
    SUNRISE: 'sunrise',
    DAYLIGHT: 'daylight',
    SUNSET: 'sunset',
    NIGHT: 'night',
}

export const CycleTextures = {
    sunrise: {
        roomPattern: 'roomPatternTextureSunrise',
        roomPlain: 'roomPlainTextureSunrise',
        cottage: 'cottageTextureSunrise',
        environment: 'environmentTextureSunrise',
        terrain: 'terrainTextureSunrise',
    },
    daylight: {
        roomPattern: 'roomPatternTextureDaylight',
        roomPlain: 'roomPlainTextureDaylight',
        cottage: 'cottageTextureDaylight',
        environment: 'environmentTextureDaylight',
        terrain: 'terrainTextureDaylight',
    },
    sunset: {
        roomPattern: 'roomPatternTextureSunset',
        roomPlain: 'roomPlainTextureSunset',
        cottage: 'cottageTextureSunset',
        environment: 'environmentTextureSunset',
        terrain: 'terrainTextureSunset',
    },
    night: {
        roomPattern: 'roomPatternTextureNight',
        roomPlain: 'roomPlainTextureNight',
        cottage: 'cottageTextureNight',
        environment: 'environmentTextureNight',
        terrain: 'terrainTextureNight',
    },
}

export const CycleEmissions = {
    sunrise: {
        room: {
            bed: false,
            bedside: false,
            desk: false,
            kitchen: true,
            room: false,
        },
        cottage: {
            front: false,
            back: true,
        },
        environment: {
            streets: true,
        },
    },
    daylight: {
        room: {
            bed: false,
            bedside: false,
            desk: false,
            kitchen: false,
            room: false,
        },
        cottage: {
            front: false,
            back: false,
        },
        environment: {
            streets: false,
        },
    },
    sunset: {
        room: {
            bed: true,
            bedside: false,
            desk: false,
            kitchen: false,
            room: false,
        },
        cottage: {
            front: true,
            back: true,
        },
        environment: {
            streets: true,
        },
    },
    night: {
        room: {
            bed: true,
            bedside: true,
            desk: true,
            kitchen: false,
            room: true,
        },
        cottage: {
            front: true,
            back: true,
        },
        environment: {
            streets: true,
        },
    },
}
