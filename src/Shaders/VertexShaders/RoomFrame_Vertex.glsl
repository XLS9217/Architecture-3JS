varying vec4 vModelPosition;
varying mat4 vModelMatrix;
varying vec3 vNormal;

void main(){
    vNormal = normalize(normalMatrix * normal);
    vNormal = normal;

    vModelPosition = modelMatrix * vec4(position, 1.0);
    vModelMatrix = modelMatrix;
    gl_Position = projectionMatrix * viewMatrix * vModelPosition;
}