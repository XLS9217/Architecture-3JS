uniform vec3 uHeatPosition;
uniform float uDistance;

varying vec2 vUv;
varying vec4 vPosition;
varying mat4 vModelMatrix;


void main(){
    
    
    vec4 worldPosition = viewMatrix * modelMatrix * vec4(position, 1.0);  
    vPosition = modelMatrix* vec4(position, 1.0); 
    vModelMatrix = modelMatrix;

    gl_Position = projectionMatrix * worldPosition;
    vUv = uv;
}