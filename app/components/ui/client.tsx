"use client"

import { FaStar } from "react-icons/fa6";

export default function Client() {
    return (
        <div className="flex flex-col items-center py-2">
            <div className="flex flex-col items-center justify-center gap-4 bg-amber-200/20 border border-yellow-400 px-3 py-1 rounded-full">
                <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                </div>
                <span className="text-yellow-800 font-semibold">Rated 4.9 / 5 by 10K+ Happy Users</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Client Component</h1>
            <p className="mt-4 text-lg text-gray-600">This is a client-side component in Next.js.</p>
        </div>
    );
}