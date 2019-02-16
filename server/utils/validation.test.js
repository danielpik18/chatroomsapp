const expect = require('expect');
const {
    isRealString
} = require('./validation');

describe('Validation', () => {
    it('Should reject non-string values', () => {
        let str = isRealString(123);
        expect(str).toBe(false);
    });

    it('Should reject string with only spaces', () => {
        let str = isRealString('  ');
        expect(str).toBe(false);
    });

    it('Should allow valid strings', () => {
        let str = isRealString('Hello World');
        expect(str).toBe(true);
    })
})