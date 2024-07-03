import ModelLoader from "../Utils/ModelLoader";
import * as THREE from 'three'
import InteractiveModelMangaer from "../Utils/InteractiveModelMangaer";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import FloatTag2D from "../2DElements/FloatTag2D";
import SceneGraph from "./SceneGraph";
import SceneManager from "../Utils/SceneManager";
import SceneCameraManager from "../Utils/CameraManager";
import ControlsManager from "../Utils/ControlsManager";
import { gsap } from 'gsap'

import earthVertexShader from "../Shaders/VertexShaders/SH_MainBuilding_Vertex.glsl"
import earthFragmentShader from "../Shaders/FragmentShaders/SH_MainBuilding_Fragment.glsl"
import CircularButtonContainer from "../2DElements/CircularButtonContainer";

let instance = null
let modelLoader = null

//props inside scene
let points = null
let tags = []
let models = []

//for advenced displaying of building selection
const distancePoint = new THREE.Uniform(new THREE.Vector3(0, 0, 0))
const distanceThreshold = new THREE.Uniform(1000.0)
let ArchitectureShells = {}
/**
 * pointer model have the displaying name, 
 * using displaying name on tag,
 * then find the alphabeta name for load the seperated level model
 */
let translateName = {
    "教学楼1":"Edu1",
    "教学楼2":"Edu2",
    "教学楼3":"Edu3"
}

export default class CEIBS_Shanghai_Main extends SceneGraph {

    constructor(inputScene) {
        super(inputScene)
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        this.namePosPair = []
        this.circularButtons = null

        this.currentLootAt = null
        this.currentCameraPos = null

        this.togglingArchShellGroup = null
        this.togglingArchLevelGroup = null

        this.LevelModels = {}
        this.LevelOrigionalPositions = {}

        this.intersectionModels = []

        // Initialize the exit button
        this.exitButton = this.createExitButton()
    }

    createExitButton() {
        // Create the exit button
        const exitButton = document.createElement('button');
        exitButton.style.position = 'fixed';
        exitButton.style.top = '50%'; 
        exitButton.style.right = '0px'; 
        exitButton.style.transform = 'translateY(-50%)'; 
        exitButton.style.zIndex = '999'; 
        exitButton.style.border = '3px solid black'
        exitButton.style.borderRadius = '50%'; 
        exitButton.style.width = '40px'; 
        exitButton.style.height = '40px'; 
        exitButton.style.background = '#ffcc00aa'; 
        exitButton.style.opacity = 0.0;

        // Create the img element inside the button
        const exitImg = document.createElement('img');
        exitImg.src = 'Icons/exit.png'; 
        exitImg.style.width = '100%'; 
        exitImg.style.height = '100%'; 
        exitImg.style.borderRadius = '50%'; 

        // Append the img element to the button
        exitButton.appendChild(exitImg);

        // Add event listener
        exitButton.addEventListener('click', () => {
            this.ToggleCampusView()
        });

        return exitButton;
    }

    loadScene() {
        console.log("loading Shanghai campus")
        super.loadScene()

        // Append the button to the body
        document.body.appendChild(this.exitButton);
    }

    unloadScene() {
        this.exitButton.remove();
        if(this.circularButtons) this.circularButtons.remove()
    }

    Update(){
        super.Update()
    }

    Create2DPoints() {
        for (const element of tags) {
            element.hide()
            this.scene.add(element.getLabel())
        }
        points = []
    }

    //take in an architecture name load the seperate level building by the name and show the button group
    ToggleBuildingView(ArchitectureName) {
        let archKey = translateName[ArchitectureName]

        //hide tags
        for(let i=0; i<tags.length; i++){
            tags[i].shouldForceHide(true)
        }

        //show exit button
        this.exitButton.style.opacity = 1.0;

        // Object.keys(ArchitectureShells).forEach((key) => {
        //     if(key == archKey)console.log('shellBuildings[key]')
        //     console.log(ArchitectureShells[key])
        // })
            
        //if model can be load
        if(archKey){
            //turn the origional group off
            this.togglingArchShellGroup = ArchitectureShells[archKey]
            console.log(this.togglingArchShellGroup)
            for(let i=0; i<this.togglingArchShellGroup.length; i++){
                this.togglingArchShellGroup[i].visible = false
            }

            let levelNum = 0;
            // Load the according group
            modelLoader.Load2Scene('CEIBS_SH/Seperate_Level/', 'CEIBS_SL_' + archKey + '_fs', 'glb', (modelPtr) => {
                this.togglingArchLevelGroup = modelPtr;
                let ss = '';
                const levels = {};
                let LevelKeyArray = [] //in case more button then keys, mod button using this

                modelPtr.traverse((child) => {
                    ss += child.name + '\n';


                    /**
                     * 分层建筑命名规范
                        CEIBS_Level_L + 数字
                     */
                    if (child.type === 'Group') {
                    
                        const nameParts = child.name.split('_');
                        if (nameParts.length >= 3 && nameParts[1] === 'Level') {
                            const levelKey = nameParts[2]
                            
                            if (!levels[levelKey]) {
                                levels[levelKey] = child; 
                                this.LevelOrigionalPositions[levelKey] = child.position.clone()
                                LevelKeyArray.push(levelKey)
                            }
                            
                        }
                    }
                    else if(child.isMesh){
                        this.intersectionModels.push(child)
                    }
                });

                console.log(ss);
                console.log(levels);
                this.LevelModels = levels

                //clear circular buttons if existing
                if(this.circularButtons) this.circularButtons.destroy()

                //create circular buttons
                this.circularButtons = new CircularButtonContainer({
                    buttonNumber: Math.max(levelNum + 1, 4),//no less then 4
                    containerWidth: '150px',
                    containerHeight: '200px',
                    top: '50%',
                    left: '98%',
                    buttonSize: 40,
                    hasRail: false
                });

                //bind a button for restore view
                this.circularButtons.setButtonAppearance(0,'M')
                this.circularButtons.bindFunctionToButton(0,()=>{

                    let cameraManager = new SceneCameraManager()
                    let controlsManager = new ControlsManager()
                    
                    cameraManager.hopToPosition(this.currentCameraPos.x, this.currentCameraPos.y, this.currentCameraPos.z)
                    controlsManager.lerpToOrbitTarget(this.currentLootAt.x, this.currentLootAt.y,this.currentLootAt.z)

                    this.restoreAllLevel('')
                })

                for(let i=1; i<this.circularButtons.numButtons; i++){
                    let keyIndex = i % LevelKeyArray.length
                    this.circularButtons.setButtonAppearance(i,LevelKeyArray[keyIndex])
                    this.circularButtons.bindFunctionToButton(i,()=>{
                        this.ToggleOnLevel(LevelKeyArray[keyIndex])
                    })
                }
            },true);

        }

    }
    
    //close the button group and return to the full campus view
    ToggleCampusView(){

        //hide exit, remove circular
        this.exitButton.style.opacity = 0.0;
        if(this.circularButtons) this.circularButtons.destroy()

        //unhide tags
        for(let i=0; i<tags.length; i++){
            tags[i].shouldForceHide(false)
        }

        //lerp camera back
        let cameraManager = new SceneCameraManager();
        cameraManager.hopToPosition(341, 113, 90);
        gsap.to(distanceThreshold, {
            duration: 1.0,
            value: 600.0,
        });

        //empty the intersection model
        this.intersectionModels = []

        //remove level model
        modelLoader.unloadModel(this.togglingArchLevelGroup)
        //show shell model
        if(this.togglingArchShellGroup){
            for(let i=0; i<this.togglingArchShellGroup.length; i++){
                this.togglingArchShellGroup[i].visible = true
            }
        }
        
    }

    restoreAllLevel(levelKey){
        //move all other level back
        Object.keys(this.LevelModels).forEach((key) => {
            if(key != levelKey){
                let recoverLevel = this.LevelModels[key]
                let recoverPos = this.LevelOrigionalPositions[key]

                gsap.to(recoverLevel.position,{
                    duration: 1,
                    x: recoverPos.x,
                    y: recoverPos.y,
                    z: recoverPos.z
                })

            }
        })
    }

    ToggleOnLevel(levelKey){
        console.log('Toggle on ' + levelKey)
        let level = this.LevelModels[levelKey]
        let originalPos = this.LevelOrigionalPositions[levelKey]

        this.restoreAllLevel(levelKey)

        //move current level and camera to position
        let newPos = new THREE.Vector3(
            originalPos.x - 40,
            originalPos.y + 30,
            originalPos.z - 40
        )
        
        let cameraManager = new SceneCameraManager()
        let controlsManager = new ControlsManager()

        gsap.to(level.position,{
            duration: 1,
            x: newPos.x,
            y: newPos.y,
            z: newPos.z
        })
        cameraManager.hopToPosition( 
            newPos.x + 20,
            newPos.y + 45,
            newPos.z - 10,
        )

        controlsManager.lerpToOrbitTarget(
            newPos.x,
            newPos.y,
            newPos.z - 10,
        )


    }

    CreateModels() {
        modelLoader = new ModelLoader(this.scene)

        modelLoader.Load2Scene('CEIBS_SH/Unified_Parts/', 'CEIBS_Ground_Fix2', 'glb', (modelPtr) => {
            modelPtr.traverse((child) => {
                child.receiveShadow = true
            })
        })

        modelLoader.Load2Scene('CEIBS_SH/Supportive/', 'Building_Points', 'glb', (modelPtr) => {
            modelPtr.traverse((child) => {
                if (child.isMesh) {

                    child.scale.set(2.5, 2.5, 2.5)
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0xbb3345
                    })

                    let tagBGColor = "#444444cc"
                    if (child.name.includes('教学')) {
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

                            this.currentCameraPos = new THREE.Vector3(child.position.x + 25, child.position.y + 60, child.position.z + 25)
                            this.currentLootAt = new THREE.Vector3(child.position.x, child.position.y, child.position.z)

                            cameraManager.hopToPosition(child.position.x + 25, child.position.y + 60, child.position.z + 25)
                            controlsManager.lerpToOrbitTarget(child.position.x, child.position.y, child.position.z)

                            gsap.to(distancePoint.value, {
                                duration: 1.0,
                                x: child.position.x,
                                y: child.position.y,
                                z: child.position.z,
                            })

                            gsap.to(distanceThreshold, {
                                duration: 1.0,
                                value: 100.0,
                            })

                            this.ToggleBuildingView(child.name)
                        },
                        logicHide: false,
                        minimunPointDistance: 500
                    })
                    newTag.setBackgroundColor(tagBGColor)
                    newTag.label.position.z -= 7.0

                    for (let i = 0; i < tags.length; i++) {
                        if (tags[i].textContent == child.name) {
                            console.log('tag existed')
                            return
                        }
                    }

                    tags.push(newTag)
                }
            })

            for (let i = 0; i < tags.length; i++) {
                this.scene.add(tags[i].getLabel());
            }
        })

        modelLoader.Load2Scene('CEIBS_SH/Unified_Parts/', 'CEIBS_SH_UnifiedModel5_ms', 'glb', (modelPtr) => {
            modelPtr.traverse((child) => {
                //console.log(child.name);

                if (child.name.includes('Transparent')) {
                    child.renderOrder = Number.NEGATIVE_INFINITY;
                } else {
                    child.castShadow = true;
                }

                const tokens = child.name.split('_');
                if (tokens.length > 1) {
                    const buildingName = tokens[1];

                    if (!ArchitectureShells[buildingName]) {
                        ArchitectureShells[buildingName] = [];
                    }
                    ArchitectureShells[buildingName].push(child);
                }

                //shader injection
                if (child.isMesh) {
                    child.material.onBeforeCompile = (shader) => {
                        shader.uniforms.distanceThreshold = distanceThreshold;
                        shader.uniforms.distancePoint = distancePoint;

                        shader.vertexShader = `
                            varying vec3 vWorldPosition;
                            ${shader.vertexShader}
                        `;

                        shader.vertexShader = shader.vertexShader.replace(
                            '#include <begin_vertex>',
                            `
                            vec4 worldPosition1 = modelMatrix * vec4(position, 1.0);
                            vWorldPosition = worldPosition1.xyz;
                            #include <begin_vertex>
                            `
                        );

                        shader.fragmentShader = `
                            uniform float distanceThreshold;
                            uniform vec3 distancePoint;
                            varying vec3 vWorldPosition;
                            ${shader.fragmentShader}
                        `;

                        shader.fragmentShader = shader.fragmentShader.replace(
                            '#include <dithering_fragment>',
                            `
                            float fragmentDistance = distance(vWorldPosition, distancePoint);

                            float distanceFactor = clamp((distanceThreshold - fragmentDistance) / distanceThreshold , 0.3, 0.75);
                            distanceFactor = smoothstep(0.0, 0.75, distanceFactor);

                            if (distanceThreshold < 500.0) {
                                gl_FragColor.rgb *= vec3(distanceFactor);
                            }

                            #include <dithering_fragment>
                            `
                        );
                    };
                }
            });
        });

        let axisHelper = new THREE.AxesHelper(500)
        this.scene.add(axisHelper)
    }

    setIdealCameraLocation(camera) {
        camera.position.set(341, 113, 90)
    }

    isSceneReady() {
        return true
    }

    getPoints() {
        return points;
    }

    getTags() {
        return tags;
    }
}
