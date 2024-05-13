import SurveillanceCamera from "./SurveillanceCamera"

let instance = null
//string key with Surveillance Camera Class value
let cameras = {
    'defaultKey': null
}

export default class RealCameraManager{
    
    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
    }

    AddCamera(name, camera){
        cameras[name] = camera
    }

    TurnOffCameras(){
        for(const ele in cameras){
            if(cameras[ele] instanceof SurveillanceCamera && cameras[ele].cameraDisplaying){
                cameras[ele].toggleCameraDisplaying()
            }
        }
    }   

    ToggleSurveillanceCamera(name){
        let camera = cameras[name]
        if(camera instanceof SurveillanceCamera){
            camera.toggleCameraDisplaying()
        }else{
            throw new Error("This is not a surceillance Camera");
        }
    }
}