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
let models = []
tags.push(new FloatTag2D({textContent: "负一层", position: new THREE.Vector3(20,28,-13)})) 
tags[0].getLabel().element.style.width = '70px'
tags[0].getLabel().element.style.fontSize = '20px'
tags[0].getLabel().element.style.background = '#ff1111'

tags.push(new FloatTag2D({ textContent: "B03阶梯教室", position: new THREE.Vector3(51, 0, -111) }));
tags.push(new FloatTag2D({ textContent: "B02阶梯教室", position: new THREE.Vector3(-41, -5, 63) }));
tags.push(new FloatTag2D({ textContent: "B01阶梯教室", position: new THREE.Vector3(-115, -5, 54) }));

tags.push(new FloatTag2D({ textContent: "B14讨论室", position: new THREE.Vector3(59, -7, 42) }));
tags.push(new FloatTag2D({ textContent: "B13讨论室", position: new THREE.Vector3(59, -7, 22) }));
tags.push(new FloatTag2D({ textContent: "B12讨论室", position: new THREE.Vector3(59, -7, 2) }));

tags.push(new FloatTag2D({ textContent: "B05讨论室", position: new THREE.Vector3(-114, -7, -55) }));
tags.push(new FloatTag2D({ textContent: "B06讨论室", position: new THREE.Vector3(-84, -7, -55) }));
tags.push(new FloatTag2D({ textContent: "B07讨论室", position: new THREE.Vector3(-54, -7, -55) }));
for(let i=1; i<tags.length; i++){
    if(i <= 3)    tags[i].getLabel().element.style.width = '90px'
    else{
        tags[i].getLabel().element.style.width = '70px'
        tags[i].getLabel().element.style.background = '#00b4d8bb'
    }    
}

//for baking
const textureLoader = new THREE.TextureLoader()
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
const directionalLight = new THREE.DirectionalLight(0xfffff0, 2.0)

export default class ShenZhen_Basement extends SceneGraph{

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

    GenerateLight(){
        /**
         * Afternoon Lights
         */
        const afternoon_DLight = new THREE.DirectionalLight(0xffff11, 1.5)
        afternoon_DLight.position.set(275, 140, 140)
        afternoon_DLight.target.position.set(-300,-50,-200)
        afternoon_DLight.castShadow = true 
        afternoon_DLight.shadow.mapSize.set(1024, 1024)
        afternoon_DLight.shadow.camera.scale.x = 40
        afternoon_DLight.shadow.camera.scale.z = 30
        afternoon_DLight.shadow.camera.scale.y = 50
        //console.log(afternoon_DLight.shadow.camera)
        // const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // this.scene.add( helper );
        this.lightGroups['afternoon'].add(afternoon_DLight)

        /**
        * day Lights
        */
        const day_DLight = new THREE.DirectionalLight(0xffffaa, 1.0)
        day_DLight.position.set(158,357,126)
        day_DLight.target.position.set(-300,-50,-200)
        day_DLight.castShadow = true 
        day_DLight.shadow.mapSize.set(1024, 1024)
        day_DLight.shadow.camera.scale.x = 40
        day_DLight.shadow.camera.scale.z = 30
        day_DLight.shadow.camera.scale.y = 50
        //console.log(day_DLight.shadow.camera)
        // const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // this.scene.add( helper );
        this.lightGroups['day'].add(day_DLight)

        /**
        * day Lights
        */
        const night_DLight = new THREE.DirectionalLight(0xffffff, 1.0)
        night_DLight.position.set(269,229,255)
        night_DLight.target.position.set(-300,-50,-200)
        night_DLight.castShadow = true 
        night_DLight.shadow.mapSize.set(1024, 1024)
        night_DLight.shadow.camera.scale.x = 40
        night_DLight.shadow.camera.scale.z = 30
        night_DLight.shadow.camera.scale.y = 50
        //console.log(night_DLight.shadow.camera)
        // const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // this.scene.add( helper );
        this.lightGroups['night'].add(night_DLight)

        /**
        * weather Lights
        */
        const weather_DLight = new THREE.DirectionalLight(0xffffff, 0.7)
        weather_DLight.position.set(269,229,255)
        weather_DLight.target.position.set(-300,-50,-200)
        weather_DLight.castShadow = true 
        weather_DLight.shadow.mapSize.set(1024, 1024)
        weather_DLight.shadow.camera.scale.x = 40
        weather_DLight.shadow.camera.scale.z = 30
        weather_DLight.shadow.camera.scale.y = 50
        //console.log(night_DLight.shadow.camera)
        // const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // this.scene.add( helper );
        this.lightGroups['weather'].add(weather_DLight)
    }

    Create2DPoints(){
        for(const element of tags)
        this.scene.add(element.getLabel())

        /**
         * Points
         */
        points = [
            {
                position: new THREE.Vector3(-125,-29,38),
                element: document.querySelector('.point-0')
            },
            {
                position: new THREE.Vector3(-59,-29,51),
                element: document.querySelector('.point-1')
            },
            {
                position: new THREE.Vector3(174,-12,-7),
                element: document.querySelector('.point-2')
            } 
        ]

        /**
         * Points Data
         */
        // Get the text container element
        const title1 = document.getElementById('title-1');
        title1.textContent = "阶梯教室1"
        const text1 = document.getElementById('text-1');
        text1.textContent = "隔壁的掌声络绎不绝"

        const title2 = document.getElementById('title-2');
        title2.textContent = "阶梯教室2"
        const text2 = document.getElementById('text-2');
        text2.textContent = "被掌声吵醒的同学跟着鼓起了掌"

        const title3 = document.getElementById('title-3');
        title3.textContent = "大厅"
        const text3 = document.getElementById('text-3');
        text3.textContent = "大屏幕里的植物其实是真的"

    }

    CreateModels(){
        /**
         * Building
         */
        let arch_level1 =  null;
        
        //Loader
        modelLoader = new ModelLoader(this.scene)

        // modelLoader.Load2Scene('models/sz_level/', 'shenzhen_base', 'glb',(modelPtr) => {
        //     // window.debug_ui.add(modelPtr.position,"x").min(-1000).max(600).step(1)
        //     // window.debug_ui.add(modelPtr.position,"y").min(-1000).max(600).step(1)
        //     // window.debug_ui.add(modelPtr.position,"z").min(-1000).max(600).step(1)

        //     console.log(modelPtr)
        //     arch_level1 = modelPtr;
        //     arch_level1.scale.set(5,5,5)
        //     arch_level1.position.set(-307,-22,44)
        //     modelPtr.traverse((child) => {
        //         if(child.isMesh)child.material.doublesided = true;
                
        //         child.castShadow = true
        //         child.receiveShadow = true
        //     })

        // })

        modelLoader.Load2Scene('models/sz_level/', 'basement_ultraSimp_i', 'glb',(modelPtr) => {
            

            // Create MeshBasicMaterial for the classMat (red)
            const classMat = new THREE.MeshStandardMaterial({ color: 0xff0000 , opacity: 0.2, transparent: true , depthWrite:false, side: THREE.DoubleSide,
                alphaTest: 0.1,format: THREE.RGBAFormat});

            // Create MeshBasicMaterial for the meetMat (blue)
            const meetMat = new THREE.MeshStandardMaterial({ color: 0x00b4d8, opacity: 0.2, transparent: true , depthWrite:false, side: THREE.DoubleSide,
                alphaTest: 0.1,format: THREE.RGBAFormat});

            console.log(modelPtr)
            arch_level1 = modelPtr;
            arch_level1.scale.set(5,5,5)
            arch_level1.position.set(-167,-41,107)
            modelPtr.traverse((child) => {
                let tokens = child.name.split('_');
                if(tokens[0] == "interactive"){
                    console.log("found " + child.name)
                    if(tokens[1] == "meeting"){
                        child.material = meetMat
                        this.interactiveModelManager.addInteractiveModel(child)
                    }
                    else if(tokens[1] == "class"){
                        child.material = classMat
                        let modelData = this.interactiveModelManager.addInteractiveModel(child)
                        modelData.clickAction = () =>{
                            console.log("go to classroom")
                            let sceneManager = new SceneManager()
                            sceneManager.LoadScene('Room')
                        }
                    }
                    
                    //child.frustumCulled = false
                    child.renderOrder = -1
                }
                else if(tokens[0] == "LevelIndicator"){
                    child.material = new THREE.MeshBasicMaterial({ color: 0xff1111, opacity: 0.7, transparent: true });
                }
                else{
                    child.castShadow = true
                    child.receiveShadow = true
                }
                
            })
            console.log(this.interactiveModelManager)
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

        console.log(window.debug_ui)
        this.scene.fog = new THREE.Fog( 0xcccccc, 700, 1500 );

        const axesHelper = new THREE.AxesHelper( 1000 );
        this.scene.add( axesHelper );
    }

    /**
     * set the ideal camera location that can view the stuffs in scene
     */
    setIdealCameraLocation(camera) {
        camera.position.set(71,143,159)
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