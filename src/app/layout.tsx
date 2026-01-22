import { ReactNode } from "react";
import type { Metadata } from "next";
import { Chilanka, Montserrat } from "next/font/google";
import Script from "next/script";

const chilanka = Chilanka({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-chilanka",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "k9cupid - Find Your Perfect Dog Match",
  description: "Discover the dog breed that fits your lifestyle with k9cupid.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${chilanka.variable} ${montserrat.variable}`}>
      <body>
        {children}
        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
