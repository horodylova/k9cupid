import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import NewsletterSubscribeForm from "@/components/NewsletterSubscribeForm";

type LatestFooterPost = {
  id: string;
  title: string;
  excerpt: string;
  dateLabel: string;
};

type SanityFooterPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt?: string;
  _createdAt: string;
};

function truncateText(text: string, maxLen: number) {
  const normalized = (text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen - 1).trim()}…`;
}

async function getLatestFooterPosts(): Promise<LatestFooterPost[]> {
  const query = `*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    _createdAt
  }`;

  try {
    const posts = await client.fetch<SanityFooterPost[]>(
      query,
      {},
      { next: { revalidate: 3600 } }
    );

    return (posts || []).map((post) => {
      const dateSource = post.publishedAt || post._createdAt;
      const dateObj = new Date(dateSource);
      const dateLabel = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      return {
        id: post.slug,
        title: post.title,
        excerpt: truncateText(post.excerpt, 110),
        dateLabel,
      };
    });
  } catch {
    return [];
  }
}

export default async function Footer() {
  const latestPosts = await getLatestFooterPosts();
  return (
    <>
      <footer id="footer" className="mt-5">
        <div className="container py-5">
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
                    <Link href="/blog" className="nav-link">Blog</Link>
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
                    <Link href="/faqs" className="nav-link">FAQs</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/privacy-policy" className="nav-link">Privacy Policy</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/terms-of-service" className="nav-link">Terms of Service</Link>
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
                {latestPosts.length > 0 && (
                  <div className="mt-3">
                    <div className="secondary-font text-uppercase text-muted mb-2" style={{ letterSpacing: "0.06em" }}>
                      Latest posts
                    </div>
                    <ul className="list-unstyled m-0">
                      {latestPosts.map((post) => (
                        <li key={post.id} className="mb-3">
                          <div className="secondary-font text-muted" style={{ fontSize: "0.9rem" }}>
                            {post.dateLabel}
                          </div>
                          <Link href={`/blog/${post.id}`} className="nav-link p-0">
                            <strong>{post.title}</strong>
                          </Link>
                          <div className="blog-paragraph fs-6 mb-0">{post.excerpt}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <NewsletterSubscribeForm />
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
