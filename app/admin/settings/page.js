"use client";
import { useState, useEffect } from "react";
import Toast from "@/components/Toast";

export default function AdminSettings() {
  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handlePw = async () => {
    setToast(null);
    if (!pw.current || !pw.newPw || !pw.confirm) {
      setToast({ message: "All fields are required", type: "error" }); return;
    }
    if (pw.newPw.length < 6) {
      setToast({ message: "New password must be at least 6 characters", type: "error" }); return;
    }
    if (pw.newPw !== pw.confirm) {
      setToast({ message: "New passwords do not match", type: "error" }); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.newPw }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: "Password updated successfully", type: "success" });
        setPw({ current: "", newPw: "", confirm: "" });
      } else {
        setToast({ message: data.message || "Failed to update password", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`adm-page ${mounted ? "adm-page-in" : ""}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Settings</h1>
          <p className="adm-sub">Manage your admin account and configuration</p>
        </div>
      </div>

      <div className="adm-settings-grid">
        <div className="adm-settings-card">
          <div className="adm-settings-card-header">
            <div className="adm-settings-icon" style={{ background: "rgba(138,36,52,.08)", color: "#8A2434" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
            </div>
            <div>
              <h3 className="adm-settings-card-title">Change Password</h3>
              <p className="adm-settings-card-sub">Update your admin password</p>
            </div>
          </div>

          <div className="adm-settings-field">
            <label>Current password</label>
            <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} placeholder="Enter current password" />
          </div>
          <div className="adm-settings-field">
            <label>New password</label>
            <input type="password" value={pw.newPw} onChange={(e) => setPw({ ...pw, newPw: e.target.value })} placeholder="At least 6 characters" />
          </div>
          <div className="adm-settings-field">
            <label>Confirm new password</label>
            <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} placeholder="Re-enter new password" />
          </div>

          <button className="adm-btn-primary" onClick={handlePw} disabled={loading} style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Updating…" : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
