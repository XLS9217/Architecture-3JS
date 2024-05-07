
/**
 * In charge of loading the moddel and showing the process
 */
import * as THREE from 'three'
import { gsap } from 'gsap'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

let instance = null

const loadingBarElement = document.querySelector('.loading-bar')

let sceneReady = false
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        
        // Wait a little
        window.setTimeout(() =>
        {
            console.log("loading manager")

            // Animate overlay
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        }, 500)

        window.setTimeout(() =>
        {
            sceneReady = true
        }, 2000)
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)

loadingManager.onStart = function () {
	console.log("loading manager start")
    loadingBarElement.classList.remove('ended')
    //overlay.material.uniforms.uAlpha.value = 1.0; 
};
// // Add event listener to the document
// document.addEventListener('keydown', function(event) {
//     // Check if the pressed key is "q"
//     if (event.key === 'q') {
//         // Execute your callback function here
//         console.log('The "q" key was pressed!');
//         // Call your function here
//         overlay.material.uniforms.uAlpha.value = 1.0; 
//     }
// });
// Call the function every 0.1 second using setInterval
// setInterval(()=>{
//     console.log("u alpha is " + overlay.material.uniforms.uAlpha.value)
// }, 200); 
/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms:
    {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})
let overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)

const objLoader = new OBJLoader(loadingManager);
const mtlLoader = new MTLLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager)
const dracoLoader = new DRACOLoader(loadingManager)
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

export default class ModelLoader
{

    constructor(scene){
        if(instance){
            return instance
        }
        instance = this
        this.scene = scene
        this.loadedModel = null//reset after load each object
        scene.add(overlay)
    }

    /**
     * 
     * @param {string} path 
     * @param {string} name 
     * @param {string} type 
     * @param {function} callback what to do with the model, immediately after it is loaded
     */
    Load2Scene(path, name, type, callback){
        
        this.scene.add(overlay)
        overlay.material.uniforms.uAlpha.value = 1.0; 
        sceneReady = false

        if(type == "gltf"){
            gltfLoader.load(
                path+name+'.gltf',
                (gltf) =>
                {
                    const model = gltf.scene
                    this.scene.add(model)
                    callback(model)
                }
            )
        }
        else if(type == "glb"){
            gltfLoader.load(
                path+name+'.glb',
                (gltf) =>
                {
                    const model = gltf.scene
                    this.scene.add(model)
                    callback(model)
                }
            )
        }
        else if(type == "obj"){
            console.log(path + name + '.mtl')

            mtlLoader.load(
                path + name + '.mtl',
                (materials) => {
                    materials.preload()
            
                    const objLoader = new OBJLoader()
                    objLoader.setMaterials(materials)
                    objLoader.load(
                        path + name + '.obj',
                        //when loading is complete
                        (object) => {
                            this.loadedModel = object;
                            this.scene.add(this.loadedModel)
                            if(callback) callback(this.loadedModel)
                        },
                        //in the middle of loading
                        (xhr) => {
                            //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                        },
                        //if error happened
                        (error) => {
                            console.log('An error happened' + error)
                        }
                    )
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log('An error happened')
                }
            )
        }
        
    }

    
    isSceneReady(){
        return sceneReady;
    }

}