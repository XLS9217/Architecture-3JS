uniform vec3 uAnchorPosition;
uniform float uTime;
uniform bool uHovering;

void main()
{
    vec4 worldPosition = viewMatrix * modelMatrix * vec4(position, 1.0);

    if(uHovering) worldPosition.y += sin(uTime * 2.0) + 0.5;
    

    gl_Position = projectionMatrix * worldPosition;
}