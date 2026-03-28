import { NextResponse } from "next/server";
import type { NewsArticle } from "@/lib/types";

export const revalidate = 600;

const MOCK_ARTICLES: NewsArticle[] = [
  {
    title: "Configure your NEWS_API_KEY to see live headlines",
    source: { name: "Setup Guide" },
    description:
      "Visit https://newsapi.org/register to get a free API key (100 requests/day). Add it to your .env.local file as NEWS_API_KEY=your_key_here",
    url: "https://newsapi.org/register",
    publishedAt: new Date().toISOString(),
    urlToImage: null,
  },
];

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        articles: MOCK_ARTICLES,
        noApiKey: true,
      });
    }

    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=20&apiKey=${apiKey}`,
      { next: { revalidate: 600 } }
    );

    if (!res.ok) throw new Error("NewsAPI error");
    const data = await res.json();
    const articles: NewsArticle[] = (data.articles ?? []).map(
      (a: NewsArticle) => ({
        title: a.title,
        source: a.source,
        description: a.description,
        url: a.url,
        publishedAt: a.publishedAt,
        urlToImage: a.urlToImage,
      })
    );

    return NextResponse.json({ articles });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "News fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
