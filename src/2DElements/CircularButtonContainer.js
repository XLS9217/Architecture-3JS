import { attribute } from "three/examples/jsm/nodes/Nodes.js";

//minimum 2
export default class CircularButtonContainer {
    constructor({ buttonNumber, containerWidth, containerHeight, top, left, buttonSize = 30 }) {
        this.numButtons = buttonNumber;
        this.buttonArray = [];
        this.buttonAttributes = []; // Stores positions and sizeUp attribute
        this.buttonSize = buttonSize;

        this.containerHeight = parseInt(containerHeight)
        this.containerWidth = parseInt(containerWidth)

        // Create container for buttons
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.top = top || '50%';
        this.container.style.left = left || '20px';
        this.container.style.width = containerWidth || '100px';
        this.container.style.height = containerHeight || '100px';
        this.container.style.transform = 'translate(-50%, -50%)';
        this.container.style.border = 'solid 3px black';
        this.container.style.borderRadius = '50%'; // Make the container a circle for better visualization
        this.container.style.display = 'flex';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
        document.body.appendChild(this.container);

        // Calculate the angle between each button
        const angleStep = (2 * Math.PI) / this.numButtons;

        // Create buttons
        for (let i = 0; i < this.numButtons; i++) {
            // Calculate the angle for each button
            const angle = Math.PI + i * angleStep;

            // Calculate initial position
            const x = parseInt(this.container.style.width) / 2 * Math.cos(angle);
            const y = parseInt(this.container.style.height) / 2 * Math.sin(angle);

            // Store initial position and sizeUp attribute
            let sizeUp = 1;
            let containerEvent = () =>{}
            if(i == 0){
                sizeUp = 1.75;
            } 
            else if(i == this.numButtons-1){
                sizeUp = 1.25
                containerEvent = () =>{this.rotateForward()}
            } 
            else if(i == 1){
                sizeUp = 1.25
                containerEvent = () =>{this.rotateBackward()}
            }
            this.buttonAttributes.push({
                position: { x, y }, 
                sizeUp: sizeUp,
                originalSize: this.buttonSize,
                originalFontSize: this.buttonSize/3.5,
                containerEvent: containerEvent // what to do when button at this location is clicked
            });

            // Create button
            const button = document.createElement('button');
            button.textContent = i;
            button.style.position = 'absolute';
            button.style.width = this.buttonSize* sizeUp + 'px';
            button.style.height = this.buttonSize* sizeUp + 'px';
            button.style.borderRadius = "50%";
            button.style.border = "3px solid black";
            button.style.backgroundColor = "#444444";
            button.style.color = "white";
            button.style.fontSize = this.buttonSize/4 * sizeUp + 'px'
            button.style.left = `calc(50% + ${x}px - ${this.buttonSize * sizeUp / 2}px)`; // Center the button
            button.style.top = `calc(50% + ${y}px - ${this.buttonSize * sizeUp / 2}px)`;  // Center the button

            // Append button to container
            this.container.appendChild(button);
            this.buttonArray.push(button);

            // Add click event listener to each button
            button.addEventListener('click', () => {
                //console.log('index '+ i)
                this.buttonAttributes[i].containerEvent()
            });
        }

        // // Create close button (X)
        // const closeButton = document.createElement('button');
        // closeButton.textContent = 'X';
        // closeButton.style.position = 'absolute';
        // closeButton.style.width = '20px';
        // closeButton.style.height = '20px';
        // closeButton.style.background = 'red';
        // closeButton.style.color = 'white';
        // closeButton.style.border = 'none';
        // closeButton.style.borderRadius = '50%';
        // closeButton.style.cursor = 'pointer';
        // this.container.appendChild(closeButton);

        // // Add click event listener to close button
        // closeButton.addEventListener('click', () => {
        //     this.destroy();
        // });
    }

    bindFunctionToButton(index, func) {
        if (index >= 0 && index < this.numButtons) {
            this.buttonArray[index].addEventListener('click', func);
        } else {
            console.error('Index out of bounds');
        }
    }

    setButtonAppearance(index, appearance) {
        if (index >= 0 && index < this.numButtons) {
            const button = this.buttonArray[index];
            
            if (typeof appearance === 'string') {
                // Set the button's text content
                button.textContent = appearance;
                button.style.backgroundImage = ''; // Clear any background image
            } else if (typeof appearance === 'object' && appearance.src) {
                // Set the button's background image
                button.textContent = '';
                button.style.backgroundImage = `url(${appearance.src})`;
                button.style.backgroundSize = 'cover';
                button.style.backgroundPosition = 'center';
            } else {
                console.error('Invalid appearance format');
            }
        } else {
            console.error('Index out of bounds');
        }
    }
    

    rotateForward() {
        // Shift buttonAttributes array to the left (circular rotation)
        const firstAttribute = this.buttonAttributes.shift();
        this.buttonAttributes.push(firstAttribute);
    
        // Update button positions
        this.rotateButtons();
    }
    
    rotateBackward() {
        // Shift buttonAttributes array to the right (circular rotation)
        const lastAttribute = this.buttonAttributes.pop();
        this.buttonAttributes.unshift(lastAttribute);
    
        // Update button positions
        this.rotateButtons();
    }
    
    rotateButtons() {
        // Update button positions
        this.buttonArray.forEach((button, index) => {
            const { x, y } = this.buttonAttributes[index].position;
            const size = this.buttonAttributes[index].sizeUp * this.buttonAttributes[index].originalSize;
    
            // Animate the transition
            let widthSpeed = this.containerWidth / 500
            let heightSpeed = this.containerHeight / 500
            button.style.transition = 'width '+widthSpeed+'s, height '+heightSpeed+'s, 0.5s';
            button.style.fontSize = this.buttonAttributes[index].originalFontSize * this.buttonAttributes[index].sizeUp + 'px'
            button.style.width = `${size}px`;
            button.style.height = `${size}px`;
            button.style.left = `calc(50% + ${x}px - ${size / 2}px)`; // Center the button
            button.style.top = `calc(50% + ${y}px - ${size / 2}px)`;  // Center the button
        });
    }

    destroy() {
        // Remove all buttons
        this.buttonArray.forEach(button => button.remove());

        // Remove close button
        this.container.querySelector('button').remove();

        // Remove container from the document
        this.container.remove();
    }
}
