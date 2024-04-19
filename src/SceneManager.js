let instance = null
let interactiveModels = []

export default class SceneManager{

    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
    }

    addInteractiveModel(model){
        interactiveModels.push(model)
    }

    getInteractiveModels(){
        return interactiveModels
    }
}