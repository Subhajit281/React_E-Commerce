import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

// ─── Shared hook for user data ────────────────────────────────────────────────
export const useAuth = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return { token, user };
};

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const navItems = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/orders", label: "Orders"  },
  { to: "/dashboard/profile", label: "Profile"  },
  { to: "/dashboard/address", label: "Address"  },
  { to: "/dashboard/wishlist", label: "Wishlist" },
  { to: "/dashboard/settings", label: "Settings"},
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

        .dash-root { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #f5f5f5; }

        /* Sidebar */
        .dash-sidebar {
          width: 240px; min-height: 100vh; background: #fff;
          border-right: 1px solid #ebebeb; display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0; z-index: 100;
          transition: transform 0.3s ease;
        }
        .dash-sidebar.closed { transform: translateX(-100%); }

        .dash-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 20px; padding: 28px 24px 20px;
          border-bottom: 1px solid #f0f0f0; letter-spacing: -0.3px;
        }

        .dash-nav { padding: 16px 12px; flex: 1; }

        .dash-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 8px; margin-bottom: 2px;
          color: #666; text-decoration: none; font-size: 14px; font-weight: 500;
          transition: all 0.15s ease;
        }
        .dash-nav-item:hover { background: #f5f5f5; color: #111; }
        .dash-nav-item.active { background: #111; color: #fff; }
        .dash-nav-icon { font-size: 15px; width: 20px; text-align: center; }

        .dash-user-box {
          padding: 16px; border-top: 1px solid #f0f0f0;
          display: flex; align-items: center; gap: 10px;
        }
        .dash-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: #111; color: #fff; display: flex; align-items: center;
          justify-content: center; font-size: 13px; font-weight: 600;
          overflow: hidden; flex-shrink: 0;
        }
        .dash-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .dash-user-name { font-size: 13px; font-weight: 600; color: #111; }
        .dash-user-email { font-size: 11px; color: #999; }

        .dash-logout-btn {
          background: none; border: none; font-size: 12px; color: #999;
          cursor: pointer; padding: 0; margin-top: 2px; text-align: left;
        }
        .dash-logout-btn:hover { color: #111; }

        /* Main */
        .dash-main { margin-left: 240px; min-height: 100vh; }

        /* Topbar */
        .dash-topbar {
          background: #fff; border-bottom: 1px solid #ebebeb;
          padding: 0 32px; height: 60px; display: flex; align-items: center;
          justify-content: space-between; position: sticky; top: 0; z-index: 50;
        }
        .dash-topbar-title { font-size: 15px; font-weight: 600; color: #111; }
        .dash-hamburger { display: none; background: none; border: none; font-size: 20px; cursor: pointer; }

        .dash-content { padding: 32px; }

        /* Cards */
        .dash-card {
          background: #fff; border-radius: 12px; border: 1px solid #ebebeb;
          padding: 24px;
        }
        .dash-card-title { font-size: 13px; font-weight: 600; color: #111; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px; }

        /* Stat cards */
        .stat-card {
          background: #fff; border-radius: 12px; border: 1px solid #ebebeb;
          padding: 20px 24px;
        }
        .stat-label { font-size: 12px; color: #999; font-weight: 500; margin-bottom: 6px; }
        .stat-value { font-size: 28px; font-weight: 700; color: #111; font-family: 'DM Serif Display', serif; }

        /* Form */
        .dash-input {
          width: 100%; padding: 10px 14px; border: 1px solid #e0e0e0;
          border-radius: 8px; font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.15s;
          background: #fafafa;
        }
        .dash-input:focus { border-color: #111; background: #fff; }
        .dash-label { font-size: 12px; font-weight: 600; color: #555; margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: 0.4px; }

        .dash-btn {
          padding: 10px 20px; border-radius: 8px; font-size: 14px;
          font-weight: 600; cursor: pointer; border: none;
          font-family: 'DM Sans', sans-serif; transition: all 0.15s;
        }
        .dash-btn-primary { background: #111; color: #fff; }
        .dash-btn-primary:hover { background: #333; }
        .dash-btn-primary:disabled { background: #ccc; cursor: not-allowed; }
        .dash-btn-outline { background: #fff; color: #111; border: 1px solid #ddd; }
        .dash-btn-outline:hover { border-color: #111; }
        .dash-btn-danger { background: #fff; color: #e53935; border: 1px solid #e53935; }
        .dash-btn-danger:hover { background: #e53935; color: #fff; }

        /* Toast */
        .dash-toast {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          background: #111; color: #fff; padding: 12px 20px;
          border-radius: 10px; font-size: 13px; font-weight: 500;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          animation: slideUp 0.3s ease;
        }
        .dash-toast.success { background: #111; }
        .dash-toast.error { background: #c62828; }

        @keyframes slideUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }

        /* Empty state */
        .empty-state { text-align: center; padding: 48px 24px; color: #999; }
        .empty-icon { font-size: 40px; margin-bottom: 12px; }
        .empty-text { font-size: 14px; }

        /* Responsive */
        @media (max-width: 768px) {
          .dash-sidebar { transform: translateX(-100%); }
          .dash-sidebar.open { transform: translateX(0); }
          .dash-main { margin-left: 0; }
          .dash-hamburger { display: block; }
          .dash-content { padding: 20px 16px; }
        }
      `}</style>

      <div className="dash-root">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 99 }}
          />
        )}

        {/* Sidebar */}
        <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="dash-logo">🌸 Floral Heaven</div>

          <nav className="dash-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `dash-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="dash-nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="dash-user-box">
            <div className="dash-avatar">
              {user?.profilePic
                ? <img src={user.profilePic} alt="avatar" />
                : (user?.name?.[0] || "U").toUpperCase()
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="dash-user-name" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
              <div className="dash-user-email" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
              <button className="dash-logout-btn" onClick={handleLogout}>Sign out →</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="dash-main">
          <div className="dash-topbar">
            <button className="dash-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <span className="dash-topbar-title">My Account</span>
            <span style={{ fontSize: "13px", color: "#999" }}>{user?.name}</span>
          </div>
          <div className="dash-content">
            <Outlet context={{ user, token, BACKEND_URL }} />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
