"use client";
import { useState, useEffect } from "react";
import Toast from "@/components/Toast";

export default function AdminSettings() {
  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" });
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [savedWhatsappNumber, setSavedWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(true);
  const [whatsappSaving, setWhatsappSaving] = useState(false);
  const [whatsappRemoving, setWhatsappRemoving] = useState(false);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/whatsapp-settings")
      .then((r) => r.json())
      .then((d) => {
        const phone = d.phoneNumber || "";
        setWhatsappNumber(phone);
        setSavedWhatsappNumber(phone);
        setWhatsappLoading(false);
      })
      .catch(() => setWhatsappLoading(false));
  }, []);

  const normalizePhoneNumber = (value) => value.replace(/\D/g, "");

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

  const handleWhatsappSave = async () => {
    setToast(null);
    const normalized = normalizePhoneNumber(whatsappNumber);
    if (normalized.length < 8 || normalized.length > 15) {
      setToast({ message: "Enter a valid WhatsApp number with country code", type: "error" });
      return;
    }

    setWhatsappSaving(true);
    try {
      const res = await fetch("/api/whatsapp-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: normalized }),
      });
      const data = await res.json();
      if (data.success) {
        setWhatsappNumber(data.phoneNumber);
        setSavedWhatsappNumber(data.phoneNumber);
        setToast({ message: "WhatsApp number saved successfully", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to save WhatsApp number", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setWhatsappSaving(false);
    }
  };

  const handleWhatsappRemove = async () => {
    setToast(null);
    setWhatsappRemoving(true);
    try {
      const res = await fetch("/api/whatsapp-settings", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setWhatsappNumber("");
        setSavedWhatsappNumber("");
        setToast({ message: "WhatsApp number removed", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to remove WhatsApp number", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setWhatsappRemoving(false);
    }
  };

  return (
    <div className={`adm-page mtop ${mounted ? "adm-page-in" : ""}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Settings</h1>
          <p className="adm-sub">Manage your admin account and WhatsApp contact number</p>
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

        <div className="adm-settings-card">
          <div className="adm-settings-card-header">
            <div className="adm-settings-icon" style={{ background: "rgba(37,211,102,.12)", color: "#128C7E" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z" />
              </svg>
            </div>
            <div>
              <h3 className="adm-settings-card-title">Floating WhatsApp Icon</h3>
              <p className="adm-settings-card-sub">Set the phone number used by the floating chat button</p>
            </div>
          </div>

          {whatsappLoading ? (
            <div style={{ padding: "20px 0", color: "#54607A", fontSize: "14px" }}>Loading…</div>
          ) : (
            <>
              <div className="adm-settings-field">
                <label>WhatsApp number</label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <p style={{ margin: "-6px 0 16px", fontSize: "12px", color: "#54607A" }}>
                Use the full international number with country code. Spaces and plus signs are fine while typing.
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  className="adm-btn-primary"
                  onClick={handleWhatsappSave}
                  disabled={whatsappSaving}
                  style={{ opacity: whatsappSaving ? 0.6 : 1, cursor: whatsappSaving ? "not-allowed" : "pointer" }}
                >
                  {whatsappSaving ? "Saving…" : savedWhatsappNumber ? "Update Number" : "Save Number"}
                </button>

                {savedWhatsappNumber && (
                  <button
                    className="adm-btn-danger"
                    onClick={handleWhatsappRemove}
                    disabled={whatsappRemoving}
                    style={{ opacity: whatsappRemoving ? 0.6 : 1, cursor: whatsappRemoving ? "not-allowed" : "pointer" }}
                  >
                    {whatsappRemoving ? "Removing…" : "Remove"}
                  </button>
                )}
              </div>

              {savedWhatsappNumber && (
                <div style={{ marginTop: "18px", padding: "12px 16px", background: "rgba(46,107,78,.06)", borderRadius: "10px", fontSize: "13px", color: "#2E6B4E" }}>
                  Active number: <strong>{savedWhatsappNumber}</strong>. The floating icon will open this WhatsApp chat on the public site.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
