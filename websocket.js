module.exports = function() {

  const WebSocket = require('ws');

  const WebSocketServer = WebSocket.Server;

  const wss = new WebSocketServer({
      perMessageDeflate: false,
      port: 8080
  });


  wss.on('connection', function (ws) {
      console.log(`[SERVER] connection()`);
      ws.on('message', function (message) {
          console.log(`[SERVER] Received: ${message}`);
          ws.send(`ECHO: ${message}`, (err) => {
              if (err) {
                  console.log(`[SERVER] error: ${err}`);
              }
          });
      })
  });
}
