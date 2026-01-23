'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <>
      <section id="banner" className="py-3" style={{ background: '#F9F3EC' }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">Cart</h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">Home</Link>
              <span className="breadcrumb-item active" aria-current="page">Cart</span>
            </nav>
          </div>
        </div>
      </section>

      <section id="cart" className="my-5 py-5">
        <div className="container">
          <div className="row g-md-5">
            <div className="col-md-8 pe-md-5">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="card-title text-uppercase">Product</th>
                    <th scope="col" className="card-title text-uppercase">Quantity</th>
                    <th scope="col" className="card-title text-uppercase">Subtotal</th>
                    <th scope="col" className="card-title text-uppercase"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center">
                        <h4 className="my-4">Your cart is currently empty.</h4>
                        <Link href="/shop" className="btn btn-primary rounded-1">Return to Shop</Link>
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4">
                          <div className="cart-info d-flex flex-wrap align-items-center ">
                            <div className="col-lg-3">
                              <div className="card-image">
                                <Image 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="img-fluid rounded-4" 
                                  width={100}
                                  height={100}
                                />
                              </div>
                            </div>
                            <div className="col-lg-9">
                              <div className="card-detail ps-3">
                                <h5 className="card-title">
                                  <Link href={`/shop/${item.id}`} className="text-decoration-none text-dark">
                                    {item.name}
                                  </Link>
                                </h5>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 align-middle">
                          <div className="input-group product-qty" style={{ maxWidth: '120px' }}>
                            <button 
                              className="btn btn-light border" 
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input 
                              type="text" 
                              className="form-control text-center bg-white" 
                              value={item.quantity} 
                              readOnly 
                            />
                            <button 
                              className="btn btn-light border" 
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 align-middle">
                          <span className="text-dark">${(item.price * item.quantity).toFixed(2)}</span>
                        </td>
                        <td className="py-4 align-middle">
                          <button 
                             className="btn btn-link text-danger p-0"
                             onClick={() => removeItem(item.id)}
                          >
                            <iconify-icon icon="mdi:trash-can-outline" className="fs-5"></iconify-icon>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-md-4">
              <div className="cart-totals">
                <h2 className="pb-4">Cart Total</h2>
                <div className="total-price pb-4">
                  <table cellSpacing="0" className="table text-uppercase">
                    <tbody>
                      <tr className="subtotal pt-2 pb-2 border-top border-bottom">
                        <th>Subtotal</th>
                        <td data-title="Subtotal">
                          <span className="price-amount amount text-dark ps-5">
                            <bdi>
                              <span className="price-currency-symbol">$</span>{totalPrice.toFixed(2)}
                            </bdi>
                          </span>
                        </td>
                      </tr>
                      <tr className="order-total pt-2 pb-2 border-bottom">
                        <th>Total</th>
                        <td data-title="Total">
                          <span className="price-amount amount text-dark ps-5">
                            <bdi>
                              <span className="price-currency-symbol">$</span>{totalPrice.toFixed(2)}</bdi>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="button-wrap row g-2">
                  <div className="col-md-12">
                    <button 
                      className="btn btn-primary p-3 text-uppercase rounded-1 w-100" 
                      disabled={items.length === 0}
                    >
                      Proceed to checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
