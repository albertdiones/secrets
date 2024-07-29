import loadSecrets from ".";

export const secretKey = 'CarrotsRabbit===================';

console.log(await loadSecrets('test-secrets.json', {key: secretKey}));