import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerLogin } from "./commands/users.js";
import { argv } from "node:process";

function main() {
    const rawArgs = argv.slice(2);

    if (rawArgs.length < 1) {
        console.log("No command provided.")
        process.exit(1);
    }

    const cmdName = rawArgs[0]
    const args = rawArgs.slice(1);

    let registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);

    runCommand(registry, cmdName, ...args);
}

main();