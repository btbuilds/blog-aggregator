import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { createPost } from "src/lib/db/queries/posts";
import { Feed, NewPost } from "src/lib/db/schema";
import { fetchFeed } from "src/lib/rss.js";
import { parseDuration } from "src/lib/time";


export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <time_between_reqs>`);
    }

    const timeArg = args[0];
    const timeBetweenRequests = parseDuration(timeArg);
    if (!timeBetweenRequests) {
        throw new Error(`Invalid duration: ${timeArg} - use format 1h 30m 15s or 3500ms`);
    }

    console.log(`Collecting feeds every ${timeArg}...`);

    // run the first scrape immediately
    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log(`No feeds need fetched right now.`);
        return;
    }
    console.log(`Found a feed to fetch: "${feed.name}"`);
    try {
        scrapeFeed(feed);
    } catch {
        console.log(`Error fetching feed ${feed.name}`)
    }
    
}

async function scrapeFeed(feed: Feed) {
    await markFeedFetched(feed.id);

    const feedData = await fetchFeed(feed.url);

    for (let item of feedData.channel.item) {
        console.log(`Found post: ${item.title}`)

        await createPost({
            url: item.link,
            feedId: feed.id,
            title: item.title,
            description: item.description,
            publishedAt: new Date(item.pubDate),
        });
    }
    console.log(`Feed "${feed.name}" fetched, found ${feedData.channel.item.length} posts`);
}

function handleError(err: unknown) {
    console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`);
}