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



/*
 * Begin init scene prop -------------------------------------------------
 */

//Statistics 
const stats = new Stats()
stats.showPanel(0) 
document.body.appendChild(stats.dom)

//Debug Gui
const debug_ui = new GUI()
window.debug_ui = debug_ui
let gui_obj = {
    
}
//debug_ui.hide();//hide UI

// Canvas
const canvas = document.querySelector('canvas.webgl')
const canvas2D = new Canvas2D();//the 2d Canvas

// Scene
const scene = new THREE.Scene()

//let sceneManager.currentGraph = null

const axesHelper = new THREE.AxesHelper( 1000 );
scene.add( axesHelper );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
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
renderer.sortObjects = true

let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement)

//SceneMangaer
const sceneManager = new SceneManager(scene, camera, controlsManager.getCurrentControl())
sceneManager.currentControl = controlsManager.getCurrentControl()
sceneManager.SwitchEnvironment('afternoon')
sceneManager.LoadScene('Arch')

//iteractive model Manager
let interactiveModelManager =  sceneManager.currentGraph.interactiveModelManager

/**
 * End init scene prop-------------------------------------------------
 */

/**
 * Debug
 */
// Add a button to the GUI
gui_obj.cameraMove = () =>
{
    sceneCameraManager.hopToPosition(1,1,1)
}
debug_ui.add(gui_obj, 'cameraMove')

let orbit = true;
gui_obj.controlChange = () =>
{
    if(orbit) controlsManager.switch2PointerLock()
    else controlsManager.switch2Orbit()

    orbit = !orbit
}
debug_ui.add(gui_obj, 'controlChange')

gui_obj.HDR_Name = 'sky'
debug_ui.add(gui_obj,'HDR_Name')
gui_obj.switchHDR_MAP = () =>
{
    sceneManager.LoadEnvironmentMap('EnvMap/' + gui_obj.HDR_Name + '.hdr')
}
debug_ui.add(gui_obj, 'switchHDR_MAP')





// Define the deleteLight function
gui_obj.deleteLight = () => {
    sceneManager.DeleteLight()
};

debug_ui.add(gui_obj, 'deleteLight')

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
        //console.log(currentIntersect.object)
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

roomButton.addEventListener('click', () => {
    console.log("Basement button clicked!");
    sceneManager.LoadScene('Room')
});

mainDisplayButton.addEventListener('click', () => {
    console.log("Main display button clicked!");
    sceneManager.LoadScene('MainDisplay')
});

// Get references to the button and iframe elements
const rickRollButton = document.getElementById('RickRoll');
const cameraButton = document.getElementById('cameraView');
const cameraFrame = document.getElementById('cameraFrame');
let isCameraViewDisplaying = false;
rickRollButton.addEventListener('click', function() {
    // Show the iframe below the buttons
    isCameraViewDisplaying = !isCameraViewDisplaying
    if(isCameraViewDisplaying){
        cameraFrame.style.display = 'block';
        cameraFrame.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Replace VIDEO_ID with your YouTube video ID
    }else{
        cameraFrame.style.display = 'none';
        cameraFrame.src = ''
    }
});


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


// Check if the device is a mobile device
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Check if the device is a tablet
function isTablet() {
    return /iPad|Android/i.test(navigator.userAgent);
}

// Check if the device is a desktop/laptop
function isDesktop() {
    return !isMobileDevice() && !isTablet();
}

// Example usage
if (isMobileDevice()) {
    alert("This is a mobile device.");
} else if (isTablet()) {
    alert("This is a tablet device.");
} else if (isDesktop()) {
    console.log("This is a desktop or laptop.");
} else {
    console.log("Device type not identified.");
}




//test ground end-----------------------------------------------------------------------------------------





let objectsToTest = interactiveModelManager.getInteractiveModels()

/**
 * Core Loop for animation and rendering
 */
const tick = () =>
{
    stats.begin();
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