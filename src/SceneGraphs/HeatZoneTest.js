/**
 * In mobile, user can operate a model use ray to detect interaction
 * On PC, only heat zone view are avaliable
 */
import ModelLoader from "../Utils/ModelLoader";
import * as THREE from 'three'
import SceneGraph from "./SceneGraph";
import SceneCameraManager from "../Utils/CameraManager";
import httpRouter from "../HTTPRouter";
import { gsap } from 'gsap'

import HeatVertex from "../Shaders/VertexShaders/HeatFloor_Vertex.glsl"
import HeatFragment from "../Shaders/FragmentShaders/HeatFloor_Fragment.glsl"
import InteractiveModelMangaer from "../Utils/InteractiveModelMangaer";
import MQRouter from "../MQRouter";
import GUI from "lil-gui";

let instance = null
let modelLoader = null

//props inside scene
let points = null
let tags = []

const maxHeatPosition = 20;

let heatZoneInfo = {}

//for synchronize data
let heatPoints = []

export default class HeatZoneTest extends SceneGraph{

    constructor(inputScene){

        super(inputScene)
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        console.log(this)

        this.interactiveModelManager = new InteractiveModelMangaer()
        this.mqRouter = new MQRouter()


        //for forwarding to shader
        this.heatPositions = []
        for(let i=0; i < maxHeatPosition; i++){
            this.heatPositions.push(new THREE.Vector3(0,0,0))
        }
        this.heatDensitys = []
        for(let i=0; i < maxHeatPosition; i++){
            this.heatDensitys.push(0)
        }
        this.pointsNumber = 0;
        this.floorMat = null;

        //for unsubscribe
        this.subscribeID = null;

        //for updating data received from mq to scene
        this.updateIntervalID = null
    }

    //fetch default crowd density from sql, do it only once
    initCrowdDensity() {
        let request = {
            type : 'sql',
            module : 'density',
            parameters : {
                requestType: 'param',
                sceneName : this.constructor.name
            }
        }
    
        httpRouter.postJSON(request)
            .then(response => {
                console.log(response)

                this.pointsNumber = 0;

                response.result.forEach((point) => {
                    //to relate frontend points to backend points, yes I know all have positions
                    let heatPoint = heatPoints[point.pointName];
                    if (heatPoint) {
                       heatPoint.density = point.density
                       heatPoint.index = this.pointsNumber
                    }

                    console.log(point.pointName + " at the position " + this.pointsNumber + " density: " + heatPoint.density)
                    this.heatPositions[this.pointsNumber] = heatPoint.position
                    this.heatDensitys[this.pointsNumber] = heatPoint.density

                    this.debug_folder.add(this.heatDensitys, this.pointsNumber, 0 , 15).name(point.pointName)
                    //window.debug_ui.add(this.heatDensitys, this.pointsNumber, 0 , 15).name(point.pointName)

                    this.pointsNumber ++;
                });

                this.floorMat.uniforms.uPointsNumber.value = this.pointsNumber;
                console.log(this.floorMat.uniforms.uPointsNumber.value)

                this.debug_folder.add(this.floorMat.uniforms.uPointsNumber,'value').min(0).max(10).step(1).name("renderedAmount")
                //window.debug_ui.add(this.floorMat.uniforms.uPointsNumber,'value').min(0).max(10).step(1).name("renderedAmount")

                //update the heat map
                setInterval(this.updateDensityAnimation, 2500); 
            })
            window.debug_ui.add(this.debug_folder)
    }

    handleHeatPointMessage(messageBody) {
        heatZoneInfo = JSON.parse(messageBody)
    }

    updateDensityAnimation() {
        let sceneInfo = heatZoneInfo["HeatZoneTest"];
        
        // Create a copy of instance.heatDensitys
        let endArray = instance.heatDensitys.slice(0);
      
        // Update endArray based on sceneInfo
        for (let point in sceneInfo) {
          let heatPoint = heatPoints[point];
          if (heatPoint) {
            heatPoint.density = sceneInfo[point];
          }
          endArray[heatPoint.index] = heatPoint.density;
        }
      
        // Using GSAP to animate instance.heatDensitys to endArray over 1 second
        gsap.to(instance.heatDensitys, {
          duration: 1,  
          endArray: endArray,  
          onUpdate: function() {
            //console.log(instance.heatDensitys);
          },
          onComplete: function() {
            //console.log("Animation completed");
          }
        });
      }

    loadScene(){
        console.log("loading heat zone")
        super.loadScene()
        this.subscribeID = this.mqRouter.subscribeToTopic('/topic/heat_point_processed_message', this.handleHeatPointMessage);
        this.debug_folder = window.debug_ui.addFolder('Heat Zone Test');
    }

    Create2DPoints(){
        for(const element of tags)
        this.scene.add(element.getLabel())

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

        modelLoader.Load2Scene('models/testModelsGLB/', 'HeatZoneLevel3', 'glb',(modelPtr) => {
            
            modelPtr.traverse((child) => {
                if(child instanceof THREE.PerspectiveCamera){
                    console.log(child)
                    let cameraManager = new SceneCameraManager()
                    cameraManager.hopToPosition(child.position.x, child.position.y, child.position.z)
                    return
                }
                
                let tokens = child.name.split('_')
                if(tokens[0] == 'Floor' && child instanceof THREE.Mesh
                    && tokens[2] == '3' //QUICK FIX
                ){
                    //console.log(child)
                    const originalTexture = child.material.map;
                    this.floorMat = new THREE.ShaderMaterial({
                        vertexShader: HeatVertex,
                        fragmentShader: HeatFragment,
                        uniforms:{
                            uTexture: { type: 't', value: originalTexture },
                            uHeatPositions: new THREE.Uniform(this.heatPositions),
                            uHeatDensitys: new THREE.Uniform(this.heatDensitys),
                            uPointsNumber: new THREE.Uniform(this.pointsNumber)
                        }
                    })

                    child.material = this.floorMat
                    //let modelData = this.interactiveModelManager.addInteractiveModel(child)
                }
                else if(tokens[0] == 'HeatPoint'){
                    let modelData = this.interactiveModelManager.addInteractiveModel(child)
                    //console.log('HeatPoint: ' + child.name + ' scene: ' + instance.constructor.name)
                    heatPoints[tokens[1]] = {
                        density: 0,
                        position: child.position,
                        index: 0
                    }

                }
                else{
                    child.receiveShadow = true
                    child.castShadow = true
                }
            })

            this.initCrowdDensity()
            console.log(heatPoints)
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
        floor.position.y = -1
        this.scene.add(floor)

        //console.log(window.debug_ui)
        this.scene.fog = new THREE.Fog( 0xcccccc, 700, 1500 );

        const axesHelper = new THREE.AxesHelper( 1000 );
        this.scene.add( axesHelper );
    }

    unloadScene(){
        this.mqRouter.unsubscribeByID(this.subscribeID);
        this.debug_folder.destroy();
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        //camera.position.set(this.camera.position)
        //camera.position.set(41,44,25)
    }

    isSceneReady(){
        return modelLoader.isSceneReady()
    }

    getPoints(){
        return points;
    }

    getTags(){
        //console.log(tags)
        return tags;
    }
}