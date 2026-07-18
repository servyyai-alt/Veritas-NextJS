import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="page-hero">
          <div className="wrap">
            <h1>Page not found</h1>
            <p>We couldn&apos;t find that page. Try one of the links below.</p>
          </div>
        </section>
        <section className="block white-sec" style={{ textAlign: "center" }}>
          <div className="wrap">
            <div className="hero-cta" style={{ justifyContent: "center", marginTop: 0 }}>
              <Link className="btn btn-primary" href="/">Go home <span className="arrow">→</span></Link>
              <Link className="btn btn-ghost-dark" href="/programmes">View programmes</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
