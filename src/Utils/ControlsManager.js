import * as THREE from 'three'

let instance = null

export default class ControlsManager{
    constructor(inputScene, inputCamera, inputControl){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this;
    }
}