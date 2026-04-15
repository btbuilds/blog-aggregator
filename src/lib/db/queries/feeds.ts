import { db } from "..";
import { feeds } from "../schema";
import { eq, sql } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, userId: string) {
    const [result] = await db.insert(feeds)
    .values({ name: name, url: url, userId: userId })
    .returning();
    return result;
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function getFeedByURL(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}

export async function markFeedFetched(feedId: string) {
    const [result] = await db.update(feeds)
    .set({ lastFetchedAt: sql`now()`, updatedAt: sql`now()` })
    .where(eq(feeds.id, feedId))
    .returning();
    return result;
}

export async function getNextFeedToFetch() {
    const [result] = await db.select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
    .limit(1);
    return result;
}