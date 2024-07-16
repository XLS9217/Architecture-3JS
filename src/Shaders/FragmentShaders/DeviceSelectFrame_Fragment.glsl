

uniform float uTime;
uniform vec3 uBaseColor;
uniform vec3 uMixColor;

varying vec2 vUv;

void main(){

    vec3 finalColor = mix(uBaseColor , vec3(vUv.x / 1.5 , 0.75 , vUv.y / 1.5) , sin(uTime * 2.0)/2.0 + 1.0);


    gl_FragColor = vec4(finalColor ,1.0);
}