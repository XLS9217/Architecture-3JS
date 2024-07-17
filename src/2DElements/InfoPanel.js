class InfoPanel {
    constructor() {
        this.title = "Default title";
        this.textContent = "Introduction here";
        this.buttonName = "Click here";
        this.buttonFunction = () => { console.log("Need to implement"); };
        this.pictureAddress = "";
        this.sidebar = null;
    }

    setDefaults() {
        this.title = "Default title";
        this.textContent = "Introduction here";
        this.buttonName = "Click here";
        this.buttonFunction = () => { console.log("Need to implement"); };
        this.pictureAddress = "";
    }

    async showInfoPanel({ title, textContent, buttonName, buttonFunction, pictureAddress } = {}) {
        // Wait for the destroy method to complete
        await this.destroy();

        // Update properties only if provided
        if (title) this.title = title;
        if (textContent) this.textContent = textContent;
        if (buttonName) this.buttonName = buttonName;
        if (buttonFunction) this.buttonFunction = buttonFunction;
        if (pictureAddress) this.pictureAddress = pictureAddress;

        // Create the sidebar div
        const sidebar = document.createElement('div');
        sidebar.style.position = 'absolute';
        sidebar.style.top = '10%';
        sidebar.style.right = '20px';
        sidebar.style.width = '20%'; 
        sidebar.style.height = '60%'; 
        sidebar.style.color = '#333'; 
        sidebar.style.backgroundColor = '#f3f4fa';
        sidebar.style.border = '1px solid #d9d9d9';
        sidebar.style.padding = '16px';
        sidebar.style.display = 'flex';
        sidebar.style.flexDirection = 'column';
        sidebar.style.borderRadius = '12px';
        sidebar.style.opacity = '0';
        sidebar.style.transition = 'opacity 0.35s';

        // Add elements to the sidebar
        sidebar.appendChild(this.createCloseButton());

        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;
        titleElement.style.marginBottom = '16px'; // Adjust margin to give space below the title
        sidebar.appendChild(titleElement);

        if (this.pictureAddress) {
            sidebar.appendChild(this.createImage());
        }

        sidebar.appendChild(this.createTextParagraph());

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = 'auto'; // Push to the bottom
        buttonContainer.appendChild(this.createMainButton());
        sidebar.appendChild(buttonContainer);

        // Add the sidebar to the document body
        document.body.appendChild(sidebar);

        // Store reference to the current sidebar
        this.sidebar = sidebar;

        // Transition the sidebar to visible
        requestAnimationFrame(() => {
            sidebar.style.opacity = '1';
        });

        // Return the instance of the sidebar div
        return sidebar;
    }

    async destroy() {
        return new Promise((resolve) => {
            if (this.sidebar && this.sidebar.parentElement) {
                this.sidebar.style.opacity = '0';
                setTimeout(() => {
                    if (this.sidebar.parentElement) {
                        document.body.removeChild(this.sidebar);
                    }
                    this.sidebar = null;
                    this.setDefaults();
                    resolve();
                }, 350); // Wait for the transition to complete
            } else {
                resolve();
            }
        });
    }

    createCloseButton() {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.borderRadius = '50%';
        closeButton.style.top = '12px';
        closeButton.style.right = '12px';
        closeButton.style.width = '32px';
        closeButton.style.height = '32px'; 
        closeButton.style.color = '#666'; 
        closeButton.style.fontSize = '16px';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        // closeButton.style.backgroundColor = '#d9d9d9';
        closeButton.style.transition = 'all 0.35s';

        closeButton.addEventListener('click', () => {
            this.destroy(); // Call destroy method on click
        });

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.backgroundColor = '#d9d9d9';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.backgroundColor = '#fff';
        });

        return closeButton;
    }

    createMainButton() {
        const button = document.createElement('button');
        button.textContent = this.buttonName;
        button.style.width = '100%';
        button.style.height = '40px';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.color = 'white';
        button.style.backgroundColor = '#bf0000';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '8px';
        button.style.border = 'none'
        button.style.transition = 'all 0.35s';

        button.addEventListener('click', this.buttonFunction);

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#bf2222';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#bf2222';
        });

        return button;
    }

    createImage() {
        const image = document.createElement('img');
        image.src = this.pictureAddress;
        image.style.maxWidth = '100%'; 
        image.style.height = 'auto'; 
        image.style.marginBottom = '10px';
        image.style.borderRadius = '8px';
        image.style.border = '1px solid #d9d9d9';
        return image;
    }

    createTextParagraph() {
        const text = document.createElement('p');
        text.textContent = this.textContent;
        text.style.fontSize = '14px';
        text.style.lineHeight = '24px';
        text.style.marginBottom = '16px'; // Adjust margin to give space below text
        return text;
    }

    
}

// Create a singleton instance of InfoPanel
const infoPanel = new InfoPanel();

// Export the instance directly
export default infoPanel;
