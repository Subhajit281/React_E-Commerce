import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .fh-footer {
          background: #0f0f0f;
          color: #c8c8c8;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
        }

        .fh-footer-top {
          padding: 64px 0 48px;
          border-bottom: 1px solid #222;
        }

        .fh-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 10px;
        }

        .fh-brand-tagline {
          font-size: 13px;
          font-weight:600;
          color: #7c3aed;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .fh-brand-desc {
          font-size: 16px;
          color: #a7a0a0;
          line-height: 1.8;
          max-width: 260px;
        }

        .fh-footer-heading {
          font-size: 13px;
          font-weight: 500;
          color: #7c3aed;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .fh-footer-link {
          display: block;
          color: #beb7b7;
          text-decoration: none;
          font-size: 15px;
          margin-bottom: 10px;
          transition: color 0.2s ease;
          position: relative;
          width: fit-content;
        }

        .fh-footer-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 1px;
          background: #fff;
          transition: width 0.25s ease;
        }

        .fh-footer-link:hover {
          color: #fff;
        }

        .fh-footer-link:hover::after {
          width: 100%;
        }

        .fh-newsletter-label {
          font-size: 16px;
          color: #b8b4b4;
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .fh-newsletter-form {
          display: flex;
          border: 1px solid #2a2a2a;
          border-radius: 4px;
          overflow: hidden;
          transition: border-color 0.2s;
        }



        .fh-newsletter-input {
          flex: 1;
          background: #fffafa;
          border: 1px solid #7c3aed;
          border-top-left-radius:7px;
          border-bottom-left-radius:7px;
          outline: none;
          padding: 11px 14px;
          font-size: 13px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
        }

        .fh-newsletter-input::placeholder { color: #120d0d; }

        .fh-newsletter-btn {
          background: #7c3aed;
          color: #fff;
          border: none;
          padding: 11px 18px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }

        .fh-newsletter-btn:hover { background: #e0e0e0; }

        .fh-social-row {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .fh-social-btn {
          width: 40px;
          height: 40px;
          border: 1px solid #7c3aed;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9c1c1;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .fa{
          font-size:20px;
        }

        .fh-social-btn:hover {
          border-color: #fff;
          color: #fff;
          background: #1a1a1a;
        }

        .fh-footer-bottom {
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .fh-footer-copy {
          font-size: 13px;
          color: #e0dbdb;
          letter-spacing:1.2px;
        }

        .fh-footer-copy a {
          color: #b0a9a9;
          text-decoration: none;
          transition: color 0.2s;
        }

        .fh-footer-copy a:hover { color: #fff; }

        .fh-footer-legal {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .fh-footer-legal a {
          font-size: 13px;
          color: #cbc1c1;
          text-decoration: none;
          transition: color 0.2s;
        }

        .fh-footer-legal a:hover { color: #fff; }

        .fh-trust-strip {
          background: #161616;
          border-top: 1px solid #1e1e1e;
          border-bottom: 1px solid #222;
          padding: 16px 0;
        }

        .fh-trust-items {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 32px;
        }

        .fh-trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #555;
          letter-spacing: 0.5px;
        }

        .fh-trust-icon { font-size: 15px; }

        .fh-divider {
          width: 1px;
          height: 16px;
          background: #2a2a2a;
        }

        @media (max-width: 768px) {
          .fh-footer-top { padding: 48px 0 32px; }
          .fh-brand-desc { max-width: 100%; }
          .fh-footer-bottom { justify-content: center; text-align: center; }
          .fh-trust-items { gap: 16px; }
          .fh-divider { display: none; }
        }
      `}</style>

      <footer className="fh-footer">

        {/* Trust strip */}
        {/* <div className="fh-trust-strip">
          <div className="container">
            <div className="fh-trust-items">
              <div className="fh-trust-item"><span className="fh-trust-icon">🌸</span> Fresh & Handpicked</div>
              <div className="fh-divider" />
              <div className="fh-trust-item"><span className="fh-trust-icon">🚚</span> Free Delivery over ₹500</div>
              <div className="fh-divider" />
              <div className="fh-trust-item"><span className="fh-trust-icon">🔒</span> Secure Payments</div>
              <div className="fh-divider" />
              <div className="fh-trust-item"><span className="fh-trust-icon">↩️</span> Easy Returns</div>
              <div className="fh-divider" />
              <div className="fh-trust-item"><span className="fh-trust-icon">💬</span> 24/7 Support</div>
            </div>
          </div>
        </div> */}

        {/* Main footer */}
        <div className="fh-footer-top">
          <div className="container">
            <div className="row g-5">

              {/* Brand */}
              <div className="col-12 col-md-4">
                <div className="fh-brand-name"> Floral Heaven</div>
                <div className="fh-brand-tagline">Crafted with nature</div>
                <p className="fh-brand-desc">
                  Bringing the beauty of nature to your doorstep. Every arrangement is handcrafted with love and delivered fresh.
                </p>
                <div className="fh-social-row">
                  <a href="https://www.instagram.com/_epic_18" target="_blank" rel="noreferrer" className="fh-social-btn" title="Instagram">
                    <i className="fa fa-instagram " />
                  </a>
                  {/* <a href="https://github.com/Subhajit281" target="_blank" rel="noreferrer" className="fh-social-btn" title="GitHub">
                    <i className="fa fa-github" />
                  </a> */}
                  <a href={`https://wa.me/916001155729`} target="_blank" rel="noreferrer" className="fh-social-btn" title="WhatsApp">
                    <i className="fa fa-whatsapp" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-6 col-md-2">
                <div className="fh-footer-heading">Shop</div>
                <Link to="/"          className="fh-footer-link">Home</Link>
                <Link to="/product"   className="fh-footer-link">All Products</Link>
                <Link to="/cart"      className="fh-footer-link">Cart</Link>
                <Link to="/checkout"  className="fh-footer-link">Checkout</Link>
              </div>

              {/* Account */}
              <div className="col-6 col-md-2">
                <div className="fh-footer-heading">Account</div>
                <Link to="/dashboard"           className="fh-footer-link">Dashboard</Link>
                <Link to="/dashboard/orders"    className="fh-footer-link">My Orders</Link>
                <Link to="/dashboard/profile"   className="fh-footer-link">Profile</Link>
                <Link to="/dashboard/wishlist"  className="fh-footer-link">Wishlist</Link>
              </div>

              {/* Newsletter */}
              <div className="col-12 col-md-4">
                <div className="fh-footer-heading">Stay in the loop</div>
                <p className="fh-newsletter-label">
                  Get notified about new arrivals, seasonal offers and floral inspiration.
                </p>
                {subscribed ? (
                  <div style={{ fontSize: "13px", color: "#6dbf6d", padding: "12px 0" }}>
                    ✓ You're subscribed! Thanks for joining.
                  </div>
                ) : (
                  <form className="fh-newsletter-form" onSubmit={handleSubscribe}>
                    <input
                      className="fh-newsletter-input"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="fh-newsletter-btn" type="submit">JOIN</button>
                  </form>
                )}

                {/* Contact */}
                <div style={{ marginTop: "24px" }}>
                  <div className="fh-footer-heading">Contact</div>
                  <a href="https://www.instagram.com/floral_heaven02/" target="_blank" rel="noreferrer" className="fh-footer-link">
                    @floral_heaven02 on Instagram
                  </a>
                  <a href={`https://wa.me/916001155729`} target="_blank" rel="noreferrer" className="fh-footer-link">
                    WhatsApp Us
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="container">
          <div className="fh-footer-bottom">
            <div className="fh-footer-copy">
              © {new Date().getFullYear()} Floral Heaven. All Copyrights Reserved
            </div>
            <div className="fh-footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;
