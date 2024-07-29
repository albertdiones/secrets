import * as fs from 'fs';
import * as crypto from 'crypto';
import cacheViaMongo from 'cache-via-mongo';
import { CacheItem } from 'cache-via-mongo/schema';

// Define a type for the decryption options
type DecryptionOptions = {
  key: string;
};

type KeyPairValue = { [key: string]: string };


type CacheInterface = {
  getItem(key: string): any;
  setItem(key: string,value: any,expiration:number): void;
}

// Function to normalize the key to 32 bytes
function normalizeKey(secretKey: string): Buffer {
    // If the key is shorter than 32 bytes, pad it with zeroes
    // If the key is longer than 32 bytes, truncate it

    if (secretKey.length !== 32) {
        throw `secret key should be exactly 32 characters, got: ${secretKey.length} characters`
    }

    return Buffer.alloc(32, secretKey, 'utf8');
}

// Function to decrypt a value
function decrypt(text: string, secretKey: string): string {
    const algorithm = 'aes-256-cbc';
    const iv = Buffer.alloc(16, 0); // Initialization vector

    const key = normalizeKey(secretKey);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const cache: CacheInterface = cacheViaMongo;

// Function to load secrets from a file and decrypt them
export default async function loadSecrets(
  filePath: string,
  options: DecryptionOptions
): Promise<KeyPairValue> {
  return cache.getItem(filePath).then(
    (cached: CacheItem | null) => {
      if (cached !== null) {
        console.log('cache hit!');
        return cached.value;
      }
      console.log('cache not hit');
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const secrets: KeyPairValue = JSON.parse(fileContent);
    
      const decryptedSecrets: KeyPairValue = {};
      for (const [key, value] of Object.entries(secrets)) {
        decryptedSecrets[key] = decrypt(value, options.key);
      }
    
      cache.setItem(filePath, decryptedSecrets,20);
    
      return decryptedSecrets;
    }
  );
}


// Function to encrypt a value
export function encrypt(text: string, secretKey: string): string {
    const algorithm = 'aes-256-cbc';
    const iv = Buffer.alloc(16, 0); // Initialization vector

    const key = normalizeKey(secretKey);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
  
