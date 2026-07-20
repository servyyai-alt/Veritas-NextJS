"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/admin/programmes", label: "Programmes", icon: "🎓" },
  { href: "/admin/blogs", label: "Blogs", icon: "📝" },
  { href: "/admin/contact", label: "Contact Submissions", icon: "📬" },
  { href: "/admin/crm-settings", label: "Contact CRM", icon: "🔗" },
  { href: "/admin/counselling-crm", label: "Book Counselling CRM", icon: "📅" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    onClose?.();
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
  };

  const handleClick = () => { onClose?.(); };

  return (
    <aside className={`adm-sidebar ${open ? "adm-sidebar-open" : ""}`}>
      <div className="adm-sidebar-head">
        <div>
          <div className="adm-sidebar-brand">Veritas</div>
          <div className="adm-sidebar-sub">Admin Panel</div>
        </div>
        <button className="adm-sidebar-close" onClick={onClose} aria-label="Close menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <nav className="adm-sidebar-nav">
        {NAV.map((n) => {
          const active = pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={handleClick}
              className={`adm-sidebar-link ${active ? "adm-sidebar-active" : ""}`}
            >
              <span className="adm-sidebar-icon">{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="adm-sidebar-foot">
        <button onClick={handleLogout} className="adm-sidebar-link adm-sidebar-logout">
          <span className="adm-sidebar-icon">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
