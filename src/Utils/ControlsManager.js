import * as THREE from 'three'
import { OrbitControls, PointerLockControls } from 'three/examples/jsm/Addons.js';

let instance = null
let currentControl = null

export default class ControlsManager{
    constructor(inputCamera, inputCanvas){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this;
        this.camera = inputCamera
        this.canvas = inputCanvas

        this.orbitControl = new OrbitControls(this.camera, this.canvas)
        this.orbitControl.enableDamping = true
        this.orbitControl.rotateSpeed = 0.15;
        this.orbitControl.PanSpeed = 0.5;

        this.pointerLockControl = new PointerLockControls(this.camera, this.canvas)

        //right button drug to rotate sight
        this.canvas.addEventListener('mousedown', function(event) {
            if (event.button === 2) {
                console.log( currentControl)
                if ( currentControl instanceof PointerLockControls && !currentControl.isLocked) {
                    currentControl.lock();
                }
            }
        });

        this.canvas.addEventListener('mouseup', function(event) {
            if (event.button === 2) {
                if ( currentControl instanceof PointerLockControls && currentControl.isLocked) {
                    currentControl.unlock();
                }
            }
        });

        this.switch2Orbit()
    }

    update(){
        //console.log(currentControl)
        if(currentControl instanceof OrbitControls){
            currentControl.update()
            // console.log(currentControl)
        }
    }

    getCurrentControl(){
        return currentControl
    }

    switch2Orbit(){
        this.orbitControl.enabled = true;
        if( currentControl instanceof PointerLockControls && currentControl.isLocked ) currentControl.lock()

        //before switch ---------------------------------------
        currentControl = this.orbitControl
        //after switch ----------------------------------------
        
    }

    switch2PointerLock() {
        console.log("switch to ponter control")
        this.orbitControl.enabled = false;

        //before switch ---------------------------------------
        currentControl = this.pointerLockControl
        //after switch ----------------------------------------

        //if( !currentControl.isLocked ) currentControl.lock()
    }
}