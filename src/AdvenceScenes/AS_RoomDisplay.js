/**
 * 1. camera zoom and rotate
 * 2. assume 4 walls, closest two will not be visible
 */
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import RendererManager from '../Utils/RenderManager'

import ViperWaveVertex from '../Shaders/VertexShaders/ViperWave_Vertex.glsl'
import ViperWaveFragment from '../Shaders/FragmentShaders/ViperWave_Fragment.glsl'
import SceneManager from '../Utils/SceneManager'
import SceneCameraManager from '../Utils/CameraManager'
import { distance } from 'three/examples/jsm/nodes/Nodes.js'
import InteractiveModelMangaer from '../Utils/InteractiveModelMangaer'

const gltfLoader = new GLTFLoader()

export default class AS_RoomDisplay{

    constructor(modelPath, size){
        
        this.scene = new THREE.Scene()
        this.modelPath = modelPath

        this.cameraManager = new SceneCameraManager()

        this.debugFolder = null
        this.walls = []

        this.size = 1.0
        if(size) this.size = size

        this.deviceReference = {}

        this.interactiveModelManager = new InteractiveModelMangaer()
    }

    loadScene(){

        
        this.originCameraPos = this.cameraManager.getCamera().position

        this.debugFolder = window.debug_ui.addFolder('Room Display');
        this.createSpecialProps()

        gltfLoader.load(
            this.modelPath,
            (gltf) =>
            {
                //add logic to model
                const model = gltf.scene
                this.scene.add(model)
                model.scale.set(this.size, this.size, this.size)
                this.modelCustomize(model)
                
                //tell rendererManager to render this
                let rendererManager = new RendererManager()
                rendererManager.switch2TempScene(this)
            }
        )

    }

    unloadScene(){
        this.debugFolder.destroy();

        let rendererManager = new RendererManager()
        rendererManager.switch2Normal()

        this.destroy()
    }

    update(){
        for (let i = 0; i < this.walls.length; i++) {
            const direction = new THREE.Vector3();
            this.cameraManager.getCamera().getWorldDirection(direction);
            this.walls[i].model.visible = true;
            
            // Get the normal of the wall
            const wallNormal = this.walls[i].normal;
        
            // Check if the wall is facing the camera
            const dotProduct = direction.dot(wallNormal);
            
            // If dotProduct is negative, the wall is facing the camera
            if (dotProduct < 0) {
                this.walls[i].model.visible = false;
            }
        }
    }

    createSpecialProps(){
        let sceneManager = new  SceneManager()

        //lights
        const ambient = new THREE.AmbientLight('#ffffff',1.0)
        this.scene.add(ambient)

        const directionalLight = new THREE.DirectionalLight('#ffffff',1.0)
        directionalLight.position.set(0.0, 1.0, 1.0)
        this.scene.add(directionalLight)


        //the plane
        const planeGeometry = new THREE.PlaneGeometry(600, 600, 50, 50);



        const viperShader = new THREE.ShaderMaterial({
            vertexShader: ViperWaveVertex,
            fragmentShader: ViperWaveFragment,
            uniforms: {
                uTime: sceneManager.GetTimeUniform(),
                uWaveStrength: new THREE.Uniform(1.5)
            },
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false
        });

        this.debugFolder.add(viperShader.uniforms.uWaveStrength, 'value').name('wave s').min(0.0).max(10.0)

        const viperGridPlane = new THREE.Mesh(planeGeometry, viperShader);
        viperGridPlane.rotation.x = -Math.PI / 2;
        viperGridPlane.position.y -= 10.0
        this.scene.add(viperGridPlane);


        //additional
        const axisHelper = new THREE.AxesHelper(600)
        this.scene.add(axisHelper)
    }

    //later change to user customize
    /**
     * Current logic
     * by tokens, first token defines the type
     */
    modelCustomize( model ){
        model.traverse((child) => {
            let tokens = child.name.split('_')
            //if(child.isMesh){
                /**
                 * Click z in blender, then rename group to N S W E
                 * Use face to decide which to not visible
                 */
                if(tokens[0] == 'Wall'){
                    //console.log('loading wall ' + child.name)
                    let facingReference = {
                        'N' : new THREE.Vector3(0, 0, -1),
                        'S' : new THREE.Vector3(0, 0, 1),
                        'W' : new THREE.Vector3(-1, 0, 0),
                        'E' : new THREE.Vector3(1, 0, 0),
                    }
                    this.walls.push({
                        model: child,
                        normal: facingReference[tokens[1]]
                    })
                }
                else if(tokens[0] == "Device"){
                    if(!this.deviceReference[tokens[1]]){
                        this.deviceReference[tokens[1]] = []
                    }
                    this.deviceReference[tokens[1]].push(child)
                    this.interactiveModelManager.addInteractiveModel(child)
                }
            //}
        })
        console.log(this.deviceReference)
    }

    destroy(){
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach((material) => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            if (object.texture) {
                object.texture.dispose();
            }
        });

        // Remove all children from the scene
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
}