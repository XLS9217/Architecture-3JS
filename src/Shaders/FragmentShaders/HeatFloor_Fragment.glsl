uniform sampler2D uTexture;
varying vec2 vUv;

void main(){
    vec4 color = texture2D(uTexture, vUv);

    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}