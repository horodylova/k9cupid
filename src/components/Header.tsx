'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [loading, setLoading] = useState(true);
  const { items, totalItems, removeItem, totalPrice } = useCart();
  const router = useRouter();
  const [sizeValue, setSizeValue] = useState('');

  useEffect(() => {
    // Simulate preloader fade out
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // 1.2s matching animation roughly

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
     // Optional: Render preloader here or return null if handled by CSS/Layout
  }

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <defs>
          <symbol xmlns="http://www.w3.org/2000/svg" id="link" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M12 19a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm0-4a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm-5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm7-12h-1V2a1 1 0 0 0-2 0v1H8V2a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3Zm1 17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9h16Zm0-11H4V6a1 1 0 0 1 1-1h1v1a1 1 0 0 0 2 0V5h8v1a1 1 0 0 0 2 0V5h1a1 1 0 0 1 1 1ZM7 15a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm0 4a1 1 0 1 0-1-1a1 1 0 0 0 1 1Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="arrow-right" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M17.92 11.62a1 1 0 0 0-.21-.33l-5-5a1 1 0 0 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 .21-.33a1 1 0 0 0 0-.76Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="category" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M19 5.5h-6.28l-.32-1a3 3 0 0 0-2.84-2H5a3 3 0 0 0-3 3v13a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-10a3 3 0 0 0-3-3Zm1 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1h4.56a1 1 0 0 1 .95.68l.54 1.64a1 1 0 0 0 .95.68h7a1 1 0 0 1 1 1Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="calendar" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M19 4h-2V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7h16Zm0-9H4V7a1 1 0 0 1 1-1h2v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h2a1 1 0 0 1 1 1Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="heart" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M20.16 4.61A6.27 6.27 0 0 0 12 4a6.27 6.27 0 0 0-8.16 9.48l7.45 7.45a1 1 0 0 0 1.42 0l7.45-7.45a6.27 6.27 0 0 0 0-8.87Zm-1.41 7.46L12 18.81l-6.75-6.74a4.28 4.28 0 0 1 3-7.3a4.25 4.25 0 0 1 3 1.25a1 1 0 0 0 1.42 0a4.27 4.27 0 0 1 6 6.05Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="plus" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="minus" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 11H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="cart" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M8.5 19a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 8.5 19ZM19 16H7a1 1 0 0 1 0-2h8.491a3.013 3.013 0 0 0 2.885-2.176l1.585-5.55A1 1 0 0 0 19 5H6.74a3.007 3.007 0 0 0-2.82-2H3a1 1 0 0 0 0 2h.921a1.005 1.005 0 0 1 .962.725l.155.545v.005l1.641 5.742A3 3 0 0 0 7 18h12a1 1 0 0 0 0-2Zm-1.326-9l-1.22 4.274a1.005 1.005 0 0 1-.963.726H8.754l-.255-.892L7.326 7ZM16.5 19a1.5 1.5 0 1 0 1.5 1.5a1.5 1.5 0 0 0-1.5-1.5Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="check" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46l-3.13-3.14A1 1 0 1 0 5.29 13l3.84 3.84a1 1 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="trash" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M10 18a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1ZM20 6h-4V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2ZM10 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm7 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8h10Zm-3-1a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="star-outline" viewBox="0 0 15 15">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
              d="M7.5 9.804L5.337 11l.413-2.533L4 6.674l2.418-.37L7.5 4l1.082 2.304l2.418.37l-1.75 1.793L9.663 11L7.5 9.804Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="star-solid" viewBox="0 0 15 15">
            <path fill="currentColor"
              d="M7.953 3.788a.5.5 0 0 0-.906 0L6.08 5.85l-2.154.33a.5.5 0 0 0-.283.843l1.574 1.613l-.373 2.284a.5.5 0 0 0 .736.518l1.92-1.063l1.921 1.063a.5.5 0 0 0 .736-.519l-.373-2.283l1.574-1.613a.5.5 0 0 0-.283-.844L8.921 5.85l-.968-2.062Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="search" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="user" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M15.71 12.71a6 6 0 1 0-7.42 0a10 10 0 0 0-6.22 8.18a1 1 0 0 0 2 .22a8 8 0 0 1 15.9 0a1 1 0 0 0 1 .89h.11a1 1 0 0 0 .88-1.1a10 10 0 0 0-6.25-8.19ZM12 12a4 4 0 1 1 4-4a4 4 0 0 1-4 4Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="close" viewBox="0 0 15 15">
            <path fill="currentColor"
              d="M7.953 3.788a.5.5 0 0 0-.906 0L6.08 5.85l-2.154.33a.5.5 0 0 0-.283.843l1.574 1.613l-.373 2.284a.5.5 0 0 0 .736.518l1.92-1.063l1.921 1.063a.5.5 0 0 0 .736-.519l-.373-2.283l1.574-1.613a.5.5 0 0 0-.283-.844L8.921 5.85l-.968-2.062Z" />
          </symbol>
        </defs>
      </svg>

      {loading && (
        <div className="preloader-wrapper">
          <div className="preloader">
          </div>
        </div>
      )}


      <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex={-1} id="offcanvasCart" aria-labelledby="My Cart">
        <div className="offcanvas-header justify-content-center">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-circle pt-2">{totalItems}</span>
            </h4>
            {items.length === 0 ? (
              <div className="text-center py-5">
                <p>Your cart is empty.</p>
                <Link href="/shop" className="btn btn-primary btn-sm mt-2">Start Shopping</Link>
              </div>
            ) : (
              <>
                <ul className="list-group mb-3">
                  {items.map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                      <div className="d-flex align-items-center">
                        <div className="me-3" style={{ width: '50px', height: '50px', position: 'relative' }}>
                          <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} className="rounded" />
                        </div>
                        <div>
                          <h6 className="my-0">{item.name}</h6>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <span className="text-muted">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          className="btn btn-link text-danger p-0 text-decoration-none"
                          style={{ fontSize: '0.8rem' }}
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total (USD)</span>
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </li>
                </ul>
                <div className="d-grid gap-2">
                  <Link href="/cart" className="btn btn-primary">View Cart</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex={-1} id="offcanvasSearch"
        aria-labelledby="Search">
        <div className="offcanvas-header justify-content-center">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">

          <div className="order-md-last">
            <h4 className="text-primary text-uppercase mb-3">
              Search
            </h4>
            <div className="search-bar border rounded-2 border-dark-subtle">
              <form id="search-form" className="text-center d-flex align-items-center" action="" method="">
                <input type="text" className="form-control border-0 bg-transparent" placeholder="Search for breeds, articles..." />
                <iconify-icon icon="tabler:search" className="fs-4 me-3"></iconify-icon>
              </form>
            </div>
          </div>
        </div>
      </div>

      <header>
        <div className="container py-2">
          <div className="row py-4 pb-0 pb-sm-4 align-items-center ">

            <div className="col-sm-4 col-lg-3 text-center text-sm-start">
              <div className="main-logo">
                <Link href="/">
                  <Image
                    src="/images/k9cupid-logo-final.png"
                    alt="k9cupid logo"
                    className="img-fluid logo-image"
                    width={819}
                    height={819}
                    priority
                  />
                  <h1 className="brand-text">k9cupid</h1>
                </Link>
              </div>
            </div>

            <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
              <div className="search-bar border rounded-2 px-3 border-dark-subtle">
                <form id="search-form" className="text-center d-flex align-items-center" action="" method="">
                  <input type="text" className="form-control border-0 bg-transparent"
                    placeholder="Search for breeds, articles..." />
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor"
                      d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" />
                  </svg>
                </form>
              </div>
            </div>

            <div
              className="col-sm-8 col-lg-4 d-flex justify-content-end gap-5 align-items-center mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
              
              <div className="support-box text-end d-none d-xl-block">
                <span className="fs-6 secondary-font text-muted">Email</span>
                <h5 className="mb-0">hello@k9cupid.fit</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <hr className="m-0" />
        </div>

        <div className="container">
          <nav className="main-menu d-flex navbar navbar-expand-lg ">

            <div className="d-flex d-lg-none align-items-end mt-3">
              <ul className="d-flex justify-content-end list-unstyled m-0">
                <li>
                  <Link href="/account" className="mx-3">
                    <iconify-icon icon="healthicons:person" className="fs-4"></iconify-icon>
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="mx-3">
                    <iconify-icon icon="mdi:heart" className="fs-4"></iconify-icon>
                  </Link>
                </li>

                <li>
                  <a href="#" className="mx-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart"
                    aria-controls="offcanvasCart">
                    <iconify-icon icon="mdi:cart" className="fs-4 position-relative"></iconify-icon>
                    <span className="position-absolute translate-middle badge rounded-circle bg-primary pt-2">
                      {totalItems}
                    </span>
                  </a>
                </li>

                <li>
                  <a href="#" className="mx-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSearch"
                    aria-controls="offcanvasSearch">
                    <iconify-icon icon="tabler:search" className="fs-4"></iconify-icon>
                  </a>
                </li>
              </ul>

            </div>

            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">

              <div className="offcanvas-header justify-content-center">
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>

              <div className="offcanvas-body justify-content-between">
                <select
                  className="filter-categories border-0 mb-0 me-5"
                  value={sizeValue}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSizeValue(v);
                    if (v) {
                      router.push(`/breeds?size=${encodeURIComponent(v)}`);
                    }
                  }}
                >
                  <option value="">Browse by Size</option>
                  <option value="toy">Toy Breeds</option>
                  <option value="small">Small Breeds</option>
                  <option value="medium">Medium Breeds</option>
                  <option value="large">Large Breeds</option>
                </select>

                <ul className="navbar-nav menu-list list-unstyled d-flex gap-md-3 mb-0">
                  <li className="nav-item">
                    <Link href="/" className="nav-link active">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/quiz" className="nav-link">Quiz</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/breeds" className="nav-link">Breeds</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/blog" className="nav-link">Blog</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/about" className="nav-link">About Us</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/shop" className="nav-link">Shop</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/contact" className="nav-link">Contact</Link>
                  </li>
                </ul>

                <div className="d-none d-lg-flex align-items-end">
                  <ul className="d-flex justify-content-end list-unstyled m-0">
                    <li>
                      <Link href="/account" className="mx-3">
                        <iconify-icon icon="healthicons:person" className="fs-4"></iconify-icon>
                      </Link>
                    </li>
                    <li>
                      <Link href="/wishlist" className="mx-3">
                        <iconify-icon icon="mdi:heart" className="fs-4"></iconify-icon>
                      </Link>
                    </li>
                    <li>
                      <a href="#" className="mx-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart"
                        aria-controls="offcanvasCart">
                        <iconify-icon icon="mdi:cart" className="fs-4 position-relative"></iconify-icon>
                        <span className="position-absolute translate-middle badge rounded-circle bg-primary pt-2">
                          {totalItems}
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

          </nav>
        </div>
      </header>
    </>
  );
}
