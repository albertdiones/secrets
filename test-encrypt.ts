import loadSecrets, { encrypt } from ".";
import { secretKey } from "./test";


console.log(encrypt('FooBar', secretKey));