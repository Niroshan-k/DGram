import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CACHE_DIR = "/tmp/downloadgram_cache";
const SAFE_SHORTCODE_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

export async function GET(request: NextRequest) {
  const shortcode = request.nextUrl.searchParams.get("shortcode");
  const isDownload = request.nextUrl.searchParams.get("download") === "1";

  if (!shortcode || !SAFE_SHORTCODE_REGEX.test(shortcode)) {
    return NextResponse.json({ error: "Invalid shortcode." }, { status: 400 });
  }

  const filePath = path.join(CACHE_DIR, `${shortcode}.mp4`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Media not found." }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get("range");

  const commonHeaders: Record<string, string> = {
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=3600",
  };

  if (isDownload) {
    commonHeaders["Content-Disposition"] =
      `attachment; filename="downloadgram-${shortcode}.mp4"`;
  }

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${fileSize}` },
      });
    }

    const chunkSize = end - start + 1;
    const nodeStream = fs.createReadStream(filePath, { start, end });

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
      status: 206,
      headers: {
        ...commonHeaders,
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Content-Length": String(chunkSize),
      },
    });
  }

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
    status: 200,
    headers: {
      ...commonHeaders,
      "Content-Length": String(fileSize),
    },
  });
}
