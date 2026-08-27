"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

export default function AdminChatbot() {
  const [url, setUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    fetch("/api/admin/chatbot-settings")
      .then((r) => r.json())
      .then((d) => {
        const next = d.chatbotUrl || "";
        setUrl(next);
        setSavedUrl(next);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleSave = async () => {
    setToast(null);
    if (!url.trim()) {
      setToast({ message: "Please enter a chatbot iframe URL", type: "error" });
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
      const res = await fetch("/api/admin/chatbot-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbotUrl: url.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedUrl(data.chatbotUrl);
        setToast({ message: "Chatbot URL saved successfully", type: "success" });
        setPreviewKey((k) => k + 1);
      } else {
        setToast({ message: data.message || "Failed to save chatbot URL", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setToast(null);
    setRemoving(true);
    try {
      const res = await fetch("/api/admin/chatbot-settings", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUrl("");
        setSavedUrl("");
        setToast({ message: "Chatbot URL removed. The public chatbot will hide.", type: "success" });
        setPreviewKey((k) => k + 1);
      } else {
        setToast({ message: data.message || "Failed to remove chatbot URL", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setRemoving(false);
    }
  };

  const previewUrl = url.trim() || savedUrl;
  const dirty = url.trim() !== savedUrl.trim();

  return (
    <div className={`adm-page mtop ${mounted ? "adm-page-in" : ""}`} style={{ paddingBottom: "120px" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">AI Chatbot</h1>
          <p className="adm-sub">Paste the CRM chatbot iframe URL and it will appear on the public site.</p>
        </div>
      </div>

      <div className="adm-settings-grid">
        <div className="adm-settings-card">
          <div className="adm-settings-card-header">
            <div className="adm-settings-icon" style={{ background: "rgba(22,41,74,.08)", color: "#16294A" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H8l-4 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 11h8" />
                <path d="M8 15h5" />
              </svg>
            </div>
            <div>
              <h3 className="adm-settings-card-title">Chatbot iframe URL</h3>
              <p className="adm-settings-card-sub">Use a CRM embed link or chatbot widget URL.</p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "20px 0", color: "#54607A", fontSize: "14px" }}>Loading…</div>
          ) : (
            <>
              <div className="adm-settings-field">
                <label>Iframe URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-crm.com/chatbot-embed"
                />
              </div>
              <div style={{ marginTop: "8px", color: "#54607A", fontSize: "12px", lineHeight: 1.5 }}>
                Save a full iframe URL from your CRM. The public site will show it as a floating chatbot launcher.
              </div>
            </>
          )}
        </div>

        <div className="adm-settings-card">
          <div className="adm-settings-card-header">
            <div className="adm-settings-icon" style={{ background: "rgba(176,136,60,.1)", color: "#7A5722" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <h3 className="adm-settings-card-title">Public Preview</h3>
              <p className="adm-settings-card-sub">This is how the chatbot iframe will appear when opened.</p>
            </div>
          </div>

          {previewUrl ? (
            <ChatbotPreview key={previewKey} url={previewUrl} />
          ) : (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#54607A", fontSize: "14px", border: "1px dashed #E6DFD3", borderRadius: "12px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px", opacity: 0.3 }}>
                <path d="M21 15a2 2 0 0 1-2 2H8l-4 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p style={{ margin: 0 }}>Enter a chatbot URL and save to see the preview.</p>
            </div>
          )}
        </div>
      </div>

      <div className="adm-home-savebar">
        <div className="adm-home-savebar-inner">
          <div style={{ color: "#54607A", fontSize: "13px", lineHeight: 1.5 }}>
            {dirty ? "You have unsaved chatbot changes." : "Chatbot settings are up to date."}
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {savedUrl && (
              <button
                className="adm-btn-danger"
                onClick={handleRemove}
                disabled={removing || loading}
                style={{ opacity: removing || loading ? 0.6 : 1, cursor: removing || loading ? "not-allowed" : "pointer" }}
              >
                {removing ? "Removing…" : "Remove"}
              </button>
            )}
            <button
              className="adm-btn-primary"
              onClick={handleSave}
              disabled={saving || loading}
              style={{ opacity: saving || loading ? 0.6 : 1, cursor: saving || loading ? "not-allowed" : "pointer" }}
            >
              {saving ? "Saving…" : savedUrl ? "Update Chatbot" : "Save Chatbot"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatbotPreview({ url }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [key, setKey] = useState(0);

  if (failed) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "#8A2434", fontSize: "14px", border: "1px dashed #E6DFD3", borderRadius: "12px" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px", opacity: 0.5 }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p style={{ margin: "0 0 14px" }}>Unable to load chatbot iframe.</p>
        <button
          className="adm-btn-ghost"
          onClick={() => { setFailed(false); setLoaded(false); setKey((k) => k + 1); }}
          style={{ fontSize: "13px" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #E6DFD3", position: "relative", minHeight: "420px" }}>
      {!loaded && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "#54607A", background: "#fff", zIndex: 1 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
          Loading preview…
        </div>
      )}
      <iframe
        key={key}
        src={url}
        width="100%"
        height="520"
        style={{ border: "none", display: "block" }}
        loading="lazy"
        allowFullScreen
        title="Chatbot Preview"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
