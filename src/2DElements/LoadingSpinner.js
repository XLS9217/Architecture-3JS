
import {Spinner} from 'spin.js';
let instance = null

export default class LoadingSpinner{
    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this;
        
        var opts = {
            lines: 13, // The number of lines to draw
            length: 35, // The length of each line
            width: 17, // The line thickness
            radius: 30, // The radius of the inner circle
            scale: 0.5, // Scales overall size of the spinner
            corners: 1, // Corner roundness (0..1)
            speed: 1, // Rounds per second
            rotate: 14, // The rotation offset
            animation: 'spinner-line-shrink', 
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#ffffff', // CSS color or array of colors
            fadeColor: 'transparent', // CSS color or array of colors
            top: '90%', 
            left: '95%', 
            shadow: '0 0 1px transparent', // Box-shadow for the lines
            zIndex: 2000000000, // The z-index (defaults to 2e9)
            className: 'spinner', // The CSS class to assign to the spinner
            position: 'absolute', // Element positioning
        };

        this.spinTarget = document.getElementById('spin');
        this.spinner = new Spinner(opts).spin(this.spinTarget);
    }

    spin(){
        this.spinner.spin(this.spinTarget);
    }

    stop(){
        this.spinner.stop();
    }
}