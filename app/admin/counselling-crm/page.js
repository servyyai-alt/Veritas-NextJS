"use client";
import { useState, useEffect } from "react";
import Toast from "@/components/Toast";

export default function AdminCounsellingCrm() {
  const [url, setUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetch("/api/admin/counselling-settings")
      .then((r) => r.json())
      .then((d) => {
        const u = d.counsellingFormUrl || "";
        setUrl(u);
        setSavedUrl(u);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setToast(null);
    if (!url.trim()) {
      setToast({ message: "Please enter a counselling form URL", type: "error" });
      return;
    }
    try {
      new URL(url.trim());
    } catch {
      setToast({ message: "Please enter a valid URL (include https://)", type: "error" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/counselling-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ counsellingFormUrl: url.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedUrl(data.counsellingFormUrl);
        setToast({ message: "Counselling URL saved successfully", type: "success" });
        setPreviewKey((k) => k + 1);
      } else {
        setToast({ message: data.message || "Failed to save", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    }
    setSaving(false);
  };

  const handleRemove = async () => {
    setToast(null);
    setRemoving(true);
    try {
      const res = await fetch("/api/admin/counselling-settings", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUrl("");
        setSavedUrl("");
        setToast({ message: "Counselling URL removed. Book page will show the default form.", type: "success" });
        setPreviewKey((k) => k + 1);
      } else {
        setToast({ message: data.message || "Failed to remove", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    }
    setRemoving(false);
  };

  const previewUrl = url.trim() || savedUrl;

  return (
    <div className={`adm-page ${mounted ? "adm-page-in" : ""}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Book Counselling CRM</h1>
          <p className="adm-sub">Connect an external CRM counselling form to your Book page</p>
        </div>
      </div>

      <div className="adm-settings-grid">
        {/* Settings card */}
        <div className="adm-settings-card">
          <div className="adm-settings-card-header">
            <div className="adm-settings-icon" style={{ background: "rgba(138,36,52,.08)", color: "#8A2434" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            </div>
            <div>
              <h3 className="adm-settings-card-title">Book Counselling Form URL</h3>
              <p className="adm-settings-card-sub">Paste the URL of your CRM counselling embed form</p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "20px 0", color: "#54607A", fontSize: "14px" }}>Loading…</div>
          ) : (
            <>
              <div className="adm-settings-field">
                <label>Form URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-crm.com/counselling/embed-url"
                />
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  className="adm-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                  style={{ opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}
                >
                  {saving ? "Saving…" : savedUrl ? "Update URL" : "Save URL"}
                </button>

                {savedUrl && (
                  <button
                    className="adm-btn-danger"
                    onClick={handleRemove}
                    disabled={removing}
                    style={{ opacity: removing ? 0.6 : 1, cursor: removing ? "not-allowed" : "pointer" }}
                  >
                    {removing ? "Removing…" : "Remove"}
                  </button>
                )}
              </div>

              {savedUrl && (
                <div style={{ marginTop: "18px", padding: "12px 16px", background: "rgba(46,107,78,.06)", borderRadius: "10px", fontSize: "13px", color: "#2E6B4E" }}>
                  Active counselling form is embedded on the <a href="/book" target="_blank" rel="noopener noreferrer" style={{ color: "#2E6B4E", fontWeight: 600 }}>Book Counselling page</a>.
                </div>
              )}
            </>
          )}
        </div>

        {/* Preview card */}
        <div className="adm-settings-card">
          <div className="adm-settings-card-header">
            <div className="adm-settings-icon" style={{ background: "rgba(22,41,74,.08)", color: "#16294A" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            </div>
            <div>
              <h3 className="adm-settings-card-title">Counselling Form Preview</h3>
              <p className="adm-settings-card-sub">See how the embedded form will appear</p>
            </div>
          </div>

          {previewUrl ? (
            <CounsellingPreview key={previewKey} url={previewUrl} />
          ) : (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#54607A", fontSize: "14px", border: "1px dashed #E6DFD3", borderRadius: "12px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px", opacity: 0.3 }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
              <p style={{ margin: 0 }}>Enter a URL and save to see the preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CounsellingPreview({ url }) {
  const [failed, setFailed] = useState(false);
  const [key, setKey] = useState(0);

  if (failed) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "#8A2434", fontSize: "14px", border: "1px dashed #E6DFD3", borderRadius: "12px" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px", opacity: 0.5 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <p style={{ margin: "0 0 14px" }}>Unable to load Counselling Form.</p>
        <button
          className="adm-btn-ghost"
          onClick={() => { setFailed(false); setKey((k) => k + 1); }}
          style={{ fontSize: "13px" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #E6DFD3" }}>
      <iframe
        key={key}
        src={url}
        width="100%"
        height="600"
        style={{ border: "none", display: "block" }}
        loading="lazy"
        allowFullScreen
        onError={() => setFailed(true)}
        title="Counselling Form Preview"
      />
    </div>
  );
}
