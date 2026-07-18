import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import Link from "next/link";

export const metadata = {
  title: "Why Pearson — Veritas by IQgrads",
  description: "Veritas is an Authorised Pearson Partner: a new programme built on a globally trusted, internationally recognised standard employers rely on.",
};

export default function WhyPearson() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="hero cine s-pearson kb" style={{ minHeight: "520px" }}>
          <div className="ph"></div><div className="tint"></div>
          <div className="wrap hero-inner single">
            <span className="eyebrow on-img">Authorised Pearson Partner</span>
            <h1>A new programme, built on a <span className="accent">globally trusted standard</span></h1>
            <p className="lead">Let&apos;s be honest — Veritas is new. But the standard we teach to isn&apos;t. We&apos;re an Authorised Pearson Partner, so your learning lines up with the frameworks of one of the biggest, most established education companies in the world. The kind of standard employers, universities and governments already know and trust.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">Book a consultation <span className="arrow">→</span></Link>
              <Link className="btn btn-light" href="/placement">Placement support</Link>
            </div>
          </div>
        </section>

        <section className="block light-sec">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Who is Pearson</span>
              <h2>A name education has trusted for generations</h2>
              <p>Pearson is one of the biggest, longest-running education companies in the world. When your learning is aligned to their standards, it carries a credibility most new institutes would take decades to earn.</p>
            </div>
            <div className="cards">
              <div className="card reveal">
                <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21h18M5 21V9l7-5 7 5v12" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Been around for generations</h3>
                <p>A long-established global education company — not a name you&apos;ve never heard of.</p>
              </div>
              <div className="card reveal">
                <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" strokeLinecap="round"/></svg></div>
                <h3>Global footprint</h3>
                <p>Works with learners, educators, employers and governments worldwide.</p>
              </div>
              <div className="card reveal">
                <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7l-9-5z"/><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Standards that travel</h3>
                <p>Recognised internationally, and built around what you can actually do.</p>
              </div>
              <div className="card reveal">
                <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>Speaks employers&apos; language</h3>
                <p>Built around the skills employers are actually looking for.</p>
              </div>
            </div>
            <p className="gap-note" style={{ marginTop: "22px" }}>* Descriptions of Pearson refer to Pearson&apos;s own reputation and reach. Verify exact descriptions and permitted wording with Pearson before publishing.</p>
          </div>
        </section>

        <section className="block white-sec">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow center">What it means for you</span>
              <h2>You&apos;re new to your career. The standard you&apos;ll hold isn&apos;t new at all.</h2>
              <p>Even though Veritas is a new name, the benchmark you&apos;ll be trained against is globally established and respected.</p>
            </div>
            <div className="benefits reveal">
              <div className="ben">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18" strokeLinecap="round"/></svg>
                <div><b>Globally recognised learning</b><p>A standard understood far beyond your home city.</p></div>
              </div>
              <div className="ben">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div><b>A path that can lead abroad</b><p>Globally aligned learning supports later study or work abroad.</p></div>
              </div>
              <div className="ben">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div><b>Spoken in employers&apos; language</b><p>Competency standards employers already understand.</p></div>
              </div>
              <div className="ben">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7l-9-5z"/></svg>
                <div><b>Quality you can rely on</b><p>Backed by international quality-assurance processes.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="block linen-sec">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow center">How we fit together</span>
              <h2>Global standard, delivered hands-on, in India</h2>
              <p>Simple split: Pearson brings the trusted, world-recognised standard. We bring the hands-on, equipment-heavy training that turns it into something you can actually do.</p>
            </div>
            <div className="fit reveal">
              <div className="fit-col fp">
                <span className="tag">Pearson provides</span>
                <h3>The globally trusted standard</h3>
                <ul>
                  <li>Internationally recognised frameworks</li>
                  <li>Competency-based, employer-oriented benchmarks</li>
                  <li>International quality assurance</li>
                  <li>A name education has trusted for generations</li>
                </ul>
              </div>
              <div className="fit-col fv">
                <span className="tag">Veritas delivers</span>
                <h3>The hands-on capability</h3>
                <ul>
                  <li>Training on live industrial equipment</li>
                  <li>Real projects and capstone work</li>
                  <li>Career coaching and placement support</li>
                  <li>Local, intensive, industry-aligned delivery</li>
                </ul>
              </div>
            </div>
            <div className="fit-join reveal">A world-recognised standard <span>+</span> real hands-on training <span>=</span> a graduate employers can hire with confidence.</div>
            <p className="gap-note" style={{ textAlign: "center", marginTop: "20px" }}>* As an Authorised Pearson Partner, Veritas delivers training aligned to Pearson standards. This does not imply Pearson endorses Veritas or guarantees any individual outcome.</p>
          </div>
        </section>

        <section className="final">
          <div className="wrap reveal">
            <span className="eyebrow center">From classroom to career</span>
            <h2>Learn to a standard the world already trusts.</h2>
            <p>Be part of our founding cohort, trained to globally recognised Pearson-aligned standards.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">Book a consultation <span className="arrow">→</span></Link>
              <Link className="btn btn-ghost" href="/programmes">Explore programmes</Link>
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