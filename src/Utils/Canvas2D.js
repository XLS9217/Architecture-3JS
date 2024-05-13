import * as THREE from 'three'
import SceneManager from './SceneManager'
let instance = null

//a string and two objects 
let dynamicLines = {
    'Default' : [],
}

export default class Canvas2D{
    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this 
        this.canvas = document.getElementById('2D_Canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas2D()

        //console.log(a instanceof HTMLElement)
    }


    resizeCanvas2D(){
        // Set canvas size to match window size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }


    updateCanvas2D(){
        // Clear previous drawings
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //draw lines
        for( const line in dynamicLines ){
            //console.log(line)
            if(dynamicLines[line].length == 2){
                let pointA = this.findScreenPosition(dynamicLines[line][0])
                let pointB = this.findScreenPosition(dynamicLines[line][1])
                this.drawLine(pointA.x,pointA.y,pointB.x,pointB.y)
            }
        }
    }


    addDynamicLine(name,obj1,obj2){
        dynamicLines[name] = [obj1,obj2]
    }

    removeDynamicLine(name){
        dynamicLines[name] = []
    }


    // Function to draw a line from a point to the bottom-left corner of the canvas
    drawLine(x_start, y_start, x_end = 0, y_end = this.canvas.height, color = 'white', lineWidth = 3) {
        
        // Set line attributes
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;

        // Begin path and draw the line
        this.ctx.beginPath();
        this.ctx.moveTo(x_start, y_start);
        this.ctx.lineTo(x_end, y_end);
        this.ctx.stroke();
    }


    //return a THREE.Vector2 for screen location
    findScreenPosition(obj){
        if(obj instanceof HTMLElement || obj instanceof HTMLVideoElement ){
            
            
            const rect = obj.getBoundingClientRect();
            const screenX = (rect.left + rect.right) /2;
            const screenY = (rect.top + rect.bottom) / 2;
            //console.log('this is a element '+screenX + " -- " + screenY)
            return new THREE.Vector2(screenX, screenY);
        }
        else if(obj instanceof THREE.Mesh){
            //console.log('this is a mesh')
            //get screen coordinates
            let sceneManager = new SceneManager()
            let pCamera = sceneManager.GetCamera()
            let worldPos =  new THREE.Vector3();
            obj.getWorldPosition(worldPos)
            const screenCoordinates = worldPos.clone().project(pCamera);
            // Create a Vector2 representing the screen location
            return new THREE.Vector2((screenCoordinates.x + 1) * window.innerWidth / 2, (-screenCoordinates.y + 1) * window.innerHeight / 2);
        }
        else if(obj instanceof THREE.Vector2){
            //console.log('this is a vector2')
            return obj
        }
        else {
            console.log('Object type: ' + obj.constructor.name);
            return null; // Return null if object type is unknown
        }
    }
}


