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

let instance = null
let modelLoader = null

//props inside scene
let points = null
let tags = []


export default class ShenZhen_MainDisplay extends SceneGraph{

    constructor(inputScene){
        super()
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        /**
         * Start creating scene
         */
        
        this.scene = inputScene;
        this.interactiveModelManager = new InteractiveModelMangaer()
        this.controlManager = new ControlsManager()
        console.log(this)
    }

    loadScene(){
        console.log("loading main display")
        
        this.controlManager.switch2PointerLock()

        this.interactiveModelManager.clearSceneData()
        //Scene Props
        this.CreateLights()
        this.CreateModels()
        this.Create2DPoints()
    }

    unloadScene(){
        this.controlManager.switch2Orbit()
    }

    CreateLights(){
        /**
         * Lights
         */
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xfffff0, 2.0)
        directionalLight.position.set(-175, 122, -4)
        directionalLight.target.position.set(191,-55,-38)
        directionalLight.castShadow = true 
        directionalLight.shadow.mapSize.set(512, 512)
        directionalLight.shadow.camera.scale.x = 40
        directionalLight.shadow.camera.scale.y = 50
        console.log(directionalLight.shadow.camera)
        this.scene.add(directionalLight)
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
                child.castShadow = true
                child.receiveShadow = true
            })

        })
        modelLoader.Load2Scene('models/sz_display/', 'main_diaplay_interactives', 'glb',(modelPtr) => {
            console.log(modelPtr)
            modelPtr = modelPtr;
        
            modelPtr.scale.set(5,5,5)
            modelPtr.position.y += 15
            modelPtr.position.x += 17
            
            modelPtr.traverse((child)=>{
                let tokens = child.name.split('_');
                //console.log(child.name)

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
                if(tokens[0] == 'Interactives'){
                    child.material =  new THREE.MeshStandardMaterial({ color: 0x000000 , opacity: 0.0, transparent: true});
                }
                else if(tokens[0] == 'Camera'){
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
        floor.position.y = -53
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