import { fetchFeed } from "src/lib/rss.js";


export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(feed, null, 2));
}