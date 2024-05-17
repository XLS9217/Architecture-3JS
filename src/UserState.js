let instance = null

export default class UserState{
    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this 

        this.elapsedTime = 0.0
    }


}