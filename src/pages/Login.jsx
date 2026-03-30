import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localCart = useSelector((state) => state.handleCart || []);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

    useEffect(() => {
  const token = localStorage.getItem("token");
    if (token) navigate("/", { replace: true });
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  // ── Sync localStorage cart → DB after login ──────────────────────────────
  const syncCartToDB = async (token) => {
    try {
      const localItems = localCart.map((item) => ({
        productId:    String(item.id || item.productId),
        title:        item.title,
        price:        item.price,
        image:        item.image || "",
        category:     item.category || "",
        selectedSize: item.selectedSize || "",
        qty:          item.qty,
      }));

      const res = await axios.post(
        `${API_BASE}/api/cart/sync`,
        { localItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        dispatch({ type: "SYNC_CART_FROM_DB", payload: res.data.items });
      }
    } catch (err) {
      console.warn("Cart sync failed (non-critical):", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Sync cart to DB right after login
      await syncCartToDB(res.data.token);

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="my-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" placeholder="name@example.com" value={email} onChange={handleChange} required />
              </div>
              <div className="my-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={handleChange} required />
              </div>
              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link></p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
