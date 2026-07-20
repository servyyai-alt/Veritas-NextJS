"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function SkeletonCard() {
  return <div className="adm-skeleton-card"><div className="adm-skel-bar w40" /><div className="adm-skel-bar w60" /></div>;
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const load = () => {
    setLoading(true);
    fetch(`/api/blogs?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`)
      .then((r) => r.json())
      .then((d) => { setBlogs(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { setMounted(true); load(); }, [q, status]);

  const del = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    load();
  };

  const toggleStatus = async (b) => {
    const next = b.status === "published" ? "draft" : "published";
    await fetch(`/api/blogs/${b._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    load();
  };

  const pillClass = (s) => `adm-pill ${s === "published" ? "adm-pill-green" : s === "coming_soon" ? "adm-pill-gold" : "adm-pill-gray"}`;

  return (
    <div className={`adm-page mtop ${mounted ? "adm-page-in" : ""}`}>
      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Blog Posts</h1>
          <p className="adm-sub">{loading ? "Loading…" : `${blogs.length} post${blogs.length !== 1 ? "s" : ""} total`}</p>
        </div>
        <Link href="/admin/blogs/new" className="adm-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Blog
        </Link>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search-bar">
          <svg className="adm-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input className="adm-search-input" placeholder="Search blogs…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="adm-filter-pills">
          {[["", "All"], ["published", "Published"], ["draft", "Draft"], ["coming_soon", "Coming Soon"]].map(([val, label]) => (
            <button key={val} className={`adm-filter-pill ${status === val ? "adm-filter-active" : ""}`} onClick={() => setStatus(val)}>{label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="adm-card-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : blogs.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
          </div>
          <p>No blog posts found.</p>
          <Link href="/admin/blogs/new" className="adm-btn-ghost">Write your first post</Link>
        </div>
      ) : (
        <div className="adm-card-grid">
          {blogs.map((b, i) => (
            <div key={b._id} className="adm-prog-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="adm-prog-top">
                <span className="adm-prog-code">{b.category || "Uncategorized"}</span>
                <span className={pillClass(b.status)}>{b.status.replace("_", " ")}</span>
              </div>
              <h3 className="adm-prog-title">{b.title}</h3>
              {b.excerpt && <p className="adm-blog-excerpt">{b.excerpt}</p>}
              <div className="adm-prog-meta">
                <span>{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Not published"}</span>
              </div>
              <div className="adm-prog-actions">
                <Link href={`/admin/blogs/${b._id}`} className="adm-action-edit">
                  Edit
                </Link>
                <button onClick={() => toggleStatus(b)} className="adm-action-toggle">
                  {b.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => del(b._id)} className="adm-action-delete">
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
