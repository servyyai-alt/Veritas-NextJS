"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function SkeletonCard() {
  return <div className="adm-skeleton-card"><div className="adm-skel-bar w40" /><div className="adm-skel-bar w60" /></div>;
}

export default function AdminProgrammes() {
  const [programmes, setProgrammes] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch(`/api/programmes?all=1&q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => { setProgrammes(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [q]);

  const toggle = async (p) => {
    await fetch(`/api/programmes/${p._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !p.published }) });
    const d = await fetch(`/api/programmes?all=1&q=${encodeURIComponent(q)}`).then((r) => r.json());
    setProgrammes(d.data || []);
  };

  const del = async (id) => {
    if (!confirm("Delete this programme?")) return;
    await fetch(`/api/programmes/${id}`, { method: "DELETE" });
    const d = await fetch(`/api/programmes?all=1&q=${encodeURIComponent(q)}`).then((r) => r.json());
    setProgrammes(d.data || []);
  };

  return (
    <div className={`adm-page mtop ${mounted ? "adm-page-in" : ""}`}>
      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Programmes</h1>
          <p className="adm-sub">{loading ? "Loading…" : `${programmes.length} programme${programmes.length !== 1 ? "s" : ""} total`}</p>
        </div>
        <Link href="/admin/programmes/new" className="adm-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Programme
        </Link>
      </div>

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
    </div>
  );
}
