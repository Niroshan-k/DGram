import { NextResponse } from "next/server";

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

  // Handle local merged media endpoint
  if (mediaUrl.startsWith("/api/instagram/media")) {
    const targetUrl = new URL(mediaUrl, request.url);
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
