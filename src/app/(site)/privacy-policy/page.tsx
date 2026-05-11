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
              <p className="secondary-font text-muted mb-4">Effective date: May 11, 2026</p>

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

              <h3 className="mt-5 mb-3">Cookies and tracking technologies</h3>
              <p className="secondary-font">
                We use cookies, local storage, and similar technologies to run the site and improve your experience.
                Some are essential (for example, keeping your session, preferences, or quiz progress). Others may be
                used for analytics and marketing. Where required, we will ask for your consent before using non-essential
                cookies.
              </p>
              <p className="secondary-font mb-2">We use the following cookie categories:</p>
              <ul className="secondary-font">
                <li>Strictly Necessary: required to provide core functionality and security.</li>
                <li>Analytics: help us understand site usage and improve performance.</li>
                <li>Advertising/Marketing: used to measure ad performance and build audiences for advertising.</li>
              </ul>

              <h4 className="mt-4 mb-2">Analytics and advertising</h4>
              <p className="secondary-font">
                When enabled, we may use Google Analytics 4 (GA4) and the Meta Pixel to understand how people use the
                site, measure performance, and support marketing and retargeting. These tools may set cookies or use
                similar technologies. Where required, we will not activate these technologies unless you accept
                non-essential cookies.
              </p>
              <h4 className="mt-4 mb-2">Tools we use (analytics and advertising)</h4>
              <p className="secondary-font">
                We may use third-party tools that set cookies or collect information from your device/browser (where
                enabled).
              </p>
              <p className="secondary-font">
                Google Analytics 4 (GA4) (Provider: Google LLC) is used for analytics and measurement (site usage,
                performance, and conversions). It may collect information such as page views, events (for example,
                button clicks), approximate location (derived from IP), device/browser information, and identifiers
                (which may include cookies and other device identifiers). GA4 data retention is configured in our
                Google Analytics settings.
              </p>
              <p className="secondary-font">
                Meta Pixel (Facebook Pixel) (Provider: Meta Platforms, Inc.) may be used for advertising/marketing
                measurement (conversion tracking), analytics related to ad performance, and audience building (where
                enabled). It may collect information such as page views and events, device/browser information, and
                identifiers (which may include cookies and other device identifiers). Meta may use this information in
                accordance with its own policies.
              </p>
              <p className="secondary-font">
                These providers may process information as independent controllers for their own purposes. We encourage
                you to review their privacy policies for details.
              </p>
              <p className="secondary-font">
                You can manage your cookie preferences using our cookie banner and the footer link{" "}
                <Link href="#privacy-choices" className="text-decoration-underline">
                  Do Not Sell or Share My Personal Information
                </Link>
                .
              </p>

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
              <h4 className="mt-4 mb-2">Service providers</h4>
              <ul className="secondary-font">
                <li>Formspree (contact and FAQ forms).</li>
                <li>Brevo (newsletter email delivery).</li>
                <li>Sanity (content management for blog posts and media).</li>
                <li>Vercel (hosting and delivery infrastructure).</li>
              </ul>
              <p className="secondary-font">
                RescueGroups provides adoption listings and related information. We do not send your email address or
                phone number to RescueGroups.
              </p>

              <h3 className="mt-5 mb-3">Data retention</h3>
              <p className="secondary-font">
                We retain information only as long as necessary for the purposes described in this policy. Quiz data
                stored in your browser can typically be cleared by clearing your browser storage. Messages sent to us
                may be retained to provide support, maintain records, and comply with legal obligations.
              </p>
              <p className="secondary-font">
                Some providers allow retention controls in their dashboards. Where available, we configure retention
                settings to align with operational needs and legal requirements.
              </p>

              <h3 className="mt-5 mb-3">Your choices</h3>
              <ul className="secondary-font">
                <li>You can choose what information to include when contacting us.</li>
                <li>You can clear cookies and site data in your browser settings.</li>
                <li>You can request access, correction, or deletion of your personal information by contacting us.</li>
              </ul>
              <p className="secondary-font">
                Our on-site controls (where shown) allow you to accept or reject non-essential cookies. Your choices
                typically apply to the browser/device where you make them.
              </p>

              <h3 className="mt-5 mb-3" id="privacy-choices" style={{ scrollMarginTop: 120 }}>
                Do Not Sell or Share My Personal Information
              </h3>
              <p className="secondary-font">
                This section explains how you can opt out of certain non-essential tracking and, where applicable,
                opt out of “sharing” for cross-context behavioral advertising. Our cookie banner and footer controls
                (where available) are intended to help you manage these choices for your browser/device.
              </p>
              <h4 className="mt-4 mb-2">Your privacy choices (US)</h4>
              <p className="secondary-font">
                Depending on where you live, you may have the right to opt out of certain uses of your information,
                including targeted advertising. If we use marketing and retargeting technologies, some laws treat this
                as “sharing” for cross-context behavioral advertising. You can opt out by rejecting non-essential
                cookies in our cookie banner (where available) and by enabling Global Privacy Control (GPC) in your
                browser. You may also contact us to request help with your privacy choices.
              </p>
              <h4 className="mt-4 mb-2">California privacy rights (CCPA/CPRA)</h4>
              <p className="secondary-font">
                If you are a California resident, you may have rights under the California Consumer Privacy Act (as
                amended by the CPRA), subject to exceptions, including the right to know, delete, correct, and opt out
                of sale/sharing of personal information, where applicable. We will not discriminate against you for
                exercising your rights.
              </p>
              <p className="secondary-font mb-2">
                Depending on how you use the site, we may collect the following categories of personal information:
              </p>
              <ul className="secondary-font">
                <li>Identifiers: email address, online identifiers, IP address.</li>
                <li>Internet or network activity: pages viewed, interactions, device/browser details.</li>
                <li>Inferences/preferences: quiz responses and preferences, saved items (for example, saved breeds or dogs).</li>
                <li>Approximate geolocation: inferred from IP.</li>
              </ul>
              <p className="secondary-font">
                Some advertising technologies may be considered a sale or sharing of personal information under
                California law, even if no money changes hands, when used for cross-context behavioral advertising.
              </p>
              <p className="secondary-font">
                How to opt out (Do Not Sell or Share): you may opt out by choosing “Reject” in our cookie banner (where
                shown) and by using our footer controls (where available) to manage your preferences for that
                browser/device.
              </p>
              <p className="secondary-font">
                If we offer a “Do Not Sell or Share My Personal Information” control, it is intended as an opt-out
                mechanism for non-essential cookies and, where applicable, “sharing” for cross-context behavioral
                advertising.
              </p>


              <h4 className="mt-4 mb-2">Global Privacy Control (GPC)</h4>
              <p className="secondary-font">
                If your browser sends a Global Privacy Control (GPC) signal, we will treat it as a request to opt out
                of non-essential cookies and, where applicable, opt out of “sharing” for targeted advertising.
              </p>

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
