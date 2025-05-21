uniform float uSize;
uniform float uPixelRatio;
uniform float uTime;
uniform float uMoveRatio;
uniform float uMoveSpeed;
uniform float uPathSize;
uniform float uFrequencyA;
uniform float uFrequencyB;

attribute float aRandomness;
attribute float aRandomMove;

varying float vRandomness;

vec2 lissajous(float t, float a, float b, float d)
{
	return vec2(sin(a*t+d), sin(b*t));
}

void main()
{
    vec3 newPosition = position;

    // base time input
    float t = uTime * uMoveSpeed + aRandomness * 6.2831;

    // Frequency multipliers for complexity
    float a = 3.0 + floor(aRandomness * uFrequencyA);
    float b = 2.0 + floor(aRandomness * uFrequencyB);
    float c = 1.5 + floor(aRandomness * 2.5);

    // Phase offset
    float delta = aRandomness * 3.14159; // phase difference (0 to π)

    // Path complexity
    float pathSize = uPathSize * aRandomness;

    // Control how many fireflies moves (0.0 = none, 1.0 = all)
    float moveEnabled = step(aRandomMove, uMoveRatio);

    // Lissajous Movement
    vec3 pos_lissajous = vec3(
        pathSize * sin(a * t + delta),
        pathSize * sin(b * t),
        0.2 * sin(c * t + delta * 0.5)
    );

    // Random Movement
    vec3 pos_random = vec3(
        pathSize * sin(a * 5.0 + t),
        pathSize * cos(a * 9.0 + t * 0.8),
        0.2 * sin(a * 12.0 + t * 0.5)
    );

    newPosition = newPosition + pos_lissajous;
    newPosition = mix(position, newPosition, moveEnabled);

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // size variation
    gl_PointSize = uSize * aRandomness;
    // scale point with window resize
    gl_PointSize *= uPixelRatio;
    // scale point with camera perspective
    gl_PointSize *= 1.0 / - viewPosition.z;

    vRandomness = aRandomness;
}