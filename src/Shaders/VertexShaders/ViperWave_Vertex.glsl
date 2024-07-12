uniform float uTime;
uniform float uWaveStrength;

varying vec2 vUv;
varying vec4 vWorldPosition;

void main() {

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    vec4 finialWorldPosition = worldPosition;

    //verying bounding
    vUv = uv;
    vWorldPosition = worldPosition;

    //vertex positioning
    float waveStrength = uWaveStrength;
    finialWorldPosition.y += sin(worldPosition.x + uTime) * waveStrength;
    finialWorldPosition.y += sin(worldPosition.z + uTime) * waveStrength * 1.5;


    gl_Position = projectionMatrix * viewMatrix * finialWorldPosition;
}