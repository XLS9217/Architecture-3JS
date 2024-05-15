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


export default class ShenZhen_Level3 extends SceneGraph{

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

    Create2DPoints(){
        /**
         * Points
         */
        points = [
            {
                position: new THREE.Vector3(-28,33,69),
                element: document.querySelector('.point-0')
            },
            {
                position: new THREE.Vector3(47,33,71),
                element: document.querySelector('.point-1')
            },
            {
                position: new THREE.Vector3(86,33,5),
                element: document.querySelector('.point-2')
            } 
        ]

        /**
         * Points Data
         */
        // Get the text container element
        const title1 = document.getElementById('title-1');
        title1.textContent = "会议室"
        const text1 = document.getElementById('text-1');
        text1.textContent = "我爱开会"

        const title2 = document.getElementById('title-2');
        title2.textContent = "接待室"
        const text2 = document.getElementById('text-2');
        text2.textContent = "重大项目一般在饭桌上谈成，这里是决定去哪里吃饭的地方"

        const title3 = document.getElementById('title-3');
        title3.textContent = "办公室"
        const text3 = document.getElementById('text-3');
        text3.textContent = "睡会午觉也不会有人发现吧"

    }

    CreateModels(){
        /**
         * Building
         */
        
        //Loader
        modelLoader = new ModelLoader(this.scene)

        modelLoader.Load2Scene('models/sz_level/', 'shenzhen_l3', 'glb',(modelPtr) => {
            // window.debug_ui.add(modelPtr.position,"x").min(-1000).max(600).step(1)
            // window.debug_ui.add(modelPtr.position,"y").min(-1000).max(600).step(1)
            // window.debug_ui.add(modelPtr.position,"z").min(-1000).max(600).step(1)

            console.log(modelPtr)
            modelPtr = modelPtr;
            modelPtr.scale.set(5,5,5)
            modelPtr.position.set(-307,30,244)
            modelPtr.traverse((child) => {
                child.castShadow = true
                child.receiveShadow = true
            })
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
        floor.position.y = 0
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
        camera.position.set(-40,100,135)
    }

    isSceneReady(){
        return modelLoader.isSceneReady()
    }

    getPoints(){
        return points;
    }
}