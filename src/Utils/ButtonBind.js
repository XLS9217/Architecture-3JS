import SceneManager from "./SceneManager";



// Get each button by its ID
const mainButton = document.getElementById('main');
const level1Button = document.getElementById('level1');
const level2Button = document.getElementById('level2');
const level3Button = document.getElementById('level3');
const basementButton = document.getElementById('level4');
const roomButton = document.getElementById('Room');
const heatZoneButton = document.getElementById('HeatZone');
const mainDisplayButton = document.getElementById('Main_Display');
const earthButton = document.getElementById('earth');
const shanghaiButton = document.getElementById('shanghaiMain');


const levelsButton = document.getElementById("levels");
const level_panel = document.getElementById("level_buttons");
const testSceneButton = document.getElementById("Test_Scene");
const testScene_panel = document.getElementById("test_scenes");


let buttonBind = () =>{
    const sceneManager = new SceneManager()

    // Hook functions to buttons using event listeners
    mainButton.addEventListener('click', () => {
        console.log("Single Arch button clicked!");
        sceneManager.LoadScene('Arch')
    });

    level1Button.addEventListener('click', () => {
        console.log("Level 1 button clicked!");
        sceneManager.LoadScene('L1')
    });

    level2Button.addEventListener('click', () => {
        console.log("Level 2 button clicked!");
        sceneManager.LoadScene('L2')
    });

    level3Button.addEventListener('click', () => {
        console.log("Level 3 button clicked!");
        sceneManager.LoadScene('L3')
    });

    basementButton.addEventListener('click', () => {
        console.log("Basement button clicked!");
        sceneManager.LoadScene('Base')
    });

    shanghaiButton.addEventListener('click', () => {
        console.log("Shanghai button clicked!");
        sceneManager.LoadScene('ShanghaiMain')
    });

    heatZoneButton.addEventListener('click', () => {
        console.log("heat Zone Button button clicked!");
        sceneManager.LoadScene('HeatZone')
    });

    earthButton.addEventListener('click', () => {
        console.log("earth button clicked!");
        sceneManager.LoadScene('Earth')
    });

    roomButton.addEventListener('click', () => {
        console.log("Basement button clicked!");
        sceneManager.LoadScene('Room')
    });
    
    mainDisplayButton.addEventListener('click', () => {
        console.log("Main display button clicked!");
        sceneManager.LoadScene('MainDisplay')
    });


    //button to toggle the levels
    let isLevelPanelHiding = true;
    levelsButton.addEventListener("click", () => {
        isLevelPanelHiding = !isLevelPanelHiding
        if(isLevelPanelHiding){
            level_panel.classList.add("hide");
        }else{
            level_panel.classList.remove("hide")
        }
    });

    //button to toggle test scenes
    let isTestSceneHiding = true;
    testSceneButton.addEventListener("click", () => {
        isLevelPanelHiding = !isLevelPanelHiding
        if(isLevelPanelHiding){
            testScene_panel.classList.add("hide");
        }else{
            testScene_panel.classList.remove("hide")
        }
    });


    // Get the weather buttons
    const snowButton = document.getElementById("weather_snow");
    const rainButton = document.getElementById("weather_rain");
    const noneButton = document.getElementById("weather_none");

    snowButton.addEventListener("click", () => {
        // Handle snow button click
        console.log("Snow button clicked");
        sceneManager.ChangeWeather('snow')
    });

    rainButton.addEventListener("click", () => {
        // Handle rain button click
        console.log("Rain button clicked");
        sceneManager.ChangeWeather('rain')
    });

    noneButton.addEventListener("click", () => {
        // Handle no weather button click
        console.log("No weather button clicked");
        sceneManager.ChangeWeather('none')
    });


    // Get the wind button and the wind panel elements
    const windButton = document.getElementById('wind');
    const windPanel = document.getElementById('wind_panel');
    windButton.addEventListener('click', () => {
        windPanel.classList.toggle('hide');
    });
    // Get all the wind buttons inside the wind panel
    const windButtons = document.querySelectorAll('#wind_panel .wind_button');
    windButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(button.textContent);
            sceneManager.ChangeWind(button.textContent)
        });
    });



    // Get references to the buttons
    const dayButton = document.getElementById('day');
    const afternoonButton = document.getElementById('afternoon');
    const nightButton = document.getElementById('night');

    // Add event listener to the day button
    dayButton.addEventListener('click', () => {
        console.log('Day button clicked!');
        sceneManager.SwitchEnvironment('day')
        dayButton.style.opacity = '1.0';
        afternoonButton.style.opacity = '0.5';
        nightButton.style.opacity = '0.5';
    });

    // Add event listener to the afternoon button
    afternoonButton.addEventListener('click', () => {
        console.log('Afternoon button clicked!');
        sceneManager.SwitchEnvironment('afternoon')
        afternoonButton.style.opacity = '1.0';
        dayButton.style.opacity = '0.5';
        nightButton.style.opacity = '0.5';
    });

    // Add event listener to the night button
    nightButton.addEventListener('click', () => {
        console.log('Night button clicked!');
        sceneManager.SwitchEnvironment('night')
        nightButton.style.opacity = '1.0';
        afternoonButton.style.opacity = '0.5';
        dayButton.style.opacity = '0.5';
    });
}
export default buttonBind 