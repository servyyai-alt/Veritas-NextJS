import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About — Veritas by IQgrads",
  description: "An Authorised Pearson Partner closing the gap between a degree and a real job, with hands-on training to a globally trusted standard.",
};

export default function About() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>About</span></div>
            <h1>We&apos;re here to close the gap between a degree and an actual job</h1>
            <p>Veritas by IQgrads exists for one reason: too many capable people finish their degree and still can&apos;t get hired, because all they were taught was theory. We turn that theory into skills you can actually use — to a standard the world trusts.</p>
          </div>
        </section>

        <section className="block white-sec">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">The gap we exist to close</span>
              <h2>India graduates millions. Industry still can&apos;t hire enough.</h2>
              <p>Employers want people who can read a wiring diagram, set up a sensor and finish a real project from day one. That gap — between having a qualification and actually being able to do the job — is exactly what we close.</p>
            </div>
            <div className="cards">
              {[
                { icon: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" strokeLinecap="round"/></>, h: "Our vision", p: "To be the name people trust when they want a degree to actually turn into a career." },
                { icon: <path d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7l-9-5z"/>, h: "Our mission", p: "Close the gap between finishing your studies and getting hired — with proper, hands-on training." },
                { icon: <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>, h: "Our promise", p: "We don't create certificates. We create careers. From classroom to career." },
                { icon: <path d="M3 21h18M5 21V9l7-5 7 5v12" strokeLinecap="round" strokeLinejoin="round"/>, h: "Our parent", p: "IQgrads is our parent company; Veritas is its brand focused entirely on getting you employed." },
              ].map((c) => (
                <div className="card reveal" key={c.h}>
                  <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{c.icon}</svg></div>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block light-sec">
          <div className="wrap">
            <div className="honest reveal">
              <span className="eyebrow">Straight talk</span>
              <h3>New brand, established standard</h3>
              <p>We&apos;re honest that Veritas is new. That&apos;s exactly why we partnered with Pearson — so that even on day one, what you learn is held to an internationally recognised, employer-trusted standard. And it&apos;s why our fee model puts the risk on us: 50% at enrolment, the rest only when you have an offer or certification.</p>
              <div className="points">
                <div className="pt"><b>Authorised Pearson Partner</b><p>A globally trusted standard from the start.</p></div>
                <div className="pt"><b>Founding cohort</b><p>Smaller groups, closer attention, the advantage of being early.</p></div>
                <div className="pt"><b>Risk on us</b><p>Pay as you progress; placement support until you&apos;re hired.</p></div>
              </div>
              <p className="gap-note" style={{ marginTop: "16px" }}>* Team, facilities and partnership details to be added; confirm Pearson wording before publishing.</p>
            </div>
          </div>
        </section>

        <section className="final">
          <div className="wrap reveal">
            <span className="eyebrow center">From classroom to career</span>
            <h2>Come build your career with us.</h2>
            <p>Talk to us about the right programme for your background and goals.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">Book a consultation <span className="arrow">→</span></Link>
              <Link className="btn btn-ghost" href="/why-pearson">Why Pearson?</Link>
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
