"use client";

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";
import { FaBars, FaXmark } from "react-icons/fa6";


export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [downloaderOpen, setDownloaderOpen] = useState(false);

    useEffect(() => {
        let scrollRequestId: number | null = null;
        const handleScroll = () => {
            // Cancel any pending animation frame before scheduling a new one
            if (scrollRequestId !== null) {
                window.cancelAnimationFrame(scrollRequestId);
            }

            scrollRequestId = window.requestAnimationFrame(() => {
                if (window.scrollY > 30) {
                    setIsScrolled(true);
                } else {
                    setIsScrolled(false);
                }
                scrollRequestId = null;
            });
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollRequestId !== null) {
                window.cancelAnimationFrame(scrollRequestId);
            }
        };
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 border-b transition-[background-color,backdrop-filter,box-shadow,padding,transform] duration-500 ease-out ${isScrolled
                ? "bg-gym-dark/85 backdrop-blur-md py-4 border-gym-crimson/30 shadow-lg shadow-black/20"
                : "bg-white m-6 rounded-2xl p-3 border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="#" className="flex items-center gap-2 group focus:outline-none">
                    <Image
                        src="/logo.png"
                        alt="Fitness Gym Logo"
                        width={100}
                        height={100}
                        className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-10">

                    {["Home", "About", "FAQ"].map((item) => {
                        let path;

                        if (item === "Home") {
                            path = "/"
                        } else if (item === "FAQ") {
                            path = "/#faq"
                        } else {
                            path = `/${item.toLowerCase()}`
                        };

                        return (
                            <Link
                                key={item}
                                href={path}
                                className="font-semibold font-sans text-sm text-gray-800"
                            >
                                {item}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden text-gray-900 hover:text-gym-coral transition-colors relative z-50"
                    aria-label="Toggle Menu"
                >
                    {mobileMenuOpen ? (
                        <FaXmark />
                    ) : (
                        <FaBars />
                    )}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white rounded-2xl mt-2 px-6 py-6 absolute top-full left-0 right-0 z-40">
                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-sm text-gray-400">Quick Access</p>
                        </div>
                        {["Home", "About", "FAQ"].map((item) => {
                            let path;

                            if (item === "Home") {
                                path = "/"
                            } else if (item === "FAQ") {
                                path = "/#faq"
                            } else {
                                path = `/${item.toLowerCase()}`
                            };
                            return (
                                <Link
                                    key={item}
                                    href={path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-800 transition-colors"
                                >
                                    {item}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}