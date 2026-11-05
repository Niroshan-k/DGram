import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execFileAsync = promisify(execFile);

const INSTAGRAM_HOSTS = new Set([
  "instagram.com",
  "www.instagram.com",
  "m.instagram.com",
]);

const mediaUrlPattern =
  /https?:\\?\/\\?[^"'\\\s<>]+(?:\.mp4|\/video\/)[^"'\\\s<>]*/gi;

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

function extractVideoFromEmbedHtml(html: string) {
  const match = html.match(
    /video_url(?:\\+)?\"?\s*:\s*(?:\\+)?\"(https?:[^\"]+?)(?:\\+)?\"/i,
  );
  if (match?.[1]) {
    let clean = match[1].replace(/\\+\//g, "/").replace(/\\+/g, "");
    clean = clean.replace(/&amp;/g, "&");
    return clean;
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

function getEmbedPath(shortcode: string) {
  return `https://www.instagram.com/p/${encodeURIComponent(shortcode)}/embed/captioned/`;
}

function getYtDlpPath(): string | null {
  const localBin = path.join(process.cwd(), "bin", "yt-dlp");
  if (fs.existsSync(localBin)) return localBin;
  if (fs.existsSync("/tmp/yt-dlp")) return "/tmp/yt-dlp";
  return null;
}

async function getOrDownloadMergedVideo(
  targetUrl: string,
  shortcode: string,
): Promise<string | null> {
  const cacheDir = "/tmp/downloadgram_cache";
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const outputPath = path.join(cacheDir, `${shortcode}.mp4`);
  if (fs.existsSync(outputPath)) {
    const stat = fs.statSync(outputPath);
    if (stat.size > 10000) {
      return `/api/instagram/media?shortcode=${encodeURIComponent(shortcode)}`;
    }
  }

  const ytDlpPath = getYtDlpPath();
  if (!ytDlpPath) return null;

  try {
    await execFileAsync(
      ytDlpPath,
      [
        "--no-warnings",
        "--no-playlist",
        "-f",
        "bestvideo+bestaudio/best",
        "--merge-output-format",
        "mp4",
        "-o",
        outputPath,
        targetUrl,
      ],
      { timeout: 35000 },
    );

    if (fs.existsSync(outputPath)) {
      const stat = fs.statSync(outputPath);
      if (stat.size > 10000) {
        return `/api/instagram/media?shortcode=${encodeURIComponent(shortcode)}`;
      }
    }
  } catch {
    // If merger fails, continue to fallbacks
  }

  return null;
}

async function extractPhotoViaYtDlp(targetUrl: string) {
  const ytDlpPath = getYtDlpPath();
  if (!ytDlpPath) return null;

  try {
    const { stdout } = await execFileAsync(
      ytDlpPath,
      ["--no-warnings", "--no-playlist", "-j", targetUrl],
      { timeout: 25000 },
    );

    const data = JSON.parse(stdout);
    const imageUrl =
      data.thumbnail ||
      (Array.isArray(data.thumbnails) && data.thumbnails.length > 0
        ? data.thumbnails[data.thumbnails.length - 1].url
        : null);

    return imageUrl;
  } catch {
    return null;
  }
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
  const shortcode = getShortcode(sourceUrl);

  let videoUrl = "";
  let imageUrl = "";

  if (selectedType === "Photos") {
    // For photos, extract direct image URL
    imageUrl = (await extractPhotoViaYtDlp(sourceUrl.toString())) ?? "";
  } else {
    // 1. Primary method for Video/Reels: Merge video + audio stream so audio is guaranteed
    videoUrl =
      (await getOrDownloadMergedVideo(sourceUrl.toString(), shortcode)) ?? "";
  }

  // 2. Secondary method: Extract progressive video directly from Instagram captioned embed
  if (!videoUrl && !imageUrl && shortcode !== "instagram-media") {
    try {
      const embedResponse = await fetch(getEmbedPath(shortcode), {
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
        },
        cache: "no-store",
      });
      if (embedResponse.ok) {
        const embedHtml = await embedResponse.text();
        const extracted = extractVideoFromEmbedHtml(embedHtml);
        if (extracted) {
          videoUrl = extracted;
        }
        const embedMediaUrls = getMediaUrls(embedHtml);
        imageUrl =
          getMetaContent(embedHtml, "og:image") ??
          embedMediaUrls.find((url) => !/\.mp4/i.test(url)) ??
          "";
      }
    } catch {
      // Continue to next fallbacks
    }
  }

  // 3. Fallback method: Traditional crawler / og tags
  if (!videoUrl && !imageUrl) {
    try {
      let instagramResponse: Response | null = null;
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
        // Continue to crawler fallback
      }

      const html = instagramResponse?.ok ? await instagramResponse.text() : "";
      const mediaUrls = getMediaUrls(html);
      videoUrl =
        getMetaContent(html, "og:video") ??
        getMetaContent(html, "og:video:secure_url") ??
        mediaUrls.find((url) => /\.mp4(?:[?&]|$)/i.test(url)) ??
        mediaUrls.find((url) => /\/video\//i.test(url)) ??
        "";
      imageUrl =
        getMetaContent(html, "og:image") ??
        mediaUrls.find((url) => !/\.mp4/i.test(url)) ??
        "";

      if (!videoUrl && !imageUrl) {
        const cleanUrl = new URL(sourceUrl);
        cleanUrl.search = "";
        const crawlerHtml = await fetchPublicPage(
          cleanUrl.toString(),
          "facebookexternalhit/1.1",
        );
        const crawlerMediaUrls = getMediaUrls(crawlerHtml);
        videoUrl =
          getMetaContent(crawlerHtml, "og:video") ??
          crawlerMediaUrls.find((url) => /\.mp4(?:[?&]|$)/i.test(url)) ??
          "";
        imageUrl =
          getMetaContent(crawlerHtml, "og:image") ??
          crawlerMediaUrls.find((url) => !/\.mp4/i.test(url)) ??
          "";
      }
    } catch {
      // Ignore fallback error
    }
  }

  const mediaUrl =
    selectedType === "Photos" || !videoUrl ? imageUrl : videoUrl;
  const kind: MediaKind = mediaUrl === imageUrl ? "image" : "video";

  if (!mediaUrl) {
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
