import * as THREE from 'three'
import FloorVertex from '../Shaders/VertexShaders/Floor_Vertex.glsl'
import FloorFragment from '../Shaders/FragmentShaders/Floor_Fragment.glsl'


let instance = null

let floorMaterial = new THREE.ShaderMaterial({
    vertexShader: FloorVertex,
    fragmentShader: FloorFragment,
})

export default class ShaderMaterialFactory{
    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this 
    }

    updateUniforms(){
        
    }

    getFloorMaterial(){
        return floorMaterial;
    }
}