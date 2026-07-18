"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <header>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="wrap nav">
        <div className="brand-group">
          <Link className="brand" href="/" aria-label="Veritas home">
            <BrandLogo />
            <div>
              <div className="name">Veritas</div>
              <div className="by">by IQgrads</div>
            </div>
          </Link>
          <div className="nav-pearson">
            <div className="pseal">
              <Image className="plogo" src="/pearson-navy.png" alt="Pearson" width={66} height={22} />
              <div className="t"><b>Authorised</b><span>Partner</span></div>
            </div>
          </div>
        </div>
        <nav className="nav-links" aria-label="Primary">
          <Link href="/programmes" className={isActive("/programmes") ? "active" : ""}>Programmes</Link>
          <Link href="/why-pearson" className={isActive("/why-pearson") ? "active" : ""}>Why Pearson</Link>
          <Link href="/placement" className={isActive("/placement") ? "active" : ""}>Placement</Link>
          <Link href="/about" className={isActive("/about") ? "active" : ""}>About</Link>
          <Link href="/blog" className={isActive("/blog") ? "active" : ""}>Blog</Link>
          <Link href="/faq" className={isActive("/faq") ? "active" : ""}>FAQ</Link>
        </nav>
        <div className="nav-cta">
          <Link className="btn btn-ghost" href="/contact">Contact</Link>
          <Link className="btn btn-primary" href="/book">Book a consultation</Link>
          <button
            className="menu-btn"
            id="menuBtn"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mnav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      <nav className={`mnav${menuOpen ? " open" : ""}`} id="mnav" aria-label="Mobile menu">
        <Link href="/programmes" onClick={() => setMenuOpen(false)}>Programmes</Link>
        <Link href="/why-pearson" onClick={() => setMenuOpen(false)}>Why Pearson</Link>
        <Link href="/placement" onClick={() => setMenuOpen(false)}>Placement</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
        <Link href="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
        <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        <Link className="btn btn-primary" href="/book" onClick={() => setMenuOpen(false)}>Book a consultation</Link>
      </nav>
    </header>
  );
}
