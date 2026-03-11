import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">
              Terms <span className="text-primary">of Service</span>
            </h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <span className="breadcrumb-item active" aria-current="page">
                Terms of Service
              </span>
            </nav>
          </div>
        </div>
      </section>

      <section className="my-5 py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-10">
              <p className="secondary-font text-muted mb-4">Effective date: March 11, 2026</p>

              <p className="secondary-font mb-4">
                These Terms of Service govern your access to and use of the k9cupid website and related features,
                including the quiz, breed pages, and blog. By using the site, you agree to these Terms.
              </p>

              <h3 className="mb-3">1. Eligibility and use</h3>
              <p className="secondary-font">
                You may use the site only if you can legally form a binding contract in your jurisdiction. You agree to
                use the site in a lawful manner and not to misuse, disrupt, or attempt to gain unauthorized access to
                the site or its systems.
              </p>

              <h3 className="mt-5 mb-3">2. No professional advice</h3>
              <p className="secondary-font">
                k9cupid provides informational content and general guidance. Quiz results are suggestions and do not
                guarantee outcomes. The site does not provide veterinary, medical, or professional training advice. For
                concerns about health or behavior, consult a qualified professional.
              </p>

              <h3 className="mt-5 mb-3">3. User submissions</h3>
              <p className="secondary-font">
                If you submit information through forms, you represent that the information is accurate to the best of
                your knowledge. You are responsible for the content you provide in messages and for ensuring it does
                not violate any laws or third-party rights.
              </p>

              <h3 className="mt-5 mb-3">4. Intellectual property</h3>
              <p className="secondary-font">
                The site content, design, text, graphics, and other materials are owned by or licensed to k9cupid and
                are protected by intellectual property laws. You may view and use the site for personal, non-commercial
                purposes. You may not copy, reproduce, distribute, or create derivative works without permission,
                except as allowed by law.
              </p>

              <h3 className="mt-5 mb-3">5. Third-party services and links</h3>
              <p className="secondary-font">
                The site may rely on third-party services for content delivery, analytics, or form handling. We are not
                responsible for third-party sites, services, or their policies. Your use of third-party services may be
                subject to their separate terms.
              </p>

              <h3 className="mt-5 mb-3">6. Availability and changes</h3>
              <p className="secondary-font">
                We may modify, suspend, or discontinue the site or any feature at any time, with or without notice. We
                may also update these Terms from time to time. Continued use of the site after changes means you accept
                the updated Terms.
              </p>

              <h3 className="mt-5 mb-3">7. Disclaimer of warranties</h3>
              <p className="secondary-font">
                The site is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest extent
                permitted by law, we disclaim all warranties, express or implied, including fitness for a particular
                purpose, non-infringement, and accuracy.
              </p>

              <h3 className="mt-5 mb-3">8. Limitation of liability</h3>
              <p className="secondary-font">
                To the fullest extent permitted by law, k9cupid will not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of data, profits, or goodwill, arising from or
                related to your use of the site.
              </p>

              <h3 className="mt-5 mb-3">9. Governing law</h3>
              <p className="secondary-font">
                These Terms are governed by the laws applicable in the jurisdiction where k9cupid operates, without
                regard to conflict of laws principles.
              </p>

              <h3 className="mt-5 mb-3">10. Contact</h3>
              <p className="secondary-font mb-0">
                Questions about these Terms? Email{" "}
                <a href="mailto:support@k9cupid.fit" className="text-decoration-underline">
                  support@k9cupid.fit
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
