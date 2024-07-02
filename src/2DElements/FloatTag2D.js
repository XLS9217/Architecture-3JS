import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import * as THREE from 'three'

export default class FloatTag2D {
    constructor({
        textContent = "need contect", 
        position = new THREE.Vector3(0,0,0), 
        customFunction = ()=>{console.log('no function')},
        logicHide = true, //hide by some logic
        minimunPointDistance = 400,
        customWidth = 70,
        customHeight = 30,
        customFontSize  = 12
    }) {
        this.defaultWidth = customWidth
        this.defaultHeight = customHeight
        this.defaultFontSize = customFontSize

        // Create the point2D element
        const point2D = document.createElement('button');
        point2D.textContent = textContent;

        // Apply CSS styles to the point2D element
        point2D.style.position = 'absolute';
        point2D.style.top = '-20px';
        point2D.style.left = '-20px';
        point2D.style.width = this.defaultWidth + 'px';
        point2D.style.height = this.defaultHeight + 'px';
        point2D.style.borderRadius = '25%';
        point2D.style.background = '#880808bb';
        point2D.style.border = '1px solid #ffffff77';
        point2D.style.color = '#ffffff';
        point2D.style.fontFamily = 'Helvetica, Arial, sans-serif';
        point2D.style.textAlign = 'center';
        point2D.style.lineHeight = this.defaultHeight + 'px';
        point2D.style.fontWeight = 'normal';
        point2D.style.fontSize = this.defaultFontSize + 'px';
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

        //set varibale for logics    
        this.textContent = textContent
        this.minimunPointDistance = minimunPointDistance

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

        this.logicHide = logicHide
        if(logicHide) this.hide()
    }

    update(camera, raycaster, scene) {
        function clamp(number, min, max) {
            return Math.min(Math.max(number, min), max);
        }

        const pointDistance = this.position.distanceTo(camera.position);
        const distanceRatio = (this.minimunPointDistance - pointDistance) / this.minimunPointDistance;
        const opacity = 1 - Math.cos((distanceRatio + 0.5) * Math.PI / 2);

        // Calculate scaled width and height
        let scaleFactor = clamp(distanceRatio * 1.5, 0.5, 1.0)
        let scaledWidth = this.defaultWidth * scaleFactor;
        let scaledHeight = this.defaultHeight * scaleFactor;
        let scaledFontSize = this.defaultFontSize * scaleFactor;

        // Apply scaled dimensions
        this.label.element.style.width = `${scaledWidth}px`;
        this.label.element.style.height = `${scaledHeight}px`;
        this.label.element.style.lineHeight = `${scaledHeight}px`;
        this.label.element.style.fontSize = `${scaledFontSize}px`;

        //do not block by other objects if not enable logicHide
        if (!this.logicHide) {
            this.unhide(opacity);
            return;
        }

        // Where on screen should this be
        const screenPosition = this.position.clone();
        screenPosition.project(camera);

        // Set the raycaster
        raycaster.setFromCamera(screenPosition, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);


        // No intersect found
        if (intersects.length === 0) {
            this.unhide(opacity);
        } else {
            // Get the distance of the intersection and the distance of the point
            const intersectionDistance = intersects[0].distance;

            // Intersection is closer than the point
            if (intersectionDistance < pointDistance || pointDistance > this.minimunPointDistance) {
                if (intersects[0].object.name != 'TagIgnore') // SPECIAL TYPE OF MESH, LATER CONSIDER COLLISION CHANNEL
                    this.hide();
            } else {
                // Intersection is further than the point
                this.unhide(opacity);
            }
        }
    }

    // Getter for the label element
    getLabel() {
        return this.label;
    }

    setFloatTagSize(width, height) {
        // Set width and height
        this.label.element.style.width = `${width}px`;
        this.label.element.style.height = `${height}px`;
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

    setFontColor(newColor){
        this.label.element.style.color = newColor;
    }

}