import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Providers from "@/components/layout/Providers";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import AmbientBg from "@/components/layout/AmbientBg";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Incident Copilot",
  description: "Intelligent incident management for small software teams",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased overflow-hidden h-screen">
        <Providers>
          <AmbientBg />
          <div className="app-shell">
            <Sidebar />
            <div className="main-area">
              <Topbar />
              <main className="content-area">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
