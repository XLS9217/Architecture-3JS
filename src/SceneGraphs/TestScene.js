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
import SceneCameraManager from "../Utils/CameraManager";

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
        // modelLoader.Load2Scene('CEIBS_SH/Main/', 'CEIBS_SH_Shell2_s', 'glb',(modelPtr) => {
        //     modelPtr.traverse((child) => {

        //         //set camera
        //         if(child instanceof THREE.PerspectiveCamera){
        //             console.log(child)
        //             let cameraManager = new SceneCameraManager()
        //             cameraManager.hopToPosition(child.position.x, child.position.y, child.position.z)
        //             return
        //         }

        //         if (child.includes("Lake")) {
        //             console.log(child.name)
        //         }

                
        //     })
            
        // })

        modelLoader.Load2Scene('CEIBS_SH/Unified_Parts/','CEIBS_Ground_Fix','glb', (modelPtr)=>{
            modelPtr.traverse((child) => {
                //console.log(child.name)
                child.receiveShadow = true
            })
        })

        modelLoader.Load2Scene('CEIBS_SH/Unified_Parts/','Uni_GroundDecoration','glb', (modelPtr)=>{
            modelPtr.traverse((child) => {
                //console.log(child.name)
            })
        })

        // modelLoader.Load2Scene('CEIBS_SH/Unified_Parts/','CEIBS_SH_UnifiedModel5_ms','glb', (modelPtr)=>{
        //     modelPtr.traverse((child) => {
        //         console.log(child.name)

        //         // Adjust renderOrder for specific children
        //         if (child.name.includes('Transparent')) {
        //             child.renderOrder = Number.NEGATIVE_INFINITY; // Render last
        //         }else{
        //             child.castShadow = true
        //             child.receiveShadow = true
        //         }
        //     })
        //     modelPtr.renderOrder = 1;
        // })

        // Load the model and handle traversal
        modelLoader.Load2Scene('CEIBS_SH/Seperate_Level/', 'CEIBS_SL_Edu1_fs', 'glb', (modelPtr) => {
            // Define an object to store visibility state of groups
            const groupVisibility = {
                CEIBS_Edu1_Level1: true,
                CEIBS_Edu1_Level2: true,
                CEIBS_Edu1_Level3: true,
                CEIBS_Edu1_Shell: true
            };

            // Traverse through the children of modelPtr
            modelPtr.traverse((child) => {
                // Log names for debugging
                console.log(child.name);

                // Check if child's name is in the groupVisibility object
                if (groupVisibility.hasOwnProperty(child.name)) {
                    // Define function to toggle visibility of the group
                    window.gui_obj[child.name] = () => {
                        groupVisibility[child.name] = !groupVisibility[child.name];
                        child.visible = groupVisibility[child.name];
                    };

                    // Add button to debug_ui for this group
                    window.debug_ui.add(window.gui_obj, child.name);
                }
            });
        });

        // Load the model and handle traversal
        modelLoader.Load2Scene('CEIBS_SH/Seperate_Level/', 'CEIBS_SL_Edu2_fs', 'glb', (modelPtr) => {
            // Define an object to store visibility state of groups
            const groupVisibility = {
                CEIBS_Edu2_Level1: true,
                CEIBS_Edu2_Level2: true,
                CEIBS_Edu2_Level3: true,
                CEIBS_Edu2_Shell: true
            };

            // Traverse through the children of modelPtr
            modelPtr.traverse((child) => {
                // Log names for debugging
                //console.log(child.name);

                // Check if child's name is in the groupVisibility object
                if (groupVisibility.hasOwnProperty(child.name)) {
                    // Define function to toggle visibility of the group
                    window.gui_obj[child.name] = () => {
                        groupVisibility[child.name] = !groupVisibility[child.name];
                        child.visible = groupVisibility[child.name];
                    };

                    // Add button to debug_ui for this group
                    window.debug_ui.add(window.gui_obj, child.name);
                }
            });
        });

        // Load the model and handle traversal
        modelLoader.Load2Scene('CEIBS_SH/Seperate_Level/', 'CEIBS_SL_Edu3_fs', 'glb', (modelPtr) => {
            // Define an object to store visibility state of groups
            const groupVisibility = {
                CEIBS_Edu3_Level1: true,
                CEIBS_Edu3_Level2: true,
                CEIBS_Edu3_Level3: true,
                CEIBS_Edu3_Shell: true
            };

            // Traverse through the children of modelPtr
            modelPtr.traverse((child) => {
                // Log names for debugging
                //console.log(child.name);

                // Check if child's name is in the groupVisibility object
                if (groupVisibility.hasOwnProperty(child.name)) {
                    // Define function to toggle visibility of the group
                    window.gui_obj[child.name] = () => {
                        groupVisibility[child.name] = !groupVisibility[child.name];
                        child.visible = groupVisibility[child.name];
                    };

                    // Add button to debug_ui for this group
                    window.debug_ui.add(window.gui_obj, child.name);
                }
            });
        });
        


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