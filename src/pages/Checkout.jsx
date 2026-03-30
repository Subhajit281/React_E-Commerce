import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, clearBuyNow } from "../redux/action";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Checkout = () => {
  const cartItems  = useSelector((s) => s.handleCart  ?? []);
  const buyNowItem = useSelector((s) => s.handleBuyNow ?? null);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const [searchParams] = useSearchParams();

  const isBuyNow = searchParams.get("mode") === "buynow" && buyNowItem;
  const state    = isBuyNow
    ? [{ ...buyNowItem, qty: buyNowItem.qty || 1 }]
    : (cartItems ?? []);

  // ── Detect logged-in user ──────────────────────────────────────────────────
  const token        = localStorage.getItem("token");
  const isLoggedIn   = !!token;
  const storedUser   = JSON.parse(localStorage.getItem("user") || "null");

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading]             = useState(false);
  const [formData, setFormData]           = useState({
    firstName: storedUser?.name?.split(" ")[0] || "",
    lastName:  storedUser?.name?.split(" ").slice(1).join(" ") || "",
    // email is intentionally NOT pre-filled from localStorage —
    // it will be fetched fresh from DB on the backend for logged-in users
    email:     "",
    mobile:    "",
    address:   "",
    address2:  "",
    country:   "",
    state:     "",
    zip:       "",
  });
  const [errors, setErrors] = useState({});

  const subtotal   = state.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping   = 30;
  const total      = subtotal + shipping;
  const totalItems = state.reduce((acc, item) => acc + item.qty, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const validateForm = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required.";
    if (!formData.lastName.trim())  e.lastName  = "Last name is required.";

    // Only validate email for guests — logged-in users get it from DB
    if (!isLoggedIn) {
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
        e.email = "Valid email is required.";
    }

    if (!formData.mobile.trim())
      e.mobile = "Mobile number is required.";
    else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim()))
      e.mobile = "Enter a valid 10-digit Indian mobile number.";
    if (!formData.address.trim()) e.address = "Address is required.";
    if (!formData.country)        e.country = "Please select a country.";
    if (!formData.state)          e.state   = "Please select a state.";
    if (!formData.zip.trim())     e.zip     = "Zip code is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearUsedItems = () => {
    if (isBuyNow) dispatch(clearBuyNow());
    else dispatch(clearCart());
  };

  const buildAddress = () =>
    `${formData.address}${formData.address2 ? ", " + formData.address2 : ""}, ${formData.state}, ${formData.country} - ${formData.zip}`;

  const buildCustomer = () => ({
    name:   `${formData.firstName} ${formData.lastName}`.trim(),
    mobile: formData.mobile.trim(),
    email:  isLoggedIn ? (storedUser?.email || '') : formData.email.trim(),
  });

  const getAuthHeader = () => token ? { Authorization: `Bearer ${token}` } : {};

  const handleCodSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/cod-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({
          items: state,
          address: buildAddress(),
          totalAmount: Math.round(total),
          customer: buildCustomer(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        clearUsedItems();
        navigate("/order-success", { state: { orderId: data.orderId, paymentMethod: "COD" } });
      } else {
        alert("❌ Failed to place order.");
      }
    } catch { alert("❌ Server error."); }
    finally { setLoading(false); }
  };

  const handleRazorpaySubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const orderRes  = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ amount: Math.round(total) }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) { alert("❌ Could not initiate payment."); setLoading(false); return; }

      const options = {
        key:         process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount:      orderData.amount,
        currency:    orderData.currency,
        name:        "Floral Heaven",
        description: "Order Payment",
        order_id:    orderData.orderId,
        prefill: {
          name:    buildCustomer().name,
          email:   isLoggedIn ? (storedUser?.email || "") : formData.email,
          contact: `+91${formData.mobile}`,
        },
        theme: { color: "#c2185b" },
        handler: async (response) => {
          const verifyRes  = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getAuthHeader() },
            body: JSON.stringify({
              ...response,
              orderMeta: {
                items: state,
                address: buildAddress(),
                totalAmount: Math.round(total),
                customer: buildCustomer(),
              },
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearUsedItems();
            navigate("/order-success", { state: { orderId: verifyData.orderId, paymentMethod: "UPI" } });
          } else { alert("❌ Payment verification failed."); }
        },
        modal: { ondismiss: () => setLoading(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r) => { alert(`❌ ${r.error.description}`); setLoading(false); });
      rzp.open();
    } catch { alert("❌ Server error."); setLoading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    paymentMethod === "cod" ? handleCodSubmit() : handleRazorpaySubmit();
  };

  if (!state.length) {
    return (
      <>
        <Navbar />
        <div className="container my-3 py-3">
          <h1 className="text-center">Checkout</h1><hr />
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>

        {/* Logged-in trust badge */}
        {isLoggedIn && (
          <div className="alert text-center py-2 mb-0" style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: "14px", borderRadius: "8px" }}>
             Logged in as <strong>{storedUser?.name}</strong> — your verified email will be used for the invoice automatically.
          </div>
        )}

        {/* {isBuyNow && (
          <div className="alert alert-info text-center py-2 mb-0" style={{ fontSize: "14px" }}>
           You're checking out a single item directly. Your cart is untouched.
          </div>
        )} */}
        <hr />

        <div className="container py-3">
          <div className="row my-4">

            {/* RIGHT: Summary + Payment */}
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4 shadow-sm">
                <div className="card-header py-3 bg-dark text-white"><h5 className="mb-0">🛒 Order Summary</h5></div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {state.map((item) => (
                      <li key={`${item.id}-${item.selectedSize || "nosize"}`} className="list-group-item px-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <span style={{ fontSize: "13px" }}>{item.title?.substring(0, 22)}...</span>
                            <span className="badge bg-secondary ms-1">x{item.qty}</span>
                            {item.selectedSize && <span className="badge bg-dark ms-1">Size: {item.selectedSize}</span>}
                          </div>
                          <span>₹{Math.round(item.price * item.qty)}</span>
                        </div>
                      </li>
                    ))}
                    <li className="list-group-item d-flex justify-content-between px-0">Products ({totalItems})<span>₹{Math.round(subtotal)}</span></li>
                    <li className="list-group-item d-flex justify-content-between px-0">Shipping<span>₹{shipping}</span></li>
                    <li className="list-group-item d-flex justify-content-between border-0 px-0 mb-3"><strong>Total</strong><strong>₹{Math.round(total)}</strong></li>
                  </ul>
                </div>
              </div>

              <div className="card mb-4 shadow-sm">
                <div className="card-header py-3 bg-dark text-white"><h5 className="mb-0">💳 Payment Method</h5></div>
                <div className="card-body d-flex flex-column gap-3">
                  {[
                    { id: "cod", label: " Cash on Delivery", desc: "Pay when your order arrives" },
                    { id: "upi", label: " UPI / Card (Razorpay)", desc: "UPI, Debit/Credit, Net Banking" },
                  ].map((pm) => (
                    <div key={pm.id}
                      className={`border rounded p-3 d-flex align-items-center gap-3 ${paymentMethod === pm.id ? "border-dark bg-light" : ""}`}
                      style={{ cursor: "pointer" }} onClick={() => setPaymentMethod(pm.id)}>
                      <input type="radio" name="pm" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} />
                      <label style={{ cursor: "pointer", marginBottom: 0 }}>
                        <strong>{pm.label}</strong>
                        <div className="text-muted small">{pm.desc}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card mb-4 border-0 shadow-sm"
                style={{ background: "linear-gradient(135deg,#fff0f6,#fce4ec)", borderLeft: "4px solid #c2185b" }}>
                <div className="card-body py-3">
                  <p className="mb-1 fw-semibold" style={{ color: "#c2185b" }}> How it works</p>
                  <p className="mb-0 text-muted small">
                    {isLoggedIn
                      ? "Your registered & verified email is used automatically - An order confirmation mail will be send to you with our contact details."
                      : "A locked invoice is instantly emailed to our team. You'll also get a confirmation email."}
                  </p>
                </div>
              </div>
            </div>

            {/* LEFT: Billing Form */}
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4 shadow-sm">
                <div className="card-header py-3"><h4 className="mb-0">Billing Details</h4></div>
                <div className="card-body">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row g-3">

                      <div className="col-sm-6 my-1">
                        <label htmlFor="firstName" className="form-label">First name</label>
                        <input type="text" className={`form-control ${errors.firstName ? "is-invalid" : ""}`} id="firstName" value={formData.firstName} onChange={handleChange} />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                      <div className="col-sm-6 my-1">
                        <label htmlFor="lastName" className="form-label">Last name</label>
                        <input type="text" className={`form-control ${errors.lastName ? "is-invalid" : ""}`} id="lastName" value={formData.lastName} onChange={handleChange} />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>

                      {/* ── Email: hidden for logged-in, shown for guests ── */}
                      {isLoggedIn ? (
                        <div className="col-12 my-1">
                          <label className="form-label">Email</label>
                          <div className="input-group">
                            <span className="input-group-text">🔐</span>
                            <input
                              type="email"
                              className="form-control"
                              value={storedUser?.email || ""}
                              disabled
                              style={{ background: "#f5f5f5", color: "#666", cursor: "not-allowed" }}
                            />
                          </div>
                          <div className="form-text text-success"> Verified email from your account — used automatically</div>
                        </div>
                      ) : (
                        <div className="col-12 my-1">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} id="email"
                            placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          <div className="form-text text-warning">⚠️ <Link to="/login">Login</Link> for a more secure checkout experience.</div>
                        </div>
                      )}

                      {/* Mobile */}
                      <div className="col-12 my-1">
                        <label htmlFor="mobile" className="form-label">
                          Mobile Number <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">🇮🇳 +91</span>
                          <input
                            type="tel"
                            className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                            id="mobile"
                            placeholder="10-digit mobile number"
                            value={formData.mobile}
                            maxLength={10}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setFormData({ ...formData, mobile: val });
                              setErrors({ ...errors, mobile: "" });
                            }}
                          />
                          {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                        </div>
                      </div>

                      <div className="col-12 my-1">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" className={`form-control ${errors.address ? "is-invalid" : ""}`} id="address"
                          placeholder="1234 Main St" value={formData.address} onChange={handleChange} />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </div>

                      <div className="col-12">
                        <label htmlFor="address2" className="form-label">Address 2 <span className="text-muted">(Optional)</span></label>
                        <input type="text" className="form-control" id="address2" placeholder="Apartment or suite"
                          value={formData.address2} onChange={handleChange} />
                      </div>

                      <div className="col-md-5 my-1">
                        <label htmlFor="country" className="form-label">Country</label>
                        <select className={`form-select ${errors.country ? "is-invalid" : ""}`} id="country"
                          value={formData.country} onChange={handleChange}>
                          <option value="">Choose...</option>
                          <option value="India">India</option>
                        </select>
                        {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                      </div>

                      <div className="col-md-4 my-1">
                        <label htmlFor="state" className="form-label">State</label>
                        <select className={`form-select ${errors.state ? "is-invalid" : ""}`} id="state"
                          value={formData.state} onChange={handleChange}>
                          <option value="">Choose...</option>
                          {["Assam","Punjab","Maharashtra","Delhi","Karnataka","Tamil Nadu","West Bengal","Rajasthan","Gujarat","Uttar Pradesh","Kerala","Bihar"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                      </div>

                      <div className="col-md-3 my-1">
                        <label htmlFor="zip" className="form-label">Zip</label>
                        <input type="text" className={`form-control ${errors.zip ? "is-invalid" : ""}`} id="zip"
                          value={formData.zip} onChange={handleChange} />
                        {errors.zip && <div className="invalid-feedback">{errors.zip}</div>}
                      </div>

                    </div>
                    <hr className="my-4" />
                    <button className="w-100 btn btn-lg" type="submit" disabled={loading}
                      style={{ background: "linear-gradient(135deg,#c2185b,#e91e8c)", color: "#fff", border: "none", borderRadius: "10px" }}>
                      {loading
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                        : paymentMethod === "cod" ? " Place Order & Send Invoice" : " Pay with Razorpay"}
                    </button>
                    <p className="text-muted text-center small mt-3">
                      {paymentMethod === "upi" ? " Secure payment via Razorpay" : " Invoice emailed to our team instantly"}
                    </p>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;