const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 5000 });

let broadcaster = null;
let viewers = [];

server.on('connection', socket => {
    socket.on('message', message => {
        let data = JSON.parse(message);

        if (data.type === "broadcaster") {
            broadcaster = socket;
            console.log('connected broadcaster!',viewers.length)
        } else if (data.type === "viewer") {
            viewers.push(socket);
            if (broadcaster) {
                broadcaster.send(JSON.stringify({ type: "newViewer" }));
            }
            console.log('connected client!',viewers.length)
        } else if (data.type === "offer") {
            viewers.forEach(viewer => viewer.send(JSON.stringify(data)));
            console.log('offer sent!')
        } else if (data.type === "answer") {
            broadcaster.send(JSON.stringify(data));
            console.log('answer sent!')
        } else if (data.type === "iceCandidate") {
            viewers.forEach(viewer => viewer.send(JSON.stringify(data)));
            console.log('candidate sent!')
        }
    });

    socket.on('close', () => {
        viewers = viewers.filter(viewer => viewer !== socket);
    });
});
