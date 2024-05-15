import InteractiveModelMangaer from "../Utils/InteractiveModelMangaer";
import * as THREE from 'three'
import SceneManager from "../Utils/SceneManager";
import SceneCameraManager from "../Utils/CameraManager";

export default class SceneGraph{
    constructor(inputScene){
        /**
         * Start creating scene
         */
        this.scene = inputScene;
        this.interactiveModelManager = new InteractiveModelMangaer()
        this.lightGroups = {
            'day': new THREE.Group(),
            'afternoon': new THREE.Group(),
            'night': new THREE.Group(),
        }
        this.currentLightGroup = this.lightGroups['afternoon']
        this.GenerateLight()
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
        console.log(afternoon_DLight.shadow.camera)
        // const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // this.scene.add( helper );
        this.lightGroups['afternoon'].add(afternoon_DLight)

        /**
        * day Lights
        */
        const day_DLight = new THREE.DirectionalLight(0xffffaa, 2.0)
        day_DLight.position.set(158,357,126)
        day_DLight.target.position.set(-300,-50,-200)
        day_DLight.castShadow = true 
        day_DLight.shadow.mapSize.set(1024, 1024)
        day_DLight.shadow.camera.scale.x = 40
        day_DLight.shadow.camera.scale.z = 30
        day_DLight.shadow.camera.scale.y = 50
        console.log(day_DLight.shadow.camera)
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
        console.log(night_DLight.shadow.camera)
        // const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // this.scene.add( helper );
        this.lightGroups['night'].add(night_DLight)
    }

    loadScene(){
        this.interactiveModelManager.clearSceneData()
        
        //switch light by environment of scene
        let sceneManager = new SceneManager()
        this.SwitchLightGroup(sceneManager.currrentEnvironment)
        
        //Scene Props
        this.CreateLights()
        this.CreateModels()
        this.Create2DPoints()
        this.CreateEnvironmentMap()
    }


    CreateLights(){
        this.scene.add(this.currentLightGroup)
    }

    Create2DPoints(){}
    CreateModels(){}
    CreateEnvironmentMap(){}
    setIdealCameraLocation(camera) {}

    SwitchLightGroup(groupName){
        this.scene.remove(this.currentLightGroup)
        this.currentLightGroup = this.lightGroups[groupName]
        this.scene.add(this.currentLightGroup)
    }

    isSceneReady(){}
    unloadScene(){}

    getPoints(){
        //console.log("getPoints")
        return [];
    }

    getTags(){
        //console.log("getTags")
        return [];
    }
}