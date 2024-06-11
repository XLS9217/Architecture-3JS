let instance = null

class HTTPRouter {
    constructor() {
        if(instance)
        {
            return instance
        }
        instance = this 

        this.ipAddr = 'http://172.16.16.147'
        this.port = '8080'
    }

    //turn the data into string then send
    async postJSON(data) {
        try {
            const response = await fetch(`${this.ipAddr}:${this.port}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

const httpRouter = new HTTPRouter();
export default httpRouter;
