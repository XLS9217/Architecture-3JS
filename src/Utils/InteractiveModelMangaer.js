import { mod, reference } from "three/examples/jsm/nodes/Nodes.js"

let instance = null



export default class InteractiveModelMangaer{

    constructor(){
        // // Singleton
        // if(instance)
        // {
        //     return instance
        // }
        // instance = this

        //store the reference the model
        this.interactiveModels = [] 

        /*
        store the matadata of the model, use the material to revert the material change 
        name
        material
        hasChanged
        */
        this.interactiveModel_data = []
    }

    clearSceneData(){
        console.log("clear scene data")
        this.interactiveModels = [];
        this.interactiveModel_data = []
    }



    /**
     * add the interactive model to interactiveModels for fast return, and to interactiveModel_data for data processing
     */
    addInteractiveModel(model){
        this.interactiveModels.push(model)
        let reference = {
            name: model.name,
            material: model.material,
            hasChanged: false,
            isSelected: false,
            //variables for furthere customization
            hoverAction: null, //has to take memory as first variable
            clickAction: null, //has to take memory as first variable
            memory: null
        }
        this.interactiveModel_data.push(reference)
        return reference
    }

    triggerHoverAction(obj){
        for(const metaData of this.interactiveModel_data){
            if(obj.name == metaData.name && metaData.hoverAction){
                metaData.hoverAction(metaData.memory)
                return true;
            }
        }
        return false;
    }


    triggerClickAction(obj){
        for(const metaData of this.interactiveModel_data){
            if(obj.name == metaData.name && metaData.clickAction){
                metaData.clickAction(metaData.memory)
                return true;
            }
        }
        return false;
    }

    getInteractiveModels(){
        return this.interactiveModels
    }

    //if it is clicked, set is selected, until it's clicked agian, don't set back on hover over
    setInteractiveModelMaterial(object, material, isClicked){
        for(const obj of this.interactiveModels){
            //console.log(obj.model.name + " and " + model.name)
            if(obj.name == object.name){
                // console.log("found set model")
                // console.log(metaData)
                const metaData = this.interactiveModel_data.find(item => item.name === object.name);
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
        for(const metaData of this.interactiveModel_data){
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
        const metaData = this.interactiveModel_data.find(item => item.name === model.object.name);
        console.log(metaData)
        console.log(model)
    }
}