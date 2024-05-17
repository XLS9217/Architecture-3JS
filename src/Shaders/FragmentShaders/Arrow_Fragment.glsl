uniform vec3 uColor;
uniform float uTime;
uniform bool uHovering;

void main()
{
    float flashSpeed = 1.5;
    float timeColor =  mod(uTime, flashSpeed) / flashSpeed ;
    timeColor = 1.0 - (sin(uTime * 2.0) + 1.0) / 2.0;
    smoothstep(0.75, 1.0 , timeColor);
    if(!uHovering) timeColor = 0.0;
    gl_FragColor = vec4(vec3(timeColor + 0.5), timeColor );
}