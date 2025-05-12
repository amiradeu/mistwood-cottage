export const CycleNames = {
    SUNRISE: 'sunrise',
    DAYLIGHT: 'daylight',
    SUNSET: 'sunset',
    NIGHT: 'night',
}

export const CycleTextures = {
    sunrise: {
        roomBig: 'roomBigTextureSunrise',
        roomSmall: 'roomSmallTextureSunrise',
        cottage: 'cottageTextureSunrise',
        environment: 'environmentTextureSunrise',
        terrain: 'terrainTextureSunrise',
    },
    daylight: {
        roomBig: 'roomBigTextureDaylight',
        roomSmall: 'roomSmallTextureDaylight',
        cottage: 'cottageTextureDaylight',
        environment: 'environmentTextureDaylight',
        terrain: 'terrainTextureDaylight',
    },
    sunset: {
        roomBig: 'roomBigTextureSunset',
        roomSmall: 'roomSmallTextureSunset',
        cottage: 'cottageTextureSunset',
        environment: 'environmentTextureSunset',
        terrain: 'terrainTextureSunset',
    },
    night: {
        roomBig: 'roomBigTextureNight',
        roomSmall: 'roomSmallTextureNight',
        cottage: 'cottageTextureNight',
        environment: 'environmentTextureNight',
        terrain: 'terrainTextureNight',
    },
}

export const CycleEmissions = {
    sunrise: {
        room: {
            kitchen: true,
        },
        cottage: {
            front: false,
            back: true,
        },
        environment: {
            streets: false,
        },
    },
    daylight: {
        room: {
            kitchen: false,
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
            kitchen: false,
        },
        cottage: {
            front: false,
            back: false,
        },
        environment: {
            streets: false,
        },
    },
    night: {
        room: {
            kitchen: true,
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
