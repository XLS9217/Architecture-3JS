import * as THREE from 'three'
import { gsap } from 'gsap'
import SingleArchitecture from '../SceneGraphs/SingleArchitecture'
import ShenZhen_Level1 from '../SceneGraphs/ShenZhen_Level1'
import ShenZhen_Level2 from '../SceneGraphs/ShenZhen_Level2'
import ShenZhen_Level3 from '../SceneGraphs/ShenZhen_Level3'
import ShenZhen_Basement from '../SceneGraphs/ShenZhen_Basement'
import Classroom from '../SceneGraphs/Classroom'
import RealCameraManager from './RealCameraManager'
import ShenZhen_MainDisplay from '../SceneGraphs/ShenZhen_MainDisplay'
import ControlsManager from './ControlsManager'
import { RGBELoader } from 'three/examples/jsm/Addons.js'

let instance = null
let scene = null
let camera = null
const raycaster = new THREE.Raycaster()
const rgbeLoader = new RGBELoader()

export default class SceneManager{
    constructor(inputScene, inputCamera, inputControl){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this 

        scene = inputScene
        camera = inputCamera
        this.currentGraph = null
        this.currentControl = inputControl

        //SceneGraphs
        this.shenzhenArch = new SingleArchitecture(scene)
        this.shenzhenL1 = new ShenZhen_Level1(scene)
        this.shenzhenL2 = new ShenZhen_Level2(scene)
        this.shenzhenL3 = new ShenZhen_Level3(scene)
        this.shenzhenBase = new ShenZhen_Basement(scene)
        this.classRoom = new Classroom(scene)
        this.mainDisplay = new ShenZhen_MainDisplay(scene)
    }

    GetCamera(){
        return camera
    }

    LoadEnvironmentMap(src){
        rgbeLoader.load(src, (environmentMap) =>
        {
            environmentMap.mapping = THREE.EquirectangularReflectionMapping
            
            scene.background = environmentMap
            scene.environment = environmentMap

            console.log(scene.environment)
        })
    }

    //in charge of linking the string to the scene
    LoadScene(sceneName){
        if(sceneName == 'Arch'){
            this.LoadGraph(this.shenzhenArch)
        }
        else if(sceneName == 'Base'){
            this.LoadGraph(this.shenzhenBase)
        }
        else if(sceneName == 'L1'){
            this.LoadGraph(this.shenzhenL1)
        }
        else if(sceneName == 'L2'){
            this.LoadGraph(this.shenzhenL2)
        }
        else if(sceneName == 'L3'){
            this.LoadGraph(this.shenzhenL3)
        }
        else if(sceneName == 'Room'){
            this.LoadGraph(this.classRoom)
        }
        else if(sceneName == 'MainDisplay'){
            this.LoadGraph(this.mainDisplay, this.currentControl)
        }
    }

    //in charge of what to do when loading a new scene graph
    LoadGraph(sceneGraph){
        //clear the 2d points
        if(this.currentGraph){
            for(const point of this.currentGraph.getPoints())
            {
                point.element.classList.remove('visible')
            }
            this.currentGraph.unloadScene()
        }

        //clear environment map
        scene.background = null
        scene.environment = null

        //turn off camera
        let realCameraManager = new RealCameraManager()
        realCameraManager.TurnOffCameras()

        //clear the scene and add a new graph
        scene.clear();
        this.currentGraph = sceneGraph
        this.currentGraph.loadScene()
        this.currentGraph.setIdealCameraLocation(camera)
        this.currentControl.target.set(0, 0, 0);
    }

    Update2DTagVisibility(sizes){
        
        let minimunPointDistance = 400  

        if(this.currentGraph.isSceneReady())
        {
            
            // Go through each tag
            for(const tag of this.currentGraph.getTags())
            {

                const screenPosition = tag.position.clone()
                screenPosition.project(camera)

                // Set the raycaster
                raycaster.setFromCamera(screenPosition, camera)
                const intersects = raycaster.intersectObjects(scene.children, true)
                //console.log(intersects)

                
                const pointDistance = tag.position.distanceTo(camera.position)
                const distanceRatio = (minimunPointDistance-pointDistance) / minimunPointDistance
                const opacity = 1-Math.cos((distanceRatio+0.5) * Math.PI/2)
                //console.log(opacity)

                // No intersect found
                if(intersects.length === 0)
                {
                    // Show
                    tag.unhide(opacity)
                }
                else
                {
                    // Get the distance of the intersection and the distance of the point
                    const intersectionDistance = intersects[0].distance

                    // Intersection is close than the point
                    if(intersectionDistance < pointDistance || pointDistance > minimunPointDistance)
                    {
                        // Hide
                        tag.hide()
                        //console.log("hide")
                    }
                    // Intersection is further than the point
                    else
                    {
                        // Show
                        tag.unhide(opacity)
                    }
                }
            }




            // Go through each point
            for(const point of this.currentGraph.getPoints())
            {

                // Get 2D screen position
                const screenPosition = point.position.clone()
                screenPosition.project(camera)
        
                // Set the raycaster
                raycaster.setFromCamera(screenPosition, camera)
                const intersects = raycaster.intersectObjects(scene.children, true)
        
                // No intersect found
                if(intersects.length === 0)
                {
                    // Show
                    point.element.classList.add('visible')
                }

                // Intersect found
                else
                {
                    // Get the distance of the intersection and the distance of the point
                    const intersectionDistance = intersects[0].distance
                    const pointDistance = point.position.distanceTo(camera.position)
        
                    // Intersection is close than the point
                    if(intersectionDistance < pointDistance || pointDistance > minimunPointDistance)
                    {
                        // Hide
                        point.element.classList.remove('visible')
                    }
                    // Intersection is further than the point
                    else
                    {
                        // Show
                        point.element.classList.add('visible')
                    }
                }
        
                const translateX = screenPosition.x * sizes.width * 0.5
                const translateY = - screenPosition.y * sizes.height * 0.5
                point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
            }
        }else{
            //console.log("not ready")
            //hide tags and points first
            if(this.currentGraph && this.currentGraph.isSceneReady()){
                for(const tag of this.currentGraph.getTags()) tag.unhide(opacity)
                for(const point of this.currentGraph.getPoints()) point.element.classList.remove('visible')
            }
        }
    }
}