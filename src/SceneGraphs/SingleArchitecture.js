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




export default class SingleArchitecture extends SceneGraph{

    constructor(inputScene){
        super(inputScene)
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        //console.log(this)

    }

    loadScene(){
        console.log("loading single arch")
        super.loadScene()
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
            // {
            //     position: new THREE.Vector3(1.55, 0.3, - 0.6),
            //     element: document.querySelector('.point-0')
            // },
            // {
            //     position: new THREE.Vector3(0.5, 0.8, - 1.6),
            //     element: document.querySelector('.point-1')
            // },
            // {
            //     position: new THREE.Vector3(1.6, - 1.3, - 0.7),
            //     element: document.querySelector('.point-2')
            // },
            // {
            //     position: new THREE.Vector3(63, 9 , -7),
            //     element: document.querySelector('.green-house')
            // }
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
            architecture_shenzhen.position.set(300,20,200)
        
            let frameModel = null;
            let invisiableMat = new THREE.MeshBasicMaterial({color: 0x000000, transparent:true, opacity:0.01})
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
                    return
                }

                if(tokens[0] == 'l1' || tokens[0] == 'l2' || tokens[0] == 'l3' || tokens[0] == 'top'|| tokens[0] == 'a_ssg') return //quick fix

                child.castShadow = true
                child.receiveShadow = true
            })

        })
        

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
        floor.position.y = -33
        this.scene.add(floor)

        //console.log(window.debug_ui)
        this.scene.fog = new THREE.Fog( 0xcccccc, 700, 1500 );
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        camera.position.set(-130, 55, 189)
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