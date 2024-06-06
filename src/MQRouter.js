
import { Client } from '@stomp/stompjs';

let instance = null

let isConnected = false;

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
        isConnected = true

        client.subscribe('/topic/test01', message =>
            console.log(`Received: ${message.body}`)
        );

        client.publish({ destination: '/topic/test01', body: 'From xls main project' });
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

    publishMessage(message) {
        if (typeof message === 'string') {
           client.publish({ destination: '/topic/test01', body: message });
            console.log(`Message sent: ${message}`);
        } else {
            console.error('Message must be a string.');
        }
    }

}