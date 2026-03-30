import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Navbar, Footer } from "../components";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const ACCENT = "#7c3aed";

const discountPercent = (original, sale) =>
  Math.round(((original - sale) / original) * 100);

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_BASE}/api/products`),
          fetch(`${API_BASE}/api/products/categories`),
        ]);
        const prodJson = await prodRes.json();
        const catJson  = await catRes.json();
        if (mounted) {
          const prods = prodJson.products || [];
          setData(prods);
          setFilter(prods);
          setCategories(catJson.categories || []);
        }
      } catch {
        toast.error("Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  const handleFilter = (label, fn) => {
    setActiveFilter(label);
    setFilter(fn());
  };

  const Loading = () => (
    <>
      <div className="col-12 py-5 text-center"><Skeleton height={40} width={560} /></div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="col-md-4 col-sm-6 col-12 mb-4">
          <Skeleton height={480} borderRadius={16} />
        </div>
      ))}
    </>
  );

  const ShowProducts = () => (
    <>
      {/* Filter Buttons */}
      <div className="col-12">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", padding: "24px 0 32px" }}>
          {[
            { label: "All", fn: () => data },
            ...categories.map((cat) => ({
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
              fn: () => data.filter((p) => p.category === cat),
            })),
          ].map(({ label, fn }) => {
            const isActive = activeFilter === label;
            return (
              <button key={label} onClick={() => handleFilter(label, fn)}
                style={{
                  padding: "7px 18px", borderRadius: "30px",
                  border: isActive ? "none" : "1.5px solid #e0e0e0",
                  background: isActive ? ACCENT : "#fff",
                  color: isActive ? "#fff" : "#555",
                  fontSize: "13px", fontWeight: isActive ? 600 : 400,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                  boxShadow: isActive ? `0 4px 12px ${ACCENT}40` : "none",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {filter.length === 0 && (
        <div className="col-12 text-center py-5 text-muted">No products found.</div>
      )}

      {filter.map((product) => {
        const salePrice     = product.discountPrice || product.price;
        const originalPrice = product.price;
        const discount      = product.discountPrice ? discountPercent(originalPrice, salePrice) : null;
        const image         = product.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image";
        const inStock       = product.stock > 0;

        return (
          <div key={product._id} className="col-md-4 col-sm-6 col-12 mb-4">
            <div
              style={{
                background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0",
                overflow: "hidden", cursor: "pointer",
                transition: "box-shadow 0.22s, transform 0.22s",
                position: "relative", display: "flex", flexDirection: "column",
                height: "100%", fontFamily: "'DM Sans', sans-serif",
              }}
              onClick={() => navigate(`/product/${product._id}`)}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,58,237,0.13)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {/* Discount Badge */}
              {discount && (
                <div style={{
                  position: "absolute", top: "12px", right: "12px", zIndex: 2,
                  width: "48px", height: "48px", background: ACCENT, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "11px", fontWeight: 700,
                  boxShadow: `0 4px 12px ${ACCENT}60`,
                }}>
                  -{discount}%
                </div>
              )}

              {/* Handmade badge */}
              <div style={{
                position: "absolute", top: "12px", left: "12px", zIndex: 2,
                background: "#fff8f0", color: "#c2610c",
                fontSize: "10px", fontWeight: 600, padding: "3px 8px",
                borderRadius: "20px", border: "1px solid #fde8cc",
              }}>
                ✦ Handmade
              </div>

              {/* Image */}
              <div style={{ background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 24px", height: "220px" }}>
                <img src={image} alt={product.title} style={{ maxHeight: "170px", maxWidth: "100%", objectFit: "contain" }} />
              </div>

              {/* Body */}
              <div style={{ padding: "16px 16px 8px", flex: 1 }}>
                <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: ACCENT }}>
                  {product.subcategory || product.category}
                </span>
                <p style={{ fontSize: "13.5px", fontWeight: 600, color: "#1a1a1a", lineHeight: "1.45", margin: "6px 0 10px" }}>
                  {product.title.length > 52 ? product.title.substring(0, 52) + "..." : product.title}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#111" }}>₹{salePrice}</span>
                  {product.discountPrice && (
                    <span style={{ fontSize: "13px", color: "#aaa", textDecoration: "line-through" }}>₹{originalPrice}</span>
                  )}
                </div>
                <p style={{ fontSize: "11px", margin: "6px 0 0", color: inStock ? "#4caf50" : "#e53935", fontWeight: 500 }}>
                  {inStock ? `✓ In stock` : "✗ Out of stock"}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ padding: "8px 16px 16px", display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                <button
                  style={{ flex: 1, padding: "9px 0", background: ACCENT, color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 8px ${ACCENT}40` }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  Buy Now
                </button>
                <button
                  style={{ flex: 1, padding: "9px 0", background: "#fff", color: inStock ? ACCENT : "#ccc", border: `1.5px solid ${inStock ? ACCENT : "#eee"}`, borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: inStock ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={(e) => { if (inStock) e.currentTarget.style.background = "#ede9fe"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
                  disabled={!inStock}
                  onClick={() => {
                    if (!inStock) { toast.error("Out of stock"); return; }
                    toast.success("Added to cart!");
                    dispatch(addCart({ id: product._id, title: product.title, price: salePrice, image, category: product.category, requiresSize: false }));
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <>
      <Navbar />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, color: "#111", marginBottom: "4px" }}>
              Our Collection
            </h2>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: 0 }}>
              Handcrafted with love — Indian ethnic jewellery & accessories
            </p>
            <div style={{ width: "40px", height: "3px", background: ACCENT, borderRadius: "2px", margin: "12px auto 0" }} />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;