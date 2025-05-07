export const CycleNames = {
    SUNRISE: 'sunrise',
    DAYLIGHT: 'daylight',
    SUNSET: 'sunset',
    NIGHT: 'night',
}

export const CycleTextures = {
    daylight: {
        roomBig: 'roomBigTextureDaylight',
        roomSmall: 'roomSmallTextureDaylight',
        cottage: 'cottageTextureDaylight',
        environment: 'environmentTextureDaylight',
        base: 'baseTextureDaylight',
        land: 'landTextureDaylight',
        mountain: 'mountainTextureDaylight',
    },
    sunrise: {
        roomBig: 'roomBigTextureSunrise',
        roomSmall: 'roomSmallTextureSunrise',
        cottage: 'cottageTextureSunrise',
        environment: 'environmentTextureSunrise',
        base: 'baseTextureSunrise',
        land: 'landTextureSunrise',
        mountain: 'mountainTextureSunrise',
    },
    sunset: {
        roomBig: 'roomBigTextureSunset',
        roomSmall: 'roomSmallTextureSunset',
        cottage: 'cottageTextureSunset',
        environment: 'environmentTextureSunset',
        base: 'baseTextureSunset',
        land: 'landTextureSunset',
        mountain: 'mountainTextureSunset',
    },
    night: {
        roomBig: 'roomBigTextureNight',
        roomSmall: 'roomSmallTextureNight',
        cottage: 'cottageTextureNight',
        environment: 'environmentTextureNight',
        base: 'baseTextureNight',
        land: 'landTextureNight',
        mountain: 'mountainTextureNight',
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
            streets: true,
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
