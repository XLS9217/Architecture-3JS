uniform float uTime;
uniform float uWaveStrength;
uniform float uMaxDistance;//changing
uniform float uWaveStillDistance;

varying vec2 vUv;
varying vec4 vWorldPosition;
varying float vGridDistFactor;
varying float vWaveStillFactor;


void main() {

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec4 finalWorldPosition = worldPosition;

    //verying bounding
    vUv = uv;
    vWorldPosition = worldPosition;

    //distance from origin
    float maxDistance = uMaxDistance;
    vGridDistFactor = (maxDistance - distance(vWorldPosition.xz , vec2(0.0))) / maxDistance;

    //distance to keep wave still
    vWaveStillFactor = clamp( 0.0, 1.0, distance(vWorldPosition.xz , vec2(0.0)) / uWaveStillDistance);
    vWaveStillFactor = pow(vWaveStillFactor, 2.0);

    //vertex positioning
    float waveStrength = uWaveStrength * (0.2 + vWaveStillFactor * 0.8);
    finalWorldPosition.y += sin(worldPosition.x + uTime) * waveStrength;
    finalWorldPosition.y += sin(worldPosition.z + uTime) * waveStrength * 1.5;

    //wave to the edge
    finalWorldPosition.y += vWaveStillFactor * 10.0;


    gl_Position = projectionMatrix * viewMatrix * finalWorldPosition;
}