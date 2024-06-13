#define NUM_HEAT_POSITIONS 20

uniform sampler2D uTexture;
uniform vec3 uHeatPositions[NUM_HEAT_POSITIONS];
uniform float uHeatDensitys[NUM_HEAT_POSITIONS];
uniform int uPointsNumber;

varying vec2 vUv;
varying vec4 vPosition;

void main() {

    //define texture color for origional texture
    vec4 textureColor = texture2D(uTexture, vUv);

    //define color for different heat ring
    vec4 baseColor = textureColor;
    vec4 ring2_green = vec4(0.01, 0.5, 0.01, 1.0);
    vec4 ring0_red = vec4(0.9, 0.0, 0.0, 1.0);
    vec4 ring1_yellow = vec4(1.0, 0.8, 0.0, 1.0);

    vec4 color = baseColor;
    float density = 0.0;
    float globalFactor = 0.0;

    //calculate the globalfactor based on distance to each heatpoint on xz plane
    for (int i = 0; i < uPointsNumber; i++) {

        density = uHeatDensitys[i];
        float dist = distance(vPosition.xyz, uHeatPositions[i].xyz);
        float factor = 1.0 - dist / density;
        factor = clamp(factor, 0.0, 1.0);

        globalFactor += factor;
    }

    //reverse the globalfactor so there is no edge
    globalFactor = 1.0 - globalFactor;

    //calcualte the fade
    float redFade = smoothstep(0.05, 0.5, globalFactor);
    color = mix(ring0_red, ring1_yellow, redFade);  

    float greenFade = smoothstep(0.2, 0.9 , globalFactor);
    color = mix(color, ring2_green, greenFade);

    float baseFade = smoothstep(0.8, 1.0, globalFactor);
    color = mix(color, baseColor, baseFade);


    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
