import React from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";

const Cart = () => {
  // ✅ Fixed: handleCart IS the array directly
  const state = useSelector((state) => state.handleCart || []);
  const dispatch = useDispatch();

  const addItem = (product) => dispatch(addCart(product));
  const removeItem = (product) => dispatch(delCart(product));

  const EmptyCart = () => (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5">Your Cart is Empty</h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  const ShowCart = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    state.forEach((item) => { subtotal += item.price * item.qty; });
    state.forEach((item) => { totalItems += item.qty; });

    return (
      <section className="h-100 gradient-custom">
        <div className="container py-5">
          <div className="row d-flex justify-content-center my-4">

            {/* Item List */}
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h5 className="mb-0">Item List</h5>
                </div>
                <div className="card-body">
                  {state.map((item) => (
                    <div key={`${item.id}-${item.selectedSize || "nosize"}`}>
                      <div className="row d-flex align-items-center">
                        <div className="col-lg-3 col-md-12">
                          <img src={item.image} alt={item.title} width={100} height={75} style={{ objectFit: "contain" }} />
                        </div>
                        <div className="col-lg-5 col-md-6">
                          <p className="mb-1"><strong>{item.title}</strong></p>
                          {item.selectedSize && (
                            <span style={{
                              display: "inline-block", background: "#111", color: "#fff",
                              borderRadius: "4px", padding: "2px 10px", fontSize: "12px",
                              fontWeight: 600, letterSpacing: "0.5px",
                            }}>
                              Size: {item.selectedSize}
                            </span>
                          )}
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="d-flex mb-4 align-items-center" style={{ maxWidth: "300px" }}>
                            <button className="btn px-3" onClick={() => removeItem(item)}>
                              <i className="fas fa-minus"></i>
                            </button>
                            <p className="mx-5 mb-0">{item.qty}</p>
                            <button className="btn px-3" onClick={() => addItem(item)}>
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                          <p className="text-start text-md-center">
                            <strong><span className="text-muted">{item.qty}</span> x ₹{item.price}</strong>
                          </p>
                        </div>
                      </div>
                      <hr className="my-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})<span>₹{Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping<span>₹{shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <strong>Total amount</strong>
                      <strong>₹{Math.round(subtotal + shipping)}</strong>
                    </li>
                  </ul>
                  <Link to="/checkout" className="btn btn-dark btn-lg btn-block w-100">
                    Go to checkout
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Cart</h1>
        <hr />
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
