import { readConfig } from "src/config";
import { createFeed } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`Name and URL are required. Usage: 'addfeed "Example" "example.com"'`)
    }
    const name: string = args[0];
    const url: string = args[1];
    const currentUserName = readConfig().currentUserName;
    const user = await getUser(currentUserName)
    if (!user) {
        throw new Error("Error retrieving user information.")
    }
    const userId = user.id;
    const feed = await createFeed(name, url, userId);
    console.log(`Feed "${name}" with URL "${url}" successfully created!`)
    printFeed(feed, user);
}

export async function printFeed(feed: Feed, user: User) {
    console.log(feed);
    console.log(user);
}