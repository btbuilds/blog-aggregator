import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const res = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator",
            accept: "application/rss+xml",
        },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`);
    }
    const XMLdata = await res.text();
    const parser = new XMLParser();
    let jObj = parser.parse(XMLdata);
    const channel = jObj.rss?.channel;
    if (!channel ||
        !channel.title ||
        !channel.link ||
        !channel.description ||
        !channel.item
    ) {
        throw new Error("Error obtaining channel from XML data.");
    }
    let items: any[] = [];
    if (Array.isArray(channel.item)) {
        items = channel.item;
    } else {
        items = [channel.item];
    }

    let rssItems: RSSItem[] = [];

    for (let item of items) {
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
        }

        rssItems.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
        });
    }

    const feed = {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: rssItems,
        }
    }

    return feed;
}