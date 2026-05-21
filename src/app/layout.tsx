import { ReactNode } from "react";
import type { Metadata } from "next";
import { Chilanka, Montserrat } from "next/font/google";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import { NavigationProvider } from "@/context/NavigationContext";

const chilanka = Chilanka({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-chilanka",
  display: "swap",
  preload: true,
  fallback: ["ui-rounded", "system-ui", "-apple-system", "Segoe UI", "Arial"],
  adjustFontFallback: true,
});

const montserrat = Montserrat({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://k9cupid.fit'),
  title: "k9cupid - Find Your Perfect Dog Match",
  description: "Discover the dog breed that fits your lifestyle with k9cupid.",
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: "k9cupid - Find Your Perfect Dog Match",
    description: "Discover the dog breed that fits your lifestyle with k9cupid.",
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'k9cupid Logo',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${chilanka.variable} ${montserrat.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
      </head>
      <body>
        <NavigationProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </NavigationProvider>
        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
