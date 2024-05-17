varying vec4 vPosition;
uniform vec3 uAnchorPosition;

void main(){
    
    vec4 worldPosition = viewMatrix * modelMatrix * vec4(position, 1.0);    

    gl_Position = projectionMatrix * worldPosition;
    vPosition =  modelMatrix * vec4(position, 1.0);
}