import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MEDIA_HOST_PATTERN =
  /(^|\.)((fbcdn|cdninstagram)\.(net|com)|instagram\.com)$/i;

function isAllowedMediaUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && MEDIA_HOST_PATTERN.test(url.hostname);
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const mediaUrl = new URL(request.url).searchParams.get("url");

  if (!mediaUrl) {
    return NextResponse.json({ error: "Invalid media URL." }, { status: 400 });
  }

  // Handle local merged media endpoint directly to avoid reverse-proxy SSL redirect issues
  if (mediaUrl.startsWith("/api/instagram/media")) {
    const urlObj = new URL(mediaUrl, "http://localhost");
    const shortcode = urlObj.searchParams.get("shortcode");
    if (shortcode) {
      const filePath = path.join("/tmp/downloadgram_cache", `${shortcode}.mp4`);
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        const nodeStream = fs.createReadStream(filePath);
        const webStream = new ReadableStream({
          start(controller) {
            nodeStream.on("data", (chunk) => controller.enqueue(chunk));
            nodeStream.on("end", () => controller.close());
            nodeStream.on("error", (err) => controller.error(err));
          },
          cancel() {
            nodeStream.destroy();
          },
        });
        return new NextResponse(webStream, {
          headers: {
            "Content-Type": "video/mp4",
            "Content-Disposition": `attachment; filename="downloadgram-${shortcode}.mp4"`,
            "Content-Length": String(stat.size),
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    }

    // Fallback: proxy-safe redirect
    const proto =
      request.headers.get("x-forwarded-proto") ||
      (request.url.startsWith("https") ? "https" : "http");
    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      new URL(request.url).host;
    const targetUrl = new URL(mediaUrl, `${proto}://${host}`);
    targetUrl.searchParams.set("download", "1");
    return NextResponse.redirect(targetUrl);
  }

  if (!isAllowedMediaUrl(mediaUrl)) {
    return NextResponse.json({ error: "Invalid media URL." }, { status: 400 });
  }

  let mediaResponse: Response;
  try {
    mediaResponse = await fetch(mediaUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "The media could not be downloaded." }, { status: 502 });
  }

  if (!mediaResponse.ok || !mediaResponse.body) {
    return NextResponse.json({ error: "The media could not be downloaded." }, { status: 502 });
  }

  const contentType = mediaResponse.headers.get("content-type") ?? "application/octet-stream";
  const safeContentType =
    contentType.startsWith("video/") || contentType.startsWith("image/")
      ? contentType
      : "application/octet-stream";

  const mimeBase = safeContentType.split(";")[0].trim().toLowerCase();
  let extension = "bin";
  if (mimeBase === "video/mp4" || mimeBase.startsWith("video/")) {
    extension = "mp4";
  } else if (mimeBase === "image/jpeg") {
    extension = "jpg";
  } else if (mimeBase === "image/png") {
    extension = "png";
  } else if (mimeBase === "image/webp") {
    extension = "webp";
  } else if (mimeBase.startsWith("image/")) {
    extension = "jpg";
  }

  return new NextResponse(mediaResponse.body, {
    headers: {
      "Content-Type": safeContentType,
      "Content-Disposition": `attachment; filename="downloadgram-media.${extension}"`,
      "Cache-Control": "no-store",
    },
  });
}
