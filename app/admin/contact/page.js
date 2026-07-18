"use client";
import { useState, useEffect } from "react";

function SkeletonRow() {
  return <div className="adm-skeleton-row"><div className="adm-skel-bar w40" /><div className="adm-skel-bar w20" /></div>;
}

export default function AdminContact() {
  const [submissions, setSubmissions] = useState([]);
  const [q, setQ] = useState("");
  const [read, setRead] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    fetch(`/api/contact?q=${encodeURIComponent(q)}&read=${encodeURIComponent(read)}`)
      .then((r) => r.json())
      .then((d) => { setSubmissions(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { setMounted(true); load(); }, [q, read]);

  const markRead = async (id, val) => {
    await fetch(`/api/contact/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: val }) });
    load();
    if (selected?._id === id) setSelected((s) => ({ ...s, read: val }));
  };

  const del = async (id) => {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  };

  return (
    <div className={`adm-page ${mounted ? "adm-page-in" : ""}`}>
      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Contact Submissions</h1>
          <p className="adm-sub">{loading ? "Loading…" : `${submissions.length} submission${submissions.length !== 1 ? "s" : ""}`}</p>
        </div>
        <a href="/api/contact/export" download className="adm-btn-dark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Export CSV
        </a>
      </div>

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
          {loading ? (
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
  );
}
