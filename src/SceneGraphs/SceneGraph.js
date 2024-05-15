import InteractiveModelMangaer from "../Utils/InteractiveModelMangaer";

export default class SceneGraph{
    constructor(inputScene){
        /**
         * Start creating scene
         */
        this.scene = inputScene;
        this.interactiveModelManager = new InteractiveModelMangaer()
    }

    loadScene(){
        this.interactiveModelManager.clearSceneData()
        //Scene Props
        this.CreateLights()
        this.CreateModels()
        this.Create2DPoints()
        this.CreateEnvironmentMap()
    }


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