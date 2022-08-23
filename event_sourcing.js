const express = require('express');
const cors = require('cors');
const events = require('events');
const PORT = 4000;

const emitter = new events.EventEmitter();

const app = express();
app.use(cors());
app.use(express.json());

// Event Sourcing - stable type of interaction between server and client
// Only server can send some information (in our example - after catching of event)
app.get("/connect", (request, responce) => {
    responce.writeHead(200, { 
        "Connection": "keep-alive", 
        "Content-Type": "text/event-stream", 
        "Cache-control": "no-cache" }
    );
    emitter.on(
        "sendMessageEvent",
        message => { 
            responce.write(`data: ${JSON.stringify(message)} \n\n`); // special format for data sending
        }
    );
});

app.post("/new-messages", (request, responce) => {
    const message = request.body;
    emitter.emit("sendMessageEvent", message);
    responce.status(200);
});

app.listen(
    PORT,
    () => {
        console.log(`Server started on port: ${PORT}`);
    }
);
