/**
 * This is a test scene that only load few model
 */
import ModelLoader from "../Utils/ModelLoader";
import * as THREE from 'three'
import SceneGraph from "./SceneGraph";
import InteractiveModelMangaer from "../Utils/InteractiveModelMangaer";

let instance = null
let modelLoader = null

//props inside scene
let points = null
let models = []

//for baking
const textureLoader = new THREE.TextureLoader()
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')


export default class ShenZhen_Level2 extends SceneGraph{

    constructor(inputScene){
        
        super(inputScene)
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        console.log(this)
    }

    loadScene(){
        console.log("loading shenzhen level 1")
        super.loadScene()
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
        /**
         * Points
         */
        points = [
            {
                position: new THREE.Vector3(52,-26,51),
                element: document.querySelector('.point-0')
            },
            {
                position: new THREE.Vector3(0,-31,61),
                element: document.querySelector('.point-1')
            },
            {
                position: new THREE.Vector3(0,0,0),
                element: document.querySelector('.point-2')
            } 
        ]

        /**
         * Points Data
         */
        // Get the text container element
        const title1 = document.getElementById('title-1');
        title1.textContent = "图书室"
        const text1 = document.getElementById('text-1');
        text1.textContent = "有时候读纸质书能让人看起来学士渊博"

        const title2 = document.getElementById('title-2');
        title2.textContent = "入口"
        const text2 = document.getElementById('text-2');
        text2.textContent = "进来第一眼看到的地方，很漂亮，但为了上课不迟到并不会留意多久"

    }

    CreateModels(){
        /**
         * Building
         */
        let arch_level1 =  null;
        
        //Loader
        modelLoader = new ModelLoader(this.scene)

        modelLoader.Load2Scene('models/sz_level/', 'shenzhen_l2', 'glb',(modelPtr) => {
            // window.debug_ui.add(modelPtr.position,"x").min(-1000).max(600).step(1)
            // window.debug_ui.add(modelPtr.position,"y").min(-1000).max(600).step(1)
            // window.debug_ui.add(modelPtr.position,"z").min(-1000).max(600).step(1)

            console.log(modelPtr)
            arch_level1 = modelPtr;
            arch_level1.scale.set(5,5,5)
            arch_level1.position.set(-307,-22,244)
            modelPtr.traverse((child) => {
                child.castShadow = true
                child.receiveShadow = true
            })

        })
        
        models.push(arch_level1)

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
        sphereShadow.scale.x = 1.5
        sphereShadow.scale.y = 1.5

        // window.debug_ui.add(sphereShadow.scale,"x").min(0).max(5).step(0.1)
        // window.debug_ui.add(sphereShadow.scale,"y").min(0).max(5).step(0.1)
        this.scene.add(sphereShadow)

        console.log(window.debug_ui)
        this.scene.fog = new THREE.Fog( 0xcccccc, 700, 1500 );

        const axesHelper = new THREE.AxesHelper( 1000 );
        this.scene.add( axesHelper );
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        camera.position.set(-8,29,130)
    }

    isSceneReady(){
        return modelLoader.isSceneReady()
    }

    getPoints(){
        return points;
    }
}