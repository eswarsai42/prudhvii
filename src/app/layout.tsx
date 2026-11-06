import type { Metadata, Viewport } from "next";
import "./globals.css";
import { COUPLE, SITE, WEDDING_DATE_LABEL } from "@/lib/wedding";

const title = `${COUPLE.groom} & ${COUPLE.bride} · The Wedding Celebration`;
const description = `Join us to celebrate the wedding of ${COUPLE.groom} and ${COUPLE.bride} on ${WEDDING_DATE_LABEL}. Schedule, venues and blessings.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title, description,
  openGraph: { title, description, type: "website", images: [{ url: "/images/hero-garlands.jpg", width: 2400, height: 1600, alt: "The couple laughing together" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/images/hero-garlands.jpg"] },
  authors: [{ name: "VEERLABS", url: "https://veerlabs.vercel.app" }],
};
export const viewport: Viewport = { themeColor: "#15110F", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&family=Mrs+Saint+Delafield&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
