uniform float uTime;

varying vec2 vUv;

void main(){

    vec3 finalPosition = position;

    //swink and expand
    vec3 normalAway = normalize(position - vec3(0.0, 0.0, 0.0));
    finalPosition = normalAway * (sin(uTime * 2.0 )/2.5 + 2.0);
    
    // Construct the rotation matrix around the Y-axis
    float angle = uTime;
    mat3 rotationMatrix = mat3(
        cos(angle),   0.0,    sin(angle),
        0.0,          1.0,    0.0,       
        -sin(angle),  0.0,    cos(angle)
    );
    finalPosition = rotationMatrix * finalPosition;

    //up and down by time
    finalPosition.y += sin(uTime * 2.0) / 2.0;



    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(finalPosition, 1.0);

    //varying binding
    vUv = uv;
}