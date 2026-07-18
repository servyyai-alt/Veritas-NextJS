"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);

  return <span>{display}</span>;
}

function SkeletonCard() {
  return (
    <div className="dash-skeleton-card">
      <div className="dash-skeleton-bar short" />
      <div className="dash-skeleton-bar long" />
    </div>
  );
}

function SkeletonSection() {
  return (
    <div className="dash-skeleton-section">
      <div className="dash-skeleton-bar medium" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="dash-skeleton-row">
          <div className="dash-skeleton-bar short" />
          <div className="dash-skeleton-bar tiny" />
        </div>
      ))}
    </div>
  );
}

const STAT_CARDS = [
  {
    key: "programmes",
    label: "Programmes",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    color: "#16294A",
    gradient: "linear-gradient(135deg, #16294A 0%, #1e3a5f 100%)",
    link: "/admin/programmes",
  },
  {
    key: "blogs",
    label: "Blog Posts",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    ),
    color: "#2E6B4E",
    gradient: "linear-gradient(135deg, #2E6B4E 0%, #3a8a64 100%)",
    link: "/admin/blogs",
  },
  {
    key: "contacts",
    label: "Submissions",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    color: "#B0883C",
    gradient: "linear-gradient(135deg, #B0883C 0%, #c9a04e 100%)",
    link: "/admin/contact",
  },
  {
    key: "unread",
    label: "Unread",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    color: "#8A2434",
    gradient: "linear-gradient(135deg, #8A2434 0%, #b03050 100%)",
    link: "/admin/contact?read=false",
    pulse: true,
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ programmes: 0, blogs: 0, contacts: 0, unread: 0 });
  const [recentContacts, setRecentContacts] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    Promise.all([
      fetch("/api/programmes?all=1").then((r) => r.json()),
      fetch("/api/blogs").then((r) => r.json()),
      fetch("/api/contact").then((r) => r.json()),
    ])
      .then(([prog, blog, contact]) => {
        const contacts = contact.data || [];
        setStats({
          programmes: (prog.data || []).length,
          blogs: (blog.data || []).length,
          contacts: contacts.length,
          unread: contacts.filter((c) => !c.read).length,
        });
        setRecentContacts(contacts.slice(0, 5));
        setRecentBlogs((blog.data || []).slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const pillStyle = (c) => ({
    fontSize: "11px",
    fontFamily: "'IBM Plex Mono',monospace",
    letterSpacing: ".06em",
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: 500,
    background:
      c === "published" ? "rgba(46,107,78,.1)" : c === "coming_soon" ? "rgba(176,136,60,.12)" : "#f0ebe3",
    color:
      c === "published" ? "#2E6B4E" : c === "coming_soon" ? "#7A5722" : "#41506A",
  });

  const now = new Date();
  const hours = now.getHours();
  const greeting = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className={`dash-page ${mounted ? "dash-page-visible" : ""}`}>
      {/* Welcome banner */}
      <div className="dash-welcome">
        <div className="dash-welcome-content">
          <div className="dash-welcome-greeting">{greeting}</div>
          <h1 className="dash-welcome-title">Admin Dashboard</h1>
          <p className="dash-welcome-sub">Here&apos;s what&apos;s happening with your site today.</p>
        </div>
        <div className="dash-welcome-pattern">
          <div className="dash-welcome-orb dash-welcome-orb-1" />
          <div className="dash-welcome-orb dash-welcome-orb-2" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="dash-stats">
        {loading
          ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          : STAT_CARDS.map((s, i) => (
              <Link
                key={s.key}
                href={s.link}
                className={`dash-stat-card ${mounted ? "dash-stat-visible" : ""}`}
                style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
              >
                <div className="dash-stat-icon" style={{ background: s.gradient }}>
                  {s.icon}
                  {s.pulse && stats[s.key] > 0 && <span className="dash-stat-pulse" />}
                </div>
                <div className="dash-stat-info">
                  <div className="dash-stat-number" style={{ color: s.color }}>
                    <AnimatedNumber value={stats[s.key]} />
                  </div>
                  <div className="dash-stat-label">{s.label}</div>
                </div>
                <div className="dash-stat-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            ))}
      </div>

      {/* Content sections */}
      <div className="dash-sections">
        {/* Recent Submissions */}
        <div className={`dash-section ${mounted ? "dash-section-visible" : ""}`} style={{ animationDelay: "0.5s" }}>
          <div className="dash-section-header">
            <div className="dash-section-title-row">
              <div className="dash-section-icon" style={{ background: "rgba(138,36,52,.08)", color: "#8A2434" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h3 className="dash-section-title">Recent Submissions</h3>
            </div>
            <Link href="/admin/contact" className="dash-view-all">
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
          {loading ? (
            <SkeletonSection />
          ) : recentContacts.length === 0 ? (
            <div className="dash-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <p>No submissions yet.</p>
            </div>
          ) : (
            <div className="dash-list">
              {recentContacts.map((c, i) => (
                <div
                  key={c._id}
                  className={`dash-row ${mounted ? "dash-row-visible" : ""}`}
                  style={{ animationDelay: `${0.6 + i * 0.06}s` }}
                >
                  <div className="dash-row-avatar" style={{ background: c.read ? "#E6DFD3" : "#8A2434" }}>
                    {c.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="dash-row-info">
                    <div className="dash-row-name">
                      {c.name}
                      {!c.read && <span className="dash-new-badge">NEW</span>}
                    </div>
                    <div className="dash-row-meta">{c.phone} &middot; {c.email}</div>
                  </div>
                  <div className="dash-row-date">
                    {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Blog Posts */}
        <div className={`dash-section ${mounted ? "dash-section-visible" : ""}`} style={{ animationDelay: "0.6s" }}>
          <div className="dash-section-header">
            <div className="dash-section-title-row">
              <div className="dash-section-icon" style={{ background: "rgba(46,107,78,.08)", color: "#2E6B4E" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </div>
              <h3 className="dash-section-title">Recent Blog Posts</h3>
            </div>
            <Link href="/admin/blogs" className="dash-view-all">
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
          {loading ? (
            <SkeletonSection />
          ) : recentBlogs.length === 0 ? (
            <div className="dash-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
              <p>No blog posts yet.</p>
            </div>
          ) : (
            <div className="dash-list">
              {recentBlogs.map((b, i) => (
                <div
                  key={b._id}
                  className={`dash-row ${mounted ? "dash-row-visible" : ""}`}
                  style={{ animationDelay: `${0.7 + i * 0.06}s` }}
                >
                  <div className="dash-row-avatar" style={{ background: "var(--navy-tint)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16294A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </div>
                  <div className="dash-row-info">
                    <div className="dash-row-name">{b.title}</div>
                    <div className="dash-row-meta">
                      <span style={pillStyle(b.status)}>{b.status.replace("_", " ")}</span>
                    </div>
                  </div>
                  <Link href={`/admin/blogs/${b._id}`} className="dash-edit-link">
                    Edit
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
