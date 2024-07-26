hachimport * as fs from 'fs';
import * as crypto from 'crypto';

// Define a type for the decryption options
type DecryptionOptions = {
  key: string;
};

type KeyPairValue = { [key: string]: string };
// Function to normalize the key to 32 bytes
function normalizeKey(secretKey: string): Buffer {
    // If the key is shorter than 32 bytes, pad it with zeroes
    // If the key is longer than 32 bytes, truncate it

    if (secretKey.length !== 32) {
        throw `secret key should be exactly 32 characters, got: ${secretKey.length} characters`
    }

    return Buffer.alloc(32, secretKey, 'utf8');
}


// Function to decrypt a value using ChaCha20
export function decrypt(text: string, secretKey: string): string {
  const algorithm = 'chacha20';
  const nonce = Buffer.alloc(12, 0); // 12-byte nonce for ChaCha20

  const key = normalizeKey(secretKey);
  const decipher = crypto.createDecipheriv(algorithm, key, nonce);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
  

// Function to load secrets from a file and decrypt them
export default async function loadSecrets(
  filePath: string,
  options: DecryptionOptions
): Promise<KeyPairValue> {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const secrets: KeyPairValue = JSON.parse(fileContent);

  const decryptedSecrets: KeyPairValue = {};
  for (const [key, value] of Object.entries(secrets)) {
    decryptedSecrets[key] = decrypt(value, options.key);
  }

  return decryptedSecrets;
}


// Function to encrypt a value using ChaCha20
export function encrypt(text: string, secretKey: string): string {
    const algorithm = 'chacha20';
    const nonce = Buffer.alloc(12, 0); // 12-byte nonce for ChaCha20
  
    const key = normalizeKey(secretKey);
    const cipher = crypto.createCipheriv(algorithm, key, nonce);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
  
