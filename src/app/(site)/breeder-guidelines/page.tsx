import Link from "next/link";

export default function BreederGuidelinesPage() {
  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">
              Breeder <span className="text-primary">Guidelines</span>
            </h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <span className="breadcrumb-item active" aria-current="page">
                Breeder Guidelines
              </span>
            </nav>
          </div>
        </div>
      </section>

      <section className="my-5 py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-10">
              <p className="secondary-font text-muted mb-4">Effective date: July 18, 2026</p>

              <p className="secondary-font mb-4">
                K9Cupid exists to connect responsible breeders with families who are ready to welcome a dog for life.
                These Guidelines describe what we expect from breeders who list on K9Cupid. By applying to list, you
                agree to follow them. They are meant to protect puppies, families, and the trust of our community, and
                they work alongside our <Link href="/terms-of-service">Terms of Service</Link> and{" "}
                <Link href="/privacy-policy">Privacy Policy</Link>.
              </p>

              <h3 className="mb-3">1. Who can list</h3>
              <p className="secondary-font">
                Listings are for individual breeders and small breeding programs placing puppies directly with
                families. You must be able to legally breed and sell dogs where you live, and to comply with all
                applicable local, state, and federal laws. Brokers, resellers, auctioneers, pet shops, and high-volume
                commercial operations that do not place puppies directly are not eligible.
              </p>

              <h3 className="mt-5 mb-3">2. Honest and accurate listings</h3>
              <p className="secondary-font">
                Every listing must be truthful. Photos should be of your own dogs and current litters. Breed, age,
                availability, pricing, and health details must be accurate and kept up to date. Do not misrepresent
                lineage, registration status, or a puppy&apos;s condition, and remove or update a listing promptly once
                a puppy is no longer available.
              </p>

              <h3 className="mt-5 mb-3">3. Health and welfare</h3>
              <p className="secondary-font">
                Puppies and parents should be raised in clean, safe conditions with appropriate nutrition,
                socialization, and veterinary care. We encourage sharing vaccination and deworming records, health
                testing, and pedigree information where available. Puppies should not leave for their new homes before
                they are developmentally ready and in line with local minimum-age requirements.
              </p>

              <h3 className="mt-5 mb-3">4. Responsible placement</h3>
              <p className="secondary-font">
                We ask breeders to place puppies with care rather than to the highest or fastest bidder. Screen
                interested families, answer their questions honestly, and be transparent about temperament, needs, and
                any known issues. A clear, written agreement between you and the buyer that sets expectations for both
                sides is strongly encouraged.
              </p>

              <h3 className="mt-5 mb-3">5. Re-homing and senior dogs</h3>
              <p className="secondary-font">
                K9Cupid welcomes responsible re-homing and listings for senior dogs who need a new home. The same
                standards of honesty and welfare apply. If you are re-homing a dog, describe its history, health, and
                temperament accurately so the right family can step forward.
              </p>

              <h3 className="mt-5 mb-3">6. Communication and conduct</h3>
              <p className="secondary-font">
                Respond to families in a timely, respectful way. Keep communication civil and professional, and never
                pressure a family into a decision. Harassment, discrimination, or abusive behavior toward buyers,
                shelters, or other breeders is not permitted.
              </p>

              <h3 className="mt-5 mb-3">7. Prohibited practices</h3>
              <p className="secondary-font">
                The following are not allowed on K9Cupid: misleading or fraudulent listings; sale of puppies below a
                safe minimum age; conditions that harm animal welfare; sale on behalf of brokers, pet shops, or
                unlicensed commercial operations; and any activity that violates applicable law. Listings for shipping
                animals sight-unseen without buyer verification may be restricted.
              </p>

              <h3 className="mt-5 mb-3">8. Shelters remain free</h3>
              <p className="secondary-font">
                Our mission is to help as many dogs find homes as possible. The shelter and rescue side of K9Cupid is
                free and will remain free. Breeder listings help support the platform so that this stays true.
              </p>

              <h3 className="mt-5 mb-3">9. Review, enforcement, and removal</h3>
              <p className="secondary-font">
                We may review listings and applications and may decline, edit, pause, or remove any listing that does
                not meet these Guidelines. We may suspend or remove breeders who provide false information, harm
                animals, or repeatedly violate these standards. Where required, we cooperate with the appropriate
                authorities.
              </p>

              <h3 className="mt-5 mb-3">10. Not professional advice</h3>
              <p className="secondary-font">
                These Guidelines are general standards for our community and do not constitute veterinary, legal, or
                professional advice. You are responsible for complying with the laws that apply to you and for the care
                of your dogs. For specific concerns, consult a qualified veterinarian or professional.
              </p>

              <h3 className="mt-5 mb-3">11. Updates</h3>
              <p className="secondary-font">
                We may update these Guidelines from time to time as the platform grows. Continued use of breeder
                features after an update means you accept the current version.
              </p>

              <h3 className="mt-5 mb-3">12. Contact</h3>
              <p className="secondary-font">
                Questions about these Guidelines or a listing can be sent to{" "}
                <a href="mailto:support@k9cupid.fit">support@k9cupid.fit</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
