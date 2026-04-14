import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const currentUserName = readConfig().currentUserName;
        const user = await getUser(currentUserName)
        if (!user) {
            throw new Error("Error retrieving user information.")
        }
        await handler(cmdName, user, ...args);
    };
}

export function registerCommand(
    registry: CommandsRegistry,
    cmdName: string,
    handler: CommandHandler,
): void {
    registry[cmdName] = handler;
}

export async function runCommand(
    registry: CommandsRegistry,
    cmdName: string,
    ...args: string[]
): Promise<void> {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Command "${cmdName}" not found.`)
    }

    await handler(cmdName, ...args);
}