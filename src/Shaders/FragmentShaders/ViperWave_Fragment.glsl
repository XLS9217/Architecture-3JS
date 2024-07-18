varying vec2 vUv;
varying vec4 vWorldPosition;
varying float vGridDistFactor;
varying float vWaveStillFactor;

void main() {

    vec3 color = vec3(vUv, 1.0);
    float alpha = 1.0;

    //value that forms the grid
    float gridIndicator = step(0.9, mod(vUv.y * 100.0, 1.0));
    gridIndicator += step(0.95, mod(vUv.x * 100.0, 1.0));
    alpha *= gridIndicator;

    //value that make grid fades by distance
    float maxDistance = 200.0;
    float fadeFactor = vGridDistFactor;
    alpha *= fadeFactor;

    alpha *= 0.75 + vWaveStillFactor * 0.25;

    gl_FragColor = vec4(color, alpha);
    //gl_FragColor = vec4(vec3(vWaveStillFactor), alpha);
}