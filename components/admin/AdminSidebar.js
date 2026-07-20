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

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <aside style={{ width: "240px", background: "#16294A", display: "flex", flexDirection: "column", flexShrink: 0 }} className="h-auto">
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff" }}>Veritas</div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "rgba(255,255,255,.5)", letterSpacing: ".12em", textTransform: "uppercase", marginTop: "2px" }}>Admin Panel</div>
      </div>
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {NAV.map((n) => {
          const active = pathname.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
              borderRadius: "8px", marginBottom: "4px", fontSize: "14px", fontWeight: 500,
              color: active ? "#fff" : "rgba(255,255,255,.65)",
              background: active ? "rgba(255,255,255,.12)" : "transparent",
              textDecoration: "none", transition: "all .2s",
            }}>
              <span>{n.icon}</span>{n.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,.1)" }}>
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
          borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,.65)",
          background: "transparent", border: "none", cursor: "pointer",
        }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
