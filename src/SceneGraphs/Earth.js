/**
 * This is a test scene that only load few model
 */
import ModelLoader from "../Utils/ModelLoader";
import * as THREE from 'three'
import { gsap } from 'gsap'
import InteractiveModelMangaer from "../Utils/InteractiveModelMangaer";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import FloatTag2D from "../2DElements/FloatTag2D";
import { element } from "three/examples/jsm/nodes/Nodes.js";
import SceneGraph from "./SceneGraph";
import SceneManager from "../Utils/SceneManager";
import infoPanel from "../2DElements/InfoPanel";


import earthVertexShader from "../Shaders/VertexShaders/Earth_Vertex.glsl"
import earthFragmentShader from "../Shaders/FragmentShaders/Earth_Fragment.glsl"
import earthatmosVertexShader from "../Shaders/VertexShaders/EarthAtmos_Vertex.glsl"
import earthatmosFragmentShader from "../Shaders/FragmentShaders/EarthAtmos_Fragment.glsl"
import SceneCameraManager from "../Utils/CameraManager";
import ControlsManager from "../Utils/ControlsManager";

let instance = null
let modelLoader = null
let textureLoader = new THREE.TextureLoader()
let sceneCameraManager = new SceneCameraManager()

//props inside scene
let points = null
let tags = []
let models = []

function latLongToVector3(lat, lon, radius) {
    // Convert latitude and longitude to spherical coordinates
    const phi = (90 - lat) * (Math.PI / 180);  // Convert latitude to radians
    const theta = (lon) * (Math.PI / 180);     // Convert longitude to radians

    // Create a Spherical object
    const spherical = new THREE.Spherical(radius, phi, theta);

    // Convert to Cartesian coordinates
    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);

    return position;
}


let shanghaiLoc = latLongToVector3(31.2304, 121.4737, 2.0);
tags.push(new FloatTag2D({
    textContent: "上海校区", 
    position: latLongToVector3(31.2304, 121.4737, 2.1) , 
    customFunction: ()=>{

    let cameraPos = latLongToVector3(31.2304, 121.4737, 3.5);
    sceneCameraManager.hopToPosition(cameraPos.x, cameraPos.y, cameraPos.z)

    let controlsManager = new ControlsManager()
    controlsManager.lerpToOrbitTarget(0,0,0)

    infoPanel.showInfoPanel({    
        textContent: '由世界著名建筑大师贝聿铭领衔创办的贝•柯•弗建筑设计师事务所设计的上海校园堪称全球商学院中最美丽、最具特色的校园之一。',
        title: '上海校区',
        buttonName: '前往',
        pictureAddress: 'pictures/ShanghaiCampus.jpg',
        buttonFunction: () => {
            let sceneManager = new SceneManager()
            sceneManager.LoadScene('ShanghaiMain')
        }
    })
}})) 

let beijingLoc = latLongToVector3(39.9042, 116.4074, 2.0);
tags.push(new FloatTag2D({
    textContent: "北京校区", 
    position: latLongToVector3(39.9042, 116.4074, 2.1) , 
    customFunction: ()=>{

    let cameraPos = latLongToVector3(39.9042, 116.4074, 3.5);
    sceneCameraManager.hopToPosition(cameraPos.x, cameraPos.y, cameraPos.z)

    let controlsManager = new ControlsManager()
    controlsManager.lerpToOrbitTarget(0,0,0)

    infoPanel.showInfoPanel({    
        textContent: '中欧国际工商学院北京校区由西班牙知名设计公司IDOM设计, 坐落于被誉为“中国硅谷”的北京中关村软件园，营造出开放、共享的交流氛围，为课程创造了一流的教学环境，也为校友提供了一个永久的家园。',
        title: '北京校区',
        buttonName: '前往',
        pictureAddress: 'pictures/BeijingCampus.jpg',
        buttonFunction: () => {
            console.log('404 there is no scene for this campus');
        }
    })
}})) 

let shenzhenLoc = latLongToVector3(22.5431, 114.0579, 2.0);
tags.push(new FloatTag2D({
    textContent: "深圳校区", 
    position: latLongToVector3(22.5431, 114.0579, 2.1) , 
    customFunction: ()=>{

    let cameraPos = latLongToVector3(22.5431, 114.0579, 3.5);
    sceneCameraManager.hopToPosition(cameraPos.x, cameraPos.y, cameraPos.z)

    let controlsManager = new ControlsManager()
    controlsManager.lerpToOrbitTarget(0,0,0)

    infoPanel.showInfoPanel({    
        textContent: '中欧国际工商学院深圳校区地处粤港澳大湾区最核心区域，环境设计崇尚人与自然的和谐共生。深圳校区为华南地区快速发展的中资企业和跨国公司培养了大批国际化高级经营管理人才。',
        title: '深圳校区',
        buttonName: '前往',
        pictureAddress: 'pictures/ShenzhenCampus.jpg',
        buttonFunction: () => {
            let sceneManager = new SceneManager()
            sceneManager.LoadScene('Arch')
        }
    })
}})) 


export default class Earth extends SceneGraph{

    constructor(inputScene){
        super(inputScene)
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        //console.log(this)
        this.debug_folder
    }

    GenerateLight(){
        console.log('do not generate light for earth')
    }

    loadScene(){
        this.debug_folder = window.debug_ui.addFolder('Earth');
        console.log("loading earth")
        super.loadScene()
        gsap.to(this.scene, {
            duration: 1.5,
            backgroundBlurriness: 1.0,
            backgroundIntensity: 0.0
        })
    }

    
    unloadScene(){
        infoPanel.destroy()
        this.debug_folder.destroy();
    }

    Create2DPoints(){
        
        for(const element of tags){
            //element.hide()
            this.scene.add(element.getLabel())
        }
        /**
         * Points
         */
        points = [
   
        ]
    }

    CreateModels(){

        const earthParameters = {}
        earthParameters.atmosphereDayColor = '#709bff'
        earthParameters.atmosphereTwilightColor = '#a30b00'

        const earthDayTexture = textureLoader.load('./textures/earth/day.jpg')
        earthDayTexture.colorSpace = THREE.SRGBColorSpace
        earthDayTexture.anisotropy = 8

        const earthNightTexture = textureLoader.load('./textures/earth/night.jpg')
        earthNightTexture.colorSpace = THREE.SRGBColorSpace
        earthDayTexture.anisotropy = 8

        const earthSpecularCloudsTexture = textureLoader.load('./textures/earth/specularClouds.jpg')

        // Mesh
        const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
        const earthMaterial = new THREE.ShaderMaterial({
            vertexShader: earthVertexShader,
            fragmentShader: earthFragmentShader,
            uniforms:
            {
                uDayTexture: new THREE.Uniform(earthDayTexture),
                uNightTexture: new THREE.Uniform(earthNightTexture),
                uSpecularClouds: new THREE.Uniform(earthSpecularCloudsTexture),
                uSunDirection: new THREE.Uniform(new THREE.Vector3(0,0,1)),
                uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
                uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor)),

                uCloudRange: new THREE.Uniform(0.5)
            }
        })
        const earth = new THREE.Mesh(earthGeometry, earthMaterial)
        this.scene.add(earth)
        earth.rotation.y = Math.PI * 1.5

        this.debug_folder
            .add(earthMaterial.uniforms.uCloudRange, 'value')
            .min(0)
            .max(0.5)
            .name('cloud range')


        // Atmosphere
        const atmosphereMaterial = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            transparent: true,
            vertexShader: earthatmosVertexShader,
            fragmentShader: earthatmosFragmentShader,
            uniforms:
            {
                uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
                uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
                uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
            },
        })

        const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial)
        atmosphere.scale.set(1.05,1.05,1.05)
        this.scene.add(atmosphere)

        atmosphere.rotation.y = Math.PI * 1.5

        this.debug_folder
            .addColor(earthParameters, 'atmosphereDayColor')
            .onChange(() =>
            {
                earthMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
                atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
            })
    
        this.debug_folder
            .addColor(earthParameters, 'atmosphereTwilightColor')
            .onChange(() =>
            {
                earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
                atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
            })

        /**
         * Sun
         */
        const sunSpherical = new THREE.Spherical(1, 1.4765485471872 , 1.1686724671354)
        const sunDirection = new THREE.Vector3()

        const debugSun = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.1, 2),
            new THREE.MeshBasicMaterial()
        )
        this.scene.add(debugSun)

        const updateSun = () => {
            sunDirection.setFromSpherical(sunSpherical);

            debugSun.position
                .copy(sunDirection)
                .multiplyScalar(5)

            earthMaterial.uniforms.uSunDirection.value.copy(sunDirection)
            atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection)
        }
        updateSun()
        //Tweaks
        this.debug_folder
            .add(sunSpherical, 'phi')
            .min(0)
            .max(Math.PI * 2)
            .onChange(updateSun)
        this.debug_folder
            .add(sunSpherical, 'theta')
            .min(0)
            .max(Math.PI* 2)
            .onChange(updateSun)


        //generate 3 balls for 3 positions
        const geometry = new THREE.SphereGeometry(0.015, 8, 8);
        const material = new THREE.MeshBasicMaterial({
             color: 0x880808,
             //wireframe: true
            });

        const shanghaiSphere = new THREE.Mesh(geometry, material);
        this.scene.add(shanghaiSphere)
        shanghaiSphere.position.set(shanghaiLoc.x, shanghaiLoc.y, shanghaiLoc.z)
        shanghaiSphere.name = 'TagIgnore'

        const beijingSphere = new THREE.Mesh(geometry, material);
        this.scene.add(beijingSphere)
        beijingSphere.position.set(beijingLoc.x, beijingLoc.y, beijingLoc.z)
        beijingSphere.name = 'TagIgnore'

        const shenzhenSphere = new THREE.Mesh(geometry, material);
        this.scene.add(shenzhenSphere)
        shenzhenSphere.position.set(shenzhenLoc.x, shenzhenLoc.y, shenzhenLoc.z)
        shenzhenSphere.name = 'TagIgnore'


        let axisHelper = new THREE.AxesHelper(100)
        this.scene.add(axisHelper)
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        camera.position.set(2.5908305488761316,1.5796517004673807,-1.3387671837256307)
    }

    isSceneReady(){
        return true
    }

    getPoints(){
        return points;
    }

    getTags(){
        return tags;
    }
}