import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import BookFormOrCrm from "./BookFormOrCrm";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Book a consultation — Veritas by IQgrads",
  description: "Book a free 20-minute career consultation with a Veritas counsellor: personalised guidance, fees and the path to a job.",
};

export default function Book() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="block white-sec">
          <div className="wrap book-grid">
            <div className="reveal">
              <div className="breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Book counselling</span></div>
              <h1 style={{ marginTop: "14px", fontSize: "clamp(28px,3.6vw,40px)" }}>Book a free career consultation</h1>
              <p style={{ fontSize: "17px", marginTop: "14px" }}>Just a 20-minute call with one of our counsellors. We&apos;ll get to know your background, suggest the right field for you, and talk you through fees, scholarships and how this turns into a job. No pressure, no hard sell.</p>
              <div className="book-points">
                {[
                  { h: "Personalised domain recommendation", p: "Matched to your degree, interests and goals." },
                  { h: "Clear fees & scholarships", p: "Exact costs and what you may qualify for." },
                  { h: "An honest view", p: "Real talk on placement support and what to expect." },
                ].map((bp) => (
                  <div className="book-point" key={bp.h}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <div><b>{bp.h}</b><span>{bp.p}</span></div>
                  </div>
                ))}
              </div>
              <div className="book-trust">
                <Image className="plogo lg" src="/pearson-navy.png" alt="Pearson" width={82} height={28} />
                <div><b>Authorised Pearson Partner</b><span>You train to a globally trusted standard</span></div>
              </div>
            </div>
            <BookFormOrCrm />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
      <RevealObserver />
    </>
  );
}
