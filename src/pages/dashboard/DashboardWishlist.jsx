import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const WISH_KEY = "fh_wishlist";

const DashboardWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
    setWishlist(saved);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem(WISH_KEY, JSON.stringify(updated));
  };

  const moveToCart = (item) => {
    dispatch({ type: "ADDITEM", payload: item });
    removeFromWishlist(item.id);
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "24px", color: "#111", margin: 0 }}>Wishlist</h2>
        <p style={{ color: "#999", fontSize: "14px", marginTop: "4px" }}>
          {wishlist.length > 0 ? `${wishlist.length} saved item${wishlist.length > 1 ? "s" : ""}` : "Items you've saved for later"}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="dash-card">
          <div className="empty-state">
            <div className="empty-icon">♡</div>
            <div style={{ fontWeight: 600, fontSize: "15px", color: "#111", marginBottom: "8px" }}>Your wishlist is empty</div>
            <div className="empty-text" style={{ marginBottom: "20px" }}>
              Save items you love while browsing — they'll appear here.
            </div>
            <Link to="/" className="dash-btn dash-btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
              Browse Products →
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {wishlist.map((item) => (
            <div className="col-12 col-sm-6 col-lg-4" key={item.id}>
              <div className="dash-card" style={{ padding: "0", overflow: "hidden" }}>
                <div style={{
                  height: "160px", overflow: "hidden", background: "#f5f5f5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.target.style.display = "none"; }}
                  />
                </div>
                <div style={{ padding: "16px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "4px", lineHeight: "1.4" }}>
                    {item.title?.length > 45 ? item.title.slice(0, 45) + "..." : item.title}
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#111", marginBottom: "12px" }}>
                    ₹{Math.round(item.price)}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="dash-btn dash-btn-primary"
                      style={{ flex: 1, fontSize: "12px", padding: "8px" }}
                      onClick={() => moveToCart(item)}
                    >
                      Move to Cart
                    </button>
                    <button
                      className="dash-btn dash-btn-outline"
                      style={{ fontSize: "12px", padding: "8px 12px" }}
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: "12px", color: "#ccc", textAlign: "center", marginTop: "24px" }}>
        💡 Tip: Click the ♡ icon on any product to save it to your wishlist
      </p>
    </div>
  );
};

export default DashboardWishlist;
