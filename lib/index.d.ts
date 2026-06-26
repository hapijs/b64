/// <reference types="node" />

import { Transform } from 'stream';

/**
 * Decodes a base64 buffer.
 *
 * @param buffer - The base64-encoded buffer.
 * @returns The decoded buffer.
 */
export function decode(buffer: Buffer): Buffer;

/**
 * Encodes a buffer to base64.
 *
 * @param buffer - The buffer to encode.
 * @returns The base64-encoded buffer.
 */
export function encode(buffer: Buffer): Buffer;

/**
 * Base64url (RFC 4648) encodes a value.
 *
 * @param value - The string or buffer to encode.
 * @param encoding - The encoding of `value` when a string. Defaults to `'binary'`.
 * @returns The base64url-encoded string.
 */
export function base64urlEncode(value: string | Buffer, encoding?: BufferEncoding): string;

/**
 * Base64url (RFC 4648) decodes a string.
 *
 * @param value - The base64url-encoded string.
 * @param encoding - The output encoding, or `'buffer'` to return a buffer. Defaults to `'binary'`.
 * @returns The decoded string, or a buffer when `encoding` is `'buffer'`.
 */
export function base64urlDecode(value: string, encoding?: BufferEncoding | 'buffer'): string | Buffer;

/** A streaming base64 decoder (a `stream.Transform`). */
export class Decoder extends Transform {}

/** A streaming base64 encoder (a `stream.Transform`). */
export class Encoder extends Transform {}
