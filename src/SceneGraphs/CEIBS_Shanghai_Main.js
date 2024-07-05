
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

import RoomFrameFragment from "../Shaders/FragmentShaders/RoomFrame_Fragment.glsl"
import RoomFrameVertex from "../Shaders/VertexShaders/RoomFrame_Vertex.glsl"
import CircularButtonContainer from "../2DElements/CircularButtonContainer";

let instance = null
let modelLoader = null

//props inside scene
let points = null
let tags = []
let models = []

let clock = new THREE.Clock()
let timeUniform = new THREE.Uniform(0.0)
let yGapUniform = new THREE.Uniform(1.5)
let fadeUniform = new THREE.Uniform(15.0)

let levelTags = {}

//for advenced displaying of building selection
const distancePoint = new THREE.Uniform(new THREE.Vector3(0, 0, 0))
const distanceThreshold = new THREE.Uniform(1000.0)
let ArchitectureShells = {}


//frame material
let classroomColor = 0xe30D54
let meetingroomColor = 0x0095EF


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
        if(this.circularButtons ) this.circularButtons.destroy()
    }

    Update(){
        super.Update()
        timeUniform.value = clock.getElapsedTime()
        //console.log(timeUniform)

        let cameraManager = new SceneCameraManager()
        let raycaster = new THREE.Raycaster()
        //console.log(this.intersectionModels)
        Object.keys(levelTags).forEach((key) => {
            let tagArr = levelTags[key];
            for(let i=0; i<tagArr.length; i++){
                tagArr[i].update(cameraManager.getCamera(), raycaster, this.scene);
                //console.log(tagArr[i])
            }
        })

    }

    Create2DPoints() {
        for (const element of tags) {
            element.hide()
            this.scene.add(element.getLabel())
        }
        points = []
    }

    //take in an architecture name load the seperate level building by the name and show the button group
    /**
        分层建筑命名规范
        CEIBS_Level_L + 数字
        Frame_ + 楼层名字 + _ + 房间名字 (房间名字将被用以染色)
        记住要重设原点
        楼层内标注要善用原点
    * */
    ToggleBuildingView(ArchitectureName) {
        
        window.debug_ui.add(yGapUniform,'value').min(0.0).max(10.0).name('gap')
        window.debug_ui.add(fadeUniform,'value').min(0.0).max(20.0).name('fade')



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
                        const tokens = child.name.split('_');

                        //room frame indicator
                        if(tokens.length > 2 && tokens[0] == 'Frame'){
                            console.log('level tag '+child.name+' found at ' + child.position.x + ' ' + child.position.y + ' '+ child.position.z )

                            //create new tag
                            let newTag = new FloatTag2D({
                                textContent: tokens[2],
                                position: child.position.clone(),
                                logicHide: false,
                                minimunPointDistance: 250
                            })

                            if(levelTags[tokens[1]]){
                                levelTags[tokens[1]].push(newTag)
                            }else{
                                levelTags[tokens[1]] = []
                                levelTags[tokens[1]].push(newTag)
                            }
                            //add level tag to the level group it belong
                            levels[tokens[1]].add(newTag.getLabel())

                            let colorUniform = new THREE.Uniform(new THREE.Vector3(0.5, 0.5, 0.5))

                            //extra utility set color by room name
                            if(child.name.includes('教室')){
                                console.log('child.name.includes(教室)')
                                newTag.setBackgroundColor(classroomColor)
                                colorUniform = new THREE.Uniform(new THREE.Vector3(0.96, 0.11, 0.39))
                            }
                            else if(child.name.includes('讨论')){
                                console.log('child.name.includes(讨论)')
                                newTag.setBackgroundColor(meetingroomColor)
                                colorUniform = new THREE.Uniform(new THREE.Vector3(0.0, 0.58, 0.93))
                            }

                            //customize the material
                            child.material = new THREE.ShaderMaterial({
                                vertexShader: RoomFrameVertex,
                                fragmentShader: RoomFrameFragment,
                                uniforms: {
                                    uBaseColor: colorUniform,
                                    uTime: timeUniform,
                                    uYGap: yGapUniform,
                                    uTagPosition: new THREE.Uniform(child.position),
                                    uFadeValue: fadeUniform
                                }
                            })
                            child.renderOrder = Number.NEGATIVE_INFINITY;

                        }

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

                //reset everything for starter
                this.restoreAllLevel('')

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
        
        //remove level tags
        Object.keys(levelTags).forEach((key)=>{
            for(let i=0; i<levelTags[key].length; i++){
                levelTags[key][i].destroy()
                this.scene.remove(levelTags[key][i].getLabel())
            }
        })
        levelTags = {}

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
                let tagArray = levelTags[key]
                let recoverPos = this.LevelOrigionalPositions[key]

                //move current level back
                gsap.to(recoverLevel.position,{
                    duration: 1,
                    x: recoverPos.x,
                    y: recoverPos.y,
                    z: recoverPos.z
                })

                //hide the tag
                if(tagArray){
                    for(let i=0; i<tagArray.length; i++){
                        tagArray[i].hide()
                        tagArray[i].shouldForceHide(true)
                    }
                }
            }
        })
    }

    ToggleOnLevel(levelKey){
        console.log('Toggle on ' + levelKey)
        let level = this.LevelModels[levelKey]
        let originalPos = this.LevelOrigionalPositions[levelKey]

        this.restoreAllLevel(levelKey)

        //show the tag of the current level
        let levelTagArr = levelTags[levelKey]
        if(levelTagArr){
            for(let i=0; i<levelTagArr.length; i++){
                levelTagArr[i].unhide()
                levelTagArr[i].shouldForceHide(false)
            }
        }
        

        //move current level and camera to position
        let newPos = new THREE.Vector3(
            originalPos.x - 40,
            originalPos.y + 60,
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
            newPos.y + 35,
            newPos.z - 10,
        )

        controlsManager.lerpToOrbitTarget(
            newPos.x,
            newPos.y,
            newPos.z - 10,
        )

        //reset render order
        // let sceneManager = new SceneManager()
        // sceneManager.RecalculateRenderOrder()

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
