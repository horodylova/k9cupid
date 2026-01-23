import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <section id="banner" className="py-3" style={{ background: '#F9F3EC' }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">About <span className="text-primary">Us</span></h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">Home</Link>
              <span className="breadcrumb-item active" aria-current="page">About Us</span>
            </nav>
          </div>
        </div>
      </section>

      <div className="my-5 py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 my-4 pe-5">
              <h2 className="">Our Quiz</h2>
              <p>
                We have created a unique quiz to help you find your perfect four-legged friend.
                It is not just a test; it is the first step towards a strong friendship and mutual understanding.
              </p>
              <p>
                Our goal is to ensure that every dog finds their person, and every person finds their dog.
                We believe that the right match is the key to a happy life for both.
              </p>
              <Link href="/quiz" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 py-2 px-4">
                Take the Quiz
                <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1 ms-2">
                  <use xlinkHref="#arrow-right"></use>
                </svg>
              </Link>
            </div>
            <div className="col-md-6 my-4">
              <h2 className="">Our Mission</h2>
              <p>We want everyone to be happy — both dogs and humans.</p>
              <p className="m-0">
                <span className="text-primary">✓</span> We help you find a dog that fits your temperament and lifestyle perfectly.
              </p>
              <p className="m-0">
                <span className="text-primary">✓</span> We reduce the number of animals returned to shelters through conscious choices.
              </p>
              <p className="m-0">
                <span className="text-primary">✓</span> We support future owners at every stage — from selection to home adaptation.
              </p>
              <p className="m-0">
                <span className="text-primary">✓</span> We create a community of happy owners and their pets.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-5 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2 className="display-4">Happiness Begins With the Right Choice.</h2>
            </div>
            <div className="col-md-6">
               <p>
                 We believe that there is a perfect dog for every person, and a perfect person for every dog.
                 Our project is created to help them meet.
               </p>
            </div>
          </div>
        </div>
      </div>

      <section id="register" style={{ backgroundImage: 'url(/images/background-img.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container ">
          <div className="row py-5 my-5">
            <div className="col-lg-6 py-5 my-5">
              <h2 className="display-4 my-5 text-dark">Ready to Meet Your Friend?</h2>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
