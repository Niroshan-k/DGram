"use client";

import React from "react";
import { useState } from "react";
import {
  FaClapperboard,
  FaVideo,
  FaCirclePlay,
  FaImage,
  FaDownload,
  FaArrowRotateRight,
  FaXmark,
} from "react-icons/fa6";

export default function Hero() {
  const [submit, setSubmit] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaKind, setMediaKind] = useState<"video" | "image">("video");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState("Video");
  const downloadTypes = [
    { label: "Video", icon: FaVideo },
    { label: "Reels", icon: FaClapperboard },
    { label: "Story", icon: FaCirclePlay },
    { label: "Photos", icon: FaImage },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const submittedUrl = formData.get("url") as string;
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: submittedUrl, type }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to find downloadable media.");
      }

      setMediaUrl(result.mediaUrl);
      setMediaKind(result.kind);
      setSubmit(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to find downloadable media.",
      );
      setSubmit(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col py-64 bg-linear-to-r from-blue-700 to-purple-700 items-center justify-center">
      {submit && (
        <div className="fixed inset-0 z-20 bg-black/60 px-4 py-6">
          <div className="flex min-h-full flex-col p-2 items-center justify-center gap-4">
            <div className="flex w-full max-w-4xl justify-end">
              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setSubmit(false)}
                className="rounded-full bg-black/70 p-2 text-lg leading-none text-white hover:bg-black"
              >
                <FaXmark />
              </button>
            </div>
            <div className="relative flex w-full max-w-4xl flex-col bg-white overflow-hidden rounded-2xl shadow-2xl lg:flex-row">
              {mediaKind === "video" ? (
                <video
                  controls
                  autoPlay
                  className="h-[50vh] min-h-100 w-full bg-black object-contain lg:h-[min(78vh,700px)] lg:w-105 lg:shrink-0"
                  src={mediaUrl}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Instagram media preview"
                  className="h-[50vh] min-h-100 w-full object-contain lg:h-[min(78vh,700px)] lg:w-105 lg:shrink-0"
                  src={mediaUrl} 
                />
              )}
              <div className="flex w-full flex-col items-center p-2 justify-center gap-2 font-semibold sm:px-6 lg:w-70">
                <a
                  download
                  href={`/api/instagram/download?url=${encodeURIComponent(mediaUrl)}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-red-500 to-purple-500 px-4 py-2 text-white font-semibold transition-transform"
                >
                  <FaDownload />
                  Download {mediaKind === "video" ? "Video" : "Photo"}
                </a>
                <button
                  type="button"
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold transition-transform"
                  onClick={() => setSubmit(false)}
                >
                  <FaArrowRotateRight />
                  Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!submit && (
        <div className="relative z-10 flex flex-col gap-2 items-center justify-center">
          <div className="flex w-max bg-white/20 backdrop-blur-xl rounded-2xl border border-gray-100/10 items-center gap-4">
            {downloadTypes.map(({ label, icon: Icon }, index) => (
              <React.Fragment key={label}>
                <button
                  type="button"
                  onClick={() => setType(label)}
                  className={`flex items-center gap-2 text-gray-100 ${
                    index === 0 || index === downloadTypes.length - 1
                      ? "p-3"
                      : ""
                  }`}
                >
                  <Icon />
                  <p className="hidden lg:block">{label}</p>
                </button>
                {index < downloadTypes.length - 1 && (
                  <div className="h-4 lg:h-8 w-0.5 bg-gray-100/50"></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-5xl lg:text-7xl mt-2 font-tiny5 uppercase font-bold text-center">
            DownloadGram
          </h1>
          <p className="text-center text-sm px-4 py-2 rounded-full">
            Quick Save your favorite reels, videos, and photos online in high
            quality
          </p>
          <div className="w-full px-4">
            <form
              onSubmit={handleSubmit}
              className="relative mx-auto mt-4 w-full max-w-xl"
            >
              <div className="w-24 rounded-t-2xl text-black/60 font-bold px-2 bg-white">{type}</div>
              <input
                name="url"
                type="text"
                placeholder="Enter Instagram URL"
                className="w-full rounded-full rounded-tl text-gray-600 bg-white p-4 pr-32 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-13 -translate-y-1/2 rounded-full bg-linear-to-r from-red-400 to-violet-500 px-5 py-2 text-white transition-colors hover:bg-blue-600"
              >
                {loading ? "Finding media..." : "Download"}
              </button>
            </form>
            {error && <p className="mt-3 text-center text-sm text-white">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
