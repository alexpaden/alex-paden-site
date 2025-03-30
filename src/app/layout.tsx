import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alex Paden - Hacking, Writing, Building",
  description: "Personal site of Alex Paden: projects, writing, and work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider>
          <div className="flex-1 flex">
            <div className="w-full h-full flex justify-center items-center">
              {children}
            </div>
            {/* Right side content */}
          </div>
          <footer>
            {/* Footer content including "Alex Paden" */}
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
