import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import * as THREE from 'three'

export default class FloatTag2D {
    constructor(textContent, position, customFunction) {
        // Create the point2D element
        const point2D = document.createElement('button');
        point2D.textContent = textContent;

        // Apply CSS styles to the point2D element
        point2D.style.position = 'absolute';
        point2D.style.top = '-20px';
        point2D.style.left = '-20px';
        point2D.style.width = '70px';
        point2D.style.height = '30px';
        point2D.style.borderRadius = '25%';
        point2D.style.background = '#880808bb';
        point2D.style.border = '1px solid #ffffff77';
        point2D.style.color = '#ffffff';
        point2D.style.fontFamily = 'Helvetica, Arial, sans-serif';
        point2D.style.textAlign = 'center';
        point2D.style.lineHeight = '30px';
        point2D.style.fontWeight = 'normal';
        point2D.style.fontSize = '12px';
        point2D.style.cursor = 'help';
        point2D.style.transition = 'transform 0.1s';
        point2D.style.zIndex = '999'; // Set z-index
        point2D.style.pointerEvents = 'auto'; // Enable all pointer events

        // Create a CSS2DObject using the point2D element
        this.label = new CSS2DObject(point2D);
        this.point = point2D
        
        // Set the initial position of the label
        this.position = position;
        this.label.position.copy(position);

        // Attach click event listener to the button
        if (customFunction && typeof customFunction === 'function') {
            point2D.addEventListener('click', () => {
                customFunction()
            });
        }else{
            point2D.addEventListener('click', () => {
                console.log('No custom function for this tag')
            });
        }


        this.hide()
    }

    // Getter for the label element
    getLabel() {
        return this.label;
    }

    // Setter for the text content
    setTextContent(textContent) {
        this.label.element.textContent = textContent;
    }

    // Setter for the position
    setPosition(newPosition) {
        this.position.copy(newPosition);
        this.label.position.copy(newPosition);
    }

    // Function to hide the label
    hide() {
        //console.log(this.label.element.style)
        this.label.element.style.opacity = '0';
    }

    // Function to unhide the label
    // pass in the opacity
    unhide(opacity) {
        if(opacity == null){
            this.label.element.style.opacity = 1 ;
        }else{
            this.label.element.style.opacity = opacity ;
        }
    }

    setBackgroundColor(newColor){
        this.label.element.style.background = newColor;
    }

}