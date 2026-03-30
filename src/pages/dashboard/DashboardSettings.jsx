import React, { useState, useEffect } from "react";

const SETTINGS_KEY = "fh_settings";

const defaultSettings = {
  emailOrderConfirmation: true,
  emailPromotions: false,
  emailNewsletter: false,
  darkMode: false,
  compactView: false,
  currency: "INR",
  language: "English",
};

const Toggle = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: "44px", height: "24px", borderRadius: "12px",
      background: checked ? "#111" : "#ddd",
      position: "relative", cursor: "pointer",
      transition: "background 0.2s ease", flexShrink: 0,
    }}
  >
    <div style={{
      width: "18px", height: "18px", borderRadius: "50%",
      background: "#fff", position: "absolute",
      top: "3px", left: checked ? "23px" : "3px",
      transition: "left 0.2s ease",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    }} />
  </div>
);

const SettingRow = ({ label, desc, checked, onChange }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: "16px", padding: "14px 0", borderBottom: "1px solid #f5f5f5",
  }}>
    <div>
      <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>{label}</div>
      {desc && <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>{desc}</div>}
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const DashboardSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
    if (stored) setSettings({ ...defaultSettings, ...stored });
  }, []);

  const toggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      {saved && <div className="dash-toast success">✓ Settings saved</div>}

      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "24px", color: "#111", margin: 0 }}>Settings</h2>
        <p style={{ color: "#999", fontSize: "14px", marginTop: "4px" }}>Manage your preferences</p>
      </div>

      {/* Notifications */}
      <div className="dash-card mb-4">
        <div className="dash-card-title">Email Notifications</div>
        <SettingRow
          label="Order Confirmations"
          desc="Get emailed when you place an order"
          checked={settings.emailOrderConfirmation}
          onChange={() => toggle("emailOrderConfirmation")}
        />
        <SettingRow
          label="Promotions & Offers"
          desc="Special discounts and seasonal sales"
          checked={settings.emailPromotions}
          onChange={() => toggle("emailPromotions")}
        />
        <SettingRow
          label="Newsletter"
          desc="New arrivals and floral inspiration"
          checked={settings.emailNewsletter}
          onChange={() => toggle("emailNewsletter")}
        />
      </div>

      {/* Preferences */}
      <div className="dash-card mb-4">
        <div className="dash-card-title">Display Preferences</div>
        <SettingRow
          label="Compact View"
          desc="Show more products per row on listing pages"
          checked={settings.compactView}
          onChange={() => toggle("compactView")}
        />

        <div style={{ padding: "14px 0", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>Currency</div>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>Display prices in</div>
          </div>
          <select
            className="dash-input"
            style={{ width: "auto", padding: "6px 12px" }}
            value={settings.currency}
            onChange={e => setSettings({ ...settings, currency: e.target.value })}
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>

        <div style={{ padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>Language</div>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>Interface language</div>
          </div>
          <select
            className="dash-input"
            style={{ width: "auto", padding: "6px 12px" }}
            value={settings.language}
            onChange={e => setSettings({ ...settings, language: e.target.value })}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Bengali</option>
          </select>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="dash-card mb-4" style={{ borderColor: "#fde8e8" }}>
        <div className="dash-card-title" style={{ color: "#c62828" }}>Danger Zone</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>Delete Account</div>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>Permanently remove your account and all data</div>
          </div>
          <button
            className="dash-btn dash-btn-danger"
            onClick={() => alert("Please contact us at @_epic_18 on Instagram to delete your account.")}
          >
            Delete Account
          </button>
        </div>
      </div>

      <button className="dash-btn dash-btn-primary" onClick={handleSave}>
        Save Settings
      </button>
    </div>
  );
};

export default DashboardSettings;
