import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">
              Privacy <span className="text-primary">Policy</span>
            </h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <span className="breadcrumb-item active" aria-current="page">
                Privacy Policy
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
                This Privacy Policy explains how k9cupid collects, uses, and shares information when you use our
                website, take the quiz, explore breed pages, or contact us. By using the site, you agree to the
                practices described in this policy.
              </p>

              <h3 className="mb-3">Information we collect</h3>
              <p className="secondary-font">
                We collect information in three main ways: information you provide, information collected
                automatically when you use the site, and information from integrated services.
              </p>

              <h4 className="mt-4 mb-2">Information you provide</h4>
              <ul className="secondary-font">
                <li>Contact details you submit through forms (such as your name and email address).</li>
                <li>Message content you send to support.</li>
                <li>Optional details you choose to share about your household and preferences.</li>
              </ul>

              <h4 className="mt-4 mb-2">Quiz and preference information</h4>
              <p className="secondary-font">
                Your quiz answers reflect lifestyle preferences (for example, activity level or shedding tolerance).
                We use this information to calculate breed matches. Quiz data may be stored in your browser to help
                you continue the quiz or revisit results.
              </p>

              <h4 className="mt-4 mb-2">Information collected automatically</h4>
              <ul className="secondary-font">
                <li>Basic usage data (pages visited, approximate device and browser information).</li>
                <li>Log data (such as IP address, timestamps, and referring pages) for security and reliability.</li>
                <li>Cookies and similar technologies used for essential site functionality.</li>
              </ul>

              <h3 className="mt-5 mb-3">How we use information</h3>
              <ul className="secondary-font">
                <li>Provide and improve the quiz, breed content, and site experience.</li>
                <li>Respond to your requests and provide support.</li>
                <li>Maintain security, prevent abuse, and troubleshoot issues.</li>
                <li>Analyze site usage to understand what content is most helpful.</li>
              </ul>

              <h3 className="mt-5 mb-3">How we share information</h3>
              <p className="secondary-font">
                We do not sell your personal information. We may share information with service providers that help us
                run the site and respond to messages. For example, when you submit a contact form, your submission may
                be processed and delivered via a form handling provider. We may also use a content platform to power
                blog posts and media.
              </p>

              <h3 className="mt-5 mb-3">Data retention</h3>
              <p className="secondary-font">
                We retain information only as long as necessary for the purposes described in this policy. Quiz data
                stored in your browser can typically be cleared by clearing your browser storage. Messages sent to us
                may be retained to provide support, maintain records, and comply with legal obligations.
              </p>

              <h3 className="mt-5 mb-3">Your choices</h3>
              <ul className="secondary-font">
                <li>You can choose what information to include when contacting us.</li>
                <li>You can clear cookies and site data in your browser settings.</li>
                <li>You can request access, correction, or deletion of your personal information by contacting us.</li>
              </ul>

              <h3 className="mt-5 mb-3">Children&apos;s privacy</h3>
              <p className="secondary-font">
                The site is not intended for children under 13. If you believe a child has provided personal
                information, please contact us so we can delete it.
              </p>

              <h3 className="mt-5 mb-3">International users</h3>
              <p className="secondary-font">
                If you access the site from outside your country, your information may be processed in locations where
                our service providers operate. By using the site, you understand that such processing may occur.
              </p>

              <h3 className="mt-5 mb-3">Changes to this policy</h3>
              <p className="secondary-font">
                We may update this Privacy Policy from time to time. When we do, we will update the effective date at
                the top of this page.
              </p>

              <h3 className="mt-5 mb-3">Contact us</h3>
              <p className="secondary-font mb-0">
                If you have questions about this Privacy Policy, email{" "}
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
