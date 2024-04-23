
/**
 * In charge of loading the moddel and showing the process
 */
import * as THREE from 'three'
import { gsap } from 'gsap'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const loadingBarElement = document.querySelector('.loading-bar')

let sceneReady = false
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        // Wait a little
        window.setTimeout(() =>
        {
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
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)

const objLoader = new OBJLoader(loadingManager);
const mtlLoader = new MTLLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager)
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

export default class ModelLoader
{

    constructor(scene){

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