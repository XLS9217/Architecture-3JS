/**
 * This is a test scene that only load few model
 */
import ModelLoader from "../Utils/ModelLoader";
import * as THREE from 'three'
import InteractiveModelMangaer from "../Utils/InteractiveModelMangaer";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import FloatTag2D from "../2DElements/FloatTag2D";
import { element } from "three/examples/jsm/nodes/Nodes.js";
import SceneGraph from "./SceneGraph";
import SceneManager from "../Utils/SceneManager";
import ControlsManager from "../Utils/ControlsManager";
import SceneCameraManager from "../Utils/CameraManager";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import Canvas2D from "../Utils/Canvas2D";
import RealCameraManager from "../Utils/RealCameraManager";
let canvas2D = new Canvas2D()
const rgbeLoader = new RGBELoader()

let instance = null
let modelLoader = null

//props inside scene
let points = null
let tags = []


export default class ShenZhen_MainDisplay extends SceneGraph{

    constructor(inputScene){
        super(inputScene)
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        this.controlManager = new ControlsManager()
        console.log(this)
    }

    loadScene(){
        console.log("loading main display")
        
        this.controlManager.switch2PointerLock()

        super.loadScene()

    }

    unloadScene(){
        this.controlManager.switch2Orbit()

        // this.scene.background = null
        // this.scene.environment = null
    }

    CreateLights(){
        /**
         * Lights
         */
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        // this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xfffff0, 1.0)
        directionalLight.position.set(275, 90, 140)
        directionalLight.target.position.set(-191,-25,-100)
        directionalLight.castShadow = true 
        directionalLight.shadow.mapSize.set(1024, 1024)
        directionalLight.shadow.camera.scale.x = 40
        directionalLight.shadow.camera.scale.y = 50
        console.log(directionalLight.shadow.camera)
        this.scene.add(directionalLight)

        // const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // this.scene.add( helper );
    }

    Create2DPoints(){
        
        
        for(const element of tags){
            element.hide()
            this.scene.add(element.getLabel())
        }
        /**
         * Points
         */
        points = [

        ]
    }

    CreateModels(){
        /**
         * Building
         */

        //Loader
        modelLoader = new ModelLoader(this.scene)
        modelLoader.Load2Scene('models/sz_display/', 'main_display_solve', 'glb',(modelPtr) => {
            console.log(modelPtr)
            modelPtr = modelPtr;
        
            modelPtr.scale.set(5,5,5)
            modelPtr.position.y += 15
            modelPtr.position.x += 17
            
            modelPtr.traverse((child) => {
                if(child.isMesh && child.material.isMeshStandardMaterial)
                {
                    child.material.envMapIntensity = 0.4
                }

                child.castShadow = true
                child.receiveShadow = true
            })
            
        })
        modelLoader.Load2Scene('models/sz_display/', 'main_diaplay_advence_interactives', 'glb',(modelPtr) => {
            console.log(modelPtr)
            modelPtr = modelPtr;
        
            modelPtr.scale.set(5,5,5)
            modelPtr.position.y += 15
            modelPtr.position.x += 17
            
            modelPtr.traverse((child)=>{
                let tokens = child.name.split('_');
                console.log(child.name)
                //console.log(child.name)
                let invisiableMat = new THREE.MeshStandardMaterial({ color: 0x000000 , opacity: 0.0, transparent: true});
                if(tokens[0] == 'Anchor'){
                    let modelData = this.interactiveModelManager.addInteractiveModel(child)
                    //console.log(child)
                    modelData.memory = {
                        position: new THREE.Vector3() 
                    }

                    child.getWorldPosition(modelData.memory.position);

                    modelData.clickAction = (memory) =>{
                        //console.log(memory.position)
                        let cameraManager = new SceneCameraManager()
                        cameraManager.hopToPosition(
                            memory.position.x,
                            memory.position.y,
                            memory.position.z,
                        )
                    }
                }
                else if(tokens[0] == 'Interactives'){
                    child.material = invisiableMat
                }
                else if(tokens[0] == 'Camera'){
                    let modelData = this.interactiveModelManager.addInteractiveModel(child)
                    modelData.memory = {
                        isToggled: false
                    }

                    modelData.clickAction = (memory) => {
                        //console.log("open camera")

                        memory.isToggled = !memory.isToggled

                        const videoElement = document.getElementById('cameraFeed');

                        if( memory.isToggled )
                            //canvas2D.addDynamicLine("BaseCamera",child,new THREE.Vector2(window.innerWidth * 0.20, window.innerHeight * 0.70))
                            canvas2D.addDynamicLine("BaseCamera",child,videoElement)
                        else
                            canvas2D.removeDynamicLine("BaseCamera")
                        let realCameraManager = new RealCameraManager()
                        realCameraManager.ToggleSurveillanceCamera('shgbit_door')
                    }
                }
                else if(tokens[0] == 'Door'){
                    child.material = invisiableMat
                    let modelData = this.interactiveModelManager.addInteractiveModel(child)
                    modelData.clickAction = () => {
                        let sceneManager = new SceneManager()
                        sceneManager.LoadScene('Room')
                    }
                }
                else if(tokens[0] == 'DownStair'){
                    let modelData = this.interactiveModelManager.addInteractiveModel(child)
                }
            })
        })


        const axesHelper = new THREE.AxesHelper( 1000 );
        this.scene.add( axesHelper );
        

        /**
         * Floor
         */
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(6000, 6000),
            new THREE.MeshStandardMaterial({
                color: '#4F7942',
                metalness: 0.5,
                roughness: 0.9
            })
        )
        floor.receiveShadow = true
        floor.rotation.x = - Math.PI * 0.5
        floor.position.y = -43
        this.scene.add(floor)

        console.log(window.debug_ui)
        this.scene.fog = new THREE.Fog( 0xcccccc, 700, 1500 );
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        camera.position.set(0, 5, 24)
    }

    isSceneReady(){
        return modelLoader.isSceneReady()
    }

    getPoints(){
        return points;
    }

    getTags(){
        return tags;
    }
}