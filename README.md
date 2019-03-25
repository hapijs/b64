Base64 streaming encoder and decoder

[![Build Status](https://travis-ci.org/hapijs/b64.svg?branch=v3-commercial)](https://travis-ci.org/hapijs/b64)

## License

This version of the package requires a commercial license. You may not use, copy, or distribute it without first acquiring a commercial license from Sideway Inc. Using this software without a license is a violation of US and international law. To obtain a license, please contact [sales@sideway.com](mailto:sales@sideway.com). The open source version of this package can be found [here](https://github.com/hapijs/b64).

## Installation

```sh
npm install b64 --save
```


## API

### encode(buffer)

Base64 encode the buffer and return it as a new Buffer.


### decode(buffer)

Base64 decode the buffer and return the result as a new buffer.


### Encoder

Transform stream that base64 encodes each chunk of the stream.

Example:

```js
'use strict';

const Fs = require('fs');
const B64 = require('b64');

const stream = Fs.createReadStream(`${__dirname}/package.json`);
const encoder = new B64.Encoder();

stream.pipe(encoder).pipe(process.stdout);
```


### Decoder

Transform stream that base64 decodes each chunk of the stream.

Example:

```js
'use strict';

const Fs = require('fs');
const B64 = require('b64');

const stream = Fs.createReadStream(`${__dirname}/encodedfile.b64`);
const decoder = new B64.Decoder();

stream.pipe(decoder).pipe(process.stdout);
```
