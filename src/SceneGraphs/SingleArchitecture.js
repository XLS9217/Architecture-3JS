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
import UserState from "../UserState";
import { gsap } from 'gsap'
import SceneCameraManager from "../Utils/CameraManager";
import ControlsManager from "../Utils/ControlsManager";
import CircularButtonContainer from "../2DElements/CircularButtonContainer";

let instance = null
let modelLoader = null

//props inside scene
let points = null
let tags = []






// Call the function to generate the buttons


export default class SingleArchitecture extends SceneGraph{

    constructor(inputScene){
        super(inputScene)
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this

        this.levels = [null, null, null, null]
        this.origionalPos = [null, null, null, null]

        this.levelViewCameraPos = new THREE.Vector3(55,254,321)

        this.levelSwitch

        this.circularButtons
    }

    loadScene(){
        console.log("loading single arch")
        super.loadScene()
        this.levelSwitch = this.generateLevelButton()

        //create circular buttons
        this.circularButtons = new CircularButtonContainer({
            buttonNumber: 4,
            containerWidth: '150px',
            containerHeight: '200px',
            top: '50%',
            left: '97.5%',
            buttonSize: 40
        });

        //add function and appearence to button
        this.circularButtons.setButtonAppearance(0, "L0")
        this.circularButtons.bindFunctionToButton(0, ()=>{
            this.switchLevel(0)
        })

        this.circularButtons.setButtonAppearance(1, "L1")
        this.circularButtons.bindFunctionToButton(1, ()=>{
            this.switchLevel(1)
        })

        this.circularButtons.setButtonAppearance(2, "L2")
        this.circularButtons.bindFunctionToButton(2, ()=>{
            this.switchLevel(2)
        })

        this.circularButtons.setButtonAppearance(3, "L3")
        this.circularButtons.bindFunctionToButton(3, ()=>{
            this.switchLevel(3)
        })
    }

    unloadScene(){
        this.levelSwitch.remove()
        this.circularButtons.destroy()
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
        
        //Loader
        modelLoader = new ModelLoader(this.scene)

        /**
         * Interactive frame for level selection
         */
        modelLoader.Load2Scene('models/sz_simplify/', 'interactivesOnly', 'glb',(modelPtr) => {
            //console.log(modelPtr)
            modelPtr.scale.set(5,5,5)
            modelPtr.position.set(300,20,200)
        
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

                if(child.name == 'l1' || child.name == 'l2' || child.name == 'l3' || child.name == 'top'|| child.name == 'a_ssg') return //quick fix donot show cube

                child.castShadow = true
                child.receiveShadow = true
            })


        })


        /**
         * Top
         */
        modelLoader.Load2Scene('models/sz_simplify/', 'sz_top_drawer', 'glb',(modelPtr) => {
            //console.log(modelPtr)
            modelPtr.scale.set(5,5,5)
            modelPtr.position.set(300,20,200)

            modelPtr.traverse((child) => {
                child.castShadow = true
                child.receiveShadow = true
            })
            
            window.debug_ui.add(modelPtr.position, 'x').min(300).max(500).name('top')

        })

        /**
         * L3
         */
        modelLoader.Load2Scene('models/sz_simplify/', 'sz_l3_drawer', 'glb',(modelPtr) => {
            //console.log(modelPtr)
            modelPtr.scale.set(5,5,5)
            modelPtr.position.set(300,20,200)

            modelPtr.traverse((child) => {
                child.castShadow = true
                child.receiveShadow = true
            })

            this.levels[3] = modelPtr
            this.origionalPos[3] = new THREE.Vector3(modelPtr.position.x, modelPtr.position.y, modelPtr.position.z)


        })

        /**
         * L2
         */
        modelLoader.Load2Scene('models/sz_simplify/', 'sz_l2_drawer', 'glb',(modelPtr) => {
            //console.log(modelPtr)
            modelPtr.scale.set(5,5,5)
            modelPtr.position.set(300,20,200)

            modelPtr.traverse((child) => {
                child.castShadow = true
                child.receiveShadow = true
            })
            this.levels[2] = modelPtr
            this.origionalPos[2] = new THREE.Vector3(modelPtr.position.x, modelPtr.position.y, modelPtr.position.z)


        })

        /**
         * L1
         */
        modelLoader.Load2Scene('models/sz_simplify/', 'sz_l1_drawer', 'glb',(modelPtr) => {
            //console.log(modelPtr)
            modelPtr.scale.set(5,5,5)
            modelPtr.position.set(300,20,200)

            modelPtr.traverse((child) => {
                child.castShadow = true
                child.receiveShadow = true
            })

            this.levels[1] = modelPtr
            this.origionalPos[1] = new THREE.Vector3(modelPtr.position.x, modelPtr.position.y, modelPtr.position.z)


        })




        /**
         * Outside view, mobile and desktop is different
         */
        let userState = new UserState()
        if(userState.deviceType == userState.DeviceTypes.COMPUTER){
            modelLoader.Load2Scene('models/sz_simplify/', 'sz_outside', 'glb',(modelPtr) => {
                modelPtr.scale.set(5,5,5)
                modelPtr.position.set(300,20,200)
    
                modelPtr.traverse((child) => {
                    child.castShadow = true
                    child.receiveShadow = true
                })
            })
        }else{
            // /**
            //  * Floor
            //  */
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
        }

        
        



        //console.log(window.debug_ui)
        this.scene.fog = new THREE.Fog( 0xcccccc, 700, 1500 );
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        let userState = new UserState()
        if(userState.deviceType == userState.DeviceTypes.MOBILE)
            camera.position.set(-130, 55, 189)
        else
            camera.position.set(55,254,321)
    }

    //0 is currently reset the camera and level showing
    switchLevel( distLevel ){
        if(!this.isSceneReady() || distLevel > 3){
            return
        }


        let cameraManager = new SceneCameraManager()
        let controlsManager = new ControlsManager()

        //put every other level back to it's origional position, only change position for desired level, 0 is base 3 is third floor
        for(let i=0; i < this.levels.length; i++){

            if(this.levels[i]){
                if(i == distLevel){
                    gsap.to(this.levels[i].position, {
                        x: this.origionalPos[i].x + 250,
                        y: this.origionalPos[i].y + 80,
                        z: this.origionalPos[i].z,
                        duration: 0.5,
                        onComplete: () => {
                            cameraManager.hopToPosition( 
                                this.origionalPos[i].x,
                                this.origionalPos[i].y + 160 + i * 20,
                                this.origionalPos[i].z - 50,
                            )
        
                            controlsManager.lerpToOrbitTarget(
                                this.origionalPos[i].x,
                                this.origionalPos[i].y + 80,
                                this.origionalPos[i].z - 180,
                            )
                                
                        }
                    })
                    
                }else{              
                    gsap.to(this.levels[i].position, {
                        x: this.origionalPos[i].x,
                        y: this.origionalPos[i].y,
                        z: this.origionalPos[i].z,
                        duration: 0.5
                    })
                }
            }
        }

        //quick fix------------------
        if(distLevel == 0){cameraManager.hopToPosition( 
            this.levelViewCameraPos.x,
            this.levelViewCameraPos.y,
            this.levelViewCameraPos.z
        )

        controlsManager.lerpToOrbitTarget(
            0,0,0
        )}
        
    }

    generateLevelButton() {
        // Create container for buttons
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '10%';
        container.style.right = '20px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.padding = '10px';
        document.body.appendChild(container);
    
        // Helper function to update button style
        function updateButtonStyle(button) {
            button.style.padding = '8px 12px';
            button.style.border = '2px solid #ccc';
            button.style.borderRadius = '50%';
            button.style.backgroundColor = '#f0f0f0b0';
            button.style.fontSize = '14px';
            button.style.transition = 'background-color 0.3s ease';
    
            button.onmouseover = function() {
                button.style.backgroundColor = '#e0e0e0';
            };
    
            button.onmouseout = function() {
                button.style.backgroundColor = '#f0f0f0b0';
            };
        }
    
        // Button to go up
        const btnUp = document.createElement('button');
        btnUp.textContent = '上';
        updateButtonStyle(btnUp);
        btnUp.onclick = () => {
            // Increase middle button value
            const currentValue = parseInt(btnMid.textContent);
            if (currentValue < 3) {
                btnMid.textContent = currentValue + 1;
                this.switchLevel(btnMid.textContent)
            }
        };
        container.appendChild(btnUp);
    
        // Middle button (initially with value 0)
        const btnMid = document.createElement('button');
        btnMid.textContent = '0';
        updateButtonStyle(btnMid);
        container.appendChild(btnMid);
    
        // Button to go down
        const btnDown = document.createElement('button');
        btnDown.textContent = '下';
        updateButtonStyle(btnDown);
        btnDown.onclick = () => {
            // Decrease middle button value, but not below 0
            const currentValue = parseInt(btnMid.textContent);
            if (currentValue > 0) {
                btnMid.textContent = currentValue - 1;
                this.switchLevel(btnMid.textContent)
            }
        };
        container.appendChild(btnDown);
    
        return container;
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