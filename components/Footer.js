import Link from "next/link";
import BrandLogo from "./BrandLogo";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col foot-about">
            <Link className="brand" href="/" style={{ display: "inline-flex" }}>
              <BrandLogo />
              <div>
                <div className="name">Veritas</div>
                <div className="by">by IQgrads</div>
              </div>
            </Link>
            <p>We&apos;re an Authorised Pearson Partner. We give you hands-on training to a standard the world trusts — and help you turn it into a real job.</p>
            <div className="pseal" style={{ marginTop: "6px" }}>
              <Image className="plogo" src="/pearson-navy.png" alt="Pearson" width={66} height={22} />
              <div className="t"><b>Authorised Partner</b><span>Selected to deliver to Pearson standards</span></div>
            </div>
          </div>
          <div className="foot-col">
            <h5>Explore</h5>
            <Link href="/programmes">Programmes</Link>
            <Link href="/why-pearson">Why Pearson</Link>
            <Link href="/placement">Placement</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="foot-col">
            <h5>Programmes</h5>
            <Link href="/programme">Industrial Automation</Link>
            <Link href="/programmes">All 22 pathways</Link>
            <Link href="/placement">Placement support</Link>
          </div>
          <div className="foot-col">
            <h5>Get started</h5>
            <Link href="/book">Book counselling</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Veritas by IQgrads · <Link href="/privacy-policy">Privacy Policy</Link></span>
          <span>Authorised Pearson Partner · Pan-India</span>
        </div>
        <div style={{ marginTop: "14px", textAlign: "right" }}>
          <Link href="/admin/login" className="admin-login-link">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
