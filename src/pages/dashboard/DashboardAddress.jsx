import React, { useState, useEffect } from "react";

const ADDR_KEY = "fh_addresses";

const emptyAddr = { label: "", name: "", phone: "", address: "", city: "", state: "", zip: "", country: "India" };

const DashboardAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // index or null
  const [form, setForm] = useState(emptyAddr);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(ADDR_KEY) || "[]");
    setAddresses(saved);
  }, []);

  const save = (list) => {
    setAddresses(list);
    localStorage.setItem(ADDR_KEY, JSON.stringify(list));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const list = [...addresses];
    if (editing !== null) {
      list[editing] = form;
    } else {
      list.push(form);
    }
    save(list);
    setShowForm(false);
    setEditing(null);
    setForm(emptyAddr);
    setErrors({});
  };

  const handleEdit = (i) => {
    setEditing(i);
    setForm(addresses[i]);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = (i) => {
    const list = addresses.filter((_, idx) => idx !== i);
    save(list);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyAddr);
    setErrors({});
  };

  const states = ["Assam", "Punjab", "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal", "Rajasthan", "Gujarat", "Uttar Pradesh", "Kerala", "Bihar", "Odisha", "Telangana"];

  return (
    <div>
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "24px", color: "#111", margin: 0 }}>Addresses</h2>
          <p style={{ color: "#999", fontSize: "14px", marginTop: "4px" }}>Manage your saved delivery addresses</p>
        </div>
        {!showForm && (
          <button className="dash-btn dash-btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm(emptyAddr); }}>
            + Add Address
          </button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="dash-card mb-4">
          <div className="dash-card-title">{editing !== null ? "Edit Address" : "New Address"}</div>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="dash-label">Label (Home / Office / Other)</label>
                <input className="dash-input" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Home" />
              </div>
              <div className="col-12 col-md-6">
                <label className="dash-label">Full Name *</label>
                <input className={`dash-input ${errors.name ? "is-invalid" : ""}`} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Recipient's name" />
                {errors.name && <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.name}</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="dash-label">Phone *</label>
                <input className={`dash-input ${errors.phone ? "is-invalid" : ""}`} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                {errors.phone && <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.phone}</div>}
              </div>
              <div className="col-12">
                <label className="dash-label">Address Line *</label>
                <input className={`dash-input ${errors.address ? "is-invalid" : ""}`} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street, building, flat no." />
                {errors.address && <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.address}</div>}
              </div>
              <div className="col-12 col-md-4">
                <label className="dash-label">City *</label>
                <input className={`dash-input ${errors.city ? "is-invalid" : ""}`} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City" />
                {errors.city && <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.city}</div>}
              </div>
              <div className="col-12 col-md-4">
                <label className="dash-label">State *</label>
                <select className={`dash-input ${errors.state ? "is-invalid" : ""}`} value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}>
                  <option value="">Select state</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.state}</div>}
              </div>
              <div className="col-12 col-md-4">
                <label className="dash-label">PIN Code *</label>
                <input className={`dash-input ${errors.zip ? "is-invalid" : ""}`} value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} placeholder="6-digit PIN" maxLength={6} />
                {errors.zip && <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.zip}</div>}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button type="submit" className="dash-btn dash-btn-primary">{editing !== null ? "Update Address" : "Save Address"}</button>
              <button type="button" className="dash-btn dash-btn-outline" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div className="dash-card">
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <div style={{ fontWeight: 600, fontSize: "15px", color: "#111", marginBottom: "8px" }}>No saved addresses</div>
            <div className="empty-text" style={{ marginBottom: "20px" }}>Add a delivery address for faster checkout.</div>
            <button className="dash-btn dash-btn-primary" onClick={() => setShowForm(true)}>+ Add First Address</button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {addresses.map((addr, i) => (
            <div className="col-12 col-md-6" key={i}>
              <div className="dash-card" style={{ position: "relative" }}>
                {addr.label && (
                  <span style={{
                    background: "#111", color: "#fff", fontSize: "10px", fontWeight: 700,
                    padding: "2px 8px", borderRadius: "20px", textTransform: "uppercase",
                    letterSpacing: "0.5px", marginBottom: "10px", display: "inline-block",
                  }}>{addr.label}</span>
                )}
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#111", marginBottom: "4px" }}>{addr.name}</div>
                <div style={{ fontSize: "13px", color: "#666", lineHeight: "1.6" }}>
                  {addr.address}<br />
                  {addr.city}, {addr.state} - {addr.zip}<br />
                  {addr.country}<br />
                  📞 {addr.phone}
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                  <button className="dash-btn dash-btn-outline" style={{ fontSize: "12px", padding: "6px 14px" }} onClick={() => handleEdit(i)}>Edit</button>
                  <button className="dash-btn dash-btn-danger" style={{ fontSize: "12px", padding: "6px 14px" }} onClick={() => handleDelete(i)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardAddress;
