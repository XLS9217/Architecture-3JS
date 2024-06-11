import * as THREE from 'three'
import { OrbitControls, PointerLockControls } from 'three/examples/jsm/Addons.js';
import nipplejs from 'nipplejs';
import UserState from '../UserState';

let instance = null
let currentControl = null
let userState = new UserState()

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
        this.switchOrbitDefault()

        this.pointerLockControl = new PointerLockControls(this.camera, this.canvas)

        this.setupMouseLinstener()


        this.joystickX = 0;
        this.joystickY = 0;
        if(userState.deviceType == userState.DeviceTypes.MOBILE){
            console.log('mobile set up joystick')
            this.setupJoyStick()
        }

        this.switch2Orbit()
    }

    setupMouseLinstener(){
        //right button drug to rotate sight
        this.canvas.addEventListener('mousedown', function(event) {
            if (event.button === 2) {
                //console.log( currentControl)
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
    }

    setupJoyStick(){
        // Create the joystick
        const joystick = nipplejs.create({
            zone: document.getElementById('joystick-container'),
            mode: 'static',
            size: 150,
            position: { left: '50%', top: '50%' },
            color: 'white'
        });

        // Variables to store joystick movement

        // Event listener for joystick movement
        joystick.on('move', (evt, data) => {
            this.joystickX = data.vector.x;
            this.joystickY = data.vector.y;
            console.log(this.joystickX)
        });

        joystick.on('end', () => {
            this.joystickX = 0;
            this.joystickY = 0;
        });
    }

    roatateCameraOnJoystickMove(){
        //update the camera position rotating by the orgin
        const rotationAngle = this.joystickX / 100;

        // Rotate the camera around the origin
        this.camera.rotateY(rotationAngle);

        // Get the current camera position
        const currentPosition = this.camera.position.clone();

        // Translate the camera's position based on its current position
        const distanceFromOrigin = currentPosition.length(); // Distance from camera to origin
        const newPosition = currentPosition.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationAngle); // Apply rotation
        this.camera.position.copy(newPosition);

        // Update the camera's look-at position to the origin
        this.camera.lookAt(0, 0, 0);
    }

    update(){
        //console.log(currentControl)
        if(currentControl instanceof OrbitControls){
            currentControl.update()
            //console.log(currentControl)
        }

        if(userState.deviceType == userState.DeviceTypes.MOBILE){
            this.roatateCameraOnJoystickMove()
        }
    }

    getCurrentControl(){
        return currentControl
    }

    switchOrbitDefault(){
        this.orbitControl.target.set(0, 0, 0);
        this.orbitControl.enableDamping = true
        this.orbitControl.rotateSpeed = 0.15;
        this.orbitControl.PanSpeed = 0.5;
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