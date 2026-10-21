"use client"

import { useEffect, useState } from "react";
import { FaStar, FaCircleCheck, FaPenToSquare } from "react-icons/fa6";

const response = [
    {
        starCount: 5,
        date: "2023-05-01",
        review: "This app is amazing! I was able to complete my tasks in half the time it used to take me. Highly recommend it!",
        reviewer: "John Doe",
        jobTitle: "Software Engineer",
    },
    {
        starCount: 3,
        date: "2023-05-01",
        review: "This app is amazing! I was able to complete my tasks in half the time it used to take me. Highly recommend it!",
        reviewer: "John Doe",
        jobTitle: "Software Engineer",
    },
    {
        starCount: 4,
        date: "2023-05-01",
        review: "This app is amazing! I was able to complete my tasks in half the time it used to take me. Highly recommend it! This app is amazing! I was able to complete my tasks in half the time it used to take me. Highly recommend it!",
        reviewer: "John Doe",
        jobTitle: "Software Engineer",
    }
]

export default function Client() {

    const [formOpen, setFormOpen] = useState(false);

    useEffect(() => {
        if (formOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [formOpen]);
    
    return (
        <div className="flex flex-col items-center py-2 lg:py-24 lg:px-32 gap-3 text-center">
            <div className="items-center justify-center gap-4 bg-amber-200/20 border border-yellow-400 px-3 py-1 rounded-full">
                <span className="text-yellow-800 font-semibold">Rated 4.9 / 5 by 10K+ Happy Users</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">What Our Users Say</h1>
            <p className="mt-4 text-lg text-gray-600">Don&apos;t just take our word for it - hear from our satisfied customers!</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 lg:p-12">
                {response.map((item, index) => (
                    <div key={index} className="bg-blue-100/20 shadow-lg hover:shadow-2xl rounded-xl border border-gray-100 hover:border-gray-200 p-6 m-4 text-left flex flex-col justify-between transition duration-300 ease-in-out hover:scale-102">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center justify-center gap-2 text-yellow-400">
                                    {Array.from({ length: item.starCount }).map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                                <span className="ml-2 text-gray-400 text-sm">{item.date}</span>
                            </div>
                            <p className="text-gray-800 mb-4">&quot; {item.review} &quot;</p>
                        </div>
                        <div>
                            <p className="text-gray-600 flex items-center gap-2 font-semibold">{item.reviewer} <FaCircleCheck className="text-blue-500 ml-1" /></p>
                            <p className="text-gray-400">{item.jobTitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center gap-2 mt-6">
                <button onClick={() => setFormOpen(true)} className="bg-linear-to-r from-purple-800 to-blue-700 text-white font-semibold py-4 px-6 rounded-full flex items-center">
                    <FaPenToSquare className="mr-2" />
                    Share Your Feedback
                </button>
                <p className="text-sm text-gray-500">Help us improve Downloadgram.</p>
            </div>

            {formOpen && (
                <div className="fixed inset-0 px-3 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md relative text-left">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-2xl hover:bg-gray-500/20 rounded-lg px-2 hover:text-gray-700"
                            onClick={() => setFormOpen(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Share Your Feedback</h2>

                        <label className="text-gray-400 mb-2 block text-sm">Rate Your Experience</label>
                        <form className="flex flex-col gap-4 text-gray-700">
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-yellow-500">
                                <span><FaStar /></span>
                                <span className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            />
                            <input
                                type="text"
                                placeholder="Your Job Title"
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            />
                            <textarea
                                placeholder="Your Feedback"
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            ></textarea>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Submit Feedback
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}