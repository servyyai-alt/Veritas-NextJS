"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";
import { DEFAULT_BOOK_CONTENT } from "@/lib/book-content";

function cloneContent(value) {
  return JSON.parse(JSON.stringify(value));
}

function InputField({ label, value, onChange, placeholder, help, type = "text" }) {
  return (
    <div className="adm-settings-field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {help ? (
        <div style={{ marginTop: "6px", color: "#54607A", fontSize: "12px", lineHeight: 1.5 }}>
          {help}
        </div>
      ) : null}
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4, help }) {
  return (
    <div className="adm-settings-field">
      <label>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1px solid #E6DFD3",
          borderRadius: "10px",
          fontSize: "14px",
          fontFamily: "'IBM Plex Sans', sans-serif",
          color: "#16294A",
          background: "#fff",
          boxSizing: "border-box",
          outline: "none",
          resize: "vertical",
          lineHeight: "1.6",
        }}
      />
      {help ? (
        <div style={{ marginTop: "6px", color: "#54607A", fontSize: "12px", lineHeight: 1.5 }}>
          {help}
        </div>
      ) : null}
    </div>
  );
}

function SectionCard({ title, description, children, fullWidth = false }) {
  return (
    <div className="adm-settings-card" style={fullWidth ? { gridColumn: "1 / -1" } : undefined}>
      <div className="adm-settings-card-header">
        <div className="adm-settings-icon" style={{ background: "rgba(138,36,52,.08)", color: "#8A2434" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </div>
        <div>
          <h3 className="adm-settings-card-title">{title}</h3>
          <p className="adm-settings-card-sub">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function AdminBook() {
  const [content, setContent] = useState(() => cloneContent(DEFAULT_BOOK_CONTENT));
  const [savedContent, setSavedContent] = useState(() => cloneContent(DEFAULT_BOOK_CONTENT));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    fetch("/api/admin/book-page-settings")
      .then((r) => r.json())
      .then((d) => {
        const next = d.content || DEFAULT_BOOK_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  const updatePath = (path, value) => {
    setContent((prev) => {
      const next = cloneContent(prev);
      let node = next;
      for (let i = 0; i < path.length - 1; i += 1) node = node[path[i]];
      node[path[path.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setToast(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/book-page-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_BOOK_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "Book consultation content saved successfully", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to save book content", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setToast(null);
    setResetting(true);
    try {
      const res = await fetch("/api/admin/book-page-settings", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_BOOK_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "Book consultation content reset to defaults", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to reset book content", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setResetting(false);
    }
  };

  const dirty = JSON.stringify(content) !== JSON.stringify(savedContent);

  return (
    <div className={`adm-page mtop ${mounted ? "adm-page-in" : ""}`} style={{ paddingBottom: "120px" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Book Consultation Content</h1>
          <p className="adm-sub">
            Edit the book consultation page copy with normal fields. The design and form stay the same.
          </p>
        </div>
      </div>

      <div className="adm-settings-grid">
        <SectionCard
          fullWidth
          title="SEO"
          description="These values control the page title and description."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField
              label="Page title"
              value={content.metadata.title}
              onChange={(v) => updatePath(["metadata", "title"], v)}
              placeholder="Book a consultation — Veritas by IQgrads"
            />
            <TextAreaField
              label="Page description"
              value={content.metadata.description}
              onChange={(v) => updatePath(["metadata", "description"], v)}
              placeholder="Book a free 20-minute career consultation..."
              rows={3}
            />
          </div>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Hero"
          description="These lines appear on the left side of the booking page."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField
              label="Hero title"
              value={content.hero.title}
              onChange={(v) => updatePath(["hero", "title"], v)}
              placeholder="Book a free career consultation"
            />
            <TextAreaField
              label="Hero description"
              value={content.hero.description}
              onChange={(v) => updatePath(["hero", "description"], v)}
              placeholder="Just a 20-minute call..."
              rows={5}
            />
          </div>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Benefits"
          description="Edit the three bullet points shown below the hero copy."
        >
          <div style={{ display: "grid", gap: "14px" }}>
            {content.points.map((point, index) => (
              <div key={index} style={{ border: "1px solid #E6DFD3", borderRadius: "14px", padding: "14px", background: "#fff" }}>
                <div style={{ marginBottom: "12px", color: "#16294A", fontSize: "13px", fontWeight: 600 }}>
                  Benefit {index + 1}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
                  <InputField
                    label="Benefit title"
                    value={point.title}
                    onChange={(v) => updatePath(["points", index, "title"], v)}
                    placeholder="Personalised domain recommendation"
                  />
                  <TextAreaField
                    label="Benefit text"
                    value={point.text}
                    onChange={(v) => updatePath(["points", index, "text"], v)}
                    placeholder="Matched to your degree..."
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Trust Strip"
          description="This appears beneath the bullet points."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField
              label="Trust title"
              value={content.trust.title}
              onChange={(v) => updatePath(["trust", "title"], v)}
              placeholder="Authorised Pearson Partner"
            />
            <InputField
              label="Trust subtitle"
              value={content.trust.subtitle}
              onChange={(v) => updatePath(["trust", "subtitle"], v)}
              placeholder="You train to a globally trusted standard"
            />
          </div>
        </SectionCard>
      </div>

      <div className="adm-home-savebar">
        <div className="adm-home-savebar-inner">
          <div style={{ color: "#54607A", fontSize: "13px", lineHeight: 1.5 }}>
            {loading ? "Loading book consultation content…" : dirty ? "You have unsaved book content changes." : "Book consultation content is up to date."}
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="adm-btn-ghost"
              onClick={handleReset}
              disabled={resetting || loading}
              style={{ opacity: resetting || loading ? 0.6 : 1, cursor: resetting || loading ? "not-allowed" : "pointer" }}
            >
              {resetting ? "Resetting…" : "Reset"}
            </button>
            <button
              className="adm-btn-primary"
              onClick={handleSave}
              disabled={saving || loading}
              style={{ opacity: saving || loading ? 0.6 : 1, cursor: saving || loading ? "not-allowed" : "pointer" }}
            >
              {saving ? "Saving…" : "Save Book Content"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
