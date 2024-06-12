uniform sampler2D uTexture;
uniform vec3 uHeatPosition;
uniform float uDistance;
varying mat4 vModelMatrix;

varying vec2 vUv;
varying vec4 vPosition;

void main(){
    //vec4 color = texture2D(uTexture, vUv);
    //vec2 quickFixOffsetXZ = vec2(-19.79, 2.02);

    vec4 baseColor = vec4(0.01, 0.5, 0.01, 1.0);
    vec4 color = baseColor;
    float dist = distance(vPosition.xz, uHeatPosition.xz);
    //float dist = distance(vPosition.xz, vec2(0.0, 0.0));

    // Use a quadratic falloff
    float density = uDistance;
    float factor = 1.0 - dist/ density;
    factor = clamp(factor, 0.0 , 1.0);
    factor = factor * factor ; 

    //colors
    vec4 ring0_red = vec4(0.9, 0.0, 0.0, 1.0);
    vec4 ring1_yellow = vec4(0.9, 0.9, 0.0, 1.0);

    color = mix(baseColor, ring0_red, factor);

    // // Adjust the transition range
    // if (factor > 0.75) {
    //     // Red to yellow transition
    //     color = mix(ring1_yellow, ring0_red, (factor - 0.75) / 0.25);
    // } else {
    //     // Base color to red transition
    //     color = mix(baseColor, ring1_yellow, factor / 0.75);
    // }

    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}