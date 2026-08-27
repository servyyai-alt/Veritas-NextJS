"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";
import { DEFAULT_CONTACT_CONTENT } from "@/lib/contact-content";

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

function SkeletonRow() {
  return <div className="adm-skeleton-row"><div className="adm-skel-bar w40" /><div className="adm-skel-bar w20" /></div>;
}

export default function AdminContact() {
  const [content, setContent] = useState(() => cloneContent(DEFAULT_CONTACT_CONTENT));
  const [savedContent, setSavedContent] = useState(() => cloneContent(DEFAULT_CONTACT_CONTENT));
  const [contentLoading, setContentLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [q, setQ] = useState("");
  const [read, setRead] = useState("");
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/contact-page-settings")
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        const next = d.content || DEFAULT_CONTACT_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setContentLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const raf = requestAnimationFrame(() => setSubmissionsLoading(true));
    fetch(`/api/contact?q=${encodeURIComponent(q)}&read=${encodeURIComponent(read)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        setSubmissions(d.data || []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setSubmissionsLoading(false);
      });
    return () => {
      active = false;
      cancelAnimationFrame(raf);
    };
  }, [q, read]);

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
      const res = await fetch("/api/admin/contact-page-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_CONTACT_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "Contact content saved successfully", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to save contact content", type: "error" });
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
      const res = await fetch("/api/admin/contact-page-settings", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_CONTACT_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "Contact content reset to defaults", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to reset contact content", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setResetting(false);
    }
  };

  const markRead = async (id, val) => {
    await fetch(`/api/contact/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: val }),
    });
    fetch(`/api/contact?q=${encodeURIComponent(q)}&read=${encodeURIComponent(read)}`)
      .then((r) => r.json())
      .then((d) => {
        setSubmissions(d.data || []);
      });
    if (selected?._id === id) setSelected((s) => ({ ...s, read: val }));
  };

  const del = async (id) => {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setSelected(null);
    fetch(`/api/contact?q=${encodeURIComponent(q)}&read=${encodeURIComponent(read)}`)
      .then((r) => r.json())
      .then((d) => {
        setSubmissions(d.data || []);
      });
  };

  const dirty = JSON.stringify(content) !== JSON.stringify(savedContent);

  return (
    <div className={`adm-page mtop ${mounted ? "adm-page-in" : ""}`} style={{ paddingBottom: "120px" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Contact Page Content</h1>
          <p className="adm-sub">
            Edit the contact page text with normal fields. The layout and design stay the same.
          </p>
        </div>
      </div>

      <div className="adm-settings-grid">
        <SectionCard
          fullWidth
          title="SEO"
          description="These values control the contact page title and description."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField
              label="Page title"
              value={content.metadata.title}
              onChange={(v) => updatePath(["metadata", "title"], v)}
              placeholder="Contact — Veritas by IQgrads"
            />
            <TextAreaField
              label="Page description"
              value={content.metadata.description}
              onChange={(v) => updatePath(["metadata", "description"], v)}
              placeholder="Talk to Veritas by IQgrads..."
              rows={3}
            />
          </div>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Hero"
          description="The heading and intro text at the top of the contact page."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField
              label="Hero title"
              value={content.hero.title}
              onChange={(v) => updatePath(["hero", "title"], v)}
              placeholder="Talk to us"
            />
            <TextAreaField
              label="Hero description"
              value={content.hero.description}
              onChange={(v) => updatePath(["hero", "description"], v)}
              placeholder="Graduate, parent or employer..."
              rows={3}
            />
          </div>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Contact Cards"
          description="Edit the three contact cards shown above the form."
        >
          <div style={{ display: "grid", gap: "14px" }}>
            {content.cards.map((card, index) => (
              <div key={index} style={{ border: "1px solid #E6DFD3", borderRadius: "14px", padding: "14px", background: "#fff" }}>
                <div style={{ marginBottom: "12px", color: "#16294A", fontSize: "13px", fontWeight: 600 }}>
                  Card {index + 1}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
                  <InputField
                    label="Label"
                    value={card.label}
                    onChange={(v) => updatePath(["cards", index, "label"], v)}
                    placeholder="Call us"
                  />
                  <TextAreaField
                    label="Main line"
                    value={card.line1}
                    onChange={(v) => updatePath(["cards", index, "line1"], v)}
                    placeholder="Contact line"
                    rows={index === 2 ? 3 : 2}
                  />
                </div>
                <TextAreaField
                  label="Second line"
                  value={card.line2}
                  onChange={(v) => updatePath(["cards", index, "line2"], v)}
                  placeholder="Optional small note"
                  rows={2}
                  help="Leave blank if you do not want a second line."
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Message Section"
          description="These lines appear beside the form on the contact page."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField
              label="Section eyebrow"
              value={content.message.eyebrow}
              onChange={(v) => updatePath(["message", "eyebrow"], v)}
              placeholder="Send a message"
            />
            <InputField
              label="Section title"
              value={content.message.title}
              onChange={(v) => updatePath(["message", "title"], v)}
              placeholder="We'll get back within one working day"
            />
          </div>

          <div style={{ marginTop: "14px", display: "grid", gap: "14px" }}>
            {content.message.points.map((point, index) => (
              <div key={index} style={{ border: "1px solid #E6DFD3", borderRadius: "14px", padding: "14px", background: "#fff" }}>
                <div style={{ marginBottom: "12px", color: "#16294A", fontSize: "13px", fontWeight: 600 }}>
                  Message Point {index + 1}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
                  <InputField
                    label="Point title"
                    value={point.title}
                    onChange={(v) => updatePath(["message", "points", index, "title"], v)}
                    placeholder="For graduates & parents"
                  />
                  <TextAreaField
                    label="Point text"
                    value={point.text}
                    onChange={(v) => updatePath(["message", "points", index, "text"], v)}
                    placeholder="Programme advice, fees and the path to a job."
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
          description="Edit the Pearson trust line below the message section."
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
              placeholder="Globally trusted standard"
            />
          </div>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Contact Submissions"
          description="The inquiry list stays the same. You can manage submissions below."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="adm-toolbar">
              <div className="adm-search-bar">
                <svg className="adm-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input className="adm-search-input" placeholder="Search by name, email, phone…" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="adm-filter-pills">
                {[["", "All"], ["false", "Unread"], ["true", "Read"]].map(([val, label]) => (
                  <button key={val} className={`adm-filter-pill ${read === val ? "adm-filter-active" : ""}`} onClick={() => setRead(val)}>{label}</button>
                ))}
              </div>
            </div>

            <div className="adm-contact-split">
              <div className="adm-contact-list">
                {submissionsLoading ? (
                  <div className="adm-skeleton-grid">{[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}</div>
                ) : submissions.length === 0 ? (
                  <div className="adm-empty">
                    <div className="adm-empty-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <p>No submissions yet.</p>
                  </div>
                ) : (
                  submissions.map((s, i) => (
                    <div
                      key={s._id}
                      className={`adm-contact-card ${selected?._id === s._id ? "adm-contact-active" : ""}`}
                      style={{ animationDelay: `${i * 0.04}s` }}
                      onClick={() => setSelected(s)}
                    >
                      <div className="adm-contact-avatar" style={{ background: s.read ? "#E6DFD3" : "#8A2434" }}>
                        {s.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="adm-contact-info">
                        <div className="adm-contact-name">
                          {s.name}
                          {!s.read && <span className="adm-new-dot" />}
                        </div>
                        <div className="adm-contact-meta">{s.email || s.phone} &middot; {s.source}</div>
                      </div>
                      <div className="adm-contact-date">
                        {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selected && (
                <div className="adm-contact-detail">
                  <div className="adm-detail-header">
                    <div className="adm-detail-avatar" style={{ background: "#8A2434" }}>
                      {selected.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="adm-detail-header-info">
                      <div className="adm-detail-name">{selected.name}</div>
                      <div className="adm-detail-date">Submitted {new Date(selected.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                    <button className="adm-detail-close" onClick={() => setSelected(null)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>

                  <div className="adm-detail-fields">
                    {[["Phone", selected.phone], ["Email", selected.email || "—"], ["Source", selected.source]].map(([k, v]) => (
                      <div key={k} className="adm-detail-row">
                        <span className="adm-detail-label">{k}</span>
                        <span className="adm-detail-value">{v}</span>
                      </div>
                    ))}
                  </div>

                  {selected.subject && (
                    <div className="adm-detail-section">
                      <span className="adm-detail-section-label">Subject</span>
                      <p className="adm-detail-section-text">{selected.subject}</p>
                    </div>
                  )}
                  {selected.message && (
                    <div className="adm-detail-section">
                      <span className="adm-detail-section-label">Message</span>
                      <p className="adm-detail-section-text">{selected.message}</p>
                    </div>
                  )}

                  <div className="adm-detail-actions">
                    <button onClick={() => markRead(selected._id, !selected.read)} className="adm-btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                      {selected.read ? "Mark Unread" : "Mark as Read"}
                    </button>
                    <button onClick={() => del(selected._id)} className="adm-btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="adm-home-savebar">
        <div className="adm-home-savebar-inner">
          <div style={{ color: "#54607A", fontSize: "13px", lineHeight: 1.5 }}>
            {contentLoading ? "Loading contact content…" : dirty ? "You have unsaved contact page changes." : "Contact content is up to date."}
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="adm-btn-ghost"
              onClick={handleReset}
              disabled={resetting || contentLoading}
              style={{ opacity: resetting || contentLoading ? 0.6 : 1, cursor: resetting || contentLoading ? "not-allowed" : "pointer" }}
            >
              {resetting ? "Resetting…" : "Reset"}
            </button>
            <button
              className="adm-btn-primary"
              onClick={handleSave}
              disabled={saving || contentLoading}
              style={{ opacity: saving || contentLoading ? 0.6 : 1, cursor: saving || contentLoading ? "not-allowed" : "pointer" }}
            >
              {saving ? "Saving…" : "Save Contact Content"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
