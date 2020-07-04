'use strict';

const Crypto = require('crypto');
const Fs = require('fs');
const Path = require('path');
const Stream = require('stream');
const Util = require('util');

const B64 = require('..');
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Wreck = require('@commercial/wreck');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


it('pipes buffer through encoder and decoder', async () => {

    const buffer = Crypto.randomBytes(1024);
    const payload = await internals.test(buffer);
    expect(payload).to.equal(buffer.toString());
});


describe('decode()', () => {

    it('decodes a short buffer (1)', () => {

        const value = '0';
        const encoded = B64.encode(Buffer.from(value));
        expect(B64.decode(encoded).toString()).to.equal(value);
    });

    it('decodes an incomplete buffer', () => {

        const value = '';
        const encoded = Buffer.from('A');
        expect(B64.decode(encoded).toString()).to.equal(value);
    });

    it('decodes an whitespace buffer', () => {

        const value = '';
        const encoded = Buffer.from('     ');
        expect(B64.decode(encoded).toString()).to.equal(value);
    });

    it('decodes a buffer with whitespace', () => {

        const value = '0123456789';
        const encoded = Buffer.from('M  D\nEy\tMz\r\nQ1Nj\rc4\r\nO Q ==');
        expect(B64.decode(encoded).toString()).to.equal(value);
    });

    it('decodes a buffer with 4th invalid character', () => {

        const value = '01';
        const encoded = Buffer.from('MDE$');
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
        const encoded = B64.encode(Buffer.from(value));         // MDEyMzQ1Njc4OQ==

        const stream = new internals.Payload([encoded.slice(0, 14)]);
        const source = stream.pipe(new B64.Decoder());

        const payload = await Wreck.read(source);
        expect(payload.toString()).to.equal(value.toString());
    });
});

describe('Base64Url', () => {

    const base64str = 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0-P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn-AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq-wsbKztLW2t7i5uru8vb6_wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t_g4eLj5OXm5-jp6uvs7e7v8PHy8_T19vf4-fr7_P3-_w';
    const str = unescape('%00%01%02%03%04%05%06%07%08%09%0A%0B%0C%0D%0E%0F%10%11%12%13%14%15%16%17%18%19%1A%1B%1C%1D%1E%1F%20%21%22%23%24%25%26%27%28%29*+%2C-./0123456789%3A%3B%3C%3D%3E%3F@ABCDEFGHIJKLMNOPQRSTUVWXYZ%5B%5C%5D%5E_%60abcdefghijklmnopqrstuvwxyz%7B%7C%7D%7E%7F%80%81%82%83%84%85%86%87%88%89%8A%8B%8C%8D%8E%8F%90%91%92%93%94%95%96%97%98%99%9A%9B%9C%9D%9E%9F%A0%A1%A2%A3%A4%A5%A6%A7%A8%A9%AA%AB%AC%AD%AE%AF%B0%B1%B2%B3%B4%B5%B6%B7%B8%B9%BA%BB%BC%BD%BE%BF%C0%C1%C2%C3%C4%C5%C6%C7%C8%C9%CA%CB%CC%CD%CE%CF%D0%D1%D2%D3%D4%D5%D6%D7%D8%D9%DA%DB%DC%DD%DE%DF%E0%E1%E2%E3%E4%E5%E6%E7%E8%E9%EA%EB%EC%ED%EE%EF%F0%F1%F2%F3%F4%F5%F6%F7%F8%F9%FA%FB%FC%FD%FE%FF');

    describe('base64urlEncode()', () => {

        it('should assert function input is a string or buffer', () => {

            const number = 1024;
            const func = () => {

                return B64.base64urlEncode(number);
            };

            expect(func).throws(Error);
        });

        it('should base64 URL-safe a string', () => {

            expect(B64.base64urlEncode(str)).to.equal(base64str);
        });

        it('encodes a buffer', () => {

            expect(B64.base64urlEncode(Buffer.from(str, 'binary'))).to.equal(base64str);
        });

        it('should base64 URL-safe a hex string', () => {

            const buffer = Buffer.from(str, 'binary');
            expect(B64.base64urlEncode(buffer.toString('hex'), 'hex')).to.equal(base64str);
        });

        it('works on larger input strings', () => {

            const input = Fs.readFileSync(Path.join(__dirname, 'index.js')).toString();
            const encoded = B64.base64urlEncode(input);

            expect(encoded).to.not.contain('+');
            expect(encoded).to.not.contain('/');

            const decoded = B64.base64urlDecode(encoded);
            expect(decoded).to.equal(input);
        });
    });

    describe('base64urlDecode()', () => {

        it('should un-base64 URL-safe a string', () => {

            expect(B64.base64urlDecode(base64str)).to.equal(str);
        });

        it('should un-base64 URL-safe a string into hex', () => {

            expect(B64.base64urlDecode(base64str, 'hex')).to.equal(Buffer.from(str, 'binary').toString('hex'));
        });

        it('should un-base64 URL-safe a string and return a buffer', () => {

            const buf = B64.base64urlDecode(base64str, 'buffer');
            expect(buf instanceof Buffer).to.equal(true);
            expect(buf.toString('binary')).to.equal(str);
        });

        it('throws error on invalid input', () => {

            expect(() => B64.base64urlDecode(1024)).to.throw('Value not a string');
        });

        it('throws error on invalid input', () => {

            expect(() => B64.base64urlDecode('*')).to.throw('Invalid character');
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


internals.test = async function (buffer) {

    const stream = new internals.Payload(buffer);
    const source = stream.pipe(new B64.Encoder()).pipe(new B64.Decoder());

    const payload = await Wreck.read(source);
    return payload.toString();
};
