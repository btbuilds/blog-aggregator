import { setUser } from "../config.js";

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <name>`);
    }
    setUser(args[0]);
    console.log(`Logged in with username ${args[0]}`);
}