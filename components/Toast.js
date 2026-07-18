"use client";
import { useEffect, useState } from "react";

export default function Toast({ message, type = "error", duration = 4000, onClose }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 350);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const colors = {
    error: { bg: "rgba(138,36,52,0.95)", border: "rgba(231,201,205,0.3)", icon: "✕" },
    success: { bg: "rgba(46,107,78,0.95)", border: "rgba(180,220,200,0.3)", icon: "✓" },
    info: { bg: "rgba(22,41,74,0.95)", border: "rgba(213,222,236,0.3)", icon: "i" },
  };
  const c = colors[type] || colors.error;

  return (
    <div
      className="toast-container"
      style={{
        position: "fixed",
        top: "28px",
        right: "28px",
        zIndex: 9999,
        transform: exiting ? "translateX(120%)" : "translateX(0)",
        opacity: exiting ? 0 : 1,
        transition: "transform .35s cubic-bezier(.22,.61,.36,1), opacity .35s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: c.bg,
          backdropFilter: "blur(16px)",
          border: `1px solid ${c.border}`,
          borderRadius: "12px",
          padding: "14px 20px",
          boxShadow: "0 16px 40px -8px rgba(0,0,0,.35)",
          maxWidth: "380px",
          fontFamily: "'IBM Plex Sans',sans-serif",
        }}
      >
        <span
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {c.icon}
        </span>
        <span style={{ color: "#fff", fontSize: "14px", fontWeight: 500, lineHeight: 1.4 }}>{message}</span>
        <button
          onClick={() => {
            setExiting(true);
            setTimeout(() => {
              setVisible(false);
              onClose?.();
            }, 350);
          }}
          style={{
            marginLeft: "8px",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            fontSize: "16px",
            padding: "2px",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
