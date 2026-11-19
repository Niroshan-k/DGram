import Image from "next/image";
import { FaBookOpen, FaGavel, FaScrewdriverWrench } from "react-icons/fa6";

const linkGroups = [
    {
        title: "Tools",
        icon: FaScrewdriverWrench,
        links: [
            "Video Downloader",
            "Reels Downloader",
            "Photo Saver",
            "Audio Extractor",
            "Stories Viewer",
            "Profile Downloader",
        ],
    },
    {
        title: "Legal",
        icon: FaGavel,
        links: ["Privacy Policy", "Terms of Service", "Disclaimer", "DMCA Policy", "Contact Us"],
    },
    {
        title: "Resources",
        icon: FaBookOpen,
        links: ["How To", "FAQs", "Blog & Guides", "Report an Issue"],
    },
];

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 transition-colors">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 lg:grid-cols-4 lg:px-0">
                <div>
                    <Image src="/logo.png" alt="DownloadGram" width={180} height={48} className="h-auto w-44" />
                    <p className="mt-5 max-w-xs text-sm leading-6 text-gray-600 dark:text-zinc-400">
                        Save your favorite Instagram videos, reels, photos, stories, and audio online in high quality.
                    </p>
                </div>
                {linkGroups.map(({ title, icon: Icon, links }) => (
                    <div key={title}>
                        <h2 className="flex items-center gap-2 font-bold text-gray-800 dark:text-zinc-100">
                            <Icon className="text-red-400" aria-hidden="true" />
                            {title}
                        </h2>
                        <ul className="mt-4 space-y-3 text-sm text-gray-500 dark:text-zinc-400">
                            {links.map((link) => (
                                <li key={link}>
                                    <a href="#" className="transition-colors hover:text-gray-800 dark:hover:text-zinc-100">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-200 dark:border-zinc-800">
                <p className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-gray-400 dark:text-zinc-500 lg:px-0">
                    © 2026 DownloadGram. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
