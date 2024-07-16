//three js classes
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

//performance and debug
import GUI from 'lil-gui'
import Stats from 'stats.js'

//my classes
import InteractiveModelMangaer from './Utils/InteractiveModelMangaer';
import FloatTag2D from './2DElements/FloatTag2D';
import ModelLoader from './Utils/ModelLoader';

//scene graphes
import SceneManager from './Utils/SceneManager';
import SurveillanceCamera from './Utils/SurveillanceCamera';
import RealCameraManager from './Utils/RealCameraManager';
import Canvas2D from './Utils/Canvas2D';
import ControlsManager from './Utils/ControlsManager';
import SceneCameraManager from './Utils/CameraManager';
import { RGBELoader } from 'three/examples/jsm/Addons.js';
import UserState from './UserState';
import ShaderMaterialManager from './Utils/ShaderMaterialManager';
import MQRouter from './MQRouter';
import DebugManager from './Utils/DebugManager';
import RendererManager from './Utils/RenderManager';



/*
 * Begin init scene prop -------------------------------------------------
 */

//UserState
const userState = new UserState()
//router
let router = new MQRouter();

//Statistics 
const stats = new Stats()
stats.showPanel(0) 
document.body.appendChild(stats.dom)

// Canvas
const canvas = document.querySelector('canvas.webgl')
const canvas2D = new Canvas2D();//the 2d Canvas

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper( 1000 );
scene.add( axesHelper );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

sizes.resolution = new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height* sizes.pixelRatio)
/**
 * Camera
 */
// Base camera
const sceneCameraManager = new SceneCameraManager()
const camera = sceneCameraManager.getCamera()
scene.add(camera)

// Controls
const controlsManager = new ControlsManager(camera,canvas)

/**
 * Renderer
 */
const rendererManager = new RendererManager(
    document.querySelector('canvas.webgl'),
    scene,
    camera
)

//SceneMangaer
const sceneManager = new SceneManager(scene, camera, controlsManager.getCurrentControl())
sceneManager.currentControl = controlsManager.getCurrentControl()
sceneManager.LoadScene('test')
sceneManager.UpdateResolutionUniform(sizes.resolution)
sceneManager.ChangeWeather('none')

//iteractive model Manager
let interactiveModelManager =  sceneManager.currentGraph.interactiveModelManager


let debugManager = new DebugManager()

/**
 * End init scene prop-------------------------------------------------
 */



/**
 * Interactive logic-------------------------------------------------
 */

/**
 * Points of interest
 */
const raycaster = new THREE.Raycaster()
let currentIntersect = null



/**
 * Interaction Logic----------------------------------------------------------------
 */


document.body.onkeyup = function(e) {
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      alert(camera.position.x + "\n" + camera.position.y + "\n" +  camera.position.z)
      console.log(camera.position.x + "," + camera.position.y + "," +  camera.position.z)
    }
}

//resize
window.addEventListener('resize', () =>
{
    canvas2D.resizeCanvas2D()

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio,2)
    sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height* sizes.pixelRatio)
    sceneManager.UpdateResolutionUniform()

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    rendererManager.renderer.setSize(sizes.width, sizes.height)
    rendererManager.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    rendererManager.labelRenderer.setSize( window.innerWidth, window.innerHeight );
})




//right button
window.addEventListener('contextmenu', () => {
    if(currentIntersect){
        interactiveModelManager.revertInteractiveModelMaterial(currentIntersect.object, true)
    }
    
});

//mouse wheel
window.addEventListener('mousedown', (event) => {
    // Check if the button clicked is the mouse wheel button (button code 1)
    if (event.button === 1) {
        if(currentIntersect)
            interactiveModelManager.printInteractiveModel(currentIntersect)
    }
});


//bind button functions to the button in index.html
import buttonBind from './Utils/ButtonBind.js'
buttonBind()



// Get references to the button and iframe elements
const cameraButton = document.getElementById('cameraView');
const cameraFrame = document.getElementById('cameraFrame');
let isCameraViewDisplaying = false;

let realCameraManager = new RealCameraManager()
let surveillanceCamera = new SurveillanceCamera('http://172.16.40.58:8080/live/test2.flv', document.getElementById('cameraFeed'))
realCameraManager.AddCamera('shgbit_door',surveillanceCamera)

// Add event listener to toggle camera feed
cameraButton.addEventListener('click', ()=>{
    realCameraManager.ToggleSurveillanceCamera('shgbit_door')
});



let unrealButton = document.getElementById('AdvencedView')
// Add event listener to toggle camera feed
unrealButton.addEventListener('click', ()=>{
    window.open('http://172.16.16.163', 'smallWindow', 'width=960,height=510');
});





//test ground --------------------------------------------------------------------------------------------







//test ground end-----------------------------------------------------------------------------------------
const clock = new THREE.Clock()
let objectsToTest = interactiveModelManager.getInteractiveModels()

/**
 * Core Loop for animation and rendering
 */
const tick = () =>
{
    stats.begin();
    //update elapsed time
    sceneManager.UpdateTimeUniform(clock.getElapsedTime())

    // Update controls
    controlsManager.update()

    //Update 2d canvas
    canvas2D.updateCanvas2D()

    //Mouse Model Interaction Logic
    interactiveModelManager.update()

    // Render
    rendererManager.render()

    //HIGHEST PRIORITY
    sceneManager.Update()

    // End the stats
    stats.end();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()