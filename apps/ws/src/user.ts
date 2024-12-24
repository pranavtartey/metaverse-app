import client from "@repo/db/client"
import { WebSocket } from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import { OutgoingMessage } from "./types";
import { RoomManager } from "./RoomManager";

function getRandomString(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export class User {

    public id: string
    private ws: WebSocket
    public userId?: string;
    private mapId?: string
    private x: number;
    private y: number;

    constructor(ws: WebSocket) {
        this.ws = ws
        this.id = getRandomString(10);
        this.x = 0,
            this.y = 0,
            this.initHandlers()
    }

    initHandlers() {
        // console.log("Hello ji")
        //the on message is only called when the ws recieves a new message from the client baki the class constructor will call the initHandler so the console.log will always be logged as soon as the connection is made with the new client
        this.ws.on("message", async (data) => {
            // console.log(data.toString());//without the toString() the data is of <Buffer 6b 75 63 68 20 62 68 69 20 6b 65 68 20 64 65 20 62 68 61 69> this pattern and as we apply the toString() we get the message in the human readable string format :)

            const parsedData = JSON.parse(data.toString());

            // console.log("This is your parsedData : ", parsedData)

            switch (parsedData.type) {
                case "join":
                    console.log("Join Event Received");
                    const mapId = parsedData.payload.mapId;
                    const token = parsedData.payload.token
                    const userId = (jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload).userId

                    if (!userId) {
                        this.ws.close()
                        return
                    }

                    this.userId = userId;

                    const map = await client.map.findFirst({
                        where: {
                            id: mapId
                        }
                    })

                    if (!map) {
                        this.ws.close();
                        return
                    }
                    this.mapId = map.id
                    this.x = Math.floor(Math.random() * map?.width);
                    this.y = Math.floor(Math.random() * map?.height)
                    RoomManager.getInstance().addUser(mapId, this);

                    console.log("X : ", this.x)
                    console.log("Y : ", this.y)

                    this.send({
                        type: "space-joined",
                        payload: {
                            spawn: {
                                x: this.x,
                                y: this.y
                            },
                            userId: this.id,
                            users: RoomManager.getInstance().rooms.get(this.mapId)?.filter(x => x.id !== this.id)?.map(u => ({ userId: u.id, x: u.x, y: u.y })) ?? []
                        }
                    })

                    RoomManager.getInstance().broadcast({
                        type: "user-joined",
                        payload: {
                            userId: this.id,
                            x: this.x,
                            y: this.y
                        }
                    }, this, this.mapId!)
                    console.log("This is the mapId from user ws : ", this.mapId)
                    break;


                case "move":
                    const moveX = parsedData.payload.x;
                    const moveY = parsedData.payload.y;
                    const xDisplacement = Math.abs(this.x - moveX);
                    const yDisplacement = Math.abs(this.y - moveY);

                    if ((xDisplacement == 5 && yDisplacement == 0) || (xDisplacement == 0 && yDisplacement == 5)) {
                        // console.log("I am working!!!")
                        this.x = moveX
                        this.y = moveY
                        RoomManager.getInstance().broadcast({
                            type: "movement",
                            payload: {
                                x: this.x,
                                y: this.y,
                                userId: this.id,
                            },
                        }, this, this.mapId!)
                        return
                    }
                    this.send({
                        type: "movement-rejected",
                        payload: {
                            x: this.x,
                            y: this.y,
                        }
                    })
            }

        })

    }

    destroy() {
        RoomManager.getInstance().broadcast({
            type: "user-left",
            payload: {
                userId: this.userId
            },
        }, this, this.mapId!)
    }

    send(payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload))
    }

}