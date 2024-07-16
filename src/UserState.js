
import * as THREE from 'three'
let instance = null
const canvas = document.querySelector('canvas.webgl')

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

/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    const rect = canvas.getBoundingClientRect();//in case if css transform the webgl canvas
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    //console.log(mouse)
})

export default class UserState{
    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this 

        this.DeviceTypes = {
            MOBILE: 'mobile',
            TABLET: 'tablet',
            COMPUTER: 'computer'
        } 
        this.deviceType = this.DeviceTypes.COMPUTER;

        // What device is this
        if (isMobileDevice()) {
            console.log("This is a mobile device.");
            this.deviceType = this.DeviceTypes.MOBILE;

        } else if (isTablet()) {
            alert("This is a tablet device.");
            this.deviceType = this.DeviceTypes.TABLET;

        } else if (isDesktop()) {
            console.log("This is a desktop or laptop.");
            this.deviceType = this.DeviceTypes.COMPUTER;

        } else {
            console.log("Device type not identified.");
        }

        this.logDeviceMemory()
        //this.deviceType = this.DeviceTypes.MOBILE;
    }

    logDeviceMemory() {
        if ('deviceMemory' in navigator) {
            console.log(`Approximately ${navigator.deviceMemory} GB of RAM available.`);
        } else {
            console.log("The Device Memory API is not supported in this browser.");
        }
    }

    getUserMouse(){
        return mouse
    }

}