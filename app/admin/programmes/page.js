"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Toast from "@/components/Toast";
import { DEFAULT_PROGRAMMES_PAGE_CONTENT } from "@/lib/programmes-page-content";

function SkeletonCard() {
  return <div className="adm-skeleton-card"><div className="adm-skel-bar w40" /><div className="adm-skel-bar w60" /></div>;
}

function cloneContent(value) {
  return JSON.parse(JSON.stringify(value));
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

export default function AdminProgrammes() {
  const [programmes, setProgrammes] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [content, setContent] = useState(() => cloneContent(DEFAULT_PROGRAMMES_PAGE_CONTENT));
  const [savedContent, setSavedContent] = useState(() => cloneContent(DEFAULT_PROGRAMMES_PAGE_CONTENT));
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);

  const loadProgrammes = useCallback(() => {
    setLoading(true);
    fetch(`/api/programmes?all=1&q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => { setProgrammes(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [q]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      loadProgrammes();
    });
    return () => cancelAnimationFrame(raf);
  }, [loadProgrammes]);

  useEffect(() => {
    fetch("/api/admin/programmes-page-settings")
      .then((r) => r.json())
      .then((d) => {
        const next = d.content || DEFAULT_PROGRAMMES_PAGE_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setSettingsLoading(false);
      })
      .catch(() => setSettingsLoading(false));
  }, []);

  const updatePath = (path, value) => {
    setContent((prev) => {
      const next = cloneContent(prev);
      let node = next;
      for (let i = 0; i < path.length - 1; i += 1) {
        node = node[path[i]];
      }
      node[path[path.length - 1]] = value;
      return next;
    });
  };

  const toggle = async (p) => {
    await fetch(`/api/programmes/${p._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !p.published }) });
    loadProgrammes();
  };

  const del = async (id) => {
    if (!confirm("Delete this programme?")) return;
    await fetch(`/api/programmes/${id}`, { method: "DELETE" });
    loadProgrammes();
  };

  return (
    <div className={`adm-page mtop ${mounted ? "adm-page-in" : ""}`} style={{ paddingBottom: "120px" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Programmes</h1>
          <p className="adm-sub">
            {loading || settingsLoading
              ? "Loading…"
              : `${programmes.length} programme${programmes.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Link href="/admin/programmes/new" className="adm-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Programme
        </Link>
      </div>

      <SectionCard
        fullWidth
        title="Programmes Page Header"
        description="Edit the text shown on the public programmes page. The grid and programme cards stay the same."
      >
        <div style={{ padding: "0 0 4px", color: "#2E6B4E", fontSize: "13px", lineHeight: 1.6 }}>
          Changes you save here will update the `/programmes` header copy on refresh.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px", marginTop: "14px" }}>
          <InputField
            label="Page title"
            value={content.metadata.title}
            onChange={(v) => updatePath(["metadata", "title"], v)}
          />
          <InputField
            label="Page description"
            value={content.metadata.description}
            onChange={(v) => updatePath(["metadata", "description"], v)}
          />
          <InputField
            label="Breadcrumb home"
            value={content.hero.breadcrumbHome}
            onChange={(v) => updatePath(["hero", "breadcrumbHome"], v)}
          />
          <InputField
            label="Breadcrumb current"
            value={content.hero.breadcrumbCurrent}
            onChange={(v) => updatePath(["hero", "breadcrumbCurrent"], v)}
          />
        </div>
        <TextAreaField
          label="Hero title"
          value={content.hero.title}
          onChange={(v) => updatePath(["hero", "title"], v)}
          rows={3}
        />
        <TextAreaField
          label="Hero description"
          value={content.hero.description}
          onChange={(v) => updatePath(["hero", "description"], v)}
          rows={4}
        />
      </SectionCard>

      <div className="adm-toolbar">
        <div className="adm-search-bar">
          <svg className="adm-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input className="adm-search-input" placeholder="Search programmes…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="adm-card-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : programmes.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
          </div>
          <p>No programmes found.</p>
          <Link href="/admin/programmes/new" className="adm-btn-ghost">Create your first programme</Link>
        </div>
      ) : (
        <div className="adm-card-grid">
          {programmes.map((p, i) => (
            <div key={p._id} className="adm-prog-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="adm-prog-top">
                <span className="adm-prog-code">{p.domainCode}</span>
                <span className={`adm-pill ${p.published ? "adm-pill-green" : "adm-pill-gray"}`}>{p.published ? "Published" : "Draft"}</span>
              </div>
              <h3 className="adm-prog-title">{p.title}</h3>
              <div className="adm-prog-meta">
                <span>{new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="adm-prog-actions">
                <Link href={`/admin/programmes/${p._id}`} className="adm-action-edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                  Edit
                </Link>
                <button onClick={() => toggle(p)} className="adm-action-toggle">
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => del(p._id)} className="adm-action-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="adm-home-savebar">
        <div className="adm-home-savebar-inner">
          <div style={{ minWidth: "240px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#16294A" }}>
              Programmes page actions
            </div>
            <div style={{ fontSize: "12px", color: "#54607A", lineHeight: 1.5 }}>
              Save header copy changes here and the public Programmes page updates on refresh.
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="adm-btn-primary"
              onClick={async () => {
                setToast(null);
                setSaving(true);
                try {
                  const res = await fetch("/api/admin/programmes-page-settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content }),
                  });
                  const data = await res.json();
                  if (data.success) {
                    const next = data.content || DEFAULT_PROGRAMMES_PAGE_CONTENT;
                    setContent(cloneContent(next));
                    setSavedContent(cloneContent(next));
                    setToast({ message: "Programmes page header saved successfully", type: "success" });
                  } else {
                    setToast({ message: data.message || "Failed to save programmes page header", type: "error" });
                  }
                } catch {
                  setToast({ message: "Something went wrong", type: "error" });
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving || loading || settingsLoading || JSON.stringify(content) === JSON.stringify(savedContent)}
              style={{
                opacity: saving || loading || settingsLoading || JSON.stringify(content) === JSON.stringify(savedContent) ? 0.6 : 1,
                cursor: saving || loading || settingsLoading || JSON.stringify(content) === JSON.stringify(savedContent) ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Content"}
            </button>
            <button
              className="adm-btn-danger"
              onClick={async () => {
                setToast(null);
                setResetting(true);
                try {
                  const res = await fetch("/api/admin/programmes-page-settings", { method: "DELETE" });
                  const data = await res.json();
                  if (data.success) {
                    const next = data.content || DEFAULT_PROGRAMMES_PAGE_CONTENT;
                    setContent(cloneContent(next));
                    setSavedContent(cloneContent(next));
                    setToast({ message: "Programmes page header reset to defaults", type: "success" });
                  } else {
                    setToast({ message: data.message || "Failed to reset programmes page header", type: "error" });
                  }
                } catch {
                  setToast({ message: "Something went wrong", type: "error" });
                } finally {
                  setResetting(false);
                }
              }}
              disabled={resetting || loading || settingsLoading}
              style={{
                opacity: resetting || loading || settingsLoading ? 0.6 : 1,
                cursor: resetting || loading || settingsLoading ? "not-allowed" : "pointer",
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
