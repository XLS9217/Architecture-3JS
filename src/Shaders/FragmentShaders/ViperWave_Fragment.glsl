varying vec2 vUv;
varying vec4 vWorldPosition;

void main() {

    vec3 color = vec3(vUv, 1.0);
    float alpha = 1.0;

    //value that forms the grid
    float gridIndicator = step(0.9, mod(vUv.y * 100.0, 1.0));
    gridIndicator += step(0.95, mod(vUv.x * 100.0, 1.0));
    alpha *= gridIndicator;

    //value that make grid fades by distance
    float maxDistance = 200.0;
    float fadeFactor = (maxDistance - distance(vWorldPosition.xz , vec2(0.0))) / maxDistance;
    alpha *= fadeFactor;


    gl_FragColor = vec4(color, alpha);
}