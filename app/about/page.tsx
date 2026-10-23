import {
    FaCamera,
    FaCircleCheck,
    FaClock,
    FaClapperboard,
    FaImages,
    FaMusic,
    FaVideo,
} from "react-icons/fa6";

const downloadTypes = [
    {
        icon: FaVideo,
        title: "Instagram Video Downloader",
        description:
            "VideoDropper is the premier tool to download public Instagram videos in original high-definition clarity. Whether it's a feed clip, IGTV, or a long-form video post, our downloader saves clean MP4 files directly to your device without quality loss, compression, or added watermarks.",
        benefits: [
            "Download original 1080p Full HD MP4 files",
            "Full audio quality and original bitrate preserved",
            "No watermarks, branding, or video recompression",
            "Fast direct browser save without login or registration",
        ],
    },
    {
        icon: FaClapperboard,
        title: "Instagram Reels Downloader",
        description:
            "Built specifically for short-form vertical video where sound sync and timing are critical. Save trending Reels with audio directly to your Camera Roll or computer in high quality, perfect for creators archiving inspiration, remixing, or offline viewing.",
        benefits: [
            "Save vertical 9:16 videos with crisp studio audio",
            "One-click save directly to phone gallery or desktop",
            "No app installation, jailbreak, or extensions needed",
            "Works smoothly on iPhone, iPad, Android, Mac and Windows",
        ],
    },
    {
        icon: FaImages,
        title: "Instagram Photo & Carousel Downloader",
        description:
            "Never settle for low-resolution screenshots that ruin image quality. VideoDropper extracts full-resolution Instagram photos directly from Instagram servers. For multi-slide carousel albums, our system identifies all slides so you can download individual photos or the complete collection.",
        benefits: [
            "Uncompressed original resolution JPG downloads",
            "Full support for multi-image carousel albums",
            "Save individual frames or complete slide sets",
            "Preserves true colors, metadata, and sharpness",
        ],
    },
    {
        icon: FaClock,
        title: "Instagram Story & Highlights Saver",
        description:
            "Stories disappear after 24 hours, but VideoDropper lets you preserve them permanently. Watch and save public Instagram stories and profile highlights anonymously. Never worry about missed updates, expiring event announcements, or campaign references.",
        benefits: [
            "100% anonymous story watching and downloading",
            "Archive 24-hour expiring stories before they disappear",
            "Download entire highlight albums including cover art",
            "High-speed lookup by Instagram link or username",
        ],
    },
    {
        icon: FaMusic,
        title: "Instagram Audio & MP3 Extractor",
        description:
            "When you only want the sound, our Audio Extractor converts any Instagram Reel or video into a high-bitrate MP3 track. Ideal for grabbing trending audio clips, viral background music, podcast snippets, or speeches for offline listening and creative editing.",
        benefits: [
            "Extract pristine audio up to 320kbps MP3 format",
            "Fast audio conversion without video data bloat",
            "Save trending background music and viral audio clips",
            "Compatible with all audio players and video editing tools",
        ],
    },
];

export default function About() {
    return (
        <main className="bg-white pb-16 bg-[radial-gradient(#A19D9C_0.1px,transparent_1px)] bg-size-[24px_24px]">
            <section className="relative overflow-hidden bg-linear-to-br from-red-500 via-rose-500 to-violet-500 px-6 pb-16 pt-40 text-white lg:px-12 lg:pb-24 lg:pt-48">
                <div className="relative mx-auto max-w-7xl">
                    <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white/80">
                        <FaCamera /> One tool for every format
                    </p>
                    <h1 className="max-w-3xl text-4xl font-bold leading-tight lg:text-6xl">
                        What Can You Download?
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-7 text-white/90 lg:text-lg">
                        Each tool is purpose-built for a specific Instagram format, from vertical Reels and multi-slide carousels to MP3 audio and expiring Stories.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-6 px-6 py-12 lg:grid-cols-2 lg:px-12 lg:py-20">
                {downloadTypes.map((downloadType, index) => {
                    const Icon = downloadType.icon;

                    return (
                        <article
                            key={downloadType.title}
                            className={`flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/60 lg:p-8 ${index === 0 ? "lg:col-span-2" : ""}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-red-500 to-violet-500 text-xl text-white">
                                    <Icon />
                                </div>
                                <div>
                                    <h2 className="mt-1 text-2xl font-bold text-gray-800">{downloadType.title}</h2>
                                </div>
                            </div>
                            <p className="mt-6 leading-7 text-gray-600">{downloadType.description}</p>
                            <ul className="mt-6 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                                {downloadType.benefits.map((benefit) => (
                                    <li key={benefit} className="flex items-start gap-2">
                                        <FaCircleCheck className="mt-0.5 shrink-0 text-green-500" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    );
                })}
            </section>
        </main>
    );
}