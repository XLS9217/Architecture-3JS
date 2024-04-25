/**
 * This is a test scene that only load few model
 */
import ModelLoader from "../Utils/ModelLoader";
import * as THREE from 'three'
import InteractiveModelMangaer from "../Utils/InteractiveModelMangaer";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

let instance = null
let modelLoader = null
let sceneManager = new InteractiveModelMangaer()

//props inside scene
let points = null
let models = []

//for baking
const textureLoader = new THREE.TextureLoader()
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')


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
        
        console.log(this)
    }

    loadScene(){
        console.log("loading single arch")
        //Scene Props
        this.CreateLights()
        this.CreateModels()
        this.Create2DPoints()
    }

    CreateLights(){
        /**
         * Lights
         */
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xfffff0, 2.0)
        directionalLight.castShadow = true 
        directionalLight.shadow.mapSize.set(1024, 1024)
        this.scene.add(directionalLight)
    }

    Create2DPoints(){
        // const earthMassDiv = document.createElement( 'div' );
        // earthMassDiv.className = 'label';
        // earthMassDiv.textContent = '5.97237e24 kg';
        // earthMassDiv.style.backgroundColor = 'transparent';

        // const earthMassLabel = new CSS2DObject( earthMassDiv );
        // earthMassLabel.position.set( 0, 0, 0 );
        // earthMassLabel.center.set( 0, 0 );
        // this.scene.add( earthMassLabel );
        // earthMassLabel.layers.set( 1 );

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
        
        //Loader
        modelLoader = new ModelLoader(this.scene)
        modelLoader.Load2Scene('models/sz_simplify/', 'sz_simp2', 'glb',(modelPtr) => {
            console.log(modelPtr)
            architecture_shenzhen = modelPtr;
            architecture_shenzhen.scale.set(5,5,5)
            architecture_shenzhen.position.set(300,0,200)
            modelPtr.traverse((child) => {
                //console.log(child)
                //sceneManager.addInteractiveModel(child)
                // const tokens = child.name.split("_");
                // if(tokens[0] == 'interact'){
                //     console.log("find interact " + child.name)
                //     sceneManager.addInteractiveModel(child)
                // }
                child.castShadow = true
                child.receiveShadow = true
            })

        })


        let interactiveToken = "room"//what should the first token be, to indicate interactive

        modelLoader.Load2Scene('models/obj_testRoom2/', 'testStructure', 'obj',(model) => {
            console.log(model)
            model.traverse((child) => {
                const tokens = child.name.split("-");
                if(tokens[0] == interactiveToken){
                    console.log("find room!!!")
                    sceneManager.addInteractiveModel(child)
                }
                model.position.set(200,0,300)
                this.scene.add(model)
            })
            //console.log(sceneManager.getInteractiveModel())
        }) 
        
        models.push(architecture_shenzhen)

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


        const sphereShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(300,350),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                alphaMap: simpleShadow
            })
        )
        sphereShadow.rotation.x = - Math.PI * 0.5
        sphereShadow.position.x = 30
        sphereShadow.position.y = floor.position.y + 1
        this.scene.add(sphereShadow)

        console.log(window.debug_ui)
        this.scene.fog = new THREE.Fog( 0xcccccc, 700, 1500 );
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        camera.position.set(-102, 61, 343)
    }

    isSceneReady(){
        return modelLoader.isSceneReady()
    }

    getPoints(){
        return points;
    }
}