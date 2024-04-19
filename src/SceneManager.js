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
                console.log("found set model")
                obj.material = material
                const dataLink = interactiveModel_data.find(item => item.name === object.name);
                dataLink.hasChanged = true
                console.log(dataLink)
            }
        }
    }

    revertInteractiveModelMaterial(object){
        for(const obj of interactiveModel_data){
            //console.log(obj.model.name + " and " + model.name)
            if(obj.name == object.name && obj.hasChanged){
                console.log("found revert model")
                object.material = obj.material
            }
        }
    }
}