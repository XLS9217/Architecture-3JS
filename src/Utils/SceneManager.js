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
import SceneCameraManager from './CameraManager'
import ModelLoader from './ModelLoader'
import LoadingSpinner from '../2DElements/LoadingSpinner'
import DropParticle3D from '../Particles/DropParticle3D'
import TestScene from '../SceneGraphs/TestScene'
import { color } from 'three/examples/jsm/nodes/Nodes.js'
import HeatZoneTest from '../SceneGraphs/HeatZoneTest'
import Earth from '../SceneGraphs/Earth'

//spinner.stop();

let instance = null
let scene = null
let camera = null
const raycaster = new THREE.Raycaster()
const rgbeLoader = new RGBELoader()

let timeUniform = new THREE.Uniform(0.0)
let resolutionUnifrom = new THREE.Uniform(new THREE.Vector2( window.innerWidth * Math.min(window.devicePixelRatio, 2), window.innerHeight * Math.min(window.devicePixelRatio, 2)))

//when optimizing need this three variable
let envMaps = {};

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
        this.currrentEnvironment = 'afternoon'

        this.spinner = new LoadingSpinner()

        //SceneGraphs
        this.shenzhenArch = new SingleArchitecture(scene)
        this.shenzhenL1 = new ShenZhen_Level1(scene)
        this.shenzhenL2 = new ShenZhen_Level2(scene)
        this.shenzhenL3 = new ShenZhen_Level3(scene)
        this.shenzhenBase = new ShenZhen_Basement(scene)
        this.classRoom = new Classroom(scene)
        this.mainDisplay = new ShenZhen_MainDisplay(scene)
        this.testScene = new TestScene(scene)
        this.heatZoneTest = new HeatZoneTest(scene)
        this.earth = new Earth(scene)

        this.LoadEnvironmentMap('EnvMap/afternoon_1_1k.hdr', 'afternoon')

        //weather
        this.currentWeather = 'none'
        this.dropParticle = null
    }

    GetScene(){
        return scene
    }

    GetCamera(){
        return camera
    }

    GetTimeUniform(){
        return timeUniform;
    }

    UpdateTimeUniform( time ){
        timeUniform.value = time
    }

    UpdateResolutionUniform(){
        let resolution = new THREE.Vector2( window.innerWidth * Math.min(window.devicePixelRatio, 2), window.innerHeight * Math.min(window.devicePixelRatio, 2))
        resolutionUnifrom.value = resolution
    }

    ChangeWind(windDir){
        this.dropParticle.changeWindStrength(0.75)
        this.dropParticle.changeWindDirection(windDir)
    }

    //none or type that is listed in DropParticle.js
    ChangeWeather(weather){
        // if(weather == this.currentWeather){
        //     return
        // }
        this.currentWeather = weather

        if(this.dropParticle){     
            console.log("remove")
            this.dropParticle.deconstruct()
            scene.remove(this.dropParticle.getParticles())
        }

        if(weather != 'none'){
            this.SwitchEnvironment('weather')
        }else{
            this.SwitchEnvironment('afternoon')
        }

        if(weather == 'snow'){
            this.dropParticle = new DropParticle3D(
                2500,//amount
                2.0,//size
                7.0,//speed
                'snow',//type
                300,//ceil
                0,//floor
                600,//width
                600,//depth
                timeUniform,
                resolutionUnifrom
            )    
            scene.add(this.dropParticle.getParticles())
        }
        else if(weather == 'rain'){
            this.dropParticle = new DropParticle3D(
                2500,//amount
                5.0,//size
                110.0,//drop speed
                'rain',//type
                300,//ceil
                0,//floor
                600,//width
                600,//depth
                timeUniform,
                resolutionUnifrom
            )    
            scene.add(this.dropParticle.getParticles())
        }
        
    }

    RecalculateRenderOrder() {
        const meshes = [];
    
        // Traverse the scene to find all meshes
        scene.traverse((object) => {
            if (object.isMesh) {
                meshes.push(object);
            }
        });
    
        // Update renderOrder based on distance to the camera
        meshes.forEach((mesh) => {
            mesh.renderOrder = mesh.position.distanceTo(camera.position);
        });
    
        // Optional: Sort meshes by renderOrder
        meshes.sort((a, b) => a.renderOrder - b.renderOrder);
    
        // Optionally, if you want to apply a specific order manually (if sorting is not enough)
        meshes.forEach((mesh, index) => {
            mesh.renderOrder = index;
        });
    }

    DeleteLight(){
        const lightsToDelete = [];
    
        // Traverse through all elements in the scene
        scene.traverse((object) => {
            if (object instanceof THREE.Light) {
                console.log(object)
                // Add the light to the array
                lightsToDelete.push(object);
            }
        });
        console.log(lightsToDelete)
        // Delete the lights from the scene
        lightsToDelete.forEach((light) => {
            scene.remove(light);
        });
    }

    /**
     * environment is a string that can be
     * day -- day_1_2k.hdr
     * afternoon -- afternoon_1_1k.hdr
     * night -- night_1_4k.hdr
     */
    SwitchEnvironment( environment ){

        if(this.currentWeather != 'none' && environment != 'weather'){
            console.log('There is weather, change cancelled')
            return
        }

        this.currrentEnvironment = environment
        this.spinner.spin()

        gsap.to(scene, {
            duration: 1.5,
            backgroundBlurriness: 1.0,
            backgroundIntensity: 0.0,
            onComplete: () => {
                if(envMaps[environment]){
                    scene.background = envMaps[environment]
                    scene.environment = envMaps[environment]
                    
                }else{

                    if(environment == 'day'){
                        this.LoadEnvironmentMap('EnvMap/day_1_2k.hdr', environment)
                    }
                    else if(environment == 'afternoon'){
                        this.LoadEnvironmentMap('EnvMap/afternoon_1_1k.hdr', environment)
                    }
                    else if(environment == 'night'){
                        this.LoadEnvironmentMap('EnvMap/night_1_4k.hdr', environment)
                    }
                    else if(environment == 'weather'){
                        console.log("weather ")
                        this.LoadEnvironmentMap('EnvMap/weather_2_2k.hdr', environment)
                    }
                }
                
                this.currentGraph.SwitchLightGroup(environment)
                gsap.to(scene, {
                    duration: 1.5,
                    backgroundBlurriness: 0.0,
                    backgroundIntensity: 1.0,
                    onComplete: () => { 
                        this.spinner.stop()
                    }
                })
            }
        })


    }

    LoadEnvironmentMap(src,environment){
        rgbeLoader.load(src, (environmentMap) =>
        {
            environmentMap.mapping = THREE.EquirectangularReflectionMapping
            environmentMap.rotation = new THREE.Matrix4().makeRotationY(Math.PI); // Example: Rotate 180 degrees around Y axis

            scene.background = environmentMap
            scene.environment = environmentMap

            envMaps[environment] = environmentMap
        })
    }

    //in charge of linking the string to the scene
    LoadScene(sceneName){
        //some scene might not want to handle envmap and weather on their own
        let keepPrevEnv = true;

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
        else if(sceneName == 'test'){
            this.LoadGraph(this.testScene)
        }
        else if(sceneName == 'HeatZone'){
            this.LoadGraph(this.heatZoneTest)
        }
        else if(sceneName == 'Earth'){
            this.LoadGraph(this.earth)
            keepPrevEnv = false;
        }

        if(keepPrevEnv){
            this.SwitchEnvironment(this.currrentEnvironment)
            this.ChangeWeather(this.currentWeather)
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

        //set light group
        //this.currentGraph.SwitchLightGroup(this.currrentEnvironment)

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
                    tag.unhide(opacity)
                }
                else
                {

                    // Get the distance of the intersection and the distance of the point
                    const intersectionDistance = intersects[0].distance

                    // Intersection is close than the point
                    if(intersectionDistance < pointDistance || pointDistance > minimunPointDistance)
                    {
                        if(intersects[0].object.name != 'TagIgnore') //SPECIAL TYPE OF MESH, LATER CONSIDER COLLISION CHANNEL
                            tag.hide()
                    }
                    // Intersection is further than the point
                    else
                    {
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