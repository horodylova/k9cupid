'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function Banner() {
  return (
    <section id="banner" style={{ background: '#F9F3EC' }}>
      <div className="container">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="main-swiper"
        >
          <SwiperSlide className="py-5">
            <div className="row banner-content align-items-center">
              <div className="img-wrapper col-md-5">
                <Image src="/images/banner-img.png" className="img-fluid" alt="Banner 1" width={606} height={759} priority />
              </div>
              <div className="content-wrapper col-md-7 p-5 mb-5">
                <div className="secondary-font text-primary text-uppercase mb-4">Find Your Perfect Match</div>
                <h2 className="banner-title display-1 fw-normal">Discover the dog breed that <span className="text-primary">fits your lifestyle</span></h2>
                <Link href="/quiz" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">
                  Start the Quiz
                  <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1">
                    <use xlinkHref="#arrow-right"></use>
                  </svg>
                </Link>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="py-5">
            <div className="row banner-content align-items-center">
              <div className="img-wrapper col-md-5">
                <Image src="/images/banner-img2.png" className="img-fluid" alt="Banner 2" width={606} height={759} />
              </div>
              <div className="content-wrapper col-md-7 p-5 mb-5">
                <div className="secondary-font text-primary text-uppercase mb-4">Expert Advice</div>
                <h2 className="banner-title display-1 fw-normal">Learn everything about <span className="text-primary">your favorite breeds</span></h2>
                <Link href="/breeds" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">
                  Explore Breeds
                  <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1">
                    <use xlinkHref="#arrow-right"></use>
                  </svg>
                </Link>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="py-5">
            <div className="row banner-content align-items-center">
              <div className="img-wrapper col-md-5">
                <Image src="/images/banner-img4.png" className="img-fluid" alt="Banner 3" width={606} height={759} />
              </div>
              <div className="content-wrapper col-md-7 p-5 mb-5">
                <div className="secondary-font text-primary text-uppercase mb-4">Dog Care Guides</div>
                <h2 className="banner-title display-1 fw-normal">Tips for a happy <span className="text-primary">life together</span></h2>
                <Link href="/articles" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">
                  Read Articles
                  <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1">
                    <use xlinkHref="#arrow-right"></use>
                  </svg>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
