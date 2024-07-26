import loadSecrets from ".";


console.log(await loadSecrets('test-secrets.json', {key: 'CarrotsRabbit==='}));