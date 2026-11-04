import { NextResponse } from "next/server";

const INSTAGRAM_HOSTS = new Set([
  "instagram.com",
  "www.instagram.com",
  "m.instagram.com",
]);

const mediaUrlPattern =
  /https?:\\?\/\\?\/[^"'\\\s<>]+(?:\.mp4|\/video\/)[^"'\\\s<>]*/gi;

type MediaKind = "video" | "image";

function isInstagramUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && INSTAGRAM_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function decodeHtml(value: string) {
  let decoded = value
    .replace(/\\u0025/g, "%")
    .replace(/\\u003D/g, "=")
    .replace(/\\u0026/g, "&")
    .replace(/\\u002F/g, "/")
    .replace(/\\u003A/g, ":")
    .replace(/\\u0022/g, '"')
    .replace(/\\u0026/g, "&")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");

  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Keep the original value when Instagram's URL contains incomplete escapes.
  }

  return decoded;
}

function getMetaContent(html: string, property: string) {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escapedProperty}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapedProperty}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }

  return null;
}

function getMediaUrls(html: string) {
  const normalizedHtml = decodeHtml(html);
  const candidates = [
    ...(normalizedHtml.match(mediaUrlPattern) ?? []),
    ...(normalizedHtml.match(
      /"(?:video_url|display_url|thumbnail_src|contentUrl|content_url)"\s*:\s*"([^"]+)"/gi,
    ) ?? []).map((value) => value.replace(/^"[^"]+"\s*:\s*"/, "").replace(/"$/, "")),
  ];

  return [...new Set(candidates.map(decodeHtml))].filter((url) =>
    /^https?:\/\//i.test(url),
  );
}

function getShortcode(url: URL) {
  const parts = url.pathname.split("/").filter(Boolean);
  return parts[1] ?? "instagram-media";
}

function getEmbedPath(url: URL, shortcode: string) {
  const contentType = url.pathname.split("/").filter(Boolean)[0];
  return contentType === "reel"
    ? `https://www.instagram.com/reel/${encodeURIComponent(shortcode)}/embed/`
    : `https://www.instagram.com/p/${encodeURIComponent(shortcode)}/embed/`;
}

async function fetchPublicPage(url: string, userAgent: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": userAgent,
    },
    redirect: "follow",
    cache: "no-store",
  });

  return response.ok ? response.text() : "";
}

export async function POST(request: Request) {
  let input: { url?: unknown; type?: unknown };

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof input.url !== "string" || !isInstagramUrl(input.url)) {
    return NextResponse.json(
      { error: "Enter a valid public Instagram URL." },
      { status: 400 },
    );
  }

  const sourceUrl = new URL(input.url);
  const selectedType = typeof input.type === "string" ? input.type : "Video";

  let instagramResponse: Response;
  try {
    instagramResponse = await fetch(sourceUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
      },
      redirect: "follow",
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Instagram could not be reached. Try again later." },
      { status: 502 },
    );
  }

  let html = instagramResponse.ok ? await instagramResponse.text() : "";
  const shortcode = getShortcode(sourceUrl);
  const mediaUrls = getMediaUrls(html);
  let videoUrl =
    getMetaContent(html, "og:video") ??
    getMetaContent(html, "og:video:secure_url") ??
    mediaUrls.find((url) => /\.mp4(?:[?&]|$)/i.test(url)) ??
    mediaUrls.find((url) => /\/video\//i.test(url));
  let imageUrl = getMetaContent(html, "og:image") ?? mediaUrls.find((url) => !/\.mp4/i.test(url));

  if (!videoUrl && !imageUrl) {
    try {
      const cleanUrl = new URL(sourceUrl);
      cleanUrl.search = "";
      const crawlerHtml = await fetchPublicPage(
        cleanUrl.toString(),
        "facebookexternalhit/1.1",
      );
      const crawlerMediaUrls = getMediaUrls(crawlerHtml);
      videoUrl =
        getMetaContent(crawlerHtml, "og:video") ??
        crawlerMediaUrls.find((url) => /\.mp4(?:[?&]|$)/i.test(url));
      imageUrl =
        getMetaContent(crawlerHtml, "og:image") ??
        crawlerMediaUrls.find((url) => !/\.mp4/i.test(url));
    } catch {
      // Continue to the embed fallback and return a clear error if needed.
    }
  }

  if (!videoUrl && !imageUrl && shortcode !== "instagram-media") {
    try {
      const embedResponse = await fetch(
        getEmbedPath(sourceUrl, shortcode),
        {
          headers: {
            Accept: "text/html,application/xhtml+xml",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
          },
          cache: "no-store",
        },
      );
      if (embedResponse.ok) {
        html = await embedResponse.text();
        const embedMediaUrls = getMediaUrls(html);
        videoUrl =
          getMetaContent(html, "og:video") ??
          embedMediaUrls.find((url) => /\.mp4(?:[?&]|$)/i.test(url));
        imageUrl =
          getMetaContent(html, "og:image") ??
          embedMediaUrls.find((url) => !/\.mp4/i.test(url));
      }
    } catch {
      // The original response is still used for the final error.
    }
  }

  if (!instagramResponse.ok && !videoUrl && !imageUrl) {
    return NextResponse.json(
      { error: "Instagram did not return this content. It may be private or unavailable." },
      { status: 502 },
    );
  }

  const mediaUrl =
    selectedType === "Photos" || !videoUrl ? imageUrl : videoUrl;
  const kind: MediaKind = mediaUrl === imageUrl ? "image" : "video";

  if (!mediaUrl || !/^https?:\/\//i.test(mediaUrl)) {
    return NextResponse.json(
      {
        error:
          "No downloadable public media was found. Instagram may require login or this URL may be unsupported.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    sourceUrl: sourceUrl.toString(),
    mediaUrl,
    kind,
    shortcode,
  });
}
