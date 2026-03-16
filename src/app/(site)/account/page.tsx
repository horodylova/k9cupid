"use client";

import Link from "next/link";

export default function AccountPage() {
  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">Account</h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <span className="breadcrumb-item active" aria-current="page">
                Account
              </span>
            </nav>
          </div>
        </div>
      </section>

      <section className="my-5 py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 my-4 pe-5">
              <h2>Your Profile</h2>
              <p>
                Hi! Right now, we do not know anything about your lifestyle yet.
              </p>
              <p>
                Take our quick quiz so we can learn what matters to you and suggest dog breeds that genuinely fit your
                day-to-day life.
              </p>
              <Link href="/quiz/start" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 py-2 px-4">
                Take the Quiz
                <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1 ms-2">
                  <use xlinkHref="#arrow-right"></use>
                </svg>
              </Link>
            </div>
            <div className="col-md-6 my-4">
              <h2>What We Will Learn</h2>
              <p className="m-0">
                <span className="text-primary">✓</span> Your activity level and routine
              </p>
              <p className="m-0">
                <span className="text-primary">✓</span> Your home and living situation
              </p>
              <p className="m-0">
                <span className="text-primary">✓</span> Your experience and expectations
              </p>
              <p className="m-0">
                <span className="text-primary">✓</span> Your preferences for size, temperament, and care
              </p>
              <p
                className="mt-4 mb-0 secondary-font account-profile-note fw-medium"
                style={{ fontSize: 13, lineHeight: "18px" }}
              >
                After the quiz, this page will show a summary of what we learned and your top matches.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="register"
        style={{
          backgroundImage: "url(/images/background-img.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="row py-5 my-5">
            <div className="col-lg-6 py-4 my-4 py-lg-5 my-lg-5 text-center text-lg-start">
              <h2 className="display-4 my-4 my-lg-5 text-dark">Ready to Meet Your Match?</h2>
            </div>
            <div className="col-lg-6 py-4 my-4 py-lg-5 my-lg-5 d-flex align-items-center justify-content-center justify-content-lg-end">
              <Link href="/quiz/start" className="btn btn-primary p-3 text-uppercase rounded-1">
                Start the Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
