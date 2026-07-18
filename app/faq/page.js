import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import FAQList from "./FAQList";
import Link from "next/link";

export const metadata = {
  title: "FAQ — Veritas by IQgrads",
  description: "Honest answers about the Pearson partnership, placement assurance, fees, eligibility and studying abroad.",
};

export default function FAQ() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>FAQ</span></div>
            <h1>Honest answers to the questions you&apos;re asking</h1>
            <p>For graduates, career changers and parents weighing up a serious decision.</p>
          </div>
        </section>
        <section className="block white-sec">
          <div className="wrap"><FAQList /></div>
        </section>
        <section className="final">
          <div className="wrap reveal">
            <span className="eyebrow center">Still have questions?</span>
            <h2>Ask us directly.</h2>
            <p>Book a free consultation and get straight answers about your situation.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">Book a consultation <span className="arrow">→</span></Link>
              <Link className="btn btn-ghost" href="/contact">Contact us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
      <RevealObserver />
    </>
  );
}
