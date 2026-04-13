import type { Metadata, Viewport } from "next";
import { Outfit, Noto_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Curexity",
  description: "Curexity frontend",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <div className="w-full bg-[#f1f4fb] min-h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}