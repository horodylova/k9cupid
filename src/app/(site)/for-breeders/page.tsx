'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { submitForm } from '@/utils/submitForm';
import styles from './forBreeders.module.css';

type FormStatus = { type: 'success' | 'error'; message: string } | null;

const stats = [
  { icon: 'mdi:tag-outline', value: 'From $29', label: 'Per litter, no commission' },
  { icon: 'mdi:shield-check', value: 'Verified Breeders', label: 'ID & health checks' },
  { icon: 'mdi:paw', value: 'Free for Shelters', label: 'Always, forever' },
];

const benefits = [
  {
    title: 'Reach a Targeted Audience',
    text: 'Get your litters in front of serious, pre-qualified buyers.',
  },
  {
    title: 'Showcase Your Program',
    text: 'Share photos, pedigrees, health info, and more.',
  },
  {
    title: 'Easy, Automated Listing',
    text: 'Create and manage listings in minutes. No back-and-forth.',
  },
];

const trustBadges = [
  { icon: 'mdi:refresh', title: 'Cancel Anytime', text: 'No long-term commitments.' },
  { icon: 'mdi:lock-check', title: 'Secure Process', text: 'Your details stay private.' },
  { icon: 'mdi:headset', title: 'Real Support', text: 'A person, not a bot.' },
];

const verifiedPoints = [
  { icon: 'mdi:card-account-details-outline', title: 'ID Verification', text: 'Confirm your identity.' },
  { icon: 'mdi:heart-pulse', title: 'Health Testing', text: 'Share OFA, PennHIP, and others.' },
  { icon: 'mdi:certificate-outline', title: 'AKC Registration', text: 'Optional AKC verification.' },
  { icon: 'mdi:license', title: 'USDA Licensed', text: 'For licensed breeders.' },
];

const tools = [
  { icon: 'mdi:image-multiple-outline', title: 'Puppy Gallery', text: 'Show off your puppies with beautiful photos.' },
  { icon: 'mdi:clipboard-pulse-outline', title: 'Health Records', text: 'Share vaccines, deworming, and more.' },
  { icon: 'mdi:family-tree', title: 'Parents & Pedigrees', text: 'Display lineage and registrations.' },
  { icon: 'mdi:dna', title: 'DNA Testing', text: 'Upload results and build trust.' },
  { icon: 'mdi:hand-coin-outline', title: 'Deposits', text: 'Secure deposits made easy.' },
  { icon: 'mdi:message-text-outline', title: 'Messages', text: 'Communicate with approved families.' },
];

const steps = [
  { icon: 'mdi:account-edit-outline', title: 'Create Account', text: 'Sign up as a breeder and choose a listing plan.' },
  { icon: 'mdi:camera-outline', title: 'Add Your Litter', text: 'Upload photos, add details, health info, and availability.' },
  { icon: 'mdi:earth', title: 'Get Discovered', text: 'Your listing goes live and is seen by hundreds of dog lovers.' },
  { icon: 'mdi:heart-outline', title: 'Find the Right Homes', text: 'Connect with approved families ready to welcome a puppy.' },
];

const plans = [
  {
    name: 'Single Litter',
    price: '$29',
    unit: '/ litter',
    tagline: 'Perfect for one-time listings.',
    highlight: 'Up to 12 puppies',
    features: ['60-day listing', 'Photo gallery & health info', 'Basic support'],
    featured: false,
  },
  {
    name: 'Monthly Breeder',
    price: '$59',
    unit: '/ month',
    tagline: 'List unlimited litters.',
    highlight: 'Unlimited litters & puppies',
    features: ['Featured in searches', 'Priority support', 'Advanced dashboard'],
    featured: true,
  },
  {
    name: 'Featured Breeder',
    price: '$99',
    unit: '/ month',
    tagline: 'Maximum visibility & reach.',
    highlight: 'Everything in Monthly',
    features: ['Top placement in searches', 'Featured breeder badge', 'Social media spotlight'],
    featured: false,
  },
];

export default function ForBreedersPage() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const isValid = form.reportValidity();

    if (!isValid) {
      setStatus(null);
      return;
    }

    setSubmitting(true);
    setStatus(null);
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      setSubmitting(false);
      setStatus({ type: 'error', message: 'There was an error sending your application. Please try again.' });
      return;
    }
    const formData = new FormData(form);

    const res = await submitForm(endpoint, formData);
    if (res.ok) {
      setStatus({
        type: 'success',
        message: 'Thank you! Your breeder application has been received. Our team will reach out shortly to get you set up.',
      });
      form.reset();
    } else {
      setStatus({ type: 'error', message: res.error || 'There was an error sending your application. Please try again.' });
    }

    setSubmitting(false);
  };

  return (
    <>
      <section id="banner" className="py-3" style={{ background: '#F9F3EC' }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">For <span className="text-primary">Breeders</span></h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">Home</Link>
              <span className="breadcrumb-item active" aria-current="page">For Breeders</span>
            </nav>
          </div>
        </div>
      </section>

      <section style={{ background: '#F9F3EC' }} className="pb-5">
        <div className="container">
          <div className={`row g-4 ${styles.statStrip}`}>
            {stats.map((stat) => (
              <div key={stat.label} className="col-12 col-md-4">
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>
                    <iconify-icon icon={stat.icon} aria-hidden="true"></iconify-icon>
                  </span>
                  <div>
                    <div className={styles.statValue}>{stat.value}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row align-items-stretch g-5 pt-5">
            <div className="col-lg-6">
              <span className={styles.eyebrow}>For Breeders</span>
              <h2 className="display-2 mt-2 mb-4">
                List Your Litters. <span className="text-primary d-block">Find Loving Homes.</span>
              </h2>
              <p className="fs-5 mb-4">
                K9Cupid connects responsible breeders with motivated dog lovers who are ready for the perfect match.
              </p>
              <ul className="list-unstyled mb-4">
                {benefits.map((benefit) => (
                  <li key={benefit.title} className="d-flex mb-3">
                    <span className={styles.checkBadge}>
                      <iconify-icon icon="mdi:check" aria-hidden="true"></iconify-icon>
                    </span>
                    <span>
                      <strong className="d-block">{benefit.title}</strong>
                      <span className="text-muted">{benefit.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className={styles.heroImageWrap}>
                <Image
                  src="/images/breeder-hero.jpg"
                  alt="A golden retriever with a litter of puppies"
                  width={1200}
                  height={800}
                  sizes="(max-width: 992px) 100vw, 50vw"
                  className={styles.heroImage}
                />
              </div>
            </div>

            <div className="col-lg-6 d-flex">
              <div className={styles.applyCard} id="breeder-apply">
                <h3 className="mb-1">Join Our Community</h3>
                <p className="text-muted mb-2">Tell us about your program and our team will get you set up</p>
                <p className="secondary-font text-muted mb-4">We usually reply within 24 hours.</p>

                <form onSubmit={handleSubmit} noValidate>
                  <input type="hidden" name="_subject" value="New K9Cupid Breeder Application" />
                  <input type="hidden" name="source" value="For Breeders landing page" />

                  <div className="mb-3">
                    <label className={styles.fieldLabel} htmlFor="kennelName">Breeder / Kennel Name</label>
                    <input id="kennelName" name="kennelName" type="text" className="form-control" placeholder="e.g. Golden Acres Kennels" required />
                  </div>

                  <div className="mb-3">
                    <label className={styles.fieldLabel} htmlFor="fullName">Your Name</label>
                    <input id="fullName" name="fullName" type="text" className="form-control" placeholder="First and last name" required />
                  </div>

                  <div className="mb-3">
                    <label className={styles.fieldLabel} htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" className="form-control" placeholder="name@yourkennel.com" required />
                  </div>

                  <div className="mb-3">
                    <label className={styles.fieldLabel} htmlFor="phone">Phone Number</label>
                    <input id="phone" name="phone" type="tel" className="form-control" placeholder="Best number to reach you" />
                  </div>

                  <div className="mb-3">
                    <label className={styles.fieldLabel} htmlFor="details">Tell Us About Your Program</label>
                    <textarea id="details" name="details" className="form-control" rows={3} placeholder="Breeds you raise, upcoming litters, and anything we should know."></textarea>
                  </div>

                  <div className={`row g-2 mb-4 ${styles.trustRow}`}>
                    {trustBadges.map((badge) => (
                      <div key={badge.title} className="col-4">
                        <div className={styles.trustBadge}>
                          <iconify-icon icon={badge.icon} aria-hidden="true"></iconify-icon>
                          <strong>{badge.title}</strong>
                          <span>{badge.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100 text-uppercase fs-6 rounded-1" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Apply to List Your Litters'}
                    {!submitting && <iconify-icon icon="mdi:arrow-right" className="mb-1 ms-2" aria-hidden="true"></iconify-icon>}
                  </button>

                  {status && (
                    <div className={`mt-3 mb-0 alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                      {status.message}
                    </div>
                  )}

                  <p className="text-muted text-center mt-3 mb-0" style={{ fontSize: 14 }}>
                    By applying, you agree to our <Link href="/terms-of-service">terms of service</Link> and <Link href="/breeder-guidelines">breeder guidelines</Link>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 my-4">
        <div className="container">
          <div className={styles.verifiedBox}>
            <div className="row g-4 align-items-center">
              <div className="col-lg-4">
                <span className={styles.verifiedSeal}>
                  <iconify-icon icon="mdi:shield-star" aria-hidden="true"></iconify-icon>
                  Verified Breeder
                </span>
                <h3 className="mt-3 mb-2">Verified Breeder Program</h3>
                <p className="text-muted mb-0">
                  We are committed to trust, transparency, and the well-being of every puppy.
                </p>
              </div>
              <div className="col-lg-8">
                <div className="row g-4">
                  {verifiedPoints.map((point) => (
                    <div key={point.title} className="col-sm-6">
                      <div className="d-flex">
                        <span className={styles.verifiedIcon}>
                          <iconify-icon icon={point.icon} aria-hidden="true"></iconify-icon>
                        </span>
                        <span>
                          <strong className="d-block">{point.title}</strong>
                          <span className="text-muted">{point.text}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: '#F9F3EC' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 mb-2">Powerful Tools, Simple Dashboard</h2>
            <p className="fs-5 text-muted mb-0">Everything you need to manage your litters and connect with families.</p>
          </div>
          <div className="row g-4">
            {tools.map((tool) => (
              <div key={tool.title} className="col-12 col-sm-6 col-lg-4">
                <div className={styles.toolCard}>
                  <span className={styles.toolIcon}>
                    <iconify-icon icon={tool.icon} aria-hidden="true"></iconify-icon>
                  </span>
                  <h3 className="h5 mt-3 mb-2">{tool.title}</h3>
                  <p className="text-muted mb-0">{tool.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 my-4">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 mb-0">How It Works</h2>
            <span className={styles.titleRule}></span>
          </div>
          <div className="row g-4">
            {steps.map((step, index) => (
              <div key={step.title} className="col-6 col-lg-3 text-center">
                <div className={styles.stepCircle}>
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <iconify-icon icon={step.icon} aria-hidden="true"></iconify-icon>
                </div>
                <h3 className="h5 mt-4 mb-2">{step.title}</h3>
                <p className="text-muted mb-0">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: '#F9F3EC' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 mb-2">Affordable Plans for Every Breeder</h2>
            <p className="fs-5 text-muted mb-0">Choose the plan that fits your program. Upgrade, pause, or cancel anytime.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {plans.map((plan) => (
              <div key={plan.name} className="col-12 col-md-6 col-lg-4">
                <div className={`${styles.planCard} ${plan.featured ? styles.planFeatured : ''}`}>
                  {plan.featured && <span className={styles.planTag}>Most Popular</span>}
                  <h3 className="h4 mb-1">{plan.name}</h3>
                  <p className="text-muted mb-3">{plan.tagline}</p>
                  <div className={styles.planPrice}>
                    {plan.price}<span className={styles.planUnit}>{plan.unit}</span>
                  </div>
                  <div className={styles.planHighlight}>{plan.highlight}</div>
                  <ul className="list-unstyled mt-3 mb-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="d-flex align-items-start mb-2">
                        <iconify-icon icon="mdi:check-circle" className={styles.planCheck} aria-hidden="true"></iconify-icon>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#breeder-apply" className={`btn w-100 text-uppercase fs-6 rounded-1 ${plan.featured ? 'btn-primary' : 'btn-outline-dark'}`}>
                    Get Started
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-muted mt-4 mb-0">No hidden fees. Cancel anytime.</p>
        </div>
      </section>

      <section className="py-5 my-4">
        <div className="container">
          <div className={styles.rehomeBox}>
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h3 className="mb-2">Re-homing or a Senior Dog?</h3>
                <p className="mb-0 text-muted">
                  We also welcome responsible re-homing and senior dog listings, because every dog deserves a loving home. Reach out and we will help you list.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link href="/shelters" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 py-2 px-4">
                  Visit Shelters
                  <iconify-icon icon="mdi:arrow-right" className="mb-1 ms-2" aria-hidden="true"></iconify-icon>
                </Link>
              </div>
            </div>
          </div>
          <p className="text-center text-muted mt-4 mb-0">
            The shelter side of K9Cupid will always remain free. Our mission is to help as many dogs find homes as possible.
          </p>
        </div>
      </section>
    </>
  );
}
