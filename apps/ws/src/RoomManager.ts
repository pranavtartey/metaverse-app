import { OutgoingMessage } from "./types";
import type { User } from "./user";

export class RoomManager {

    rooms: Map<string, User[]> = new Map()
    static instance: RoomManager

    private constructor() {
        this.rooms = new Map();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance
    }

    public removeUser(user: User, mapId: string) {
        if (!this.rooms.has(mapId)) {
            return
        }
        this.rooms.set(mapId, (this.rooms.get(mapId)?.filter(u => u.id !== user.id) ?? []));
    }

    public addUser(mapId: string, user: User) {
        if (!this.rooms.has(mapId)) {
            this.rooms.set(mapId, [user])
            console.log("this ran because there was no mapid present : ", this.rooms)
            return
        }
        this.rooms.set(mapId, [...(this.rooms.get(mapId) ?? []), user])
        console.log("This ran because there was already a user in the room : ", this.rooms)
    }

    public broadcast(message: OutgoingMessage, user: User, roomId: string) {
        console.log("This is the value of this.rooms.get(roomId) : ", this.rooms.get(roomId))
        if (!this.rooms.has(roomId)) {
            console.log("There was no room so no message was sent and a new room was created")
            return
        }
        this.rooms.get(roomId)?.forEach(u => {
            if (u.id !== user.id) {
                u.send(message);
                console.log("The message is being sent to this guy : ", u)
            }
        })
    }

}