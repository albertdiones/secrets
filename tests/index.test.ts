import {describe, expect, test} from '@jest/globals';
import loadSecrets from "../index.ts";
import cacheViaRedis from 'cache-via-redis';


cacheViaRedis.connect();

export const secretKey = 'CarrotsRabbit===================';
test('password decrypts', async () => {
    await loadSecrets('test-secrets.json', {key: secretKey})
    .then(
        (decryptedConfig) => {
            expect(decryptedConfig.smtp_password).toBe("FooBar");
            expect(decryptedConfig.mysql_password).toBe("Hello");
            expect(decryptedConfig.mongodb_password).toBe("World");            
            expect(decryptedConfig.mailchimp_api_key).toBe("Dog");
            expect(decryptedConfig.salesforce_api_key).toBe("Cat");
        }
    );    
  }
);