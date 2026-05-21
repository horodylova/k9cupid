import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "./icons";

export default function Banner() {
  return (
    <section id="banner" style={{ background: "#F9F3EC" }}>
      <div className="container">
        <div className="py-2 py-md-5">
          <div className="row banner-content align-items-center">
            <div className="img-wrapper col-md-5">
              <Image
                src="/images/banner-img.WebP"
                className="img-fluid banner-img"
                alt="Banner"
                width={606}
                height={759}
                sizes="(max-width: 768px) 100vw, 42vw"
                priority
              />
            </div>
            <div className="content-wrapper col-md-7 p-3 p-md-5 mb-3 mb-md-5">
              <div className="secondary-font text-primary text-uppercase mb-2 mb-md-4">Find Your Perfect Match</div>
              <h2 className="banner-title display-4 display-md-1 fw-normal">
                Discover the dog breed that <span className="text-primary">fits your lifestyle</span>
              </h2>
              <Link href="/quiz" className="btn btn-outline-dark btn-md btn-lg-md text-uppercase fs-6 rounded-1 mt-3">
                Start the Quiz
                <ArrowRightIcon className="mb-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
