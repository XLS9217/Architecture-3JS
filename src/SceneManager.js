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
            hasChanged: false,
            isSelected: false
        })
    }

    getInteractiveModels(){
        return interactiveModels
    }

    //if it is clicked, set is selected, until it's clicked agian, don't set back on hover over
    setInteractiveModelMaterial(object, material, isClicked){
        for(const obj of interactiveModels){
            //console.log(obj.model.name + " and " + model.name)
            if(obj.name == object.name){
                // console.log("found set model")
                // console.log(metaData)
                const metaData = interactiveModel_data.find(item => item.name === object.name);
                if(isClicked){
                    if(!metaData.isSelected){
                        metaData.isSelected = true
                        obj.material = material
                    }
                }else{
                    if(!metaData.isSelected){
                        obj.material = material
                    }
                }
                //obj.material = material
                metaData.hasChanged = true
            }
        }
    }

    revertInteractiveModelMaterial(object, isClicked){
        for(const metaData of interactiveModel_data){
            if(metaData.name == object.name && metaData.hasChanged){
                if(isClicked){
                    // console.log("found revert model data")
                    // console.log(metaData)
                    if(metaData.isSelected){
                        metaData.isSelected = false
                        object.material = metaData.material
                    }
                }else{  
                    if(!metaData.isSelected)
                        object.material = metaData.material
                }
            }
        }
    }

    printInteractiveModel(model){
        console.log("Interactive Model----------------")
        const metaData = interactiveModel_data.find(item => item.name === model.object.name);
        console.log(metaData)
        console.log(model)
    }
}