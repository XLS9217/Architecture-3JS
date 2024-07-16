import { Raycaster } from "three"
import * as THREE from 'three'
import { mod, reference } from "three/examples/jsm/nodes/Nodes.js"
import UserState from "../UserState"
import {sceneCameraManager} from "./CameraManager.js"

let instance = null

const hover_material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#ff0055')
})

const select_material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#ff0055'),
    wireframe: true
})

//left button
window.addEventListener('click', () =>
{
    if(instance.currentIntersect)
        instance.triggerClickAction(instance.currentIntersect.object)
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    //console.log('Mouse position (screen coordinates):', mouseX, mouseY);
    // console.log(sceneManager.currentGraph)
    // console.log(objectsToTest)
})

export default class InteractiveModelMangaer{

    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this

        //store the reference the model
        this.interactiveModels = [] 

        /*
        store the matadata of the model, use the material to revert the material change 
        name
        material
        hasChanged
        */
        this.interactiveModel_data = []
        this.currentIntersect = null
    }

    findParentGroup(object) {
        const interactiveModels = this.getInteractiveModels();
        while (object.parent && interactiveModels.includes(object.parent)) {
            //console.log(object.name + " has parent")
            object = object.parent;
        }
        return object;
    }

    update(){
        //Raycast with mouse click
        let raycaster = new Raycaster()
        let userState = new UserState()

        let objectsToTest = this.getInteractiveModels()

        raycaster.setFromCamera(userState.getUserMouse(), sceneCameraManager.getCamera())
        const intersects = raycaster.intersectObjects(objectsToTest)

        // Reset all objects to red
        for (const object of objectsToTest) {
            //object.material.color.set('#ff0000');
            this.triggerIdleAction(object)

            this.revertInteractiveModelMaterial(object,false)
        }

        // Change color of the closest intersected object to blue
        if (intersects.length > 0) {
            this.currentIntersect = intersects[0]
            this.triggerHoverAction(this.currentIntersect.object)
            this.currentIntersect.object = this.findParentGroup(this.currentIntersect.object)
        }else{
            this.currentIntersect = null
        }
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

        if(this.interactiveModels.includes(model.parent)){
            return
        }

        this.interactiveModels.push(model)
        let reference = {
            name: model.name,
            material: model.material,
            hasChanged: false,
            isSelected: false,
            //variables for furthere customization
            idleAction: null, //what to do when idling, before hover
            hoverAction: () => {
                this.setInteractiveModelMaterial(this.currentIntersect.object, hover_material, false)
            }, //has to take memory as first variable
            clickAction: ()=>{
                console.log("mouse intersect with " + instance.currentIntersect.object.name)
                //console.log(instance.currentIntersect.object)
            }, //has to take memory as first variable
            memory: null
        }
        this.interactiveModel_data.push(reference)
        return reference
    }

    triggerHoverAction(obj){
        obj = this.findParentGroup(obj)
        for(const metaData of this.interactiveModel_data){
            if(obj.name == metaData.name && metaData.hoverAction){
                metaData.hoverAction(metaData.memory)
                return true;
            }
        }
        return false;
    }

    triggerIdleAction(obj){
        if(obj == null) return
        for(const metaData of this.interactiveModel_data){
            if(obj.name == metaData.name && metaData.idleAction){
                metaData.idleAction(metaData.memory)
                return true;
            }
        }
        return false;
    }

    triggerClickAction(obj){
        //console.log('click action for ' + obj.name)
        //console.log(obj)
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