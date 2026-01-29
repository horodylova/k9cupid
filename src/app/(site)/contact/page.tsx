// File: ContactPage component
'use client'
import Link from "next/link";
import { useState } from "react";
import { submitForm } from "@/utils/submitForm";
import Image from "next/image";

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
          <div className="row">
            <div className="contact-info col-lg-6 pb-3">
              <h2 className="text-dark">Contact Information</h2>
              <p>We are here to help you and your furry friend find the best products and matches!</p>
              <div className="page-content d-flex flex-wrap mt-5">
                <div className="col-lg-6 col-sm-12">
                  <div className="content-box text-dark pe-4 mb-5">
                    <h4 className="card-title">Office</h4>
                    <div className="contact-address pt-3">
                      <p>123 Love Paw Ave, San Francisco, CA 94103</p>
                    </div>
                    <div className="contact-number">
                      <p>
                        <a href="tel:+18005550199">+1 (800) 555-0199</a>
                      </p>
                      <p>
                        <a href="tel:+18005550200">+1 (800) 555-0200</a>
                      </p>
                    </div>
                    <div className="email-address">
                      <p>
                        <a href="mailto:support@k9cupid.com">support@k9cupid.fit</a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="content-box">
                    <h4 className="card-title">Management</h4>
                    <div className="contact-address pt-3">
                      <p>456 Barker St, New York, NY 10001</p>
                    </div>
                    <div className="contact-number">
                      <p>
                        <a href="tel:+12125550188">+1 (212) 555-0188</a>
                      </p>
                      <p>
                        <a href="tel:+12125550199">+1 (212) 555-0199</a>
                      </p>
                    </div>
                    <div className="email-address">
                      <p>
                        <a href="mailto:admin@k9cupid.com">admin@k9cupid.fit</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="inquiry-item col-lg-6">
              <div className="rounded-5">
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
