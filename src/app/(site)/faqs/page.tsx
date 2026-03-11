"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { submitForm } from "@/utils/submitForm";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    id: "what-is-k9cupid",
    question: "What is k9cupid?",
    answer:
      "k9cupid helps you discover dog breeds that fit your lifestyle. Take the quiz to get personalized matches, explore breed pages to learn what to expect, and use the blog for practical tips and guidance.",
  },
  {
    id: "how-quiz-works",
    question: "How does the quiz work?",
    answer:
      "The quiz asks about your home, schedule, activity level, preferences, and sensitivity to things like shedding. We then score breeds against your answers and show matches that align best with your lifestyle and expectations.",
  },
  {
    id: "match-accuracy",
    question: "How accurate are the results?",
    answer:
      "Results are guidance, not a guarantee. Every dog is an individual, and environment and training matter. Use the matches as a shortlist and always meet dogs in person when possible. For medical or behavioral concerns, consult a qualified professional.",
  },
  {
    id: "data-source",
    question: "Where does your breed data come from?",
    answer:
      "We combine structured breed trait data with our matching logic to help you compare breeds consistently. We continuously refine how we interpret traits like energy, trainability, and shedding based on real-world feedback and common expectations.",
  },
  {
    id: "save-results",
    question: "Can I save my quiz results or resume later?",
    answer:
      "Yes. Your progress is saved so you can come back without starting from scratch. If your results look off, try adjusting a couple of answers and compare the updated shortlist.",
  },
  {
    id: "not-seeing-breed",
    question: "Why is my favorite breed not showing up in results?",
    answer:
      "Some breeds may not match your current answers strongly enough, or the breed may not be available in our database yet. Try widening preferences (for example, being more flexible about energy or shedding) and check the Breeds page to explore manually.",
  },
  {
    id: "allergies-shedding",
    question: "I have allergies. Can you guarantee a hypoallergenic dog?",
    answer:
      "No breed is 100% hypoallergenic. Shedding and dander vary by individual dog and home environment. If allergies are a concern, prioritize low-shedding breeds in the quiz and spend time with the dog before committing. Allergy testing and a doctor’s advice can also help.",
  },
  {
    id: "shedding-vs-coat",
    question: "Is shedding the same as coat length?",
    answer:
      "Not always. Some long-coated dogs shed less than you expect, while some short-coated dogs can shed a lot. In our quiz, “shedding” focuses on how much hair ends up on clothes and furniture, not how long the coat looks.",
  },
  {
    id: "apartment-friendly",
    question: "Can an active breed be apartment-friendly?",
    answer:
      "Yes. Apartment-friendly is mostly about meeting exercise needs and managing barking. Many medium and large breeds do well in apartments with consistent daily activity, training, and mental enrichment.",
  },
  {
    id: "first-time-owner",
    question: "I’m a first-time dog owner. What should I prioritize?",
    answer:
      "Start with a manageable energy level, good trainability, and a temperament that fits your household. Be realistic about daily time for walks and training. If you want a low-maintenance dog, prioritize lower grooming and shedding tolerance that matches your comfort level.",
  },
  {
    id: "kids-pets",
    question: "I have kids or other pets. How should I use the quiz?",
    answer:
      "Answer those questions first and be honest about your situation. If you have toddlers or small pets, prioritize gentler temperaments and higher compatibility. The quiz uses these answers to avoid recommending breeds that are typically a poor fit.",
  },
  {
    id: "adoption-vs-breeder",
    question: "Do you help with adoption or finding breeders?",
    answer:
      "k9cupid helps you choose a type of dog that fits your life. Once you have a shortlist, we recommend meeting dogs through reputable rescues and shelters, or working with ethical, health-focused breeders. Always ask about health tests and temperament.",
  },
  {
    id: "why-different-results",
    question: "Why do I get different results when I change one answer?",
    answer:
      "Some answers carry a lot of weight, such as activity level, time alone, and strong preferences like “minimal shedding”. Changing one of these can shift the rankings significantly. Use this to test scenarios and find your comfort zone.",
  },
  {
    id: "privacy",
    question: "Do you store my personal data?",
    answer:
      "We aim to collect as little personal data as possible. Your quiz progress may be stored in your browser to help you resume later. If you contact us, we only use your message to reply and provide support.",
  },
];

export default function FaqsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const alertImage = "/Dog%20in%20car-Picsart-BackgroundRemover.png";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      setStatus({ type: "error", message: "Form endpoint is not configured." });
      setSubmitting(false);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await submitForm(endpoint, formData);
    if (res.ok) {
      setStatus({ type: "success", message: "Your message has been sent successfully!" });
      form.reset();
    } else {
      setStatus({ type: "error", message: res.error || "There was an error sending your message." });
    }

    setSubmitting(false);
  };

  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">
              FAQ<span className="text-primary">s</span>
            </h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <span className="breadcrumb-item active" aria-current="page">
                FAQs
              </span>
            </nav>
          </div>
        </div>
      </section>

      <section className="faqs-wrap">
        <div className="container py-5 my-5">
          <div className="row my-4">
            <main className="col-md-8 pe-5">
              <h2 className="mb-3">Frequently asked questions</h2>
              <p className="secondary-font">
                Find quick answers about the quiz, matching logic, breed info, and how to use results responsibly. If
                you still need help, message us and we will get back to you as soon as possible.
              </p>

              <div className="page-content my-5">
                <div className="accordion mb-5" id="faqAccordion">
                  {faqs.map((item, index) => {
                    const headingId = `heading-${item.id}`;
                    const collapseId = `collapse-${item.id}`;
                    const isFirst = index === 0;

                    return (
                      <div className="accordion-item" key={item.id}>
                        <h2 className="accordion-header" id={headingId}>
                          <button
                            className={`accordion-button${isFirst ? "" : " collapsed"}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#${collapseId}`}
                            aria-expanded={isFirst ? "true" : "false"}
                            aria-controls={collapseId}
                          >
                            <h5 className="m-0">{item.question}</h5>
                          </button>
                        </h2>
                        <div
                          id={collapseId}
                          className={`accordion-collapse collapse${isFirst ? " show" : ""}`}
                          aria-labelledby={headingId}
                          data-bs-parent="#faqAccordion"
                        >
                          <div className="accordion-body secondary-font">{item.answer}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </main>

            <div className="inquiry-item col-md-4">
              <h3 className="section-title mb-3">Ask us anything</h3>
              <p className="secondary-font">
                Email <a href="mailto:support@k9cupid.fit" className="text-decoration-underline">support@k9cupid.fit</a> or use the form below. Share a few details (home type, activity level, time alone, shedding tolerance, kids/pets). If you took the quiz, include your top matches so we can help you compare them.
              </p>

              <form className="form-group flex-wrap" onSubmit={handleSubmit} noValidate>
                {status?.type === "success" ? (
                  <>
                    <div className="custom-alert custom-alert--success">
                      <div className="custom-alert__media">
                        <Image
                          src={alertImage}
                          alt="k9cupid"
                          className="custom-alert__img"
                          width={56}
                          height={56}
                          priority
                        />
                      </div>
                      <div className="custom-alert__content">
                        <h5 className="custom-alert__title">Message sent!</h5>
                        <p className="custom-alert__text">
                          Thanks! We received your message and will reply by email.
                        </p>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <Link href="/quiz" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 w-100">
                        Take the Quiz
                      </Link>
                      <Link href="/breeds" className="btn btn-dark btn-lg text-uppercase fs-6 rounded-1 w-100">
                        Explore Breeds
                      </Link>
                    </div>

                    <div className="d-grid mt-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg rounded-1"
                        onClick={() => setStatus(null)}
                      >
                        Send another message
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-input col-lg-12 d-flex mb-3">
                      <input
                        type="text"
                        name="name"
                        placeholder="Write Your Name Here"
                        className="form-control ps-3 me-3"
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Write Your Email Here"
                        className="form-control ps-3"
                        required
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <input type="tel" name="phone" placeholder="Phone Number" className="form-control ps-3" />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <input
                        type="text"
                        name="subject"
                        placeholder="Write Your Subject Here"
                        className="form-control ps-3"
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <textarea
                        name="message"
                        placeholder="Write Your Message Here"
                        className="form-control ps-3"
                        style={{ height: "150px" }}
                        required
                      />
                    </div>

                    {status?.type === "error" && (
                      <div className="custom-alert custom-alert--error">
                        <div className="custom-alert__media">
                          <Image
                            src={alertImage}
                            alt="k9cupid"
                            className="custom-alert__img"
                            width={56}
                            height={56}
                            priority
                          />
                        </div>
                        <div className="custom-alert__content">
                          <h5 className="custom-alert__title">Something went wrong</h5>
                          <p className="custom-alert__text">{status.message}</p>
                        </div>
                      </div>
                    )}

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-arrow btn-primary btn-lg btn-pill btn-dark fs-6"
                        disabled={submitting}
                      >
                        {submitting ? "Sending..." : "Submit"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
