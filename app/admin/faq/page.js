"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";
import { DEFAULT_FAQ_CONTENT } from "@/lib/faq-content";

function cloneContent(value) {
  return JSON.parse(JSON.stringify(value));
}

function getAtPath(obj, path) {
  return path.reduce((acc, key) => acc[key], obj);
}

function setAtPath(obj, path, value) {
  let node = obj;
  for (let i = 0; i < path.length - 1; i += 1) {
    node = node[path[i]];
  }
  node[path[path.length - 1]] = value;
}

function InputField({ label, value, onChange, placeholder, help }) {
  return (
    <div className="adm-settings-field">
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {help && <div style={{ marginTop: "6px", color: "#54607A", fontSize: "12px", lineHeight: 1.5 }}>{help}</div>}
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
      {help && <div style={{ marginTop: "6px", color: "#54607A", fontSize: "12px", lineHeight: 1.5 }}>{help}</div>}
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

function ArraySection({ title, description, items, onAdd, addLabel, children }) {
  return (
    <div style={{ marginTop: "18px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
        <div>
          <h4 style={{ margin: 0, color: "#16294A", fontSize: "15px", fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h4>
          <p style={{ margin: "4px 0 0", color: "#54607A", fontSize: "12px", lineHeight: 1.5 }}>{description}</p>
        </div>
        <button className="adm-btn-ghost" onClick={onAdd} type="button" style={{ whiteSpace: "nowrap" }}>
          {addLabel}
        </button>
      </div>
      <div style={{ display: "grid", gap: "12px" }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #E6DFD3",
              borderRadius: "14px",
              padding: "14px",
              background: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ color: "#16294A", fontSize: "13px", fontWeight: 600 }}>Item {index + 1}</div>
              <button
                type="button"
                className="adm-btn-danger"
                onClick={() => children.remove(index)}
                style={{ padding: "8px 10px", minHeight: "auto" }}
              >
                Remove
              </button>
            </div>
            {children.render(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminFAQ() {
  const [content, setContent] = useState(() => cloneContent(DEFAULT_FAQ_CONTENT));
  const [savedContent, setSavedContent] = useState(() => cloneContent(DEFAULT_FAQ_CONTENT));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    fetch("/api/admin/faq-settings")
      .then((r) => r.json())
      .then((d) => {
        const next = d.content || DEFAULT_FAQ_CONTENT;
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
      setAtPath(next, path, value);
      return next;
    });
  };

  const updateArrayItem = (path, index, key, value) => {
    setContent((prev) => {
      const next = cloneContent(prev);
      const arr = getAtPath(next, path);
      arr[index] = { ...arr[index], [key]: value };
      return next;
    });
  };

  const addArrayItem = (path, item) => {
    setContent((prev) => {
      const next = cloneContent(prev);
      const arr = getAtPath(next, path);
      arr.push(item);
      return next;
    });
  };

  const removeArrayItem = (path, index) => {
    setContent((prev) => {
      const next = cloneContent(prev);
      const arr = getAtPath(next, path);
      arr.splice(index, 1);
      return next;
    });
  };

  const handleSave = async () => {
    setToast(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/faq-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_FAQ_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "FAQ content saved successfully", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to save FAQ content", type: "error" });
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
      const res = await fetch("/api/admin/faq-settings", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_FAQ_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "FAQ content reset to defaults", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to reset FAQ content", type: "error" });
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
          <h1 className="adm-title">FAQ Content</h1>
          <p className="adm-sub">
            Edit the FAQ page copy with normal fields. The accordion design stays the same.
          </p>
        </div>
      </div>

      <div className="adm-settings-grid">
        <SectionCard fullWidth title="Publish notes" description="This editor updates the FAQ text only. The page layout, spacing, and design stay the same.">
          <div style={{ padding: "0 0 4px", color: "#2E6B4E", fontSize: "13px", lineHeight: 1.6 }}>
            Save changes here and the public FAQ page will use the new copy on refresh.
          </div>
        </SectionCard>

        <SectionCard fullWidth title="Metadata" description="These values control the page title and description.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Page title" value={content.metadata.title} onChange={(v) => updatePath(["metadata", "title"], v)} />
            <InputField label="Page description" value={content.metadata.description} onChange={(v) => updatePath(["metadata", "description"], v)} />
          </div>
        </SectionCard>

        <SectionCard fullWidth title="Hero" description="The top header section on the FAQ page.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Breadcrumb home" value={content.hero.breadcrumbHome} onChange={(v) => updatePath(["hero", "breadcrumbHome"], v)} />
            <InputField label="Breadcrumb current" value={content.hero.breadcrumbCurrent} onChange={(v) => updatePath(["hero", "breadcrumbCurrent"], v)} />
          </div>
          <TextAreaField label="Hero title" value={content.hero.title} onChange={(v) => updatePath(["hero", "title"], v)} rows={3} />
          <TextAreaField label="Hero description" value={content.hero.description} onChange={(v) => updatePath(["hero", "description"], v)} rows={4} />
        </SectionCard>

        <SectionCard fullWidth title="FAQ Items" description="Edit the accordion questions and answers shown on the FAQ page.">
          <ArraySection
            title="Questions"
            description="Add, remove, and edit the FAQ entries."
            items={content.faqs}
            onAdd={() => addArrayItem(["faqs"], { q: "", a: "" })}
            addLabel="Add FAQ"
          >
            {{
              remove: (index) => removeArrayItem(["faqs"], index),
              render: (item, index) => (
                <div>
                  <TextAreaField
                    label="Question"
                    value={item.q}
                    onChange={(v) => updateArrayItem(["faqs"], index, "q", v)}
                    rows={2}
                  />
                  <TextAreaField
                    label="Answer"
                    value={item.a}
                    onChange={(v) => updateArrayItem(["faqs"], index, "a", v)}
                    rows={4}
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard fullWidth title="Final CTA" description="The closing section at the bottom of the page.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.finalCta.eyebrow} onChange={(v) => updatePath(["finalCta", "eyebrow"], v)} />
            <InputField label="Title" value={content.finalCta.title} onChange={(v) => updatePath(["finalCta", "title"], v)} />
            <InputField label="Primary CTA" value={content.finalCta.primaryCta} onChange={(v) => updatePath(["finalCta", "primaryCta"], v)} />
            <InputField label="Secondary CTA" value={content.finalCta.secondaryCta} onChange={(v) => updatePath(["finalCta", "secondaryCta"], v)} />
          </div>
          <TextAreaField label="Body" value={content.finalCta.body} onChange={(v) => updatePath(["finalCta", "body"], v)} rows={4} />
        </SectionCard>
      </div>

      <div className="adm-home-savebar">
        <div className="adm-home-savebar-inner">
          <div style={{ minWidth: "240px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#16294A" }}>FAQ actions</div>
            <div style={{ fontSize: "12px", color: "#54607A", lineHeight: 1.5 }}>
              Save changes here and the FAQ page updates on refresh.
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="adm-btn-primary"
              onClick={handleSave}
              disabled={saving || loading || !dirty}
              style={{
                opacity: saving || loading || !dirty ? 0.6 : 1,
                cursor: saving || loading || !dirty ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Content"}
            </button>
            <button
              className="adm-btn-danger"
              onClick={handleReset}
              disabled={resetting || loading}
              style={{
                opacity: resetting || loading ? 0.6 : 1,
                cursor: resetting || loading ? "not-allowed" : "pointer",
              }}
            >
              {resetting ? "Resetting..." : "Reset to Defaults"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
