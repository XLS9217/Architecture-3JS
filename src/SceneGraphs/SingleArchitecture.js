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

let instance = null
let modelLoader = null

//props inside scene
let points = null
let tags = []
let models = []

//tags.push(new FloatTag2D("main architecture",new THREE.Vector3(0,35,0)))
//tags[0].setBackgroundColor('#ff0000bb')

//for baking
const textureLoader = new THREE.TextureLoader()
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')


export default class SingleArchitecture extends SceneGraph{

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
        //console.log(this)
    }

    loadScene(){
        console.log("loading single arch")

        this.interactiveModelManager.clearSceneData()
        //Scene Props
        this.CreateLights()
        this.CreateModels()
        this.Create2DPoints()
        this.CreateEnvironmentMap()
    }

    CreateEnvironmentMap(){
        let sceneManager = new SceneManager();
        sceneManager.LoadEnvironmentMap('EnvMap/sky.hdr');
    }

    CreateLights(){
        /**
         * Lights
         */
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        // this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xfffff0, 2.0)
        directionalLight.position.set(275, 140, 140)
        directionalLight.target.position.set(-300,-50,-200)
        directionalLight.castShadow = true 
        directionalLight.shadow.mapSize.set(1024, 1024)
        directionalLight.shadow.camera.scale.x = 40
        directionalLight.shadow.camera.scale.z = 30
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
            {
                position: new THREE.Vector3(1.55, 0.3, - 0.6),
                element: document.querySelector('.point-0')
            },
            {
                position: new THREE.Vector3(0.5, 0.8, - 1.6),
                element: document.querySelector('.point-1')
            },
            {
                position: new THREE.Vector3(1.6, - 1.3, - 0.7),
                element: document.querySelector('.point-2')
            },
            {
                position: new THREE.Vector3(63, 9 , -7),
                element: document.querySelector('.green-house')
            }
        ]
    }

    CreateModels(){
        /**
         * Building
         */
        let architecture_shenzhen =  null;
        
        //Loader
        modelLoader = new ModelLoader(this.scene)
        modelLoader.Load2Scene('models/sz_simplify/', 'sz_whole_interactive', 'glb',(modelPtr) => {
            //console.log(modelPtr)
            architecture_shenzhen = modelPtr;
            architecture_shenzhen.scale.set(5,5,5)
            architecture_shenzhen.position.set(300,0,200)
        
            let frameModel = null;
            let invisiableMat = new THREE.MeshBasicMaterial({color: 0x000000, transparent:true, opacity:0.02})
            let blackMat = new THREE.MeshBasicMaterial({color: 0x000000})
            modelPtr.traverse((child) => {
                //console.log(child)
                //sceneManager.addInteractiveModel(child)
                const tokens = child.name.split("_");
                if(tokens[0] == 'interactive'){
                    //console.log("find interact " + child.name)
                    
                    if(tokens[1] == 'cube'){
                        child.material = invisiableMat
                        let interactOption = this.interactiveModelManager.addInteractiveModel(child)
                        interactOption.memory = {
                            frame: frameModel,
                            isLoading: false,//prevent user click multiple times
                        }
                        interactOption.clickAction = (memory) => {
                            if(memory.isLoading) return
                            console.log("click" + memory.frame.name)
                            let sceneManager = new SceneManager()
                            sceneManager.LoadScene(tokens[2])
                            memory.isLoading = true;
                        }
                        interactOption.hoverAction = (memory) => {
                            this.interactiveModelManager.setInteractiveModelMaterial( memory.frame, blackMat, false)
                        }
                    }
                    else if(tokens[1] == 'frame'){
                        frameModel = child
                        frameModel.material = invisiableMat
                        let interactOption = this.interactiveModelManager.addInteractiveModel(child)
                        interactOption.hoverAction = (memory) => {
                            
                        }
                    }
                    else{
                        child.castShadow = true
                        child.receiveShadow = true
                        child.material.envMapIntensity = 0.3
                    }
                    
                }
                child.castShadow = true
                child.receiveShadow = true
            })

        })
        
        models.push(architecture_shenzhen)

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


        const sphereShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(300,350),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                alphaMap: simpleShadow
            })
        )
        sphereShadow.rotation.x = - Math.PI * 0.5
        sphereShadow.position.x = 30
        sphereShadow.position.y = floor.position.y + 1
        this.scene.add(sphereShadow)

        console.log(window.debug_ui)
        this.scene.fog = new THREE.Fog( 0xcccccc, 700, 1500 );
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        camera.position.set(-124, 40, 220)
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