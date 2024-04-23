/**
 * This is a test scene that only load few model
 */
import ModelLoader from "../Utils/ModelLoader";
import * as THREE from 'three'
import SceneManager from "../SceneManager";

let instance = null
let modelLoader = null
let sceneManager = new SceneManager()

//props inside scene
let points = null
let models = []


export default class SingleArchitecture{

    constructor(inputScene){

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

        //Scene Props
        this.CreateLights()
        this.CreateModels()
        this.Create2DPoints()
        
        console.log(this)
    }

    CreateLights(){
        /**
         * Lights
         */
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
        directionalLight.castShadow = true 
        directionalLight.shadow.mapSize.set(1024, 1024)
        directionalLight.position.set(5, 5, 5)
        this.scene.add(directionalLight)
    }

    Create2DPoints(){
        /**
         * Points
         */
        points = [
            {
                position: new THREE.Vector3(1.55, 0.3, - 0.6),
                element: document.querySelector('.point-0')
            },
            {
                position: new THREE.Vector3(0.5, 0.8, - 1.6),
                element: document.querySelector('.point-1')
            },
            {
                position: new THREE.Vector3(1.6, - 1.3, - 0.7),
                element: document.querySelector('.point-2')
            },
            {
                position: new THREE.Vector3(63, 9 , -7),
                element: document.querySelector('.green-house')
            }
        ]
    }

    CreateModels(){
        /**
         * Building
         */
        let architecture_shenzhen =  null;
        const setArchitecture = (modelPtr) => {
            console.log(modelPtr)
            architecture_shenzhen = modelPtr;
            architecture_shenzhen.scale.set(10,10,10)
            architecture_shenzhen.position.set(650,0,0)
            modelPtr.traverse((child) => {
                //console.log(child)
                //sceneManager.addInteractiveModel(child)
                // const tokens = child.name.split("_");
                // if(tokens[0] == 'interact'){
                //     console.log("find interact " + child.name)
                //     sceneManager.addInteractiveModel(child)
                // }
            })
        }
        
        //Loader
        modelLoader = new ModelLoader(this.scene)
        modelLoader.Load2Scene('models/sz_simplify/', 'sz_simp', 'glb',setArchitecture)


        let interactiveToken = "room"//what should the first token be, to indicate interactive

        modelLoader.Load2Scene('models/obj_testRoom2/', 'testStructure', 'obj',(model) => {
            console.log(model)
            model.traverse((child) => {
                const tokens = child.name.split("-");
                if(tokens[0] == interactiveToken){
                    console.log("find room!!!")
                    sceneManager.addInteractiveModel(child)
                }
                this.scene.add(model)
            })
            //console.log(sceneManager.getInteractiveModel())
        }) 
        
        models.push(architecture_shenzhen)

        /**
         * Floor
         */
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000),
            new THREE.MeshStandardMaterial({
                color: '#444444',
                metalness: 0,
                roughness: 0.5
            })
        )
        floor.receiveShadow = true
        floor.rotation.x = - Math.PI * 0.5
        floor.position.y = -250
        this.scene.add(floor)
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        camera.position.set(774, 67, -571)
    }

    isSceneReady(){
        return modelLoader.isSceneReady()
    }

    getPoints(){
        return points;
    }
}