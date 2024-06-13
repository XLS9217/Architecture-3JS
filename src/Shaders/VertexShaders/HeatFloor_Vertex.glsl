varying vec2 vUv;
varying vec4 vPosition;


void main(){
    
    
    vec4 worldPosition = viewMatrix * modelMatrix * vec4(position, 1.0);  
    vPosition = modelMatrix* vec4(position, 1.0); 

    gl_Position = projectionMatrix * worldPosition;
    vUv = uv;
}