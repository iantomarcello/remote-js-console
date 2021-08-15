/**
 * Starts the server
 */

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080, });

console.log('Remote JS Console Websocket server established!');

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const time = new Date().toLocaleTimeString();
    const { key, messages } = JSON.parse(message);
    let colour;

    switch(key.toLowerCase()) {
      case 'connect': // green
        colour = '\x1b[32m'; 
        break;

      default:
      case 'log': // white
        colour = '\x1b[37m';
        break;

      case 'warn': // yellow
        colour = '\x1b[33m';
        break;

      case 'error': // red
        colour = '\x1b[31m';
        break;
    }
    console.log(`${colour}%s\x1b[0m`, `${key} at ${time}`);
    console.log(messages);
  });
});
