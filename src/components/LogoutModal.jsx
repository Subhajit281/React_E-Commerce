import React, { useState } from "react";

const ACCENT = "#7c3aed";

/**
 * Drop-in replacement for your handleLogout logic.
 * Usage: replace your logout button with <LogoutButton />
 * Make sure useNavigate is available in the parent or pass navigate as prop.
 */

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
        width: 64px; height: 64px;
        background: #ede9fe;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
        font-size: 28px;
      }

      .fh-logout-title {
        font-family: 'Playfair Display', serif;
        font-size: 20px; font-weight: 700;
        color: #111; margin: 0 0 8px;
      }

      .fh-logout-subtitle {
        font-family: 'DM Sans', sans-serif;
        font-size: 13.5px; color: #888;
        margin: 0 0 28px; line-height: 1.5;
      }

      .fh-logout-actions {
        display: flex; gap: 10px;
      }

      .fh-btn-cancel {
        flex: 1; padding: 12px 0;
        background: #f5f5f5; color: #555;
        border: none; border-radius: 12px;
        font-size: 14px; font-weight: 600;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        transition: background 0.15s;
      }
      .fh-btn-cancel:hover { background: #ebebeb; }

      .fh-btn-logout {
        flex: 1; padding: 12px 0;
        background: ${ACCENT}; color: #fff;
        border: none; border-radius: 12px;
        font-size: 14px; font-weight: 600;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        transition: opacity 0.15s;
        box-shadow: 0 4px 14px ${ACCENT}50;
      }
      .fh-btn-logout:hover { opacity: 0.88; }
    `}</style>

    <div className="fh-logout-overlay" onClick={onCancel}>
      <div className="fh-logout-modal" onClick={e => e.stopPropagation()}>
        <div className="fh-logout-icon">🚪</div>
        <h2 className="fh-logout-title">Logging out?</h2>
        <p className="fh-logout-subtitle">
          Are you sure you want to log out of your account?<br />
          You'll need to sign in again to access your orders.
        </p>
        <div className="fh-logout-actions">
          <button className="fh-btn-cancel" onClick={onCancel}>
            Stay
          </button>
          <button className="fh-btn-logout" onClick={onConfirm}>
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  </>
);

export default LogoutModal;
