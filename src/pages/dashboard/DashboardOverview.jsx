import React from "react";
import { useOutletContext, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardOverview = () => {
  const { user } = useOutletContext();
  const cartItems = useSelector((s) => s.handleCart ?? []); // ← FIXED: .cart
  const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const quickLinks = [
    { to: "/dashboard/orders", label: "View Orders", desc: "Track your order history" },
    { to: "/dashboard/profile", label: "Edit Profile", desc: "Update your info & photo" },
    { to: "/dashboard/address", label: "Addresses", desc: "Manage delivery addresses" },

  ];

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: "#111", margin: 0 }}>
          {greeting()}, {user?.name?.split(" ")[0]} 
        </h1>
        <p style={{ color: "#999", fontSize: "14px", marginTop: "6px" }}>
          Here's what's happening with your account
        </p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Orders", value: "0", icon: "📦" },
          { label: "Wishlist Items", value: "0", icon: "♡" },
          { label: "Cart Items", value: cartCount, icon: "🛒" },
        ].map((s) => (
          <div className="col-12 col-sm-4" key={s.label}>
            <div className="stat-card">
              <div style={{ fontSize: "20px", marginBottom: "8px" }}>{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile card */}
      <div className="dash-card mb-4">
        <div className="dash-card-title">Profile</div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "#111", color: "#fff", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: "20px", fontWeight: 700, overflow: "hidden", flexShrink: 0,
          }}>
            {user?.profilePic
              ? <img src={user.profilePic} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : (user?.name?.[0] || "U").toUpperCase()
            }
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "15px", color: "#111" }}>{user?.name}</div>
            <div style={{ fontSize: "13px", color: "#999" }}>{user?.email}</div>
            <Link to="/dashboard/profile" style={{ fontSize: "12px", color: "#111", fontWeight: 600, textDecoration: "underline", marginTop: "4px", display: "inline-block" }}>
              Edit profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="dash-card">
        <div className="dash-card-title">Quick Actions</div>
        <div className="row g-3">
          {quickLinks.map((q) => (
            <div className="col-12 col-sm-6" key={q.to}>
              <Link to={q.to} style={{ textDecoration: "none" }}>
                <div style={{
                  border: "1px solid #ebebeb", borderRadius: "10px", padding: "16px",
                  display: "flex", alignItems: "center", gap: "12px",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  cursor: "pointer",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#111"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#ebebeb"}
                >
                  <span style={{ fontSize: "22px" }}>{q.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#111" }}>{q.label}</div>
                    <div style={{ fontSize: "12px", color: "#999" }}>{q.desc}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
