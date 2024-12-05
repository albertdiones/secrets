import loadSecrets, { encrypt } from ".";
import { secretKey } from "./test";


console.log(await encrypt('FooBar', secretKey));