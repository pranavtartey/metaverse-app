dotenv.config()
import { WebSocketServer } from 'ws';
import { User } from './user';
import dotenv from "dotenv"

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {

    let user = new User(ws)

    ws.on('error', console.error);

    ws.send('Hello ji you are new connected to the websocket connection on PORT : 3001');
});