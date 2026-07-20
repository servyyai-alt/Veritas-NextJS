"use client";
import { useState, useEffect } from "react";
import BookForm from "./BookForm";

export default function BookFormOrCrm() {
  const [crmUrl, setCrmUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/counselling-settings")
      .then((r) => r.json())
      .then((d) => {
        setCrmUrl(d.counsellingFormUrl || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="form-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px", color: "#54607A", fontSize: "14px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite", marginRight: "10px" }}>
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
        Loading…
      </div>
    );
  }

  if (!crmUrl) {
    return <BookForm />;
  }

  if (iframeFailed) {
    return (
      <div className="form-card" style={{ textAlign: "center", padding: "40px 20px" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8A2434" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 14px", opacity: 0.5 }}>
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p style={{ color: "#8A2434", fontSize: "15px", margin: "0 0 16px" }}>Unable to load Counselling Form.</p>
        <button
          className="btn btn-primary"
          onClick={() => { setIframeFailed(false); setIframeLoaded(false); setIframeKey((k) => k + 1); }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="crm-iframe-wrap">
      {!iframeLoaded && (
        <div className="crm-iframe-loader">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
          Loading counselling form…
        </div>
      )}
      <iframe
        key={iframeKey}
        src={crmUrl}
        width="100%"
        height="900"
        className={`crm-iframe ${iframeLoaded ? "crm-iframe-visible" : ""}`}
        loading="lazy"
        allowFullScreen
        title="Counselling Form"
        onLoad={() => setIframeLoaded(true)}
        onError={() => setIframeFailed(true)}
      />
    </div>
  );
}
