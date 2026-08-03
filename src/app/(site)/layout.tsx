import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PromoModal from "@/components/ui/PromoModal";
import BootstrapClient from "@/components/ui/BootstrapClient";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main style={{ flex: 1 }}>
        {children}
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
      </main>
      <PromoModal />
      <BootstrapClient />
      <Footer />
    </div>
  );
}
