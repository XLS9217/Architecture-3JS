import ModelLoader from "../Utils/ModelLoader";
import * as THREE from 'three'

let instance = null
let modelLoader = null

//props inside scene
let points = null
let models = []

//mode indicator

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
            architecture_shenzhen.scale.set(0.01,0.01,0.01)
            architecture_shenzhen.position.set(-400,0,200)
        }
        
        //Loader
        modelLoader = new ModelLoader(this.scene)
        //modelLoader.Load2Scene('models/obj_shenzhen/', 'arch', 'obj',setArchitecture)


        modelLoader.Load2Scene('models/obj_testRoom/', 'testStructure', 'obj',(a) => {
            console.log(a)
            a.traverse((child) => {
                if(child.name == "room"){
                    console.log("find room!!!")
                    child.MeshStandardMaterial = new THREE.MeshStandardMaterial({
                        color: '#ff0000'
                    })
                }
                this.scene.add(a)
            })
        })
        
        models.push(architecture_shenzhen)

        /**
         * Floor
         */
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshStandardMaterial({
                color: '#444444',
                metalness: 0,
                roughness: 0.5
            })
        )
        floor.receiveShadow = true
        floor.rotation.x = - Math.PI * 0.5
        floor.position.y = -100
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