import Image from "next/image";
import { FaClapperboard, FaVideo, FaCirclePlay, FaImage } from "react-icons/fa6";

export default function Hero() {
    return (
        <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden">
            <div className="absolute inset-0 lg:inset-4 overflow-hidden lg:rounded-lg">
                <Image
                    src="/bg.png"
                    alt="Hero Image"
                    fill
                    priority
                    className="object-cover"
                />
            </div>
            <div className="relative z-10 flex flex-col gap-2 items-center justify-center">
                <div className="flex w-max bg-linear-to-r from-red-500 to-violet-400 lg:px-6 lg:py-3 px-3 py-1 rounded-2xl border border-gray-100/70 items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-100">
                        <FaVideo />
                        <p>Video</p>
                    </div>
                    <div className="h-4 lg:h-8 w-0.5 bg-gray-100/50"></div>
                    <div className="flex items-center gap-2 text-gray-100">
                        <FaClapperboard className="lg:text-lg text-sm" />
                        <p>Reels</p>
                    </div>
                    <div className="h-4 lg:h-8 w-0.5 bg-gray-100/50"></div>
                    <div className="flex items-center gap-2 text-gray-100">
                        <FaCirclePlay />
                        <p>Story</p>
                    </div>
                    <div className="h-4 lg:h-8 w-0.5 bg-gray-100/50"></div>
                    <div className="flex items-center gap-2 text-gray-100">
                        <FaImage />
                        <p>Photos</p>
                    </div>
                </div>
                <h1 className="text-3xl lg:text-7xl mt-2 font-tiny5 uppercase font-bold text-center">DownloadGram</h1>
                <p className="text-center text-sm px-2">Quick Save your favorite reels, videos, and photos online in high quality</p>

                <div className="w-full px-4">
                    <form className="relative mx-auto mt-4 w-full max-w-xl">
                        <input
                            type="text"
                            placeholder="Enter Instagram URL"
                            className="w-full rounded-full bg-white p-4 pr-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <div className="absolute bottom-10 z-10 w-full max-w-6xl text-sm px-4 text-center">
                <p>
                    Downloadgram is an online Instagram tool to download Instagram reels, videos and photos online. You can download photos, videos clip from Instagram easily in just one click and save to any device like smartphone (iOS, Android, iPhone, iPad), computer (Windows, Mac, Linux) and tablet through any web browser (chrome, firefox, safari, UC, CM, Dolphin, Opera and others.) You can download single photos, videos, reels, or even entire albums (carousel posts) from public Instagram accounts in the original uploaded quality without a watermark. Please note that private Instagram accounts are not supported due to Instagram&apos;s privacy policies.
                </p>
            </div>
        </div>
    )
}