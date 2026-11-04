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

  return new NextResponse(mediaResponse.body, {
    headers: {
      "Content-Type": safeContentType,
      "Content-Disposition": `attachment; filename="downloadgram-media"`,
      "Cache-Control": "no-store",
    },
  });
}
