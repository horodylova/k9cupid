'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useNavigation } from '@/context/NavigationContext';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';
import { loadWishlist, subscribeWishlist } from '@/lib/wishlistStorage';
import { loadShelterDogWishlist, subscribeShelterDogWishlist } from '@/lib/shelterDogWishlistStorage';

export default function Header() {
  const { items, totalItems, removeItem, totalPrice } = useCart();
  const { attemptNavigation } = useNavigation();
  const [sizeValue, setSizeValue] = useState('');
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const closeMenu = () => {
    const offcanvasNavbar = document.getElementById('offcanvasNavbar');
    if (offcanvasNavbar?.classList.contains('show')) {
      const closeBtn = offcanvasNavbar.querySelector('.btn-close') as HTMLButtonElement;
      closeBtn?.click();
    }
  };

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    closeMenu();
    attemptNavigation(path);
  };

  const sizeOptions = [
    { id: 'toy', label: 'Toy Breeds' },
    { id: 'small', label: 'Small Breeds' },
    { id: 'medium', label: 'Medium Breeds' },
    { id: 'large', label: 'Large Breeds' },
  ];

  const activeSizeLabel = sizeValue
    ? sizeOptions.find((opt) => opt.id === sizeValue)?.label ?? 'Browse by Size'
    : 'Browse by Size';

  useEffect(() => {
    const compute = () => {
      const breeds = loadWishlist();
      const dogs = loadShelterDogWishlist();
      setWishlistCount(breeds.length + dogs.length);
    };

    compute();
    const unsubBreeds = subscribeWishlist(() => compute());
    const unsubDogs = subscribeShelterDogWishlist(() => compute());
    return () => {
      unsubBreeds();
      unsubDogs();
    };
  }, []);

  useEffect(() => {
    if (!isSizeOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-size-dropdown="true"]')) return;
      setIsSizeOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [isSizeOpen]);

  return (
    <>
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
            <GlobalSearchBar
              className="search-bar border rounded-2 border-dark-subtle px-3 position-relative"
              inputClassName="form-control border-0 bg-transparent"
              icon={<iconify-icon icon="tabler:search" className="fs-4 me-2"></iconify-icon>}
            />
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
                    src="/images/k9cupid-logo-final.WebP"
                    alt="k9cupid logo"
                    className="logo-image"
                    width={120}
                    height={120}
                    sizes="(max-width: 767px) 90px, 120px"
                  />
                  <h1 className="brand-text">k9cupid</h1>
                </Link>
              </div>
            </div>

            <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
              <GlobalSearchBar
                className="search-bar border rounded-2 px-3 border-dark-subtle position-relative"
                inputClassName="form-control border-0 bg-transparent"
              />
            </div>

            <div
              className="col-sm-8 col-lg-4 d-flex justify-content-end gap-5 align-items-center mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
              
              <div className="support-box text-end d-none d-xl-block">
                <span className="fs-6 secondary-font text-muted">Email</span>
                <h5 className="mb-0">support@k9cupid.fit</h5>
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
                  <Link href="/account" className="icon-button mx-3" aria-label="Account">
                    <iconify-icon icon="healthicons:person" className="fs-4" aria-hidden="true"></iconify-icon>
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="icon-button mx-3" aria-label="Wishlist">
                    <span className="position-relative d-inline-flex">
                      <iconify-icon icon="mdi:heart" className="fs-4" aria-hidden="true"></iconify-icon>
                      {wishlistCount > 0 && (
                        <span
                          className="position-absolute translate-middle badge rounded-circle bg-primary"
                            style={{ top: -8, left: 'calc(100% + 2px)', minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, lineHeight: 1 }}
                          aria-label={`${wishlistCount} saved items`}
                        >
                          {wishlistCount}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    className="icon-button mx-3 d-none"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCart"
                    aria-controls="offcanvasCart"
                    aria-label="Open cart"
                  >
                    <iconify-icon icon="mdi:cart" className="fs-4 position-relative" aria-hidden="true"></iconify-icon>
                    <span className="position-absolute translate-middle badge rounded-circle bg-primary pt-2">
                      {totalItems}
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="icon-button mx-3"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasSearch"
                    aria-controls="offcanvasSearch"
                    aria-label="Open search"
                  >
                    <iconify-icon icon="tabler:search" className="fs-4" aria-hidden="true"></iconify-icon>
                  </button>
                </li>
              </ul>

            </div>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">

              <div className="offcanvas-header justify-content-center">
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>

              <div className="offcanvas-body justify-content-between">
                <div className="position-relative mb-0 me-5" data-size-dropdown="true">
                  <button
                    type="button"
                    className="filter-categories border-0 mb-0 d-inline-flex align-items-center gap-2 bg-transparent py-2 px-3 rounded"
                    aria-haspopup="listbox"
                    aria-expanded={isSizeOpen}
                    onClick={() => setIsSizeOpen((v) => !v)}
                  >
                    <span>{activeSizeLabel}</span>
                    <iconify-icon icon="ri:arrow-down-s-line" className="fs-5"></iconify-icon>
                  </button>
                  {isSizeOpen && (
                    <div
                      className="position-absolute start-0 mt-2 bg-white border rounded shadow-sm"
                      style={{ minWidth: 220, zIndex: 1060 }}
                      role="listbox"
                    >
                      <button
                        type="button"
                        className="dropdown-item py-2 px-3 w-100 text-start"
                        style={{ transition: 'background-color 120ms ease, color 120ms ease' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F9F3EC';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                        }}
                        onClick={() => {
                          setSizeValue('');
                          setIsSizeOpen(false);
                        }}
                      >
                        Browse by Size
                      </button>
                      {sizeOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          className="dropdown-item py-2 px-3 w-100 text-start"
                          style={{ transition: 'background-color 120ms ease, color 120ms ease' }}
                          aria-pressed={sizeValue === opt.id}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F9F3EC';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '';
                          }}
                          onClick={() => {
                            setSizeValue(opt.id);
                            setIsSizeOpen(false);
                            closeMenu();
                            attemptNavigation(`/breeds?size=${encodeURIComponent(opt.id)}`);
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <ul className="navbar-nav menu-list list-unstyled d-flex gap-md-3 mb-0">
                  <li className="nav-item">
                    <Link href="/" onClick={(e) => handleLinkClick(e, '/')} className="nav-link active">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/quiz" onClick={(e) => handleLinkClick(e, '/quiz')} className="nav-link">Quiz</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/breeds" onClick={(e) => handleLinkClick(e, '/breeds')} className="nav-link">Breeds</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/shelters" onClick={(e) => handleLinkClick(e, '/shelters')} className="nav-link">Shelters</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/blog" onClick={(e) => handleLinkClick(e, '/blog')} className="nav-link">Blog</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/about" onClick={(e) => handleLinkClick(e, '/about')} className="nav-link">About Us</Link>
                  </li>
                  <li className="nav-item d-none">
                    <Link href="/shop" onClick={(e) => handleLinkClick(e, '/shop')} className="nav-link">Shop</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="nav-link">Contact</Link>
                  </li>
                </ul>

                <div className="d-none d-lg-flex align-items-end">
                  <ul className="d-flex justify-content-end list-unstyled m-0">
                    <li>
                      <Link href="/account" className="icon-button mx-3" aria-label="Account">
                        <iconify-icon icon="healthicons:person" className="fs-4" aria-hidden="true"></iconify-icon>
                      </Link>
                    </li>
                    <li>
                      <Link href="/wishlist" className="icon-button mx-3" aria-label="Wishlist">
                        <span className="position-relative d-inline-flex">
                          <iconify-icon icon="mdi:heart" className="fs-4" aria-hidden="true"></iconify-icon>
                          {wishlistCount > 0 && (
                            <span
                              className="position-absolute translate-middle badge rounded-circle bg-primary"
                              style={{ top: -8, left: 'calc(100% + 2px)', minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, lineHeight: 1 }}
                              aria-label={`${wishlistCount} saved items`}
                            >
                              {wishlistCount}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="icon-button mx-3 d-none"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasCart"
                        aria-controls="offcanvasCart"
                        aria-label="Open cart"
                      >
                        <iconify-icon icon="mdi:cart" className="fs-4 position-relative" aria-hidden="true"></iconify-icon>
                        <span className="position-absolute translate-middle badge rounded-circle bg-primary pt-2">
                          {totalItems}
                        </span>
                      </button>
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
