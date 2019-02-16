    const expect = require('expect');
    const {
        Users
    } = require('./users');

    describe('Users class', () => {
        let users;

        beforeEach(() => {
            users = new Users();
            users.users = [{
                    id: 'USER1ID123456',
                    name: 'JONA',
                    room: 'NodeJS'
                }, {
                    id: 'USER3ID123456',
                    name: 'GARY',
                    room: 'PHP'
                },
                {
                    id: 'USER4ID123456',
                    name: 'MARLON',
                    room: 'NodeJS'
                }
            ];
        })

        it('Should add a new user', () => {
            users = new Users();
            const user = {
                id: 'adertj3457sd88345',
                name: 'Bobby',
                room: 'Star wars fangirls'
            };

            const addedUser = users.addUser(user.id, user.name, user.room);

            expect(users.users).toEqual([user]);
        });

        it('Should remove a user', () => {
            let id = users.users[1].id;
            let removedUser = users.removeUser(id);

            expect(removedUser.id).toBe(id);
            expect(users.users.length).toBe(2);
        });

        it('Should NOT remove a user', () => {
            let removedUser = users.removeUser('invalidId');

            expect(removedUser).toBeFalsy();
            expect(users.users.length).toBe(3);
        });

        it('Should find user', () => {
            let user = users.getUser(users.users[0].id);
            expect(user.id).toBe(users.users[0].id);
        });

        it('Should NOT find user', () => {
            let user = users.getUser('invalidID');
            expect(user).toBeFalsy();
        });

        it('Should return names for room', () => {
            const userList = users.getUserList('NodeJS');
            expect(userList).toEqual(['JONA', 'MARLON']);
        });
    });