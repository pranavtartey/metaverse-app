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
            return
        }
        this.rooms.set(mapId, [...(this.rooms.get(mapId) ?? []), user])
    }

    public broadcast(message: OutgoingMessage, user: User, roomId: string) {
        if (!this.rooms.has(roomId)) {
            return
        }
        this.rooms.get(roomId)?.forEach(u => {
            if (u.id !== user.id) {
                u.send(message);
            }
        })
    }

}