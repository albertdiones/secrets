import cacheViaRedis from "cache-via-redis";
import loadSecrets, { askForPassword } from ".";


export const secretKey = 'CarrotsRabbit===================';

cacheViaRedis.connect();





askForPassword("Input password:")
.then(
  (password) => {
    loadSecrets(
            'test-secrets.json', 
            { key: password }
        )
        .then(
            (secrets) => {
                // run the application based on these secret
                return console.log('results', secrets)
            }
        );
  }
)