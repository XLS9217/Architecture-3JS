#define NUM_HEAT_POSITIONS 20

uniform sampler2D uTexture;
uniform float uDistance;
varying mat4 vModelMatrix;

uniform vec3 uHeatPosition;
uniform vec3 uHeatPositions[NUM_HEAT_POSITIONS];
uniform int uPointsNumber;

varying vec2 vUv;
varying vec4 vPosition;

void main(){
    //vec4 color = texture2D(uTexture, vUv);

    vec4 baseColor = vec4(0.01, 0.5, 0.01, 1.0);
    vec4 color = baseColor;
    //float dist = distance(vPosition.xz, uHeatPosition.xz);
    float dist = distance(vPosition.xz, uHeatPositions[uPointsNumber].xz);

    // Use a quadratic falloff
    float density = uDistance;
    float factor = dist / density;
    factor = clamp(factor, 0.0 , 1.0);

    //colors
    vec4 ring0_red = vec4(0.9, 0.0, 0.0, 1.0);
    vec4 ring1_yellow = vec4(0.9, 0.9, 0.0, 1.0);

    //color = mix(ring0_red, baseColor, factor);

    float redFade = smoothstep(0.1, 0.8, factor);
    color = mix(ring0_red, ring1_yellow, redFade);

    float greenFade = smoothstep(0.5, 1.0, factor);
    color = mix(color, baseColor, greenFade);

    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}