import cacheViaRedis from "cache-via-redis";
import loadSecrets from ".";
import profile from 'timer-profiler';
import * as readline from 'readline';
import { Writable } from "stream";



export const secretKey = 'CarrotsRabbit===================';

cacheViaRedis.connect();


// cr: wERWINd
class MutableStdOut extends Writable {
    muted: boolean;
    constructor(...parameters) {
        parameters[0] = {
            ...(parameters[0] ?? {}),
            ...{
                write: function (chunk, encoding, callback) {
                    if (this.muted === true) {
                        return;
                    }
                    process.stdout.write(chunk,encoding);
                    callback();
                }
            }
        }
        super(...parameters);
    }
}


const passwordPromptStdout = new MutableStdOut();

// Create an interface for reading input from stdin
const userInterface = readline.createInterface({
    input: process.stdin,
    output: passwordPromptStdout,
    terminal: true,
  });

const initialPrompt = 'Input password: ';

// todo: find any other events that will
//    preemptively prevent the printing out 
//    of the typed input instead of 
//    retroactively deleting it from the terminal

const dataListener = (chunk) => {
    const key = chunk.toString();  

    if (key === "\u007F") { // cr: salieri
        return;
    }

    process.stdout.write(
        `\b \b`
        .repeat(key.length)
    );
  };


const keypressHandler = (key, data) => {
    if (key === "\u007F") { // cr: salieri
        return;
    }

    process.stdout.write(
        `\b \b`
    );
};


// process.stdin.on('keypress',keypressHandler);


userInterface.question(
    initialPrompt,
    (password) => {
        passwordPromptStdout.muted = false;
        process.stdin.removeListener('data', dataListener);
        userInterface.close(); 
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
);


passwordPromptStdout.muted = true;