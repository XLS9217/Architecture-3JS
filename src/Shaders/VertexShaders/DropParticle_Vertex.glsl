
uniform vec2 uResolution;
uniform vec2 uWindDirection;
uniform float uWindStrength;
uniform float uSize;
uniform float uTime;  
uniform float uCeil;  
uniform float uFloor;  

attribute float aSize;
attribute float aSpeed;

void main()
{
    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //position after dropping over time
    float fallingProcess = mod(modelPosition.y - uTime * aSpeed, uCeil - uFloor);//the lower the smaller
    modelPosition.y = uFloor + fallingProcess;
    modelPosition.xz += uWindDirection * ((uCeil - uFloor) - fallingProcess) * uWindStrength;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Final Size
    gl_PointSize = uSize * uResolution.y * aSize;
    gl_PointSize *= 1.0 / - viewPosition.z;
}