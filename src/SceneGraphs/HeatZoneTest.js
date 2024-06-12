/**
 * In mobile, user can operate a model use ray to detect interaction
 * On PC, only heat zone view are avaliable
 */
import ModelLoader from "../Utils/ModelLoader";
import * as THREE from 'three'
import SceneGraph from "./SceneGraph";
import SceneCameraManager from "../Utils/CameraManager";
import httpRouter from "../HTTPRouter";

import HeatVertex from "../Shaders/VertexShaders/HeatFloor_Vertex.glsl"
import HeatFragment from "../Shaders/FragmentShaders/HeatFloor_Fragment.glsl"
import InteractiveModelMangaer from "../Utils/InteractiveModelMangaer";

let instance = null
let modelLoader = null

//props inside scene
let points = null
let tags = []




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

        this.fetchInterval = null;
        this.heatPoints = []
        this.floorMat = null;
    }

    fetchCrowdDensity(heatPoints) {
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
                response.result.forEach((point) => {
                    let heatPoint = heatPoints[point.pointName];
                    if (heatPoint) {
                       heatPoint.density = point.density
                    }

                    if(point.pointName == 'MeetingPath'){
                        console.log("class room position updated")
                        this.floorMat.uniforms.uHeatPosition.value = heatPoint.position              
                        window.debug_ui.add(this.floorMat.uniforms.uHeatPosition.value , 'x' ).min(-50.0).max(50.0).name('heat pos')
                        
                    }
                });
            })
    }

    loadScene(){
        console.log("loading heat zone")
        super.loadScene()
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
                            uHeatPosition: new THREE.Uniform(new THREE.Vector3(10,0,0)),
                            uDistance: new THREE.Uniform(10.0)
                        }
                    })

                    child.material = this.floorMat
                    //let modelData = this.interactiveModelManager.addInteractiveModel(child)
                }
                else if(tokens[0] == 'HeatPoint'){
                    let modelData = this.interactiveModelManager.addInteractiveModel(child)
                    //console.log('HeatPoint: ' + child.name + ' scene: ' + instance.constructor.name)
                    this.heatPoints[tokens[1]] = {
                        density: 0,
                        position: child.position
                    }



                }
                else{
                    child.receiveShadow = true
                    child.castShadow = true
                }
            })

            
            window.debug_ui.add(this.floorMat.uniforms.uDistance , 'value' ).min(5.0).max(100.0)
            this.fetchCrowdDensity(this.heatPoints)
            console.log(this.heatPoints)
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
        clearInterval(this.fetchInterval);
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