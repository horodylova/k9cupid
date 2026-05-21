import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Script from "next/script";
import PromoModal from "@/components/ui/PromoModal";
import CookieBanner from "@/components/ui/CookieBanner";
import PageViewTracker from "@/components/analytics/PageViewTracker";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex flex-column min-vh-100">
        <Header />
        <PromoModal />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <CookieBanner />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
    </div>
  );
}
