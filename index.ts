import * as fs from 'fs';
import * as crypto from 'crypto';

// Define a type for the decryption options
type DecryptionOptions = {
  key: string;
};

type KeyPairValue = { [key: string]: string };

// Function to decrypt a value
function decrypt(text: string, secretKey: string): string {
  const algorithm = 'aes-256-cbc';
  const iv = Buffer.alloc(16, 0); // Initialization vector

  const decipher = crypto.createDecipheriv(
    algorithm,
    crypto.scryptSync(secretKey, 'salt', 128), 
    iv
);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Function to load secrets from a file and decrypt them
export default 
    async function loadSecrets(
        filePath: string,
        options: DecryptionOptions
    ): Promise< KeyPairValue > {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const secrets = JSON.parse(fileContent);
    
        const decryptedSecrets: KeyPairValue = {};
        for (const [key, value] of Object.entries(secrets)) {
            decryptedSecrets[key] = decrypt(value, options.key);
        }
    
        return decryptedSecrets;
    }