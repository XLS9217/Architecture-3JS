
uniform vec2 uResolution;
uniform vec2 uWindDirection;
uniform float uWindStrength;
uniform float uSize;
uniform float uTime;  
uniform float uCeil;  
uniform float uFloor;  
uniform int uType;

attribute float aSize;
attribute float aSpeed;

void main()
{
    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //position after dropping over time
    float fallingProcess = mod(modelPosition.y - uTime * aSpeed, uCeil - uFloor);//the lower the smaller
    float distFromSky = ((uCeil - uFloor) - fallingProcess);

    //snow
    if(uType == 0){
        modelPosition.y = uFloor + fallingProcess;
        modelPosition.xz += uWindDirection 
            * distFromSky //the lower the further
            * (uCeil - modelPosition.y)/50.0  //the lower the faster
            * uWindStrength 
            * aSize; //the biger the faster
        //modelPosition.xz -= uWindDirection * 50.0; //keep in center
    }
    //rain
    else if(uType == 1){
        modelPosition.y = uFloor + fallingProcess - distFromSky * 9.8 / 4.0;
        modelPosition.xz += uWindDirection
            * distFromSky //the lower the further
            ;
    }




    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Final Size
    gl_PointSize = uSize * uResolution.y * aSize;
    gl_PointSize *= 1.0 / - viewPosition.z;
}