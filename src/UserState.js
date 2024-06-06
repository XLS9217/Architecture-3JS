let instance = null


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

        
        //this.deviceType = this.DeviceTypes.MOBILE;
    }


}