import { readConfig } from "src/config";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUser, getUserById } from "src/lib/db/queries/users";
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

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds();
    if (feeds.length === 0) {
        console.log("No feeds found.");
        return;
    }
    console.log(`Listing ${feeds.length} feeds:`)
    for (let feed of feeds) {
        let user = await getUserById(feed.userId);
        if (!user) {
            throw new Error(`User not found for feed ${feed.id}`)
        }
        printFeed(feed, user);
        console.log(`-------------------`)
    }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* Name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}