import type { CollectionEntry } from "astro:content";
import { XMLParser } from "fast-xml-parser";

export type PostSummary = {
  title: string;
  description: string;
  pubDate: Date;
  tags?: string[];
  href: string;
  source: "blog" | "zenn";
  timeZone?: string;
};

const ZENN_PROFILE_URL = "https://zenn.dev/yayo1";
const ZENN_FEED_URL = `${ZENN_PROFILE_URL}/feed?all=1`;
const ZENN_ARTICLE_PATH_PREFIX = "/yayo1/articles/";
const DESCRIPTION_LENGTH = 160;

type ZennFeedItem = {
  title?: unknown;
  description?: unknown;
  link?: unknown;
  pubDate?: unknown;
};

export function toBlogPostSummary(
  post: CollectionEntry<"blog">,
  lang: string,
): PostSummary {
  return {
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate,
    tags: post.data.tags,
    href: `/${lang}/blog/${post.id.replace(`${lang}/`, "")}`,
    source: "blog",
  };
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function createExcerpt(description: string): string {
  const normalized = description.replace(/\s+/gu, " ").trim();
  const characters = Array.from(normalized);

  if (characters.length <= DESCRIPTION_LENGTH) return normalized;

  return `${
    characters
      .slice(0, DESCRIPTION_LENGTH - 1)
      .join("")
      .trimEnd()
  }…`;
}

function parseZennItem(item: ZennFeedItem): PostSummary | undefined {
  const title = asString(item.title)?.trim();
  const description = asString(item.description);
  const link = asString(item.link);
  const pubDate = asString(item.pubDate);

  if (!title || !link || !pubDate) return undefined;

  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return undefined;
  }

  if (
    url.origin !== "https://zenn.dev" ||
    !url.pathname.startsWith(ZENN_ARTICLE_PATH_PREFIX)
  ) {
    return undefined;
  }

  const publishedAt = new Date(pubDate);
  if (Number.isNaN(publishedAt.valueOf())) return undefined;

  return {
    title,
    description: description ? createExcerpt(description) : "",
    pubDate: publishedAt,
    href: url.href,
    source: "zenn",
    timeZone: "Asia/Tokyo",
  };
}

async function fetchZennPosts(): Promise<PostSummary[]> {
  try {
    const response = await fetch(ZENN_FEED_URL, {
      headers: { Accept: "application/rss+xml, application/xml" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Zenn RSS returned ${response.status}`);
    }

    const parser = new XMLParser({
      isArray: (_name, path) => path === "rss.channel.item",
    });
    const feed = parser.parse(await response.text()) as {
      rss?: { channel?: { item?: ZennFeedItem[] } };
    };
    const items = feed.rss?.channel?.item;

    if (!Array.isArray(items)) {
      throw new Error("Zenn RSS did not contain an item list");
    }

    return items.flatMap((item) => {
      const post = parseZennItem(item);
      return post ? [post] : [];
    });
  } catch (error) {
    console.warn("Could not load Zenn posts; continuing without them.", error);
    return [];
  }
}

let zennPostsPromise: Promise<PostSummary[]> | undefined;

export function getZennPosts(): Promise<PostSummary[]> {
  zennPostsPromise ??= fetchZennPosts();
  return zennPostsPromise;
}
