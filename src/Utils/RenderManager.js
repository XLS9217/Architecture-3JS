/**
 * In charge of every render 3d 2d label
 * Also Post Processing
 */

import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/Addons.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import ControlsManager from './ControlsManager';

let renderManager = null;

export default class RendererManager {
    constructor( 
        canvas,
        scene,
        camera
     ) {
        if(renderManager){
            return renderManager
        }
        renderManager = this
        
        const rect = canvas.getBoundingClientRect();

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        })
        renderer.setClearColor(0x222222)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.setSize(rect.width, rect.height, false);//css transform fix
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.alpha = true; // Enable alpha blending
        renderer.sortObjects = true

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(rect.width, rect.height);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = `${rect.top}px`; // Adjust position
        labelRenderer.domElement.style.left = `${rect.left}px`; // Adjust position
        labelRenderer.domElement.style.pointerEvents = 'none';
        document.body.appendChild(labelRenderer.domElement);

        this.renderer = renderer
        this.labelRenderer = labelRenderer

        this.scene = scene
        this.camera = camera

        //mode enum
        this.Modes = {
            Normal: 'normal',
            Panorama: 'panorama',
            PostProcess: 'post_process',
            TempScene: 'temp_scene'
        }
        this.mode = this.Modes.Normal

        //panorama mode
        this.panoramaScene = new THREE.Scene()

        //temprary scene mode
        this.tempSceneClass = null
    }

    render(){
        if(this.mode == this.Modes.Normal){
            this.renderer.render(this.scene, this.camera)
            this.labelRenderer.render(this.scene, this.camera);
        }
        else if(this.mode == this.Modes.Panorama){
            this.renderer.render(this.panoramaScene, this.camera)
        }
        else if(this.mode == this.Modes.TempScene){
            this.renderer.render(this.tempSceneClass.scene, this.camera)
            this.tempSceneClass.update()
        }
        //something went wrong, set back to normal
        else{
            this.mode = this.Modes.Normal
        }
    }

    switch2TempScene(tempSceneClass){
        this.mode = this.Modes.TempScene
        this.tempSceneClass= tempSceneClass
    }

    switch2Normal(){
        this.labelRenderer.domElement.style.opacity = 1.0
        this.mode = this.Modes.Normal
        let controlsManager = new ControlsManager()
        controlsManager.switch2Orbit()
    }

    switch2Panorama(envMapUrl) {
        this.labelRenderer.domElement.style.opacity = 0.0

        const textureLoader = new THREE.TextureLoader();
        const rgbeLoader = new RGBELoader();
    
        // Determine the file extension
        const fileExtension = envMapUrl.split('.').pop().toLowerCase();
    
        // Use RGBELoader for HDR files, TextureLoader for others
        let loader;
        if (fileExtension === 'hdr' || fileExtension === 'rgbe') {
            loader = rgbeLoader;
        } else {
            loader = textureLoader;
        }
    
        loader.load(envMapUrl, (texture) => {

            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.panoramaScene.environment = texture;
            this.panoramaScene.background = texture;

            console.log('Environment map set successfully, switch to paanorama');
            this.mode = this.Modes.Panorama
            let controlsManager = new ControlsManager()
            controlsManager.switch2PointerLock()

        }, undefined, (error) => {
            console.error('An error occurred loading the environment map:', error);
        });
    }

}


// window.gui_obj.panorama = () =>
// {
//     instance.switch2Panorama('EnvMap/classroom_1_4k.jpg')
// }
// window.debug_ui.add(window.gui_obj, 'panorama').name('panorama')