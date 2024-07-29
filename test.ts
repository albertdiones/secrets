import loadSecrets from ".";
import profile from 'timer-profiler';
import mongoose from 'mongoose';


export const secretKey = 'CarrotsRabbit===================';

const mongoUrl = 'mongodb://localhost:27017/cache_via_mongo_test';

await mongoose.connect(mongoUrl);

profile(
    () => loadSecrets('test-secrets.json', {key: secretKey})
)
.then(
    (results) => console.log('results', results)
);