
import { Client } from '@stomp/stompjs';
import UserState from './UserState';

let instance = null

let isConnected = false;

let userState = new UserState()

const username = 'xls';
const password = '123456';

const client = new Client({
    brokerURL: 'ws://172.16.16.147:15674/ws',
    connectHeaders: {
        login: username,
        passcode: password,
    },
    onConnect: () => {

        console.log("rabbit mq connected")
        isConnected = true

        client.subscribe('/topic/test01', message =>
            console.log(`Received: ${message.body}`)
        );

        // client.subscribe('/topic/heat_point_raw_message', message =>
        //     console.log(`Received heat point: ${message.body}`)
        // );

        client.publish({ destination: '/topic/test01', body: 'User start xls project, device: ' + userState.deviceType });
    },
});

client.activate();



export default class MQRouter{
    constructor(){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this 
        //this.Connected = false;
        //this.initiateConnection()
    }

    initiateConnection(){

        const username = 'xls';
        const password = '123456';
    
        const client = new Client({
            brokerURL: 'ws://172.16.16.147:15674/ws',
            connectHeaders: {
                login: username,
                passcode: password,
            },
            onConnect: () => {

                console.log("connected")
                this.Connected = true;

                client.subscribe('/topic/test01', message =>
                    console.log(`Received: ${message.body}`)
                );

                client.publish({ destination: '/topic/test01', body: 'From xls main project' });
            },
        });
    
        client.activate();
    }

    subscribeToTopic(topic, callbackFunction) {
        // Subscribe to the specified topic with the provided callback function
        let subscribeID = client.subscribe(topic, message => {
            callbackFunction(message.body);
        });
        console.log(subscribeID)
        return subscribeID.id
    }

    unsubscribeByID(ID) {
        // Unsubscribe from the specified topic
        client.unsubscribe(ID);
        alert('unsubscribe ' + ID)
    }

    publishMessage(message) {
        if (typeof message === 'string') {
           client.publish({ destination: '/topic/test01', body: message });
            console.log(`Message sent: ${message}`);
        } else {
            console.error('Message must be a string.');
        }
    }

}