import * as THREE from 'three'
import { gsap } from 'gsap'
import SceneManager from './SceneManager'

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

    hopToPosition(xPos, yPos, zPos){
        gsap.to(camera.position, { 
            duration: 1, 
            x: xPos, 
            y: yPos, 
            z: zPos,
            onComplete: () => {
                console.log('Finished');
                let sceneManager = new SceneManager()
                sceneManager.RecalculateRenderOrder()
            }
        });
    }
}