/**
 * This is a test scene that only load few model
 */
import ModelLoader from "../Utils/ModelLoader";
import * as THREE from 'three'
import SceneGraph from "./SceneGraph";
import InteractiveModelMangaer from "../Utils/InteractiveModelMangaer";
import FloatTag2D from "../2DElements/FloatTag2D";
import SceneManager from "../Utils/SceneManager";

let instance = null
let modelLoader = null

//props inside scene
let points = null
let tags = []

//for baking
const textureLoader = new THREE.TextureLoader()

//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
const directionalLight = new THREE.DirectionalLight(0xfffff0, 2.0)

export default class Classroom extends SceneGraph{

    constructor(inputScene){

        super()
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this

        /**
         * Start creating scene
         */
        this.scene = inputScene;
        this.interactiveModelManager = new InteractiveModelMangaer();
        console.log(this)

    }

    loadScene(){
        console.log("loading shenzhen level 1")
        this.interactiveModelManager.clearSceneData()
        //Scene Props
        this.CreateLights()
        this.CreateModels()
        this.Create2DPoints()
    }

    CreateLights(){
        /**
         * Lights
         */
        this.scene.add(ambientLight)

        directionalLight.position.set(-175, 122, -4)
        directionalLight.target.position.set(191,-55,-38)
        directionalLight.castShadow = true 
        directionalLight.shadow.mapSize.set(512, 512)
        directionalLight.shadow.camera.scale.x = 40
        directionalLight.shadow.camera.scale.y = 50
        console.log(directionalLight.shadow.camera)
        this.scene.add(directionalLight)

        // const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
        // this.scene.add(directionalLightCameraHelper)
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
        let arch_level1 =  null;
        
        //Loader
        modelLoader = new ModelLoader(this.scene)

        modelLoader.Load2Scene('models/sz_level/', 'shenzhen_base_classroom', 'glb',(modelPtr) => {
            
            console.log(modelPtr)
            modelPtr.position.set(-10,0,-10)
            modelPtr.traverse((child) => {
                let tokens = child.name.split('_');
                if(tokens[0] == 'interactive'){
                    let modelData = this.interactiveModelManager.addInteractiveModel(child)
                    if(tokens[1] == 'door'){
                        modelData.clickAction = () => {
                            let sceneManager = new SceneManager()
                            sceneManager.LoadScene('Base')
                        }
                    }
                    else if(tokens[1] == 'camera'){
                        modelData.clickAction = () => {
                            console.log("open camera")
                        }
                    }
                }
                child.castShadow = true
                child.receiveShadow = true
            })
            console.log(this.interactiveModelManager)
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
        floor.position.y = -53
        this.scene.add(floor)

        console.log(window.debug_ui)
        this.scene.fog = new THREE.Fog( 0xcccccc, 700, 1500 );

        const axesHelper = new THREE.AxesHelper( 1000 );
        this.scene.add( axesHelper );
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        camera.position.set(1,17,3)
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