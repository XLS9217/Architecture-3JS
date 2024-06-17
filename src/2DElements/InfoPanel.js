export function generateInfoPanel({ 
    title = "Default title",
    textContent = "Introduction here", 
    buttonName = "Click here", 
    buttonFunction = () => { console.log("Need to implement"); },
    pictureAddress = ""
}) {
    // Create the sidebar div
    const sidebar = document.createElement('div');
    sidebar.style.position = 'absolute';
    sidebar.style.top = '10%';
    sidebar.style.right = '20px';
    sidebar.style.width = '20%'; 
    sidebar.style.height = '60%'; 
    sidebar.style.color = 'white'; 
    sidebar.style.backgroundColor = '#4c4c4c80';
    sidebar.style.border = '2px solid white';
    sidebar.style.padding = '10px';
    sidebar.style.display = 'flex';
    sidebar.style.flexDirection = 'column';
    sidebar.style.borderRadius = '5%';

    // Create a close button (X) and add it to the top left corner of the sidebar
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.borderRadius = '50%';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px'; 
    closeButton.style.color = 'white'; 
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.border = '2px solid white';
    closeButton.style.backgroundColor = '#aa000080';

    closeButton.addEventListener('click', () => {
        document.body.removeChild(sidebar);
    });
    sidebar.appendChild(closeButton);

    // Add the title here
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.marginBottom = '10px'; // Adjust margin to give space below the title
    sidebar.appendChild(titleElement);

    // Add image if provided
    if (pictureAddress) {
        const image = document.createElement('img');
        image.src = pictureAddress;
        image.style.maxWidth = '100%'; // Ensure image fits within sidebar width
        image.style.height = 'auto'; // Maintain aspect ratio
        image.style.marginBottom = '10px'; // Adjust margin below image
        sidebar.appendChild(image);
    }

    // Add some text content to the sidebar
    const text = document.createElement('p');
    text.textContent = textContent;
    text.style.marginBottom = '10px'; // Adjust margin to give space below text
    sidebar.appendChild(text);

    // Create a button container and add it to the bottom of the sidebar
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = 'auto'; // Push to the bottom

    const button = document.createElement('button');
    button.textContent = buttonName;
    button.style.width = '100%';
    button.style.height = '40px'; 
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '15%';

    button.addEventListener('click', buttonFunction);
    buttonContainer.appendChild(button);

    sidebar.appendChild(buttonContainer);

    // Add the sidebar to the document body
    document.body.appendChild(sidebar);

    // Return the instance of the sidebar div
    return sidebar;
}
