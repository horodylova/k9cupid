import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/(site)/globals.css";

export default function NotFound() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main style={{ flex: 1 }}>
        <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
            <div className="container py-5 my-3">
                <div className="hero-content py-5 my-3">
                    <h2 className="display-1 mt-3 mb-0">Error <span className="text-primary"> 404 </span></h2>
                    <p>Sorry! Page that you are looking for is not available.</p>
                    <Link href="/" className="btn btn-outline-dark btn-lg text-uppercase fs-6 px-4 py-3 rounded-1 mt-4">
                        Go Back Home
                        <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1 ms-2" fill="currentColor">
                             <path d="M17.92 11.62a1 1 0 0 0-.21-.33l-5-5a1 1 0 0 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 .21-.33a1 1 0 0 0 0-.76Z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
      </main>
      <Footer />
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" strategy="afterInteractive" />
    </div>
  );
}
