import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap'
import ModelLoader from './Utils/ModelLoader';
import SingleArchitecture from './SceneGraphs/SingleArchitecture';
import GUI from 'lil-gui'
import SceneManager from './SceneManager';


 let sceneReady = true


/*
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//SceneManager
const sceneManager = new SceneManager()

//SceneGraph
const singleArch = new SingleArchitecture(scene)


/**
 * debug
 */
//Debug Gui
const debug_ui = new GUI()
//debug_ui.hide();//hide UI

const axesHelper = new THREE.AxesHelper( 1000 );
scene.add( axesHelper );



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 3000)
//camera.position.set(774, 67, -571)
singleArch.setIdealCameraLocation(camera)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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
 * For showing where camera is at
 */
document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
      alert(camera.position.x + "\n" + camera.position.y + "\n" +  camera.position.z)
    }
  }

window.addEventListener('click', () =>
{
    if(currentIntersect)
    {
        let mat2set = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#ff0055') // Set the new color
        })
        sceneManager.setInteractiveModelMaterial(currentIntersect.object, mat2set)
        //console.log(currentIntersect.object)
    }
})

window.addEventListener('contextmenu', () => {
    if(currentIntersect)
    {
        sceneManager.revertInteractiveModelMaterial(currentIntersect.object)
    }
});





const objectsToTest = sceneManager.getInteractiveModels()

/**
 * Core Loop for animation and rendering
 */
const tick = () =>
{
    // Update controls
    controls.update()

    //Raycast with mouse click
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objectsToTest)

    // Reset all objects to red
    for (const object of objectsToTest) {
        //object.material.color.set('#ff0000');
        //sceneManager.revertInteractiveModelMaterial(object)
    }

    // Change color of the closest intersected object to blue
    if (intersects.length > 0) {
        currentIntersect = intersects[0]
        //currentIntersect.object.material.color.set('#0000ff');
    }else{
        currentIntersect = null
    }

    

    // Update points only when the scene is ready
    if(singleArch.isSceneReady())
    {
        // Go through each point
        for(const point of singleArch.getPoints())
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
                if(intersectionDistance < pointDistance)
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
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()