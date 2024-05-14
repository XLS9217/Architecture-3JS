export default class SceneGraph{
    constructor(){

    }

    loadScene(){}
    CreateLights(){}
    Create2DPoints(){}
    CreateModels(){}
    CreateEnvironmentMap(){}
    setIdealCameraLocation(camera) {}
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