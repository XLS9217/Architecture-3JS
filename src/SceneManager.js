import { mod } from "three/examples/jsm/nodes/Nodes.js"

let instance = null

//store the reference the model
let interactiveModels = [] 

 /*
 store the matadata of the model, use the material to revert the material change 
 name
 material
 hasChanged
 */
let interactiveModel_data = []

export default class SceneManager{

    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
    }

    /**
     * add the interactive model to interactiveModels for fast return, and to interactiveModel_data for data processing
     */
    addInteractiveModel(model){
        interactiveModels.push(model)
        interactiveModel_data.push({
            name: model.name,
            material: model.material,
            hasChanged: false
        })
    }

    getInteractiveModels(){
        return interactiveModels
    }

    setInteractiveModelMaterial(object, material){
        for(const obj of interactiveModels){
            //console.log(obj.model.name + " and " + model.name)
            if(obj.name == object.name){
                console.log("found model")
                obj.material = material
            }
        }
    }

    revertInteractiveModelMaterial(object){

    }
}