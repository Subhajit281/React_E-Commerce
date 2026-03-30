import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Footer } from "../components";

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, paymentMethod } = location.state || {};

  return (
    <>
      <Navbar />
      <div className="container py-5 my-5 text-center">
        <div style={{
          maxWidth: "500px", margin: "0 auto", background: "#fff",
          borderRadius: "20px", padding: "48px 40px",
          boxShadow: "0 8px 40px rgba(194,24,91,0.12)"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🌸</div>
          <h2 style={{ color: "#c2185b", fontWeight: 700 }}>Order Placed!</h2>
          <p className="text-muted mb-4">
            Your order has been received and a detailed invoice has been sent to our team. We'll contact you shortly to confirm delivery!
          </p>

          {orderId && (
            <div style={{ background: "#fdf6fb", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
              <p className="mb-1 text-muted small">Order ID</p>
              <p className="mb-0 fw-bold" style={{ color: "#c2185b", fontSize: "18px" }}>{orderId}</p>
            </div>
          )}

          <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "16px", marginBottom: "28px", textAlign: "left" }}>
            <p className="mb-2 fw-semibold">📧 What happens next?</p>
            <ul className="mb-0 text-muted small" style={{ paddingLeft: "18px" }}>
              <li>You'll receive a confirmation email shortly</li>
              <li>Our team will review your order</li>
              <li>We'll contact you via WhatsApp/Instagram/Email to confirm</li>
              {paymentMethod === "COD" && <li>Pay in cash when your order arrives 🚚</li>}
            </ul>
          </div>

          <Link to="/" className="btn btn-lg w-100"
            style={{ background: "linear-gradient(135deg,#c2185b,#e91e8c)", color: "#fff", border: "none", borderRadius: "10px" }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;
