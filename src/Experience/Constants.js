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
