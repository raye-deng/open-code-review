/**
 * Demo file: Node.js Deprecated API Detection
 *
 * This file demonstrates deprecated Node.js APIs that should be detected.
 */

const http = require('http');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');

// Deprecated: new Buffer() - Use Buffer.from() or Buffer.alloc()
const buffer = new Buffer(1024);
console.log('Buffer created:', buffer);

// Deprecated: url.parse() - Use new URL()
const parsedUrl = url.parse('https://example.com/path?query=value');
console.log('Parsed URL:', parsedUrl);

// Deprecated: crypto.createCipher() - Use crypto.createCipheriv()
const cipher = crypto.createCipher('aes-256-cbc', 'secret-key');
console.log('Cipher created:', cipher);

// Deprecated: crypto.createDecipher() - Use crypto.createDecipheriv()
const decipher = crypto.createDecipher('aes-256-cbc', 'secret-key');
console.log('Decipher created:', decipher);

// Deprecated: fs.exists() - Use fs.existsSync() or fs.access()
fs.exists('/path/to/file', (exists) => {
  console.log('File exists:', exists);
});

// Deprecated: crypto.createHash('md5') for security purposes
const hash = crypto.createHash('md5');
console.log('MD5 hash created (not secure):', hash);

// Deprecated: crypto.createHash('sha1') for security purposes
const sha1Hash = crypto.createHash('sha1');
console.log('SHA1 hash created (weak):', sha1Hash);

console.log('Demo file complete');
