import cacheViaRedis from "cache-via-redis";
import loadSecrets from ".";
import profile from 'timer-profiler';


export const secretKey = 'CarrotsRabbit===================';

cacheViaRedis.connect();

console.time();
profile(
    () => loadSecrets('test-secrets.json', {key: secretKey})
)
.then(
    (results) => {
        console.timeEnd();
        return console.log('results', results)
    }
);