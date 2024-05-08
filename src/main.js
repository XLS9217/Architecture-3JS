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
renderer.sortObjects = true

//SceneMangaer
const sceneManager = new SceneManager(scene, camera)
sceneManager.LoadScene('Arch')

//iteractive model Manager
let interactiveModelManager =  sceneManager.currentGraph.interactiveModelManager

/**
 * End init scene prop-------------------------------------------------
 */

/**
 * Debug
 */


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







//the camera video
// Create flvPlayer as a global variable
let flvPlayer;

// Function to initialize the player and attach it to the video element
function initializePlayer() {
    flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: 'http://172.16.40.58:8080/live/test2.flv', // Replace with your RTMP stream URL
    });

    // Attach the player to the video element
    flvPlayer.attachMediaElement(document.getElementById('cameraFeed'));
}

// Function to toggle camera feed
function toggleCameraFeed() {
    isCameraViewDisplaying = !isCameraViewDisplaying;

    if (isCameraViewDisplaying) {
        // Show the camera feed
        cameraFeed.style.display = 'block';

        // Reinitialize the player if it's not already initialized
        if (!flvPlayer) {
            initializePlayer();
        }

        // Load and play the video
        flvPlayer.load();
        flvPlayer.play();
    } else {
        // Hide the camera feed
        cameraFeed.style.display = 'none';

        // Pause the video
        flvPlayer.pause();

        // Reset source and unload the player
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
        flvPlayer = null;
    }
}

// Add event listener to toggle camera feed
cameraButton.addEventListener('click', toggleCameraFeed);






// cameraButton.addEventListener('click', async () => {
//     isCameraViewDisplaying = !isCameraViewDisplaying;

//     try {
//         if (isCameraViewDisplaying) {
//             // Get access to the camera stream
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
//             // Set the camera stream as the source for the video element
//             cameraFeed.srcObject = stream;

//             // Show the camera feed
//             cameraFeed.style.display = 'block';
//         } else {
//             // Stop the camera stream and hide the video element
//             const tracks = cameraFeed.srcObject.getTracks();
//             tracks.forEach(track => track.stop());
//             cameraFeed.srcObject = null;
//             cameraFeed.style.display = 'none';
//         }
//     } catch (error) {
//         console.error('Error accessing camera:', error);
//     }
// });

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





let objectsToTest = interactiveModelManager.getInteractiveModels()

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