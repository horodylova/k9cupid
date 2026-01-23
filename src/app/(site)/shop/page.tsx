'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart, Product } from '@/context/CartContext';

const products: Product[] = [
  {
    id: 1,
    name: 'Matching Bandanas Set',
    price: 25.00,
    rating: 5.0,
    image: '/images/item1.jpg',
    isNew: true,
  },
  {
    id: 2,
    name: 'Friendship Bracelet & Collar Charm',
    price: 18.00,
    rating: 4.8,
    image: '/images/item2.jpg',
  },
  {
    id: 3,
    name: 'Cozy Socks & Paw Print Bandana',
    price: 30.00,
    rating: 5.0,
    image: '/images/item3.jpg',
    isSale: true,
  },
  {
    id: 4,
    name: 'Matching Tote Bag & Dog Bandana',
    price: 45.00,
    rating: 4.9,
    image: '/images/item4.jpg',
  },
  {
    id: 5,
    name: 'Custom Frequency Dog Whistle',
    price: 35.00,
    rating: 5.0,
    image: '/images/item1.jpg',
    isNew: true,
  },
  {
    id: 6,
    name: 'Matching Keychain Bells Set',
    price: 15.00,
    rating: 4.7,
    image: '/images/item2.jpg',
  },
  {
    id: 7,
    name: 'Driver & Co-pilot Car Stickers',
    price: 12.00,
    rating: 4.9,
    image: '/images/item3.jpg',
  },
  {
    id: 8,
    name: 'Custom Embroidery Patches',
    price: 10.00,
    rating: 4.8,
    image: '/images/item4.jpg',
  },
  {
    id: 9,
    name: 'NFC Smart Collar Tag',
    price: 28.00,
    rating: 5.0,
    image: '/images/item1.jpg',
    isNew: true,
  },
];

export default function ShopPage() {
  const { addItem } = useCart();

  return (
    <>
      <section id="banner" className="py-3" style={{ background: '#F9F3EC' }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">Matching Accessories</h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">Home</Link>
              <span className="breadcrumb-item active" aria-current="page">Shop</span>
            </nav>
          </div>
        </div>
      </section>

      <div className="shopify-grid">
        <div className="container py-5 my-5">
          <div className="row flex-md-row-reverse g-md-5 mb-5">

            <main className="col-md-9">
              <div className="filter-shop d-md-flex justify-content-between align-items-center">
                <div className="showing-product">
                  <p className="m-0">Showing 1–9 of {products.length} results</p>
                </div>
                <div className="sort-by">
                  <select className="filter-categories border-0 m-0">
                    <option value="">Default sorting</option>
                    <option value="">Name (A - Z)</option>
                    <option value="">Name (Z - A)</option>
                    <option value="">Price (Low-High)</option>
                    <option value="">Price (High-Low)</option>
                    <option value="">Rating (Highest)</option>
                    <option value="">Rating (Lowest)</option>
                    <option value="">Model (A - Z)</option>
                    <option value="">Model (Z - A)</option>
                  </select>
                </div>
              </div>

              <div className="product-grid row ">
                {products.map((product) => (
                  <div key={product.id} className="col-md-4 my-4">
                    {product.isNew && (
                      <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                        New
                      </div>
                    )}
                    {product.isSale && (
                      <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                        Sale
                      </div>
                    )}
                     {product.isSold && (
                      <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                        Sold
                      </div>
                    )}
                    <div className="card position-relative">
                      <Link href={`/shop/${product.id}`}>
                        <Image 
                          src={product.image} 
                          className="img-fluid rounded-4" 
                          alt={product.name} 
                          width={600} 
                          height={600}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </Link>
                      <div className="card-body p-0">
                        <Link href={`/shop/${product.id}`}>
                          <h3 className="card-title pt-4 m-0">{product.name}</h3>
                        </Link>

                        <div className="card-text">
                          <span className="rating secondary-font">
                            {[...Array(5)].map((_, i) => (
                               <iconify-icon key={i} icon="clarity:star-solid" className="text-primary"></iconify-icon>
                            ))}
                            {product.rating.toFixed(1)}</span>

                          <h3 className="secondary-font text-primary">${product.price.toFixed(2)}</h3>

                          <div className="d-flex flex-wrap mt-3">
                            <a 
                              href="#" 
                              className="btn-cart me-3 px-4 pt-3 pb-3"
                              onClick={(e) => {
                                e.preventDefault();
                                addItem(product);
                              }}
                            >
                              <h5 className="text-uppercase m-0">Add to Cart</h5>
                            </a>
                            <a href="#" className="btn-wishlist px-4 pt-3 ">
                              <iconify-icon icon="fluent:heart-28-filled" className="fs-5"></iconify-icon>
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <nav className="navigation paging-navigation text-center mt-5" role="navigation">
                <div className="pagination loop-pagination d-flex justify-content-center align-items-center">
                  <a href="#" className="pagination-arrow d-flex align-items-center mx-3">
                    <iconify-icon icon="ic:baseline-keyboard-arrow-left" className="pagination-arrow fs-1"></iconify-icon>
                  </a>
                  <span aria-current="page" className="page-numbers mt-2 fs-3 mx-3 current">1</span>
                  <a className="page-numbers mt-2 fs-3 mx-3" href="#">2</a>
                  <a className="page-numbers mt-2 fs-3 mx-3" href="#">3</a>
                  <a href="#" className="pagination-arrow d-flex align-items-center mx-3">
                    <iconify-icon icon="ic:baseline-keyboard-arrow-right" className="pagination-arrow fs-1"></iconify-icon>
                  </a>
                </div>
              </nav>

            </main>
            <aside className="col-md-3 mt-5">
              <div className="sidebar">
                <div className="widget-menu">
                  <div className="widget-search-bar">
                    <div className="search-bar border rounded-2 border-dark-subtle pe-3">
                      <form id="search-form" className="text-center d-flex align-items-center" action="" method="">
                        <input type="text" className="form-control border-0 bg-transparent" placeholder="Search for products" />
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="currentColor"
                            d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" />
                        </svg>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="widget-product-categories pt-5">
                  <h4 className="widget-title">Categories</h4>
                  <ul className="product-categories sidebar-list list-unstyled">
                    <li className="cat-item">
                      <a href="#" className="nav-link">All Products</a>
                    </li>
                    <li className="cat-item">
                      <a href="#" className="nav-link">Matching Sets</a>
                    </li>
                    <li className="cat-item">
                      <a href="#" className="nav-link">Personalized Gear</a>
                    </li>
                    <li className="cat-item">
                      <a href="#" className="nav-link">Jewelry & Charms</a>
                    </li>
                    <li className="cat-item">
                      <a href="#" className="nav-link">Apparel</a>
                    </li>
                    <li className="cat-item">
                      <a href="#" className="nav-link">Accessories</a>
                    </li>
                  </ul>
                </div>
                <div className="widget-product-tags pt-3">
                  <h4 className="widget-title">Tags</h4>
                  <ul className="product-tags sidebar-list list-unstyled">
                    <li className="tags-item">
                      <a href="#" className="nav-link">Bandanas</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">Safety</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">Gift Ideas</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">Travel</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">Summer</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">Handmade</a>
                    </li>
                  </ul>
                </div>
                <div className="widget-product-brands pt-3">
                  <h4 className="widget-title">Brands</h4>
                  <ul className="product-tags sidebar-list list-unstyled">
                    <li className="tags-item">
                      <a href="#" className="nav-link">K9Cupid Originals</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">Paws & People</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">SafeTails</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">CustomCraft</a>
                    </li>
                  </ul>
                </div>
                <div className="widget-price-filter pt-3">
                  <h4 className="widget-titlewidget-title">Filter By Price</h4>
                  <ul className="product-tags sidebar-list list-unstyled">
                    <li className="tags-item">
                      <a href="#" className="nav-link">Less than $10</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">$10- $20</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">$20- $30</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">$30- $40</a>
                    </li>
                    <li className="tags-item">
                      <a href="#" className="nav-link">$40- $50</a>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
