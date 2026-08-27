"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SiteChatbot() {
  const pathname = usePathname();
  const [chatbotUrl, setChatbotUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
      return undefined;
    }

    let active = true;

    const loadChatbot = async () => {
      try {
        const res = await fetch("/api/admin/chatbot-settings", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        setChatbotUrl(data.chatbotUrl || "");
      } catch {
        if (active) setChatbotUrl("");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadChatbot();

    const handleFocus = () => {
      loadChatbot();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      active = false;
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="chatbot-launcher"
        aria-label={open ? "Close chatbot" : "Open chatbot"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="chatbot-launcher-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H8l-4 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 11h8" />
            <path d="M8 15h5" />
          </svg>
        </span>
        <span className="chatbot-launcher-text">AI Chat</span>
      </button>

      {open && (
        <div className="chatbot-shell" role="dialog" aria-label="AI chatbot">
          <div className="chatbot-head">
            <div>
              <div className="chatbot-title">AI Chatbot</div>
              <div className="chatbot-sub">Powered by your CRM embed</div>
            </div>
            <button
              type="button"
              className="chatbot-close"
              aria-label="Close chatbot"
              onClick={() => setOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="chatbot-body">
            {loading ? (
              <div className="chatbot-loading">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Loading chatbot…
              </div>
            ) : !chatbotUrl ? (
              <div className="chatbot-error">
                <p>Chatbot is not configured yet.</p>
                <span style={{ color: "#54607A", fontSize: "13px", lineHeight: 1.5 }}>
                  Add the CRM iframe URL in the admin panel to activate this widget.
                </span>
              </div>
            ) : failed ? (
              <div className="chatbot-error">
                <p>Unable to load the chatbot.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setFailed(false);
                    setIframeLoaded(false);
                    setIframeKey((k) => k + 1);
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {!iframeLoaded && (
                  <div className="chatbot-loading">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Loading chatbot…
                  </div>
                )}
                <iframe
                  key={iframeKey}
                  src={chatbotUrl}
                  title="AI Chatbot"
                  className={`chatbot-iframe${iframeLoaded ? " chatbot-iframe-visible" : ""}`}
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => setFailed(true)}
                  allowFullScreen
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
