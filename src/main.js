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

//const controls = controlsManager.currentControl

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(0xcccccc)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.alpha = true; // Enable alpha blending
renderer.sortObjects = true

let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement)

//material manager
const shaderMaterialManager = new ShaderMaterialManager()

//SceneMangaer
const sceneManager = new SceneManager(scene, camera, controlsManager.getCurrentControl())
sceneManager.currentControl = controlsManager.getCurrentControl()
//sceneManager.LoadScene('Arch')//======================================================
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
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

    //console.log(mouse)
})

/**
 * Interaction Logic----------------------------------------------------------------
 */
const hover_material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#ff0055')
})

const select_material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#ff0055'),
    wireframe: true
})

document.body.onkeyup = function(e) {
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      alert(camera.position.x + "\n" + camera.position.y + "\n" +  camera.position.z)
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
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    labelRenderer.setSize( window.innerWidth, window.innerHeight );
})


//left button
window.addEventListener('click', () =>
{
    if(currentIntersect){
        if(!interactiveModelManager.triggerClickAction(currentIntersect.object))
            interactiveModelManager.setInteractiveModelMaterial(currentIntersect.object, select_material, true)
        console.log("mouse intersect with " + currentIntersect.object.name)
    }
    
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    //console.log('Mouse position (screen coordinates):', mouseX, mouseY);
    // console.log(sceneManager.currentGraph)
    // console.log(objectsToTest)
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



// Get each button by its ID
const mainButton = document.getElementById('main');
const level1Button = document.getElementById('level1');
const level2Button = document.getElementById('level2');
const level3Button = document.getElementById('level3');
const basementButton = document.getElementById('level4');
const roomButton = document.getElementById('Room');
const mainDisplayButton = document.getElementById('Main_Display');

// Hook functions to buttons using event listeners
mainButton.addEventListener('click', () => {
    console.log("Single Arch button clicked!");
    sceneManager.LoadScene('Arch')
});

level1Button.addEventListener('click', () => {
    console.log("Level 1 button clicked!");
    sceneManager.LoadScene('L1')
});

level2Button.addEventListener('click', () => {
    console.log("Level 2 button clicked!");
    sceneManager.LoadScene('L2')
});

level3Button.addEventListener('click', () => {
    console.log("Level 3 button clicked!");
    sceneManager.LoadScene('L3')
});

basementButton.addEventListener('click', () => {
    console.log("Basement button clicked!");
    sceneManager.LoadScene('Base')
});

//button to toggle the levels
const levelsButton = document.getElementById("levels");
const panel = document.getElementById("level_buttons");
let isLevelPanelHiding = true;
levelsButton.addEventListener("click", () => {
    isLevelPanelHiding = !isLevelPanelHiding
    if(isLevelPanelHiding){
        panel.classList.add("hide");
    }else{
        panel.classList.remove("hide")
    }
});
roomButton.addEventListener('click', () => {
    console.log("Basement button clicked!");
    sceneManager.LoadScene('Room')
});
mainDisplayButton.addEventListener('click', () => {
    console.log("Main display button clicked!");
    sceneManager.LoadScene('MainDisplay')
});

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


// Get the weather buttons
const snowButton = document.getElementById("weather_snow");
const rainButton = document.getElementById("weather_rain");
const noneButton = document.getElementById("weather_none");

snowButton.addEventListener("click", () => {
    // Handle snow button click
    console.log("Snow button clicked");
    sceneManager.ChangeWeather('snow')
});

rainButton.addEventListener("click", () => {
    // Handle rain button click
    console.log("Rain button clicked");
    sceneManager.ChangeWeather('rain')
});

noneButton.addEventListener("click", () => {
    // Handle no weather button click
    console.log("No weather button clicked");
    sceneManager.ChangeWeather('none')
});



let unrealButton = document.getElementById('AdvencedView')
// Add event listener to toggle camera feed
unrealButton.addEventListener('click', ()=>{
    window.open('http://172.16.16.163', 'smallWindow', 'width=960,height=510');
});

// Get the wind button and the wind panel elements
const windButton = document.getElementById('wind');
const windPanel = document.getElementById('wind_panel');
windButton.addEventListener('click', () => {
    windPanel.classList.toggle('hide');
});
// Get all the wind buttons inside the wind panel
const windButtons = document.querySelectorAll('#wind_panel .wind_button');
windButtons.forEach(button => {
    button.addEventListener('click', () => {
        console.log(button.textContent);
        sceneManager.ChangeWind(button.textContent)
    });
});

// Get references to the buttons
const dayButton = document.getElementById('day');
const afternoonButton = document.getElementById('afternoon');
const nightButton = document.getElementById('night');

// Add event listener to the day button
dayButton.addEventListener('click', () => {
    console.log('Day button clicked!');
    sceneManager.SwitchEnvironment('day')
    dayButton.style.opacity = '1.0';
    afternoonButton.style.opacity = '0.5';
    nightButton.style.opacity = '0.5';
});

// Add event listener to the afternoon button
afternoonButton.addEventListener('click', () => {
    console.log('Afternoon button clicked!');
    sceneManager.SwitchEnvironment('afternoon')
    afternoonButton.style.opacity = '1.0';
    dayButton.style.opacity = '0.5';
    nightButton.style.opacity = '0.5';
});

// Add event listener to the night button
nightButton.addEventListener('click', () => {
    console.log('Night button clicked!');
    sceneManager.SwitchEnvironment('night')
    nightButton.style.opacity = '1.0';
    afternoonButton.style.opacity = '0.5';
    dayButton.style.opacity = '0.5';
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

    //Raycast with mouse click
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objectsToTest)
    
    //if there are interactive stuff in the scene 
    if(sceneManager.currentGraph.interactiveModelManager){
        interactiveModelManager = sceneManager.currentGraph.interactiveModelManager
        objectsToTest = interactiveModelManager.getInteractiveModels()

        // Reset all objects to red
        for (const object of objectsToTest) {
            //object.material.color.set('#ff0000');
            interactiveModelManager.triggerIdleAction(object)

            interactiveModelManager.revertInteractiveModelMaterial(object,false)
        }

        // Change color of the closest intersected object to blue
        if (intersects.length > 0) {
            currentIntersect = intersects[0]
            if(!interactiveModelManager.triggerHoverAction(currentIntersect.object))
                interactiveModelManager.setInteractiveModelMaterial(currentIntersect.object, hover_material, false)
        }else{
            currentIntersect = null
        }
    }

    //update the 2d tags in scene
    sceneManager.Update2DTagVisibility(sizes)

    // Render
    renderer.render(scene, camera)
    labelRenderer.render( scene, camera );

    // End the stats
    stats.end();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()