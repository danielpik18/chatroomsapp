class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const user = {
            id,
            name,
            room
        };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        let removedUser = this.getUser(id);

        if (removedUser) {
            this.users = this.users.filter(user => user.id !== id);
        }

        return removedUser;
    }

    getUser(id) {
        return this.users.filter(user => user.id === id)[0];
    }

    getUserList(room) {
        const filteredUsers = this.users.filter(user => user.room === room);
        const namesArr = filteredUsers.map(user => user.name);
        return namesArr;
    }
};

module.exports = {
    Users
};