'use client'
import Link from "next/link";
import { useState } from "react";
import { submitForm } from "@/utils/submitForm";
import Image from "next/image";
import NewsletterSubscribeForm from "@/components/NewsletterSubscribeForm";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const alertImage = "/Dog%20in%20car-Picsart-BackgroundRemover.png";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      setStatus({ type: 'error', message: 'Form endpoint is not configured.' });
      setSubmitting(false);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await submitForm(endpoint, formData);
    if (res.ok) {
      setStatus({ type: 'success', message: 'Your message has been sent successfully!' });
      form.reset();
    } else {
      setStatus({ type: 'error', message: res.error || 'There was an error sending your message.' });
    }

    setSubmitting(false);
  };
  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">Contact</h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">Home</Link>
              <span className="breadcrumb-item active" aria-current="page">Contact</span>
            </nav>
          </div>
        </div>
      </section>

      <section className="contact-us">
        <div className="container py-5 my-5">
          <div className="row align-items-stretch">
            <div className="contact-info col-lg-6 pb-3 d-flex flex-column">
              <h2 className="text-dark">Contact Information</h2>
              <p>Have a question about your quiz results or choosing the right breed? Send us a message and we will help you compare options and set expectations.</p>
              <div className="page-content mt-5">
                <div className="content-box text-dark pe-4 mb-5">
                  <h4 className="card-title">Support</h4>
                  <div className="pt-3">
                    <p className="secondary-font mb-3">
                      Email{" "}
                      <a href="mailto:support@k9cupid.fit" className="text-decoration-underline">
                        support@k9cupid.fit
                      </a>{" "}
                      or use the form. If you took the quiz, include your top matches, plus a few details about your home, schedule, and activity level.
                    </p>
                    <p className="secondary-font mb-0">
                      Looking for quick answers? Check{" "}
                      <Link href="/faqs" className="text-decoration-underline">
                        FAQs
                      </Link>{" "}
                      or read our{" "}
                      <Link href="/privacy-policy" className="text-decoration-underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden mt-auto" style={{ background: "#F9F3EC" }}>
                <div className="card-body p-3 p-lg-3">
                  <div className="text-uppercase text-muted fw-semibold mb-2">Newsletter</div>
                  <h3 className="h5 fw-normal mb-2">Get the best dog guides, weekly</h3>
                  <NewsletterSubscribeForm
                    source="contact_left"
                    variant="icon"
                    placeholder="Email address"
                    successBehavior="inline"
                  />
                </div>
              </div>
            </div>
            <div className="inquiry-item col-lg-6 d-flex">
              <div className="rounded-5 h-100 w-100 d-flex flex-column">
                <h2 className="text-dark">Get in Touch</h2>
                <p>Use the form below to get in touch with us.</p>
                <form id="form" className="form-group flex-wrap" onSubmit={handleSubmit} noValidate>
                  <div className="form-input col-lg-12 d-flex mb-3">
                    <input type="text" name="name" placeholder="Write Your Name Here" className="form-control ps-3 me-3" required />
                    <input type="email" name="email" placeholder="Write Your Email Here" className="form-control ps-3" required />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <input type="tel" name="phone" placeholder="Phone Number" className="form-control ps-3" />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <input type="text" name="subject" placeholder="Write Your Subject Here" className="form-control ps-3" />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <textarea 
                      name="message"
                      placeholder="Write Your Message Here" 
                      className="form-control ps-3"
                      style={{ height: "150px" }}
                      required
                    ></textarea>
                  </div>

                  {status && (
                    <div className={`custom-alert ${status.type === 'success' ? 'custom-alert--success' : 'custom-alert--error'}`}>
                      <div className="custom-alert__media">
                        <Image
                          src={alertImage}
                          alt="K9Cupid"
                          className="custom-alert__img"
                          width={56}
                          height={56}
                          priority
                        />
                      </div>
                      <div className="custom-alert__content">
                        <h5 className="custom-alert__title">
                          {status.type === 'success' ? 'Message sent!' : 'Something went wrong'}
                        </h5>
                        <p className="custom-alert__text">{status.message}</p>
                      </div>
                    </div>
                  )}
                  <div className="d-grid">
                    <button className="btn btn-dark btn-lg rounded-1" type="submit" disabled={submitting}>
                      {submitting ? 'Sending...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
