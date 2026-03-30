import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useParams, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart, buyNow } from "../redux/action";
import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct]               = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading]               = useState(false);
  const [loading2, setLoading2]             = useState(false);
  const [selectedSize, setSelectedSize]     = useState("");
  const [sizeError, setSizeError]           = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      setLoading2(true);
      setSelectedSize("");
      setSizeError(false);

      try {
        const res  = await fetch(`${API_BASE}/api/products/${id}`);
        const data = await res.json();
        if (!mounted) return;

        const prod = data.product;
        setProduct(prod);
        setLoading(false);

        // Fetch similar products in same category
        if (prod?.category) {
          const res2  = await fetch(`${API_BASE}/api/products/category/${prod.category}`);
          const data2 = await res2.json();
          if (mounted) {
            setSimilarProducts((data2.products || []).filter((p) => p._id !== prod._id));
            setLoading2(false);
          }
        }
      } catch {
        if (mounted) { setLoading(false); setLoading2(false); }
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
    return () => { mounted = false; };
  }, [id]);

  const needsSize = product?.requiresSize && product?.sizes?.length > 0;
  const image     = product?.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image";
  const salePrice = product?.discountPrice || product?.price;

  // ── Add to Cart ───────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (needsSize && !selectedSize) {
      setSizeError(true);
      toast.error("Please select a size first");
      return;
    }
    setSizeError(false);
    dispatch(addCart({
      id:           product._id,
      title:        product.title,
      price:        salePrice,
      image,
      category:     product.category,
      requiresSize: product.requiresSize,
      selectedSize: selectedSize || "",
    }));
    toast.success("Added to cart!");
  };

  // ── Buy Now → dispatches to handleBuyNow slice, never touches cart ────────
  const handleBuyNow = () => {
    if (needsSize && !selectedSize) {
      setSizeError(true);
      toast.error("Please select a size first");
      return;
    }
    setSizeError(false);
    dispatch(buyNow({
      id:           product._id,
      title:        product.title,
      price:        salePrice,
      image,
      category:     product.category,
      requiresSize: product.requiresSize,
      selectedSize: selectedSize || "",
      qty:          1,
    }));
    navigate("/checkout?mode=buynow");
  };

  // ── Skeletons ─────────────────────────────────────────────────────────────
  const Loading = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 py-3"><Skeleton height={400} width={400} /></div>
        <div className="col-md-6 py-5">
          <Skeleton height={30} width={250} />
          <Skeleton height={90} />
          <Skeleton height={40} width={70} />
          <Skeleton height={50} width={110} />
          <Skeleton height={120} />
          <Skeleton height={40} width={110} inline />
          <Skeleton className="mx-3" height={40} width={110} />
        </div>
      </div>
    </div>
  );

  const Loading2 = () => (
    <div className="my-4 py-4 d-flex">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="mx-4"><Skeleton height={400} width={250} /></div>
      ))}
    </div>
  );

  // ── Main Product Display ──────────────────────────────────────────────────
  const ShowProduct = () => {
    const totalStock = needsSize
      ? product.sizes.reduce((acc, s) => acc + s.stock, 0)
      : product.stock;

    return (
      <div className="container my-5 py-2">
        <div className="row">
          {/* Image */}
          <div className="col-md-6 col-sm-12 py-3 d-flex align-items-center justify-content-center">
            <img
              className="img-fluid" src={image} alt={product.title}
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>

          {/* Details */}
          <div className="col-md-6 py-5">
            <h6 className="text-uppercase text-muted mb-1" style={{ letterSpacing: "1px", fontSize: "12px" }}>
              {product.subcategory || product.category}
            </h6>
            <h1 className="display-6 mb-2" style={{ fontWeight: 700, lineHeight: 1.3 }}>
              {product.title}
            </h1>

            {/* Price */}
            <div className="d-flex align-items-baseline gap-3 mb-3">
              <h3 style={{ fontWeight: 700, fontSize: "28px", margin: 0 }}>
                ₹{salePrice}
              </h3>
              {product.discountPrice && (
                <span style={{ fontSize: "18px", color: "#aaa", textDecoration: "line-through" }}>
                  ₹{product.price}
                </span>
              )}
              {product.discountPrice && (
                <span style={{ fontSize: "13px", color: "#4caf50", fontWeight: 600 }}>
                  {Math.round(((product.price - salePrice) / product.price) * 100)}% off
                </span>
              )}
            </div>

            <p className="text-muted mb-4" style={{ fontSize: "14px", lineHeight: "1.8" }}>
              {product.description}
            </p>

            {/* Stock indicator for non-sized products */}
            {!needsSize && (
              <p style={{ fontSize: "13px", marginBottom: "16px", color: totalStock > 0 ? "#4caf50" : "#e53935", fontWeight: 600 }}>
                {totalStock > 0 ? `✓ ${totalStock} in stock` : "✗ Out of stock"}
              </p>
            )}

            {/* Size Selector */}
            {needsSize && (
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>
                    Select Size <span style={{ color: "#e53935" }}>*</span>
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {product.sizes.map((sizeObj) => {
                    const isSelected  = selectedSize === sizeObj.label;
                    const outOfStock  = sizeObj.stock === 0;
                    return (
                      <button
                        key={sizeObj.label}
                        disabled={outOfStock}
                        onClick={() => { setSelectedSize(sizeObj.label); setSizeError(false); }}
                        style={{
                          minWidth: "48px", height: "44px", padding: "0 10px",
                          border: isSelected ? "2px solid #111" : "1px solid #ddd",
                          borderRadius: "6px",
                          background: outOfStock ? "#f5f5f5" : isSelected ? "#111" : "#fff",
                          color: outOfStock ? "#ccc" : isSelected ? "#fff" : "#333",
                          fontWeight: isSelected ? 700 : 400,
                          fontSize: "13px", cursor: outOfStock ? "not-allowed" : "pointer",
                          transition: "all 0.15s ease",
                          textDecoration: outOfStock ? "line-through" : "none",
                        }}
                      >
                        {sizeObj.label}
                      </button>
                    );
                  })}
                </div>
                {sizeError && (
                  <p style={{ color: "#e53935", fontSize: "12px", marginTop: "8px" }}>
                    ⚠️ Please select a size to continue
                  </p>
                )}
                {selectedSize && (
                  <p style={{ color: "#4caf50", fontSize: "12px", marginTop: "8px" }}>
                    ✓ Size {selectedSize} selected
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-dark px-4"
                onClick={handleAddToCart}
                disabled={!needsSize && product.stock === 0}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-outline-dark px-4"
                onClick={handleBuyNow}
                disabled={!needsSize && product.stock === 0}
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="d-flex gap-3 mt-4 flex-wrap">
              {["🚚 Free delivery", "↩️ Easy returns", "🔒 Secure payment"].map((b) => (
                <span key={b} style={{ fontSize: "12px", color: "#888" }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Similar Products ──────────────────────────────────────────────────────
  const ShowSimilarProduct = () => (
    <div className="py-4 my-4">
      <div className="d-flex">
        {similarProducts.map((item) => {
          const itemImage    = item.images?.[0] || "https://via.placeholder.com/220x200";
          const itemSale     = item.discountPrice || item.price;
          return (
            <div
              key={item._id}
              className="card mx-4 text-center"
              style={{ minWidth: "220px", cursor: "pointer", transition: "box-shadow 0.2s" }}
              onClick={() => navigate(`/product/${item._id}`)}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <img className="card-img-top p-3" src={itemImage} alt={item.title} height={200} style={{ objectFit: "contain" }} />
              <div className="card-body">
                <h6 className="card-title" style={{ fontSize: "13px" }}>
                  {item.title.substring(0, 30)}...
                </h6>
                <p style={{ fontWeight: 700, fontSize: "14px" }}>₹{itemSale}</p>
              </div>
              <div className="card-body pt-0" onClick={(e) => e.stopPropagation()}>
                {/* Similar products Buy Now → always goes to detail page */}
                <button
                  className="btn btn-dark btn-sm m-1"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  Buy Now
                </button>
                <button
                  className="btn btn-outline-dark btn-sm m-1"
                  onClick={() => {
                    if (item.requiresSize) {
                      toast("Pick your size first!", { icon: "📏" });
                      navigate(`/product/${item._id}`);
                    } else if (item.stock === 0) {
                      toast.error("Out of stock");
                    } else {
                      toast.success("Added to cart!");
                      dispatch(addCart({
                        id: item._id, title: item.title,
                        price: itemSale, image: itemImage,
                        category: item.category, requiresSize: false,
                      }));
                    }
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          {loading ? <Loading /> : product ? <ShowProduct /> : (
            <div className="col-12 text-center py-5">
              <h4 className="text-muted">Product not found.</h4>
            </div>
          )}
        </div>
        {similarProducts.length > 0 && (
          <div className="row my-5 py-5">
            <div className="d-none d-md-block">
              <h2 className="mb-3">You may also like</h2>
              <Marquee pauseOnHover pauseOnClick speed={50}>
                {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
              </Marquee>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Product;