import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import {toast} from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";



const initialForm = { name: "", email: "", message: "" };

const FeedbackPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    return newErrors;
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      toast.success(data.message || "Feedback submitted successfully!");
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      toast.error(err.message || "Failed to send feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Feedback</h1>
        <p className="text-center text-muted">
          We'd love to hear from you. Share your thoughts with us!
        </p>
        <hr />

        <div className="row my-4 h-100">
          <div className="col-md-5 col-lg-4 col-sm-10 mx-auto">
            <form onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Message */}
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={5}
                  className={`form-control ${errors.message ? "is-invalid" : ""}`}
                  id="message"
                  name="message"
                  placeholder="Enter your message (min. 10 characters)"
                  value={form.message}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.message && (
                  <div className="invalid-feedback">{errors.message}</div>
                )}
                {/* Character hint */}
                <div className="form-text text-end">
                  {form.message.length} / 10 min
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-dark px-5 my-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Sending...
                    </>
                  ) : (
                    "Send Feedback"
                  )}
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

export default FeedbackPage;
