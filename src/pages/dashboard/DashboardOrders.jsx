import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const statusColors = {
  placed:    { bg: "#e3f2fd", color: "#1565c0" },
  confirmed: { bg: "#e8f5e9", color: "#2e7d32" },
  shipped:   { bg: "#fff8e1", color: "#f57f17" },
  delivered: { bg: "#e8f5e9", color: "#1b5e20" },
  cancelled: { bg: "#fce4ec", color: "#c62828" },
};

const DashboardOrders = () => {
  const { token } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/payment/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setOrders(data.orders);
        else setError("Failed to load orders.");
      } catch { setError("Could not connect to server."); }
      finally { setLoading(false); }
    };
    if (token) fetchOrders();
  }, [token]);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "24px", color: "#111", margin: 0 }}>Orders</h2>
        <p style={{ color: "#999", fontSize: "14px", marginTop: "4px" }}>Your complete order history</p>
      </div>

      {loading && <div className="dash-card text-center py-5"><div className="spinner-border text-dark"></div><p className="mt-3 text-muted small">Loading orders...</p></div>}
      {error && <div className="dash-card"><div className="empty-state"><div className="empty-icon">⚠️</div><div style={{ color: "#c62828", fontWeight: 600 }}>{error}</div></div></div>}

      {!loading && !error && orders.length === 0 && (
        <div className="dash-card">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div style={{ fontWeight: 600, fontSize: "15px", color: "#111", marginBottom: "8px" }}>No orders yet</div>
            <div className="empty-text" style={{ marginBottom: "20px" }}>When you place orders, they'll show up here.</div>
            <Link to="/" className="dash-btn dash-btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Start Shopping →</Link>
          </div>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => {
            const s = statusColors[order.orderStatus] || statusColors.placed;
            return (
              <div key={order._id} className="dash-card">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px", color: "#111" }}>Order #{order.orderId}</div>
                    <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ background: s.bg, color: s.color, padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                    <span style={{ background: order.paymentStatus === "paid" ? "#e8f5e9" : "#fff8e1", color: order.paymentStatus === "paid" ? "#2e7d32" : "#f57f17", padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                      {order.paymentMethod} · {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #f5f5f5", paddingTop: "12px", marginBottom: "12px" }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13px" }}>
                      <span style={{ color: "#333" }}>
                        {item.title?.length > 40 ? item.title.substring(0, 40) + "..." : item.title}
                        {item.selectedSize && <span style={{ background: "#f0f0f0", borderRadius: "4px", padding: "1px 6px", fontSize: "11px", marginLeft: "6px" }}>{item.selectedSize}</span>}
                        <span style={{ color: "#999", marginLeft: "4px" }}>×{item.qty}</span>
                      </span>
                      <span style={{ fontWeight: 600, color: "#111" }}>₹{Math.round(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #f5f5f5", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ fontSize: "12px", color: "#999", maxWidth: "300px" }}>📍 {order.address}</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "12px", color: "#999" }}>Total</div>
                    <div style={{ fontWeight: 700, fontSize: "18px", color: "#111" }}>₹{Math.round(order.totalAmount)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardOrders;
