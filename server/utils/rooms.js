class Room {
    constructor(name) {
        this.name = name;
        this.users = [];
    }

    userJoin(username) {
        this.users.push(username);
    }

    userLeave(username) {
        this.users = this.users.filter(user => user !== username);
    }
}

class Rooms {
    constructor() {
        this.rooms = [];
    }

    addRoom(name) {
        const room = new Room(name);
        this.rooms.push(room);
        return room;
    }

    removeRoom(name) {
        let removedRoom = this.getRoom(name);

        if (removedRoom) {
            this.rooms = this.rooms.filter(room => room.name !== name);
        }

        return removedRoom;
    }

    getRoom(name) {
        return this.rooms.filter(room => room.name === name)[0];
    }

    getRoomsList() {
        return this.rooms;
    }
}

module.exports = {
    Rooms
};