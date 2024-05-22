varying vec2 vUv;

void main() {
    vec2 uv = gl_PointCoord;
    gl_FragColor = vec4(uv, 1.0, 1.0);
}