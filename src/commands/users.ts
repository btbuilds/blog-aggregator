import { createUser, getUser, getUsers } from "src/lib/db/queries/users.js";
import { readConfig, setUser } from "../config.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <name>`);
    }
    const userName = args[0];
    const user = await getUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`);
    }
    setUser(userName);
    console.log(`Logged in with username ${userName}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <name>`);
    }
    const userName = args[0];
    const user = await createUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`);
    }
    setUser(userName);
    console.log("User created successfully!");
    console.log(await getUser(userName));
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
    const users = await getUsers();
    const currentUserName = readConfig().currentUserName;
    for (let user of users) {
        console.log(`* ${user.name}${user.name === currentUserName ? " (current)" : ""}`);
    }
}