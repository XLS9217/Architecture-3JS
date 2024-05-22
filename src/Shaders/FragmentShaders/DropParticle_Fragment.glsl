void main()
{

    // Diffuse
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = 1.0 - strength;

    // Final color
    gl_FragColor = vec4(vec3(strength), strength);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>


}