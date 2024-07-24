
uniform vec3 uBaseColor;
uniform vec3 uTagPosition;
varying vec3 vNormal;

uniform float uTime;
uniform float uYGap;
uniform float uFadeValue;

uniform bool uIsSelected;

varying vec4 vModelPosition;
varying mat4 vModelMatrix;

float simpleRandom(vec2 value){
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123); //always 0~1 need to -0.5
}

void main(){
    vec3 color = uBaseColor/ 2.0;
    float alpha = 1.0;
    
    float constFadeValue = uFadeValue;
    vec3 worldTagPos = (vModelMatrix * vec4(uTagPosition,1.0)).xyz;
    float fadeFromTop = worldTagPos.y - vModelPosition.y;

    // float yGapPattern = mod(vModelPosition.y + uTime, uYGap);
    // alpha = yGapPattern;

    alpha = clamp(0.3, 0.8, alpha);

    vec3 downward = vec3(0.0, 1.0, 0.0);
    float dotNormalDown = dot(vNormal, downward);
    float cos10deg = cos(radians(10.0));

    //behaviour of face on side
    if(uIsSelected){
        alpha = (sin(uTime * 2.5) + 1.0) / 2.0 + 0.25;
    }

    //behavior on the face on top
    if(dotNormalDown > cos10deg){
        if(uIsSelected){
            color = vec3(0.0,0.0,0.0);
        }else{
            color = uBaseColor/ 2.0;
        }
        alpha = 0.95;
    }

    //the glich effect
    // float glitchGap = 3.0;
    // if(uIsSelected){
    //     glitchGap *= 2.0;
    //     color *= mod(gl_FragCoord.x + uTime, glitchGap);
    // }else{
    //     color *= mod(gl_FragCoord.y, glitchGap);
    // }
    


    gl_FragColor = vec4(color , alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}