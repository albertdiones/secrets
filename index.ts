import * as fs from 'fs';
import * as crypto from 'crypto';

// Define a type for the decryption options
type DecryptionOptions = {
  key: string;
};

type KeyPairValue = { [key: string]: string };

// Function to derive a key from a secret
function deriveKey(secretKey: string): Buffer {
return crypto.createHash('sha256').update(secretKey).digest(); // Generate a 32-byte key
}

// Function to decrypt a value
function decrypt(text: string, secretKey: string): string {
    const algorithm = 'aes-256-cbc';
    const iv = Buffer.alloc(16, 0); // Initialization vector

    const key = deriveKey(secretKey);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
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


// Function to encrypt a value
export function encrypt(text: string, secretKey: string): string {
    const algorithm = 'aes-256-cbc';
    const iv = Buffer.alloc(16, 0); // Initialization vector

    const key = deriveKey(secretKey);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
  
