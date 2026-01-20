import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      <footer id="footer" className="my-5">
        <div className="container py-5 my-5">
          <div className="row">
            <div className="col-md-3">
              <div className="footer-menu footer-brand">
                <Link href="/" className="footer-brand-link text-decoration-none">
                  <Image
                    src="/Cupid and Dogs-Picsart-BackgroundRemover.png"
                    alt="k9cupid logo"
                    className="img-fluid footer-logo-image"
                    width={250}
                    height={250}
                    style={{ maxHeight: '120px', width: 'auto' }}
                  />
                  <h5 className="footer-site-title mb-0">k9cupid</h5>
                </Link>
                <div className="footer-brand-content">
                  <p className="blog-paragraph fs-6 mt-3 footer-brand-text">
                    Your ultimate guide to finding the perfect canine companion. We help you discover, understand, and connect with the dog breed that fits your lifestyle.
                  </p>
                  <div className="social-links">
                    <ul className="d-flex list-unstyled gap-3">
                      <li className="social">
                        <a href="#">
                          <iconify-icon className="social-icon" icon="ri:facebook-fill"></iconify-icon>
                        </a>
                      </li>
                      <li className="social">
                        <a href="#">
                          <iconify-icon className="social-icon" icon="ri:instagram-fill"></iconify-icon>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="footer-menu">
                <h3>Quick Links</h3>
                <ul className="menu-list list-unstyled">
                  <li className="menu-item">
                    <Link href="/" className="nav-link">Home</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/quiz" className="nav-link">Quiz</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/breeds" className="nav-link">Breeds</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/articles" className="nav-link">Articles</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/about" className="nav-link">About Us</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/contact" className="nav-link">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-3">
              <div className="footer-menu">
                <h3>Help Center</h3>
                <ul className="menu-list list-unstyled">
                  <li className="menu-item">
                    <a href="#" className="nav-link">FAQs</a>
                  </li>
                  <li className="menu-item">
                    <a href="#" className="nav-link">Privacy Policy</a>
                  </li>
                  <li className="menu-item">
                    <a href="#" className="nav-link">Terms of Service</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-3">
              <div className="footer-menu">
                <h3>Our Newsletter</h3>
                <p className="blog-paragraph fs-6">
                  Subscribe to our newsletter to get updates about our latest breed guides and adoption tips.
                </p>
                <div className="search-bar border rounded-pill border-dark-subtle px-2">
                  <form className="text-center d-flex align-items-center" action="" method="">
                    <input
                      type="text"
                      className="form-control border-0 bg-transparent"
                      placeholder="Enter your email here"
                    />
                    <iconify-icon className="send-icon" icon="tabler:location-filled"></iconify-icon>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div id="footer-bottom">
        <div className="container">
          <hr className="m-0" />
          <div className="row mt-3">
            <div className="col-md-6 copyright">
              <p className="secondary-font">© 2026 k9cupid. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
