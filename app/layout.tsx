import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";

const instrument_Sans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DownloadGram",
  description: "Instagram content downloader.",
};

const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrument_Sans.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
