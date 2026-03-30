import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { name, email, password } = formData;

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.id === "email") {
      setOtpSent(false); setOtpVerified(false); setOtp(""); setResendTimer(0);
    }
  };

  const handleSendOtp = async () => {
    if (!email) return alert("Enter email first");
    try {
      setOtpLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/send-otp`, { email });
      alert(res.data.message);
      setOtpSent(true);
      setResendTimer(60);
    } catch (err) {
      alert(err.response?.data?.message || "OTP failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      setVerifyLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/verify-otp`, { email, otp });
      alert(res.data.message);
      setOtpVerified(true);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) return alert("Please verify OTP first");
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/signup`, { name, email, password });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Register</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="my-3">
                <label htmlFor="name">Full Name</label>
                <input type="text" className="form-control" id="name" value={name} onChange={handleChange} required />
              </div>
              <div className="my-3">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" value={email} onChange={handleChange} required />
              </div>
              <div className="text-center mb-3">
                <button type="button" className="btn btn-outline-dark" onClick={handleSendOtp}
                  disabled={otpLoading || otpVerified || resendTimer > 0}>
                  {otpVerified ? "✅ OTP Verified" : otpLoading ? "Sending..." : resendTimer > 0 ? `Resend in ${resendTimer}s` : otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
              {otpSent && !otpVerified && (
                <>
                  <div className="my-3">
                    <label>Enter OTP</label>
                    <input type="text" className="form-control" value={otp} onChange={(e) => setOtp(e.target.value)} />
                  </div>
                  <div className="text-center mb-3">
                    <button type="button" className="btn btn-dark" onClick={handleVerifyOtp} disabled={verifyLoading}>
                      {verifyLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                </>
              )}
              <div className="my-3">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" value={password} onChange={handleChange} required />
              </div>
              <div className="my-3">
                <p>Already have an account? <Link to="/login" className="text-info">Login</Link></p>
              </div>
              <div className="text-center">
                <button className="btn btn-dark" type="submit" disabled={loading || !otpVerified}>
                  {loading ? "Registering..." : "Register"}
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

export default Register;
