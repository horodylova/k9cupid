import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromoModal from "@/components/PromoModal";
import BootstrapClient from "@/components/BootstrapClient";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex flex-column min-vh-100">
        <Header />
        <PromoModal />
        <BootstrapClient />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
    </div>
  );
}
