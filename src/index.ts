import {
    CommandsRegistry,
    registerCommand,
    runCommand,
} from "./commands/commands.js";
import { handlerReset } from "./commands/reset.js";
import { handlerLogin, handlerRegister } from "./commands/users.js";
import { argv } from "node:process";

async function main() {
    const rawArgs = argv.slice(2);

    if (rawArgs.length < 1) {
        console.log("No command provided.");
        process.exit(1);
    }

    const cmdName = rawArgs[0];
    const args = rawArgs.slice(1);

    let registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    try {
        await runCommand(registry, cmdName, ...args);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command ${cmdName}: ${err.message}`);
        } else {
            console.error(`Error running command ${cmdName}: ${err}`);
        }
        process.exit(1);
    }
    process.exit(0);
}

main();