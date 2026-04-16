/**
 * Demo file showing AI-generated custom cryptographic algorithms
 * These are examples of insecure cryptographic implementations
 * that AI might generate instead of using standard libraries
 */

// ── Example 1: Custom XOR Encryption ─────────────────────────────
// AI might generate this "simple" XOR cipher, which is trivially breakable
function xorEncrypt(data: string, key: string): string {
  return data.split('').map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join('');
}

// ── Example 2: Caesar Cipher ───────────────────────────────────────
// AI might generate ROT13 or Caesar cipher as "encryption"
function caesarCipher(text: string, shift: number): string {
  return text.split('').map(c =>
    String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65)
  ).join('');
}

// ── Example 3: Custom RC4 Implementation ────────────────────────
// AI might implement RC4 from scratch, but it's broken
function rc4Encrypt(key: string, data: string): string {
  let S: number[] = [];
  for (let i = 0; i < 256; i++) {
    S[i] = i;
  }

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key.charCodeAt(i % key.length)) % 256;
    [S[i], S[j]] = [S[j], S[i]];
  }

  // Stream generation
  let i = 0;
  let j = 0;
  let keystream = '';
  for (let k = 0; k < data.length; k++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
    keystream += String.fromCharCode(S[(S[i] + S[j]) % 256]);
  }

  // XOR with keystream
  let result = '';
  for (let k = 0; k < data.length; k++) {
    result += String.fromCharCode(data.charCodeAt(k) ^ keystream.charCodeAt(k));
  }
  return result;
}

// ── Example 4: Custom DES Implementation ────────────────────────
// AI might try to implement DES (56-bit keys are broken)
function desEncrypt(block: string, key: string): string {
  // Simplified DES implementation (not actual DES, but pattern matches)
  let result = '';
  for (let i = 0; i < block.length; i++) {
    result += String.fromCharCode(
      (block.charCodeAt(i) + key.charCodeAt(i % key.length)) % 256
    );
  }
  return result;
}

// ── Example 5: Custom Hash Function ───────────────────────────────
// AI might create a simple hash function instead of using SHA-256
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// ── Example 6: Simple Math as Encryption ────────────────────────
// AI might use simple arithmetic operations as "encryption"
function encryptSimple(text: string): string {
  return text.split('').map(c =>
    String.fromCharCode(c.charCodeAt(0) + 1)
  ).join('');
}

// ── Example 7: Base64 as Encryption ────────────────────────────
// AI might think Base64 is encryption (it's just encoding!)
function secureEncryption(data: string): string {
  return Buffer.from(data).toString('base64'); // This is NOT encryption!
}

// ── Example 8: Custom Substitution Cipher ───────────────────────
// AI might create a simple substitution cipher
function substitutionCipher(text: string): string {
  const map: Record<string, string> = {
    'a': 'z', 'b': 'y', 'c': 'x', 'd': 'w', 'e': 'v',
    'f': 'u', 'g': 't', 'h': 's', 'i': 'r', 'j': 'q'
  };
  return text.split('').map(c => map[c] || c).join('');
}

// ── Example 9: Reversible Obfuscation as Security ───────────────
// AI might use string reversal as "encryption"
function hidePassword(password: string): string {
  return password.split('').reverse().join(''); // Obfuscation, not encryption!
}

// ── Example 10: ROT13 Implementation ─────────────────────────────
// AI might implement ROT13 as "encryption"
function rot13(text: string): string {
  return text.split('').map(c => {
    const code = c.charCodeAt(0);
    if ((code >= 65 && code <= 90)) {
      return String.fromCharCode(((code - 65 + 13) % 26) + 65);
    }
    if ((code >= 97 && code <= 122)) {
      return String.fromCharCode(((code - 97 + 13) % 26) + 97);
    }
    return c;
  }).join('');
}

export {
  xorEncrypt,
  caesarCipher,
  rc4Encrypt,
  desEncrypt,
  simpleHash,
  encryptSimple,
  secureEncryption,
  substitutionCipher,
  hidePassword,
  rot13
};
