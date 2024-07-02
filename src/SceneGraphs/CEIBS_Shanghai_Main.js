/**
 * This is a test scene that only load few model
 */
import ModelLoader from "../Utils/ModelLoader";
import * as THREE from 'three'
import InteractiveModelMangaer from "../Utils/InteractiveModelMangaer";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import FloatTag2D from "../2DElements/FloatTag2D";
import { color, element } from "three/examples/jsm/nodes/Nodes.js";
import SceneGraph from "./SceneGraph";
import SceneManager from "../Utils/SceneManager";
import SceneCameraManager from "../Utils/CameraManager";
import ControlsManager from "../Utils/ControlsManager";

import earthVertexShader from "../Shaders/VertexShaders/SH_MainBuilding_Vertex.glsl"
import earthFragmentShader from "../Shaders/FragmentShaders/SH_MainBuilding_Fragment.glsl"

let instance = null
let modelLoader = null

//props inside scene
let points = null
let tags = []
let models = []

let shellBuildings = {}
let translateName = {
    "教学楼1":"Edu1",
    "教学楼2":"Edu2",
    "教学楼3":"Edu3"
}


export default class CEIBS_Shanghai_Main extends SceneGraph{

    constructor(inputScene){
        super(inputScene)
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        //console.log(this)

        this.namePosPair = []

    }

    loadScene(){
        console.log("loading Shanghai campus")
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


        modelLoader.Load2Scene('CEIBS_SH/Supportive/','Building_Points','glb', (modelPtr)=>{
            modelPtr.traverse((child) => {
                if(child.isMesh){

                    child.scale.set(2.5,2.5,2.5)
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0xbb3345
                    })
                    //console.log(child.position)


                    //let tagBGColor = "#880808bb"
                    let tagBGColor = "#444444cc"
                    if(child.name.includes('教学')){
                        tagBGColor = "#880808cc"
                    }

                    let newTag = new FloatTag2D({
                        textContent: child.name, 
                        position: child.position.clone(), 
                        customFunction: () => {

                            let currentBuildingName = child.name;
                            console.log(currentBuildingName)

                            let cameraManager = new SceneCameraManager()
                            let controlsManager = new ControlsManager()
                            cameraManager.hopToPosition(child.position.x+35, child.position.y+65, child.position.z+35)
                            controlsManager.lerpToOrbitTarget(child.position.x, child.position.y, child.position.z)

                        },
                        logicHide: false,
                        minimunPointDistance: 500
                    })
                    newTag.setBackgroundColor(tagBGColor)
                    tags.push(newTag)
                }

                
            })

            for(let i=0; i<tags.length; i++){
                this.scene.add(tags[i].getLabel());
            }

        })



        // modelLoader.Load2Scene('CEIBS_SH/Unified_Parts/','CEIBS_SH_UnifiedModel5_ms','glb', (modelPtr)=>{
        //     modelPtr.traverse((child) => {
        //         console.log(child.name)
 
        //         // Adjust renderOrder for specific children
        //         if (child.name.includes('Transparent')) {
        //             child.renderOrder = Number.NEGATIVE_INFINITY; // Render last
        //         }else{
        //             child.castShadow = true
        //             //child.receiveShadow = true
        //         }
        //     })
        //     //modelPtr.renderOrder = 1;
        // })
        modelLoader.Load2Scene('CEIBS_SH/Unified_Parts/', 'CEIBS_SH_UnifiedModel5_ms', 'glb', (modelPtr) => {
        
            // Traverse through the children of modelPtr
            modelPtr.traverse((child) => {
                console.log(child.name);
        
                // Adjust renderOrder for specific children
                if (child.name.includes('Transparent')) {
                    child.renderOrder = Number.NEGATIVE_INFINITY; // Render last
                } else {
                    child.castShadow = true;
                    //child.receiveShadow = true
                }
        
                // Tokenize the name
                const tokens = child.name.split('_');
                if (tokens.length > 1) {
                    const buildingName = tokens[1]; // Assuming the second token is the building identifier
        
                    // Add child to the respective building group
                    if (!shellBuildings[buildingName]) {
                        shellBuildings[buildingName] = [];
                    }
                    shellBuildings[buildingName].push(child);
                }

                //shader injection
                if(child.isMesh){
                    child.material.onBeforeCompile = (shader) => {
                        // Inject custom uniforms
                        shader.uniforms.customUniform = { value: 1.0 };
                      
    
                        // Modify vertex shader code
                        shader.vertexShader = `
                          uniform float customUniform;
                          ${shader.vertexShader}
                        `;
                      
                        // Insert custom code at a specific point in the vertex shader
                        shader.vertexShader = shader.vertexShader.replace(
                          '#include <begin_vertex>',
                          `
                            #include <begin_vertex>
                          `
                        );
                      
                        
                        // Modify fragment shader code
                        shader.fragmentShader = `
                          uniform float customUniform;
                          ${shader.fragmentShader}
                        `;
                      
                        // Insert custom code at a specific point in the fragment shader
                        shader.fragmentShader = shader.fragmentShader.replace(
                          '#include <dithering_fragment>',
                          `
                            #include <dithering_fragment>
                          `
                        );
    
                        console.log(shader.fragmentShader)
                    };
                }
                
            });
        
            
        });
        
        // // Load the model and handle traversal
        // modelLoader.Load2Scene('CEIBS_SH/Seperate_Level/', 'CEIBS_SL_Edu1_fs', 'glb', (modelPtr) => {
        //     // Define an object to store visibility state of groups
        //     const groupVisibility = {
        //         CEIBS_Edu1_Level1: true,
        //         CEIBS_Edu1_Level2: true,
        //         CEIBS_Edu1_Level3: true,
        //         CEIBS_Edu1_Shell: true
        //     };

        //     // Traverse through the children of modelPtr
        //     modelPtr.traverse((child) => {
        //         // Log names for debugging
        //         console.log(child.name);

        //         // Check if child's name is in the groupVisibility object
        //         if (groupVisibility.hasOwnProperty(child.name)) {
        //             // Define function to toggle visibility of the group
        //             window.gui_obj[child.name] = () => {
        //                 groupVisibility[child.name] = !groupVisibility[child.name];
        //                 child.visible = groupVisibility[child.name];
        //             };

        //             // Add button to debug_ui for this group
        //             window.debug_ui.add(window.gui_obj, child.name);
        //         }
        //     });
        // });

        
        



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