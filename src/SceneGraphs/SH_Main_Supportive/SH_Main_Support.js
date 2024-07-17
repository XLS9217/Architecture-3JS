
import * as THREE from 'three'

let textureLoader = new THREE.TextureLoader()

export function hexToVector3(hex) {
    // Extract the red, green, and blue components from the hex color
    const r = ((hex >> 16) & 0xFF) / 255;
    const g = ((hex >> 8) & 0xFF) / 255;
    const b = (hex & 0xFF) / 255;
    
    // Create and return the THREE.Vector3 object
    return new THREE.Vector3(r, g, b);
}

export function createUtilButton(exitToFunction, imgName) {
    // Create the exit button
    const exitButton = document.createElement('button');
    exitButton.style.position = 'fixed';
    exitButton.style.top = '50%'; 
    exitButton.style.right = '0px'; 
    exitButton.style.transform = 'translateY(-50%)'; 
    exitButton.style.zIndex = '999'; 
    exitButton.style.border = '3px solid black'
    exitButton.style.borderRadius = '50%'; 
    exitButton.style.width = '40px'; 
    exitButton.style.height = '40px'; 
    exitButton.style.background = '#ffcc00aa'; 
    exitButton.style.opacity = 0.0;

    // Create the img element inside the button
    const exitImg = document.createElement('img');
    exitImg.src = 'Icons/' + imgName; 
    exitImg.style.width = '100%'; 
    exitImg.style.height = '100%'; 
    exitImg.style.borderRadius = '50%'; 

    // Append the img element to the button
    exitButton.appendChild(exitImg);

    // Add event listener
    exitButton.addEventListener('click', exitToFunction);

    return exitButton;
}


export function ManuallyConfigLight( scene ){
    // Initialize the directional light===========================================================================

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4.47);
    directionalLight.position.set(424,240,-100);
    directionalLight.target.position.set(268, 58, -20);
    directionalLight.castShadow = true;

    // Adjust the shadow camera properties
    directionalLight.shadow.camera.left = -400;
    directionalLight.shadow.camera.right = 250;
    directionalLight.shadow.camera.top = 250;
    directionalLight.shadow.camera.bottom = -250;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 500;

    // Set the shadow camera's position and orientation to match the light
    directionalLight.shadow.camera.position.copy(directionalLight.position);
    directionalLight.shadow.camera.lookAt(directionalLight.target.position);

    // Update the camera helper to reflect changes
    directionalLight.shadow.camera.updateProjectionMatrix();
    let lighthelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    //this.scene.add(this.lighthelper);//helper here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    scene.add(directionalLight);
    scene.add(directionalLight.target);

    // // Create lil-gui folder
    // const lightFolder = window.debug_ui.addFolder('Directional Light');

    // // Add controls for light color
    // lightFolder.addColor({ color: directionalLight.color.getHex() }, 'color').onChange((value) => {
    //     directionalLight.color.set(value);
    // });

    // // Add controls for light intensity
    // lightFolder.add(directionalLight, 'intensity', 0, 10);

    // // Add controls for light position
    // const lightPositionFolder = lightFolder.addFolder('Position');
    // lightPositionFolder.add(directionalLight.position, 'x', -1000, 1000).onChange(() => updateShadowCamera(directionalLight));
    // lightPositionFolder.add(directionalLight.position, 'y', -1000, 1000).onChange(() => updateShadowCamera(directionalLight));
    // lightPositionFolder.add(directionalLight.position, 'z', -1000, 1000).onChange(() => updateShadowCamera(directionalLight));

    // // Add controls for light target position
    // const lightTargetFolder = lightFolder.addFolder('Target Position');
    // lightTargetFolder.add(directionalLight.target.position, 'x', -1000, 1000).onChange(() => updateShadowCamera(directionalLight));
    // lightTargetFolder.add(directionalLight.target.position, 'y', -1000, 1000).onChange(() => updateShadowCamera(directionalLight));
    // lightTargetFolder.add(directionalLight.target.position, 'z', -1000, 1000).onChange(() => updateShadowCamera(directionalLight));

    // // Function to update the shadow camera when the light or target position changes
    // function updateShadowCamera(light) {
    //     light.shadow.camera.position.copy(light.position);
    //     light.shadow.camera.lookAt(light.target.position);
    //     light.shadow.camera.updateProjectionMatrix();
    //     //this.lighthelper.update();
    // }

    // Initialize the ambient light
    const ambientLight = new THREE.AmbientLight(0xfff7e5, 1.15); // color and intensity
    scene.add(ambientLight);

    // // Create lil-gui folder for ambient light
    // const ambientLightFolder = window.debug_ui.addFolder('Ambient Light');

    // // Add controls for ambient light color
    // ambientLightFolder.addColor({ color: ambientLight.color.getHex() }, 'color').onChange((value) => {
    //     ambientLight.color.set(value);
    // });

    // // Add controls for ambient light intensity
    // ambientLightFolder.add(ambientLight, 'intensity', 0, 10);
}


/**
 * Shader code
 */

let clearColor = 0xffffff

export const perlinNoise = `
    //	Classic Perlin 2D Noise 
    //	by Stefan Gustavson
    //

    vec4 permute(vec4 x)
    {
        return mod(((x*34.0)+1.0)*x, 289.0);
    }

    vec2 fade(vec2 t)
    {
        return t*t*t*(t*(t*6.0-15.0)+10.0);
    }

    float cnoise(vec2 P)
    {
        vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
        Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyww;
        vec4 i = permute(permute(ix) + iy);
        vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
        vec4 gy = abs(gx) - 0.5;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;
        vec2 g00 = vec2(gx.x,gy.x);
        vec2 g10 = vec2(gx.y,gy.y);
        vec2 g01 = vec2(gx.z,gy.z);
        vec2 g11 = vec2(gx.w,gy.w);
        vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
        g00 *= norm.x;
        g01 *= norm.y;
        g10 *= norm.z;
        g11 *= norm.w;
        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));
        vec2 fade_xy = fade(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
        return 2.3 * n_xy;
    }
`

export function BasePlaneInjection(child){
    child.material.transparent = false
    child.renderOrder = 1
    child.position.y -= 2
    child.material.onBeforeCompile = (shader) => {
        // Add custom uniforms
        shader.uniforms.uDistance = { value: 1000.0 };
        //window.debug_ui.add(shader.uniforms.uDistance, 'value').min(0.0).max(1000,0).step(1.0).name('dist')
        shader.uniforms.uClearColor = { value: new THREE.Color(clearColor) };
    
        // Inject custom varying variables into the vertex shader
        shader.vertexShader = `
            varying vec3 vPosition;
            varying vec2 vUv;
    
            ${shader.vertexShader}
        `;
    
        // Replace the main shader function to include custom logic
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            vUv = uv;
            #include <begin_vertex>
            `
        );
    
        // Inject custom uniforms and varying variables into the fragment shader
        shader.fragmentShader = `
            uniform float uDistance;
            uniform vec3 uClearColor;
    
            varying vec3 vPosition;
            varying vec2 vUv;
    
            ${shader.fragmentShader}
        `;
    
        // Replace the main shader function to include custom logic
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            float distFactor = clamp(distance(vPosition, vec3(0.0, 0.0, 0.0)) / uDistance, 0.0 , 1.0);
            vec3 finalColor = mix(gl_FragColor.rgb, uClearColor, distFactor);
    
            gl_FragColor = vec4(finalColor, 1.0);
            #include <dithering_fragment>
            `
        );
    };
}

export function LakeInjection(child){


    // Create the video element
    // const video = document.createElement('video');
    // video.src = 'CEIBS_SH/Other/waterTextureVideo.mp4'; // Path to your video file
    // video.loop = true;
    // video.muted = true; // Mute the video to allow autoplay
    // video.crossOrigin = 'anonymous';
    // video.play();
    // video.playbackRate = 0.4; 

    // // Create the video texture
    // const videoTexture = new THREE.VideoTexture(video);
    // videoTexture.repeat.set(0.004, 0.004);
    // videoTexture.wrapS = THREE.RepeatWrapping;
    // videoTexture.wrapT = THREE.RepeatWrapping;

    // child.material = new THREE.MeshStandardMaterial({ map: videoTexture });

    // child.material.onBeforeCompile = (shader) => {
    //     shader.fragmentShader = shader.fragmentShader.replace(
    //         '#include <dithering_fragment>',
    //         `
    //         gl_FragColor.xyz *= 0.5;
    //         gl_FragColor.b += 0.1;
    //         #include <dithering_fragment>
    //         `
    //     );
    // }


    //add the water pbr
    let waterTexture = textureLoader.load('/CEIBS_SH/Water_001_SD/Water_001_COLOR.jpg')

    waterTexture.repeat.set(0.004, 0.004)
    waterTexture.wrapS = THREE.MirroredRepeatWrapping;
    waterTexture.wrapT = THREE.MirroredRepeatWrapping;

    child.material = new THREE.MeshStandardMaterial({
        map: waterTexture
    });

}

export function GrassInjection(child){
    child.material.onBeforeCompile = (shader) => {
        shader.uniforms.uGrassHue = new THREE.Uniform(0.56)
        //window.debug_ui.add(shader.uniforms.uGrassHue, 'value').min(0.0).max(1.0).step(0.01).name('GrassHue')
        shader.fragmentShader = `
            uniform float uGrassHue;
            ${shader.fragmentShader}
        `;

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            gl_FragColor.xyz *= uGrassHue;
            #include <dithering_fragment>
            `
        );
    }
}

