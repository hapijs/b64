import { Transform } from 'node:stream';

import { describe, expectTypeOf, it } from 'vitest';

import * as B64 from '../src/index.js';

describe('typings', () => {
    describe('encode', () => {
        it('returns a buffer', () => {
            expectTypeOf(B64.encode(Buffer.from('a'))).toEqualTypeOf<Buffer>();
        });

        it('invalid calls rejected', () => {
            // @ts-expect-error input must be a buffer
            B64.encode('a');
        });
    });

    describe('decode', () => {
        it('returns a buffer', () => {
            expectTypeOf(B64.decode(Buffer.from('YQ=='))).toEqualTypeOf<Buffer>();
        });

        it('invalid calls rejected', () => {
            // @ts-expect-error input must be a buffer
            B64.decode('YQ==');
        });
    });

    describe('base64urlEncode', () => {
        it('accepts a string or a buffer', () => {
            expectTypeOf(B64.base64urlEncode('a')).toEqualTypeOf<string>();
            expectTypeOf(B64.base64urlEncode('61', 'hex')).toEqualTypeOf<string>();
            expectTypeOf(B64.base64urlEncode(Buffer.from('a'))).toEqualTypeOf<string>();
        });

        it('invalid calls rejected', () => {
            try {
                // @ts-expect-error value must be a string or a buffer
                B64.base64urlEncode(1);
            } catch {}

            try {
                // @ts-expect-error encoding must be a buffer encoding
                B64.base64urlEncode('a', 'nope');
            } catch {}
        });
    });

    describe('base64urlDecode', () => {
        it('returns a string by default', () => {
            expectTypeOf(B64.base64urlDecode('YQ')).toEqualTypeOf<string>();
            expectTypeOf(B64.base64urlDecode('YQ', 'hex')).toEqualTypeOf<string>();
        });

        it('returns a buffer with the buffer encoding', () => {
            expectTypeOf(B64.base64urlDecode('YQ', 'buffer')).toEqualTypeOf<Buffer>();
        });

        it('invalid calls rejected', () => {
            try {
                // @ts-expect-error value must be a string
                B64.base64urlDecode(Buffer.from('YQ'));
            } catch {}
        });
    });

    describe('Encoder', () => {
        it('is a transform stream', () => {
            expectTypeOf(new B64.Encoder()).toExtend<Transform>();
        });
    });

    describe('Decoder', () => {
        it('is a transform stream', () => {
            expectTypeOf(new B64.Decoder()).toExtend<Transform>();
        });
    });
});
