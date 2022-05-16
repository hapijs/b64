'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');


const { before, describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('import()', () => {

    let B64;

    before(async () => {

        B64 = await import('../lib/index.js');
    });

    it('exposes all methods and classes as named imports', () => {

        expect(Object.keys(B64)).to.equal([
            'Decoder',
            'Encoder',
            'base64urlDecode',
            'base64urlEncode',
            'decode',
            'default',
            'encode'
        ]);
    });
});
