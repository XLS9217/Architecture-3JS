uniform vec3 uColor;
varying vec4 vPosition;
uniform vec3 uAnchorPosition;

void main(){

    float anchorDistance = distance(vPosition.xz,uAnchorPosition.xz) / 100.0;
    //gl_FragColor = vec4(uColor, 1.0);
    gl_FragColor = vec4(vec3(anchorDistance), 1.0);
    
}