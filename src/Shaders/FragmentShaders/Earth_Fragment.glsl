uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularClouds;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

uniform float uCloudRange;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    //sun orientation
    //vec3 uSunDirection = vec3(0.0, 0.0, 1.0);
    float sunOrientation = dot(uSunDirection, normal);
    // color = vec3(sunOrientation);

    //day/night color
    float dayMix = smoothstep(-0.25,0.5,sunOrientation);
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    color = mix(nightColor, dayColor, dayMix);  

    //specular clouds
    vec2 specularCloudsColor = texture(uSpecularClouds, vUv).rg;
    //color = vec3(specularCloudsColor, 1.0);

    //clouds
    //float cloudsMix = smoothstep(0.5,1.0,specularCloudsColor.g);
    float cloudsMix = smoothstep(uCloudRange, 1.0 ,specularCloudsColor.g);
    cloudsMix *= dayMix;
    color = mix(color, vec3(1.0), cloudsMix);

    //fresnel
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel,2.0);

    //atmosphere
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    //color = vec3(atmosphereDayMix);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color = mix(color, atmosphereColor, atmosphereDayMix * fresnel);

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}