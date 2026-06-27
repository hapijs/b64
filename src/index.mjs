import * as Hoek from '@hapi/hoek';

export { decode, Decoder } from './decoder.mjs';
export { encode, Encoder } from './encoder.mjs';

// Base64url (RFC 4648) encode

export function base64urlEncode(value, encoding) {
    Hoek.assert(typeof value === 'string' || Buffer.isBuffer(value), 'value must be string or buffer');
    const buf = Buffer.isBuffer(value) ? value : Buffer.from(value, encoding || 'binary');
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
}

// Base64url (RFC 4648) decode

export function base64urlDecode(value, encoding) {
    if (typeof value !== 'string') {
        throw new Error('Value not a string');
    }

    if (!/^[\w\-]*$/.test(value)) {
        throw new Error('Invalid character');
    }

    const buf = Buffer.from(value, 'base64');
    return encoding === 'buffer' ? buf : buf.toString(encoding || 'binary');
}
