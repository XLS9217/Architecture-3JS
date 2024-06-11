import * as THREE from 'three'


let instance = null

const clock = new THREE.Clock()
let timeUniform = new THREE.Uniform(0.0)
let resolutionUnifrom = new THREE.Uniform(new THREE.Vector2( window.innerWidth * Math.min(window.devicePixelRatio, 2), window.innerHeight * Math.min(window.devicePixelRatio, 2)))


export default class ShaderMaterialManager{
    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this 
    }

    updateUniforms(){
        timeUniform.value = clock.getElapsedTime()
        let resolution = new THREE.Vector2( window.innerWidth * Math.min(window.devicePixelRatio, 2), window.innerHeight * Math.min(window.devicePixelRatio, 2))
        resolutionUnifrom.value = resolution
    }


}