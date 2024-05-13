let instance = null
let camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1500)

export default class SceneCameraManager{
    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this;

    }

    getCamera(){
        return camera
    }
}