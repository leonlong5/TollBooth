const WebSocket = require('ws');

const WebSocketServer = WebSocket.Server;

const wss = new WebSocketServer({
    perMessageDeflate: false,
    port: 2223
});

module.exports = wss;
