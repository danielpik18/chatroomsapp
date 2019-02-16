const expect = require('expect');
const {
    generateMessage,
    generateLocationMessage
} = require('./message');

describe('generateMessage', () => {
    it('Should generate a new message', () => {
        const from = 'Daniboi';
        const text = 'YOOO MA HOMIE';
        const messageObj = generateMessage(from, text);

        expect(typeof messageObj.createdAt).toBe('number');
        expect(messageObj).toMatchObject({
            from,
            text
        });
    });
});

describe('generateLocationMessage', () => {
    it('Should generate a new location message', () => {
        const from = 'Daniboi';
        const url = 'https://www.google.com/maps?q=12,14';
        const messageObj = generateLocationMessage(from, 12, 14);

        expect(typeof messageObj.createdAt).toBe('number');
        expect(messageObj).toMatchObject({
            from,
            url
        });
    });
});