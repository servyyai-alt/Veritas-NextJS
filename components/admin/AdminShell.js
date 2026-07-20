"use client";
import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="adm-shell">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="adm-overlay" onClick={closeSidebar} />}

      <AdminSidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="adm-main">
        {/* Mobile top bar */}
        <div className="adm-topbar">
          <button className="adm-hamburger" onClick={toggleSidebar} aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
          <div className="adm-topbar-brand">
            <span className="adm-topbar-logo">Veritas</span>
            <span className="adm-topbar-sub">Admin</span>
          </div>
        </div>

        <main className="adm-content">
          {children}
        </main>
      </div>
    </div>
  );
}
