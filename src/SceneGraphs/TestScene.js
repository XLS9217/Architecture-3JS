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
import AS_RoomDisplay from "../AdvenceScenes/AS_RoomDisplay";
import RendererManager from "../Utils/RenderManager";

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

        modelLoader.Load2Scene('CEIBS_SH/Unified_Parts/','CEIBS_Ground_Fix','glb', (modelPtr)=>{
            modelPtr.traverse((child) => {
                //console.log(child.name)
                child.receiveShadow = true
            })
        })


        
        //let classRoomDisplay = new AS_RoomDisplay('models/testModelsGLB/displayRoom.glb')
        let classRoomDisplay = new AS_RoomDisplay('CEIBS_SH/Room_Device/ClassroomDisplay.glb', 5.0)
        let rendererManager = new RendererManager()

        
        //classRoomDisplay.loadScene()
        let toggle = false;
        window.gui_obj.toggleRoomDisplay = () =>
        {
            if(toggle) classRoomDisplay.unloadScene()
            else classRoomDisplay.loadScene()
        
            toggle = !toggle
        }
        window.debug_ui.add(window.gui_obj, 'toggleRoomDisplay')

        


        /**
         * Plane
         */
         // Load the texture
         const textureLoader = new THREE.TextureLoader();
         const texture = textureLoader.load('pictures/BeijingCampus.jpg');

         // Create the plane geometry
         const geometry = new THREE.PlaneGeometry(5, 5);

         // Create the material with the loaded texture
         const material = new THREE.MeshBasicMaterial({ map: texture });

         // Create the mesh with the geometry and material
         const plane = new THREE.Mesh(geometry, material);
         plane.scale.set(10,10,10)
         plane.position.set(0,0,-100)

         // Add the plane to the scene
         this.scene.add(plane);


        // /**
        //  * Floor
        //  */
        // const floor = new THREE.Mesh(
        //     new THREE.PlaneGeometry(6000, 6000),
        //     new THREE.MeshStandardMaterial({
        //         color: '#4F7942',
        //         metalness: 0.5,
        //         roughness: 0.9
        //     })
        // )
        // floor.receiveShadow = true
        // floor.rotation.x = - Math.PI * 0.5
        // floor.position.y = -33
        // this.scene.add(floor)

        let axisHelper = new THREE.AxesHelper(500)
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