import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BRAND = "Floral Heaven";
const ACCENT = "#7c3aed";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000"; // ✅ added

// ── Logout Confirmation Modal ─────────────────────────────────────────────
const LogoutModal = ({ onConfirm, onCancel }) => (
  <>
    <style>{`
      .fh-logout-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.45);
        z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        animation: fhFadeIn 0.15s ease;
        padding: 16px;
      }
      @keyframes fhFadeIn { from { opacity: 0 } to { opacity: 1 } }
      .fh-logout-modal {
        background: #fff;
        border-radius: 20px;
        padding: 36px 32px 28px;
        max-width: 380px;
        width: 100%;
        box-shadow: 0 24px 60px rgba(124,58,237,0.15);
        text-align: center;
        animation: fhSlideUp 0.2s ease;
      }
      @keyframes fhSlideUp {
        from { transform: translateY(20px); opacity: 0 }
        to   { transform: translateY(0);    opacity: 1 }
      }
      .fh-logout-icon {
        width: 64px; height: 64px; background: #ede9fe;
        border-radius: 50%; display: flex; align-items: center;
        justify-content: center; margin: 0 auto 20px; font-size: 28px;
      }
      .fh-logout-title {
        font-family: 'Playfair Display', serif;
        font-size: 20px; font-weight: 700; color: #111; margin: 0 0 8px;
      }
      .fh-logout-subtitle {
        font-family: 'DM Sans', sans-serif;
        font-size: 13.5px; color: #888; margin: 0 0 28px; line-height: 1.5;
      }
      .fh-logout-actions { display: flex; gap: 10px; }
      .fh-btn-cancel {
        flex: 1; padding: 12px 0; background: #f5f5f5; color: #555;
        border: none; border-radius: 12px; font-size: 14px; font-weight: 600;
        cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s;
      }
      .fh-btn-cancel:hover { background: #ebebeb; }
      .fh-btn-logout-confirm {
        flex: 1; padding: 12px 0; background: #7c3aed; color: #fff;
        border: none; border-radius: 12px; font-size: 14px; font-weight: 600;
        cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.15s;
        box-shadow: 0 4px 14px rgba(124,58,237,0.4);
      }
      .fh-btn-logout-confirm:hover { opacity: 0.88; }
    `}</style>
    <div className="fh-logout-overlay" onClick={onCancel}>
      <div className="fh-logout-modal" onClick={e => e.stopPropagation()}>
        <div className="fh-logout-icon">🥺</div>
        <h2 className="fh-logout-title">Logging out?</h2>
        <p className="fh-logout-subtitle">
          Are you sure you want to log out of your account?<br />
          You'll need to sign in again to access your orders.
        </p>
        <div className="fh-logout-actions">
          <button className="fh-btn-cancel" onClick={onCancel}>Stay</button>
          <button className="fh-btn-logout-confirm" onClick={onConfirm}>Yes, Logout</button>
        </div>
      </div>
    </div>
  </>
);

// ── Main Navbar ───────────────────────────────────────────────────────────
const Navbar = () => {
  const cartItems = useSelector((state) => state.handleCart || []);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ CHANGED: categories now dynamic from your backend
  const [categories, setCategories] = useState([{ value: "all", label: "All" }]);

  // ✅ CHANGED: fetch categories from your backend
  useEffect(() => {
    fetch(`${API_BASE}/api/products/categories`)
      .then((r) => r.json())
      .then((json) => {
        const cats = (json.categories || []).map(c => ({
          value: c,
          label: c.charAt(0).toUpperCase() + c.slice(1),
        }));
        setCategories([{ value: "all", label: "All" }, ...cats]);
      })
      .catch(() => {});
  }, []);

  // ✅ CHANGED: fetch all products from your backend instead of fakestoreapi
  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((r) => r.json())
      .then((json) => setAllProducts(json.products || []))
      .catch(() => {});
  }, []);

  const openSearch = () => {
    setSearchOpen(true);
    setSearchQuery("");
    setSearchResults([]);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  // ✅ CHANGED: filter uses your product fields (_id, images[], subcategory, discountPrice)
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    const timer = setTimeout(() => {
      let results = allProducts;
      if (searchCategory !== "all")
        results = results.filter(p => p.category === searchCategory);
      results = results.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results.slice(0, 6));
      setSearchLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, searchCategory, allProducts]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/product", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/feedback", label: "Feedback" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap');
        :root { --accent: ${ACCENT}; --accent-light: #ede9fe; --nav-height: 68px; }
        .fh-navbar {
          position: sticky; top: 0; z-index: 1000; background: #fff;
          border-bottom: 1px solid #f0f0f0; height: var(--nav-height);
          display: flex; align-items: center; font-family: 'DM Sans', sans-serif;
        }
        .fh-nav-inner {
          width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
        }
        .fh-nav-links {
          display: flex; align-items: center; gap: 28px;
          list-style: none; margin: 0; padding: 0;
        }
        .fh-nav-links a {
          font-size: 13px; font-weight: 500; color: #444; text-decoration: none;
          letter-spacing: 0.3px; transition: color 0.2s; position: relative;
        }
        .fh-nav-links a::after {
          content: ''; position: absolute; bottom: -3px; left: 0;
          width: 0; height: 2px; background: var(--accent);
          transition: width 0.2s; border-radius: 2px;
        }
        .fh-nav-links a:hover, .fh-nav-links a.active { color: var(--accent); }
        .fh-nav-links a:hover::after, .fh-nav-links a.active::after { width: 100%; }
        .fh-brand {
          font-family: 'Playfair Display', serif; font-size: 23px; font-weight: 900;
          color: #732bf0; text-decoration: none; white-space: nowrap;
          letter-spacing: 1px; text-align: center;
        }
        .fh-brand:hover { color: var(--accent); }
        .fh-nav-icons { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
        .fh-icon-btn {
          background: none; border: none; cursor: pointer; width: 38px; height: 38px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #444; transition: background 0.15s, color 0.15s; position: relative; font-size: 17px;
        }
        .fh-icon-btn:hover { background: var(--accent-light); color: var(--accent); }
        .fh-cart-badge {
          position: absolute; top: 2px; right: 2px; width: 17px; height: 17px;
          background: var(--accent); color: #fff; border-radius: 50%;
          font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }
        .fh-user-pill {
          display: flex; align-items: center; gap: 6px; background: var(--accent-light);
          border-radius: 20px; padding: 4px 12px 4px 6px;
          font-size: 12px; font-weight: 500; color: var(--accent); cursor: default;
        }
        .fh-logout-btn {
          background: none; border: none; cursor: pointer; font-size: 12px;
          font-weight: 500; color: #888; padding: 4px 8px;
          border-radius: 6px; transition: background 0.15s;
        }
        .fh-logout-btn:hover { background: #f5f5f5; color: #333; }
        .fh-hamburger {
          display: none; background: none; border: none; cursor: pointer;
          flex-direction: column; gap: 5px; padding: 4px;
        }
        .fh-hamburger span {
          display: block; width: 22px; height: 2px;
          background: #333; border-radius: 2px; transition: all 0.25s;
        }
        .fh-search-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 2000;
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 80px; animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .fh-search-modal {
          background: #fff; border-radius: 16px; width: 100%; max-width: 560px;
          margin: 0 16px; box-shadow: 0 24px 60px rgba(0,0,0,0.18);
          overflow: hidden; animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { transform: translateY(-16px); opacity: 0 }
          to { transform: translateY(0); opacity: 1 }
        }
        .fh-search-header {
          display: flex; align-items: center;
          justify-content: space-between; padding: 20px 20px 0;
        }
        .fh-search-header h5 {
          font-family: 'Playfair Display', serif; font-size: 16px;
          margin: 0; color: #111; letter-spacing: 0.3px;
        }
        .fh-search-close {
          background: none; border: none; cursor: pointer; font-size: 20px;
          color: #888; line-height: 1; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; transition: background 0.15s;
        }
        .fh-search-close:hover { background: #f5f5f5; color: #333; }
        .fh-search-controls { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
        .fh-search-select {
          width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb;
          border-radius: 10px; font-size: 13px; font-family: 'DM Sans', sans-serif;
          color: #444; appearance: none;
          background: #fafafa url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 14px center;
          cursor: pointer; outline: none; transition: border-color 0.15s;
        }
        .fh-search-select:focus { border-color: var(--accent); }
        .fh-search-input-wrap {
          display: flex; align-items: center; border: 1.5px solid #e5e7eb;
          border-radius: 10px; background: #fff; overflow: hidden; transition: border-color 0.15s;
        }
        .fh-search-input-wrap:focus-within { border-color: var(--accent); }
        .fh-search-input {
          flex: 1; border: none; outline: none; padding: 11px 14px;
          font-size: 14px; font-family: 'DM Sans', sans-serif; color: #222; background: transparent;
        }
        .fh-search-icon { padding: 0 14px; color: #aaa; font-size: 16px; }
        .fh-search-results { border-top: 1px solid #f0f0f0; max-height: 340px; overflow-y: auto; }
        .fh-search-result-item {
          display: flex; align-items: center; gap: 12px; padding: 12px 20px;
          cursor: pointer; transition: background 0.12s; color: inherit;
        }
        .fh-search-result-item:hover { background: #faf9ff; }
        .fh-search-result-img {
          width: 48px; height: 48px; object-fit: contain; border-radius: 8px;
          background: #f9f9f9; padding: 4px; flex-shrink: 0;
        }
        .fh-search-result-title { font-size: 13px; font-weight: 500; color: #222; line-height: 1.3; flex: 1; }
        .fh-search-result-price { font-size: 13px; font-weight: 700; color: var(--accent); white-space: nowrap; }
        .fh-search-empty { padding: 24px 20px; text-align: center; color: #aaa; font-size: 13px; }
        .fh-search-footer {
          padding: 12px 20px; border-top: 1px solid #f0f0f0;
          font-size: 12px; color: #aaa; text-align: center;
        }
        .fh-search-footer a { color: var(--accent); text-decoration: none; font-weight: 500; }
        .fh-search-footer a:hover { text-decoration: underline; }
        .fh-mobile-drawer {
          position: fixed; top: var(--nav-height); left: 0; right: 0; background: #fff;
          border-bottom: 1px solid #f0f0f0; padding: 16px 24px 24px; z-index: 999;
          display: flex; flex-direction: column; gap: 4px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08); animation: slideDown 0.2s ease;
        }
        .fh-mobile-link {
          display: block; padding: 10px 0; font-size: 15px; font-weight: 500;
          color: #333; text-decoration: none; border-bottom: 1px solid #f5f5f5;
          font-family: 'DM Sans', sans-serif;
        }
        .fh-mobile-link:hover { color: var(--accent); }
        .fh-mobile-divider { height: 1px; background: #f0f0f0; margin: 8px 0; }
        @media (max-width: 768px) {
          .fh-nav-links { display: none; }
          .fh-hamburger { display: flex; }
          .fh-user-pill span { display: none; }
          .fh-brand { font-size: 18px; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="fh-navbar">
        <div className="fh-nav-inner">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button className="fh-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
              <span /><span /><span />
            </button>
            <ul className="fh-nav-links">
              {navLinks.map(l => (
                <li key={l.to}>
                  <NavLink to={l.to} className={({ isActive }) => isActive ? "active" : ""}>{l.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <NavLink to="/" className="fh-brand">{BRAND}</NavLink>

          <div className="fh-nav-icons">
            <button className="fh-icon-btn" onClick={openSearch} title="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            {!token ? (
              <button className="fh-icon-btn" onClick={() => navigate("/login")} title="Login">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            ) : (
              <>
                <div className="fh-user-pill" title={user?.name}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{user?.name?.split(" ")[0]}</span>
                </div>
                <button className="fh-icon-btn" onClick={() => navigate("/dashboard")} title="Dashboard">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button className="fh-logout-btn" onClick={() => setShowLogoutModal(true)}>
                  Logout
                </button>
              </>
            )}

            <button className="fh-icon-btn" onClick={() => navigate("/cart")} title="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && <span className="fh-cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="fh-mobile-drawer">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} className="fh-mobile-link" onClick={() => setMobileOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <div className="fh-mobile-divider" />
          {!token ? (
            <>
              <NavLink to="/login" className="fh-mobile-link" onClick={() => setMobileOpen(false)}>Login</NavLink>
              <NavLink to="/register" className="fh-mobile-link" onClick={() => setMobileOpen(false)}>Register</NavLink>
            </>
          ) : (
            <button
              className="fh-mobile-link"
              style={{ border: "none", background: "none", textAlign: "left", cursor: "pointer", padding: "10px 0", color: "#e53935" }}
              onClick={() => { setMobileOpen(false); setShowLogoutModal(true); }}
            >
              Logout
            </button>
          )}
        </div>
      )}

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div className="fh-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="fh-search-modal" onClick={e => e.stopPropagation()}>
            <div className="fh-search-header">
              <h5>Search our store</h5>
              <button className="fh-search-close" onClick={() => setSearchOpen(false)}>✕</button>
            </div>
            <div className="fh-search-controls">
              {/* ✅ Now uses dynamic categories from your backend */}
              <select className="fh-search-select" value={searchCategory} onChange={e => setSearchCategory(e.target.value)}>
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <div className="fh-search-input-wrap">
                <span className="fh-search-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input
                  ref={searchInputRef}
                  className="fh-search-input"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Escape") setSearchOpen(false);
                    if (e.key === "Enter" && searchResults.length > 0) {
                      // ✅ uses _id instead of id
                      navigate(`/product/${searchResults[0]._id}`);
                      setSearchOpen(false);
                    }
                  }}
                />
              </div>
            </div>
            <div className="fh-search-results">
              {searchLoading && <div className="fh-search-empty">Searching...</div>}
              {!searchLoading && searchQuery && searchResults.length === 0 && (
                <div className="fh-search-empty">No results for "{searchQuery}"</div>
              )}
              {!searchLoading && searchResults.map(item => (
                <div
                  key={item._id}  
                  className="fh-search-result-item"
                  onClick={() => { navigate(`/product/${item._id}`); setSearchOpen(false); }} 
                >
                  {/* ✅ images[] array instead of image */}
                  <img src={item.images?.[0] || ""} alt={item.title} className="fh-search-result-img" />
                  <span className="fh-search-result-title">
                    {item.title?.length > 50 ? item.title.substring(0, 50) + "..." : item.title}
                  </span>
                  {/* ✅ discountPrice || price */}
                  <span className="fh-search-result-price">₹{item.discountPrice || item.price}</span>
                </div>
              ))}
            </div>
            {searchQuery && searchResults.length > 0 && (
              <div className="fh-search-footer">
                <a href="#" onClick={e => { e.preventDefault(); navigate("/product"); setSearchOpen(false); }}>
                  View all results for "{searchQuery}" →
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ Logout Confirmation Modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;