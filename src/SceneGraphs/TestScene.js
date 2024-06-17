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


export default class TestScene extends SceneGraph{

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
   
        ]
    }

    CreateModels(){
        modelLoader = new ModelLoader(this.scene)
        modelLoader.Load2Scene('models/obj_testRoom2/', 'testStructure', 'obj',(modelPtr) => {})

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

        let axisHelper = new THREE.AxesHelper(100)
        this.scene.add(axisHelper)
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        camera.position.set(-103, 143, 182)
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