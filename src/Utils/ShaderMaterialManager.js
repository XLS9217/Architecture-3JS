import * as THREE from 'three'
import FloorVertex from '../Shaders/VertexShaders/Floor_Vertex.glsl'
import FloorFragment from '../Shaders/FragmentShaders/Floor_Fragment.glsl'


let instance = null

const clock = new THREE.Clock()
let timeUniform = new THREE.Uniform(0.0)
let resolutionUnifrom = new THREE.Uniform(new THREE.Vector2( window.innerWidth * Math.min(window.devicePixelRatio, 2), window.innerHeight * Math.min(window.devicePixelRatio, 2)))


let floorMaterial = new THREE.ShaderMaterial({
    vertexShader: FloorVertex,
    fragmentShader: FloorFragment,
    uniforms: {
        uResolution: resolutionUnifrom,
        uTime: timeUniform,
        uWeatherType: new THREE.Uniform(-1),//-1 == no weather, 0 == snow, 1 == rain
    }, 
})

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

    getFloorMaterial(){
        return floorMaterial;
    }
}