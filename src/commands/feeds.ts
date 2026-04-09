import { readConfig } from "src/config";
import { createFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feedfollows";
import { createFeed, getFeedByURL, getFeeds } from "src/lib/db/queries/feeds";
import { getCurrentUserId, getUser, getUserById } from "src/lib/db/queries/users";
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
    const feedFollow = await createFeedFollow(user.id, feed.id);
    printFeedFollow(user.name, feedFollow.feedName);
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

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Incorrect number of arguments. Usage: 'follow www.example.com'`)
    }
    const url = args[0]
    const userId = await getCurrentUserId();
    const feed = await getFeedByURL(url);
    if (!feed) {
        throw new Error(`Error finding feed '${url}'`)
    }
    const feedFollow = await createFeedFollow(userId, feed.id);
    printFeedFollow(feedFollow.userName, feedFollow.feedName);
}

export async function handlerFollowing() {
    const userId = await getCurrentUserId();
    const feedFollows = await getFeedFollowsForUser(userId);
    if (feedFollows.length === 0) {
        console.log(`No feed follows found for current user.`)
    }
    console.log(`Feed follows for current user:`);
    for (let ff of feedFollows) {
        console.log(`* ${ff.feedname}`);
    }
}

export function printFeedFollow(username: string, feedname: string) {
    console.log(`* User: ${username}`);
    console.log(`* Feed: ${feedname}`);
}