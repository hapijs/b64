'use strict';

// Load modules

const Crypto = require('crypto');
const Stream = require('stream');
const Util = require('util');

const Lab = require('lab');
const Wreck = require('wreck');
const B64 = require('..');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Lab.expect;


it('pipes buffer through encoder and decoder', async () => {

    const buffer = Crypto.randomBytes(1024);
    const payload = await internals.test(buffer);
    expect(payload).to.equal(buffer.toString());
});


describe('decode()', () => {

    it('decodes a short buffer (1)', async () => {

        const value = '0';
        const encoded = B64.encode(new Buffer(value));
        expect(B64.decode(encoded).toString()).to.equal(value);
    });

    it('decodes an incomplete buffer', async () => {

        const value = '';
        const encoded = new Buffer('A');
        expect(B64.decode(encoded).toString()).to.equal(value);
    });

    it('decodes an whitespace buffer', async () => {

        const value = '';
        const encoded = new Buffer('     ');
        expect(B64.decode(encoded).toString()).to.equal(value);
    });

    it('decodes a buffer with whitespace', async () => {

        const value = '0123456789';
        const encoded = new Buffer('M  D\nEy\tMz\r\nQ1Nj\rc4\r\nO Q ==');
        expect(B64.decode(encoded).toString()).to.equal(value);
    });

    it('decodes a buffer with 4th invalid character', async () => {

        const value = '01';
        const encoded = new Buffer('MDE$');
        expect(B64.decode(encoded).toString()).to.equal(value);
    });
});


describe('Encoder', () => {

    it('process remainder', async () => {

        const buffer = [Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(5)];
        const payload = await internals.test(buffer);
        expect(payload).to.equal(Buffer.concat(buffer).toString());
    });

    it('flushes remainder', async () => {

        const buffer = [Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(1)];
        const payload = await internals.test(buffer);
        expect(payload).to.equal(Buffer.concat(buffer).toString());
    });

    it('skips empty remainder', async () => {

        const buffer = [Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(3)];
        const payload = await internals.test(buffer);
        expect(payload).to.equal(Buffer.concat(buffer).toString());
    });
});


describe('Decoder', () => {

    it('process remainder', async () => {

        const value = Crypto.randomBytes(100);
        const encoded = B64.encode(value);

        const stream = new internals.Payload([encoded.slice(0, 3), encoded.slice(3, 9), encoded.slice(9)]);
        const source = stream.pipe(new B64.Decoder());

        const payload = await Wreck.read(source);
        expect(payload.toString()).to.equal(value.toString());
    });

    it('flushes remainder', async () => {

        const value = '0123456789';
        const encoded = B64.encode(new Buffer(value));         // MDEyMzQ1Njc4OQ==

        const stream = new internals.Payload([encoded.slice(0, 14)]);
        const source = stream.pipe(new B64.Decoder());

        const payload = await Wreck.read(source);
        expect(payload.toString()).to.equal(value.toString());
    });
});


internals.Payload = function (payload) {

    Stream.Readable.call(this);

    this._data = [].concat(payload);
    this._position = 0;
};

Util.inherits(internals.Payload, Stream.Readable);


internals.Payload.prototype._read = function (size) {

    const chunk = this._data[this._position++];
    if (chunk) {
        this.push(chunk);
    }
    else {
        this.push(null);
    }
};


internals.test = async function (buffer) {

    const stream = new internals.Payload(buffer);
    const source = stream.pipe(new B64.Encoder()).pipe(new B64.Decoder());

    const payload = await Wreck.read(source);
    return payload.toString();
};
