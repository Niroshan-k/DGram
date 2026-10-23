"use client";

import React from "react";
import { useState } from "react";
import { FaClapperboard, FaVideo, FaCirclePlay, FaImage, FaDownload, FaArrowRotateRight, FaXmark } from "react-icons/fa6";

export default function Hero() {

    const [submit, setSubmit] = useState(false);
    const [embedUrl, setEmbedUrl] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const submittedUrl = formData.get("url") as string;

        try {
            const instagramUrl = new URL(submittedUrl);
            const pathParts = instagramUrl.pathname.split("/").filter(Boolean);
            const contentType = pathParts[0];
            const shortcode = pathParts[1];

            if (
                !["instagram.com", "www.instagram.com"].includes(instagramUrl.hostname) ||
                contentType !== "reel" ||
                !shortcode
            ) {
                return;
            }

            setEmbedUrl(`https://www.instagram.com/reel/${shortcode}/embed`);
            setSubmit(true);
        } catch {
            setSubmit(false);
        }
    };

    return (
        <div className="relative flex flex-col py-64 bg-linear-to-r from-blue-600 to-purple-600 items-center justify-center">
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
                            <iframe
                                title="Instagram reel preview"
                                src={embedUrl}
                                className="h-[50vh] min-h-100 w-full border-0 lg:h-[min(78vh,700px)] lg:w-105 lg:shrink-0"
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            />
                            <div className="flex w-full flex-col items-center p-2 justify-center gap-2 font-semibold sm:px-6 lg:w-70">
                                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-red-500 to-purple-500 px-4 py-2 text-white font-semibold transition-transform">
                                    <FaDownload />Download Video
                                </button>
                                <button
                                    type="button"
                                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold transition-transform"
                                    onClick={() => setSubmit(false)}
                                >
                                    <FaArrowRotateRight />
                                    Another Video
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!submit && (
                <div className="relative z-10 flex flex-col gap-2 items-center justify-center">
                    <div className="flex w-max bg-linear-to-r from-red-500 to-violet-400 lg:px-6 lg:py-3 px-3 py-1 rounded-2xl border border-gray-100/70 items-center gap-4">
                        <div className="flex items-center text-sm gap-2 text-gray-100">
                            <FaVideo />
                            <p className="hidden lg:block">Video</p>
                        </div>
                        <div className="h-4 lg:h-8 w-0.5 bg-gray-100/50"></div>
                        <div className="flex items-center gap-2 text-gray-100">
                            <FaClapperboard />
                            <p className="hidden lg:block">Reels</p>
                        </div>
                        <div className="h-4 lg:h-8 w-0.5 bg-gray-100/50"></div>
                        <div className="flex items-center gap-2 text-gray-100">
                            <FaCirclePlay />
                            <p className="hidden lg:block">Story</p>
                        </div>
                        <div className="h-4 lg:h-8 w-0.5 bg-gray-100/50"></div>
                        <div className="flex items-center gap-2 text-gray-100">
                            <FaImage />
                            <p className="hidden lg:block">Photos</p>
                        </div>
                    </div>
                    <h1 className="text-5xl lg:text-7xl mt-2 font-tiny5 uppercase font-bold text-center">DownloadGram</h1>
                    <p className="text-center text-sm px-4 py-2 rounded-full">Quick Save your favorite reels, videos, and photos online in high quality</p>
                    <div className="w-full px-4">
                        <form onSubmit={handleSubmit} className="relative mx-auto mt-4 w-full max-w-xl">
                            <input
                                name="url"
                                type="text"
                                placeholder="Enter Instagram URL"
                                className="w-full rounded-full text-gray-600 bg-white p-4 pr-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-red-400 to-violet-500 px-5 py-2 text-white transition-colors hover:bg-blue-600"
                            >
                                Download
                            </button>
                        </form>
                    </div>

                </div>
            )}
        </div>
    )
}