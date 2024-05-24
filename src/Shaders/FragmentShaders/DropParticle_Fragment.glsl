
uniform int uType;

vec4 SnowShape(){
    // Diffuse
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = 1.0 - strength;

    vec4 outputColor = vec4(vec3(strength), strength);
    return outputColor;
}

vec4 RainShape(){
    
    vec4 outputColor = vec4(0.5, 0.5, 0.5 , 0.5);
    

    float strength = distance(gl_PointCoord, vec2( 0.5 , clamp(gl_PointCoord.y, 0.25, 0.75)));
    strength *= 8.0;
    strength = 1.0 - strength;

    outputColor = vec4(vec3(strength), 0.6);

    return outputColor;
}

void main()
{

    vec4 fragColor = vec4(1.0,0.5,0.5, 0.5);//default

    //snow
    if(uType == 0){
        fragColor = SnowShape();
    }
    //rain
    if(uType == 1){
        fragColor = RainShape();
    }

    // Final color
    gl_FragColor = fragColor;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>


}