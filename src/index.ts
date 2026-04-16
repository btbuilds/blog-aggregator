import { handlerAgg } from "./commands/aggregate.js";
import { handlerBrowse } from "./commands/browse.js";
import {
    CommandsRegistry,
    middlewareLoggedIn,
    registerCommand,
    runCommand,
} from "./commands/commands.js";
import { handlerAddFeed, handlerFeeds, handlerFollow, handlerFollowing, handlerUnfollow } from "./commands/feeds.js";
import { handlerReset } from "./commands/reset.js";
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/users.js";
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
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(registry, "feeds", handlerFeeds);
    registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
    registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
    registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));
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