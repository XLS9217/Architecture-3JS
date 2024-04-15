
import * as THREE from 'three'
import { gsap } from 'gsap'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

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

export default class ModelLoader
{

    constructor(scene){
        this.scene = scene
        
        scene.add(overlay)
    }

    Load2Scene(path, name, type){
        console.log(path + name + '.mtl')

        mtlLoader.load(
            //'models/architectures/obj/architecture.mtl',
            //'models/obj_fix3/arch.mtl',
            path + name + '.mtl',
            (materials) => {
                materials.preload()
        
                const objLoader = new OBJLoader()
                objLoader.setMaterials(materials)
                objLoader.load(
                    // 'models/architectures/obj/architecture.obj',
                    path + name + '.obj',
                    (object) => {
                        console.log(object)
                        object.scale.set(0.01,0.01,0.01)
                        this.scene.add(object)
                    },
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                    },
                    (error) => {
                        console.log('An error happened')
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