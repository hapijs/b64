'use strict';

const Crypto = require('crypto');
const Stream = require('stream');
const Util = require('util');

const Lab = require('lab');
const Wreck = require('wreck');
const B64 = require('..');


const internals = {};


const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Lab.expect;


it('pipes buffer through encoder and decoder', (done) => {

    const buffer = Crypto.randomBytes(1024);
    internals.test(buffer, (err, payload) => {

        expect(err).to.not.exist();
        expect(payload).to.equal(buffer.toString());
        done();
    });
});


describe('decode()', () => {

    it('decodes a short buffer (1)', (done) => {

        const value = '0';
        const encoded = B64.encode(Buffer.from(value));
        expect(B64.decode(encoded).toString()).to.equal(value);
        done();
    });

    it('decodes an incomplete buffer', (done) => {

        const value = '';
        const encoded = Buffer.from('A');
        expect(B64.decode(encoded).toString()).to.equal(value);
        done();
    });

    it('decodes an whitespace buffer', (done) => {

        const value = '';
        const encoded = Buffer.from('     ');
        expect(B64.decode(encoded).toString()).to.equal(value);
        done();
    });

    it('decodes a buffer with whitespace', (done) => {

        const value = '0123456789';
        const encoded = Buffer.from('M  D\nEy\tMz\r\nQ1Nj\rc4\r\nO Q ==');
        expect(B64.decode(encoded).toString()).to.equal(value);
        done();
    });

    it('decodes a buffer with 4th invalid character', (done) => {

        const value = '01';
        const encoded = Buffer.from('MDE$');
        expect(B64.decode(encoded).toString()).to.equal(value);
        done();
    });
});


describe('Encoder', () => {

    it('process remainder', (done) => {

        const buffer = [Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(5)];
        internals.test(buffer, (err, payload) => {

            expect(err).to.not.exist();
            expect(payload).to.equal(Buffer.concat(buffer).toString());
            done();
        });
    });

    it('flushes remainder', (done) => {

        const buffer = [Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(1)];
        internals.test(buffer, (err, payload) => {

            expect(err).to.not.exist();
            expect(payload).to.equal(Buffer.concat(buffer).toString());
            done();
        });
    });

    it('skips empty remainder', (done) => {

        const buffer = [Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(5), Crypto.randomBytes(3)];
        internals.test(buffer, (err, payload) => {

            expect(err).to.not.exist();
            expect(payload).to.equal(Buffer.concat(buffer).toString());
            done();
        });
    });
});


describe('Decoder', () => {

    it('process remainder', (done) => {

        const value = Crypto.randomBytes(100);
        const encoded = B64.encode(value);

        const stream = new internals.Payload([encoded.slice(0, 3), encoded.slice(3, 9), encoded.slice(9)]);
        const source = stream.pipe(new B64.Decoder());

        Wreck.read(source, {}, (err, payload) => {

            expect(err).to.not.exist();
            expect(payload.toString()).to.equal(value.toString());
            done();
        });
    });

    it('flushes remainder', (done) => {

        const value = '0123456789';
        const encoded = B64.encode(Buffer.from(value));         // MDEyMzQ1Njc4OQ==

        const stream = new internals.Payload([encoded.slice(0, 14)]);
        const source = stream.pipe(new B64.Decoder());

        Wreck.read(source, {}, (err, payload) => {

            expect(err).to.not.exist();
            expect(payload.toString()).to.equal(value.toString());
            done();
        });
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


internals.test = function (buffer, callback) {

    const stream = new internals.Payload(buffer);
    const source = stream.pipe(new B64.Encoder()).pipe(new B64.Decoder());

    Wreck.read(source, {}, (err, payload) => {

        callback(err, payload ? payload.toString() : null);
    });
};
