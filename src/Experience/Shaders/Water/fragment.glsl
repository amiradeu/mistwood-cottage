// Water Shader by Dan Greenheck (https://github.com/dgreenheck/threejs-water-shader/tree/main)
precision highp float;

uniform float uOpacity;

uniform vec3 uTroughColor;
uniform vec3 uSurfaceColor;
uniform vec3 uPeakColor;

uniform float uPeakThreshold;
uniform float uPeakTransition;
uniform float uTroughThreshold;
uniform float uTroughTransition;

uniform float uFresnelScale;
uniform float uFresnelPower;

varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform samplerCube uEnvironmentMap;

void main() {
  // Calculate vector from camera to the vertex
  vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
  vec3 reflectedDirection = reflect(viewDirection, vNormal);
  reflectedDirection.x = -reflectedDirection.x;

  // Sample environment map to get the reflected color
  vec4 reflectionColor = textureCube(uEnvironmentMap, reflectedDirection);

  // Calculate fresnel effect
  float fresnel = uFresnelScale * pow(1.0 - clamp(dot(viewDirection, vNormal), 0.0, 1.0), uFresnelPower);

  // Calculate elevation-based color
  float elevation = vWorldPosition.y;

  // Calculate transition factors using smoothstep
  float peakFactor = smoothstep(uPeakThreshold - uPeakTransition, uPeakThreshold + uPeakTransition, elevation);
  float troughFactor = smoothstep(uTroughThreshold - uTroughTransition, uTroughThreshold + uTroughTransition, elevation);

  // Mix between trough and surface colors based on trough transition
  vec3 mixedColor1 = mix(uTroughColor, uSurfaceColor, troughFactor);

  // Mix between surface and peak colors based on peak transition 
  vec3 mixedColor2 = mix(mixedColor1, uPeakColor, peakFactor);

  // Mix the final color with the reflection color
  vec3 finalColor = mix(mixedColor2, reflectionColor.rgb, fresnel);

  gl_FragColor = vec4(finalColor, uOpacity);
}