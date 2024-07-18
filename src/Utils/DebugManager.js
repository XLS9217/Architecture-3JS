import GUI from 'lil-gui'
import MQRouter from '../MQRouter';
import SceneManager from './SceneManager';
import ControlsManager from './ControlsManager';
import UserState from '../UserState';
import httpRouter from '../HTTPRouter.js';

let instance = null

const router = new MQRouter();

//Debug Gui
const debug_ui = new GUI()
window.debug_ui = debug_ui
let gui_obj = {
    
}
window.gui_obj = gui_obj
//debug_ui.hide();//hide UI

export default class DebugManager{

    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this 

        const userState = new UserState()
        if(userState.deviceType != userState.DeviceTypes.COMPUTER){
            window.debug_ui.hide()
            return
        }

        this.initBasicFunction()
        this.initUserControl()
        this.initSceneControl()
        this.initMessageControl()

        debug_ui.close()
    }

    initBasicFunction(){
        const folder = window.debug_ui.addFolder('Basic');

        window.gui_obj.printScene = () => {
            let sceneManager = new SceneManager()
            console.log(sceneManager.GetScene())
        };
        folder.add(gui_obj, 'printScene')

        // Add a property for the selected control option
        window.gui_obj.selectedControl = 'orbit'; // Default option is 'orbit'

        // Add the select bar to the folder
        const controlSelect = folder.add(window.gui_obj, 'selectedControl', {
            Orbit: 'orbit', 
            PointerLock: 'pointerLock',
            PanControl: 'pan control'
        }).name('Control Type');
    
        // Add an event listener to the control select dropdown to automatically change controls
        controlSelect.onChange(() => {
            let controlsManager = new ControlsManager()

            if (window.gui_obj.selectedControl === 'orbit') {
                controlsManager.switch2Orbit();
            } else if (window.gui_obj.selectedControl === 'pointerLock') {
                controlsManager.switch2PointerLock();
            } else if (window.gui_obj.selectedControl === 'pan control') {
                console.log('pan control')
            }
        });
        
    }

    initUserControl(){
        const folder = window.debug_ui.addFolder('User Control');
        let userState = new UserState()


        // Set the initial value for deviceSelect
        window.gui_obj.deviceSelect = userState.deviceType; // Assume userState.getDeviceType() returns one of the device types

        // Add the select bar to the folder
        const deviceSelect = folder.add(window.gui_obj, 'deviceSelect',  userState.DeviceTypes).name('Device Select');

        deviceSelect.onChange(() => {
            console.log(`Switch to device: ${window.gui_obj.deviceSelect}`);
            let userState = new UserState()
            userState.deviceType = window.gui_obj.deviceSelect
        });

        //console.log(deviceSelect)
        
        folder.close()
    }

    initSceneControl(){
        const folder = window.debug_ui.addFolder('Scene Environment Control');

        window.gui_obj.trunOffEnvMap = () =>
        {
            let sceneManager = new SceneManager()
            let scene = sceneManager.GetScene()
            scene.environment = null;
            scene.background = null;
        }
        folder.add(window.gui_obj, 'trunOffEnvMap').name('Turn off environment map');

        window.gui_obj.HDR_Name = 'weather_1_2k'
        window.gui_obj.switchHDR_MAP = () =>
        {
            let sceneManager = new SceneManager()
            sceneManager.LoadEnvironmentMap('EnvMap/' + window.gui_obj.HDR_Name + '.hdr')
        }
        folder.add(window.gui_obj, 'HDR_Name')
        folder.add(window.gui_obj, 'switchHDR_MAP').name('Switch HDR map')

        folder.close()
    }

    initMessageControl(){
        const folder = window.debug_ui.addFolder('Message Control');


        window.gui_obj.message2rabbit = 'message'
        window.gui_obj.sendToRabbit = () => {
            router.publishMessage(window.gui_obj.message2rabbit)
        };
        folder.add(window.gui_obj, 'message2rabbit').name('msg to rabbit');
        folder.add(window.gui_obj, 'sendToRabbit').name('Send to rabbit');


        window.gui_obj.message2Http = 'message'
        window.gui_obj.sendToHttp = () => {
            let message = {
                type: "message",
                message: window.gui_obj.message2Http
            }

            httpRouter.postJSON(message)
                .then(result => {
                    console.log(result)
                })
        };
        folder.add(window.gui_obj, 'message2Http').name('msg to http');
        folder.add(window.gui_obj, 'sendToHttp').name('Send to http');

        
        window.gui_obj.sendPlaneJSON = () => {

            //edit here ----------------------------------------
            let message = {
                type: "sql",
                module: "density"
            }
            //--------------------------------------------------

            httpRouter.postJSON(message)
                .then(result => {
                    console.log(result)
                })
        };
        folder.add(window.gui_obj, 'sendPlaneJSON').name('Send plain json (edit in code)');

        folder.close();
    }
}