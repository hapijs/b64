import { describe, expect, it } from 'vitest';

import * as B64 from '../lib/index.js';

describe('import()', () => {
    it('exposes all methods and classes as named imports', () => {
        expect(Object.keys(B64)).toEqual([
            'decode',
            'Decoder',
            'encode',
            'Encoder',
            'base64urlEncode',
            'base64urlDecode',
        ]);
    });
});
