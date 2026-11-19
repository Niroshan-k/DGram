"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaXmark, FaMoon, FaSun } from "react-icons/fa6";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkmode, setDarkmode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setDarkmode(isDark);
  }, []);

  const toggleDarkmode = () => {
    const next = !isDarkmode;
    setDarkmode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("theme", "light");
      } catch {}
    }
  };

  useEffect(() => {
    let scrollRequestId: number | null = null;
    const handleScroll = () => {
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
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-[background-color,backdrop-filter,box-shadow,padding,transform] duration-500 ease-out ${
        isScrolled
          ? "text-zinc-900 dark:text-zinc-100 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md py-4 border-b border-gray-200/60 dark:border-zinc-800 shadow-lg shadow-black/5 dark:shadow-black/20"
          : "text-white m-2 rounded-2xl p-3 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus:outline-none"
        >
          <Image
            src="/logo.png"
            alt="DownloadGram Logo"
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
              path = "/";
            } else if (item === "FAQ") {
              path = "/#faq";
            } else {
              path = `/${item.toLowerCase()}`;
            }

            return (
              <Link
                key={item}
                href={path}
                className="font-semibold font-sans text-sm hover:opacity-80 transition-opacity"
              >
                {item}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={toggleDarkmode}
            aria-label={isDarkmode ? "Switch to light mode" : "Switch to dark mode"}
            title={isDarkmode ? "Switch to light mode" : "Switch to dark mode"}
            className="hover:bg-white/20 dark:hover:bg-white/10 p-2 rounded-lg cursor-pointer transition-colors"
          >
            {mounted ? (
              isDarkmode ? (
                <FaSun className="text-yellow-400 text-base" />
              ) : (
                <FaMoon className="text-base" />
              )
            ) : (
              <span className="inline-block w-4 h-4" />
            )}
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden transition-colors relative z-50 p-2 rounded-lg ${
            isScrolled ? "text-zinc-900 dark:text-zinc-100" : "text-gray-100"
          }`}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <FaXmark className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl mt-2 px-6 py-6 absolute top-full left-4 right-4 z-40 shadow-2xl">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Quick Access</p>
              <button
                type="button"
                onClick={toggleDarkmode}
                className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkmode ? (
                  <>
                    <FaSun className="text-yellow-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <FaMoon className="text-zinc-600 dark:text-zinc-300" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
            {["Home", "About", "FAQ"].map((item) => {
              let path;

              if (item === "Home") {
                path = "/";
              } else if (item === "FAQ") {
                path = "/#faq";
              } else {
                path = `/${item.toLowerCase()}`;
              }
              return (
                <Link
                  key={item}
                  href={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-800 dark:text-zinc-200 font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
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
