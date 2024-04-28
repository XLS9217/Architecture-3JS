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
import SingleArchitecture from './SceneGraphs/SingleArchitecture';
import ShenZhen_Level1 from './SceneGraphs/ShenZhen_Level1';
import ShenZhen_Level2 from './SceneGraphs/ShenZhen_Level2';
import ShenZhen_Level3 from './SceneGraphs/ShenZhen_Level3';
import ShenZhen_Basement from './SceneGraphs/ShenZhen_Basement';
import SceneManager from './Utils/SceneManager';



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

// Scene
const scene = new THREE.Scene()

//iteractive model Manager
const interactiveModelManager = new InteractiveModelMangaer()

//SceneGraphs
let shenzhenArch = new SingleArchitecture(scene)
let shenzhenL1 = new ShenZhen_Level1(scene)
let shenzhenL2 = new ShenZhen_Level2(scene)
let shenzhenL3 = new ShenZhen_Level3(scene)
let shenzhenBase = new ShenZhen_Basement(scene)

let currentSceneGraph = null

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1500)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.rotateSpeed = 0.15;
controls.PanSpeed = 0.5;
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

//SceneMangaer
const sceneManager = new SceneManager(scene, camera)
currentSceneGraph = shenzhenArch
sceneManager.LoadGraph(shenzhenArch)

/**
 * End init scene prop-------------------------------------------------
 */

/**
 * Debug
 */
let currentScene = "singleArch"

gui_obj.currentScene = currentScene
gui_obj.changeScene = ()=>{
    currentScene = gui_obj.currentScene
    alert("current scene is " + currentScene)

    if(currentScene == "singleArch"){
        scene.clear();
        currentSceneGraph = shenzhenArch
    }
    else if(currentScene == "szl1"){
        scene.clear();
        currentSceneGraph = shenzhenL1
    }

    currentSceneGraph.loadScene()
    currentSceneGraph.setIdealCameraLocation(camera)
}
window.debug_ui.add(gui_obj, "currentScene")
window.debug_ui.add(gui_obj, "changeScene")

/**
 * Interactive logic-------------------------------------------------
 */

/**
 * Points of interest
 */
const raycaster = new THREE.Raycaster()
let currentIntersect = null
let minimunPointDistance = 350

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
 * Interaction Logic
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
        interactiveModelManager.setInteractiveModelMaterial(currentIntersect.object, select_material, true)
        //console.log(currentIntersect.object)
    }
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
const basementButton = document.getElementById('level4'); // Renamed to match the button text

// Hook functions to buttons using event listeners
mainButton.addEventListener('click', () => {
    console.log("Single Arch button clicked!");
    sceneManager.LoadGraph(shenzhenArch)
});

level1Button.addEventListener('click', () => {
    console.log("Level 1 button clicked!");
    sceneManager.LoadGraph(shenzhenL1)
    currentSceneGraph = shenzhenL1
});

level2Button.addEventListener('click', () => {
    console.log("Level 2 button clicked!");
    sceneManager.LoadGraph(shenzhenL2)
    currentSceneGraph = shenzhenL2
});

level3Button.addEventListener('click', () => {
    console.log("Level 3 button clicked!");
    sceneManager.LoadGraph(shenzhenL3)
    currentSceneGraph = shenzhenL3
});

basementButton.addEventListener('click', () => {
    console.log("Basement button clicked!");
    sceneManager.LoadGraph(shenzhenBase)
    currentSceneGraph = shenzhenBase
});




//test ground --------------------------------------------------------------------------------------------

let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement)

// // Create an instance of FloatHelper2D
// let floatHelper = new FloatTag2D("test helper",new THREE.Vector3(-40,24,136))
// scene.add(floatHelper.getLabel())


//test ground end-----------------------------------------------------------------------------------------





const objectsToTest = interactiveModelManager.getInteractiveModels()

/**
 * Core Loop for animation and rendering
 */
const tick = () =>
{
    stats.begin();
    // Update controls
    controls.update()

    //Raycast with mouse click
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objectsToTest)

    // Reset all objects to red
    for (const object of objectsToTest) {
        //object.material.color.set('#ff0000');
        interactiveModelManager.revertInteractiveModelMaterial(object,false)
    }

    // Change color of the closest intersected object to blue
    if (intersects.length > 0) {
        currentIntersect = intersects[0]
        interactiveModelManager.setInteractiveModelMaterial(currentIntersect.object, hover_material, false)
    }else{
        currentIntersect = null
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