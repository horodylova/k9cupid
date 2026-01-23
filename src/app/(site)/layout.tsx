import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex flex-column min-vh-100">
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
    </div>
  );
}
