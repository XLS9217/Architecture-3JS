let flvPlayer;


export default class SurveillanceCamera{
    constructor(cameraUrl, htmlElement){

        this.url = cameraUrl
        this.element = htmlElement
        this.cameraDisplaying = false
    }

    initializePlayer() {
        flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: this.url
        });
    
        // Attach the player to the video element
        flvPlayer.attachMediaElement(this.element);
    }

    toggleCameraDisplaying() {
        this.cameraDisplaying = !this.cameraDisplaying;
    
        if (this.cameraDisplaying) {
            // Show the camera feed
            this.element.style.display = 'block';
    
            // Reinitialize the player if it's not already initialized
            if (!flvPlayer) {
                this.initializePlayer();
            }
    
            // Load and play the video
            flvPlayer.load();
            flvPlayer.play();
        } else {
            // Hide the camera feed
            this.element.style.display = 'none';
    
            // Pause the video
            flvPlayer.pause();
    
            // Reset source and unload the player
            flvPlayer.unload();
            flvPlayer.detachMediaElement();
            flvPlayer.destroy();
            flvPlayer = null;
        }
    }
}