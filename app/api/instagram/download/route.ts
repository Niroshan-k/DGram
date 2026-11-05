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

  if (!mediaUrl || !isAllowedMediaUrl(mediaUrl)) {
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
  const extension =
    safeContentType.split(";")[0] === "video/mp4"
      ? "mp4"
      : safeContentType.split(";")[0] === "image/jpeg"
        ? "jpg"
        : safeContentType.split(";")[0] === "image/png"
          ? "png"
          : safeContentType.split(";")[0] === "image/webp"
            ? "webp"
            : "bin";

  return new NextResponse(mediaResponse.body, {
    headers: {
      "Content-Type": safeContentType,
      "Content-Disposition": `attachment; filename="downloadgram-media.${extension}"`,
      "Cache-Control": "no-store",
    },
  });
}
