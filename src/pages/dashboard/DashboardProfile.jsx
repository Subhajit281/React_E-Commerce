import React, { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";

const Toast = ({ msg, type }) =>
  msg ? <div className={`dash-toast ${type}`}>{msg}</div> : null;

const DashboardProfile = () => {
  const { user, token, BACKEND_URL } = useOutletContext();

  const [name, setName] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);

  const [picLoading, setPicLoading] = useState(false);
  const [preview, setPreview] = useState(user?.profilePic || "");
  const fileRef = useRef();

  const [pwData, setPwData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);

  const [toast, setToast] = useState({ msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  // ── Update name ────────────────────────────────────────────────────────────
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) return showToast("Name must be at least 2 characters", "error");
    setNameLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/update-profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...user, name: data.user.name };
        localStorage.setItem("user", JSON.stringify(updated));
        showToast("✓ Name updated successfully");
      } else {
        showToast(data.message || "Failed to update name", "error");
      }
    } catch { showToast("Server error", "error"); }
    finally { setNameLoading(false); }
  };

  // ── Upload profile pic ─────────────────────────────────────────────────────
  const handlePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return showToast("Please select an image file", "error");
    if (file.size > 5 * 1024 * 1024) return showToast("Image must be under 5MB", "error");

    setPreview(URL.createObjectURL(file));
    setPicLoading(true);

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/profile-pic`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...user, profilePic: data.user.profilePic };
        localStorage.setItem("user", JSON.stringify(updated));
        setPreview(data.user.profilePic);
        showToast("✓ Profile picture updated");
      } else {
        showToast(data.message || "Upload failed", "error");
      }
    } catch { showToast("Server error", "error"); }
    finally { setPicLoading(false); }
  };

  // ── Change password ────────────────────────────────────────────────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwData.currentPassword || !pwData.newPassword || !pwData.confirmPassword)
      return showToast("All password fields are required", "error");
    if (pwData.newPassword.length < 8)
      return showToast("New password must be at least 8 characters", "error");
    if (pwData.newPassword !== pwData.confirmPassword)
      return showToast("Passwords do not match", "error");

    setPwLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwData.currentPassword, newPassword: pwData.newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        showToast("✓ Password changed successfully");
      } else {
        showToast(data.message || "Failed to change password", "error");
      }
    } catch { showToast("Server error", "error"); }
    finally { setPwLoading(false); }
  };

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} />

      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "24px", color: "#111", margin: 0 }}>Profile</h2>
        <p style={{ color: "#999", fontSize: "14px", marginTop: "4px" }}>Manage your personal information</p>
      </div>

      {/* Profile Picture */}
      <div className="dash-card mb-4">
        <div className="dash-card-title">Profile Picture</div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "#111", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: 700, overflow: "hidden", flexShrink: 0,
            border: "3px solid #f0f0f0",
          }}>
            {preview
              ? <img src={preview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : (user?.name?.[0] || "U").toUpperCase()
            }
          </div>
          <div>
            <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handlePicChange} />
            <button
              className="dash-btn dash-btn-outline"
              onClick={() => fileRef.current.click()}
              disabled={picLoading}
            >
              {picLoading ? "Uploading..." : "Change Photo"}
            </button>
            <p style={{ fontSize: "12px", color: "#bbb", marginTop: "6px", marginBottom: 0 }}>
              JPG, PNG or WebP. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="dash-card mb-4">
        <div className="dash-card-title">Personal Information</div>
        <form onSubmit={handleNameUpdate}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="dash-label">Full Name</label>
              <input
                className="dash-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="dash-label">Email</label>
              <input
                className="dash-input"
                type="email"
                value={user?.email || ""}
                disabled
                style={{ background: "#f5f5f5", cursor: "not-allowed", color: "#999" }}
              />
            </div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <button className="dash-btn dash-btn-primary" type="submit" disabled={nameLoading}>
              {nameLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="dash-card">
        <div className="dash-card-title">Change Password</div>
        <form onSubmit={handlePasswordChange}>
          <div className="row g-3">
            <div className="col-12">
              <label className="dash-label">Current Password</label>
              <input
                className="dash-input"
                type="password"
                value={pwData.currentPassword}
                onChange={(e) => setPwData({ ...pwData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="dash-label">New Password</label>
              <input
                className="dash-input"
                type="password"
                value={pwData.newPassword}
                onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })}
                placeholder="Min 8 characters"
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="dash-label">Confirm New Password</label>
              <input
                className="dash-input"
                type="password"
                value={pwData.confirmPassword}
                onChange={(e) => setPwData({ ...pwData, confirmPassword: e.target.value })}
                placeholder="Repeat new password"
              />
            </div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <button className="dash-btn dash-btn-primary" type="submit" disabled={pwLoading}>
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardProfile;
