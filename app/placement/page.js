import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import QuizSection from "./QuizSection";
import Link from "next/link";

export const metadata = {
  title: "Placement support — Veritas by IQgrads",
  description: "Placement assurance backed by your skills, plus bridging training and a team that works with you until you're hired.",
  alternates: { canonical: "https://www.veritasbyiqgrads.com/placement.html" },
};

export default function Placement() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">

        {/* Hero */}
        <section className="hero cine s-place kb" style={{ minHeight: "540px" }}>
          <div className="ph"></div><div className="tint"></div>
          <div className="wrap hero-inner single">
            <span className="eyebrow on-img">Placement support · Authorised Pearson Partner</span>
            <h1>We don&apos;t just train you. <span className="accent">We stay until you&apos;re hired.</span></h1>
            <p className="lead">If your degree is done and the offers still aren&apos;t coming, it isn&apos;t because you aren&apos;t capable — you were taught theory, not what employers hire for. We back your skills with placement assurance and a team that works with you, including extra training to bridge any gap, until you&apos;re in your career.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">Book a consultation <span className="arrow">→</span></Link>
              <Link className="btn btn-light" href="/placement">How our assurance works</Link>
            </div>
          </div>
        </section>

        {/* Assurance */}
        <section className="block light-sec">
          <div className="wrap assure">
            <div className="assure-copy reveal">
              <span className="eyebrow">Our placement assurance</span>
              <h2>A commitment that lasts until you&apos;re in your career</h2>
              <p>Here&apos;s our placement assurance in plain terms: it&apos;s built on the skills you walk away with. The day your course ends isn&apos;t the day we stop. We keep working with you, and if an employer points to something you&apos;re missing, we train you on it and get you back in the room.</p>
              <div className="assure-copy pull" style={{ fontFamily: "'Space Grotesk'", fontSize: "20px", color: "var(--navy)", fontWeight: 600, marginTop: "22px", paddingLeft: "18px", borderLeft: "3px solid var(--wine)", lineHeight: 1.35 }}>
                Your skills get you the interview. We stay with you until you get the role.
              </div>
              <p className="gap-note" style={{ marginTop: "16px" }}>* Assurance is a commitment based on acquired skills and active participation — not a guarantee of a specific job. Finalise exact eligibility and terms before publishing.</p>
            </div>
            <div className="promises reveal">
              <div className="promise">
                <div className="pi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7l-9-5z"/><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <div><b>Backed by real skills</b><p>Grounded in demonstrable, job-ready capability.</p></div>
              </div>
              <div className="promise">
                <div className="pi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8" strokeLinecap="round"/></svg></div>
                <div><b>We keep going</b><p>Support continues after the course — coaching and follow-through.</p></div>
              </div>
              <div className="promise">
                <div className="pi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h7l2-3 3 6 2-3h4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <div><b>Bridging training</b><p>If a gap appears, we add targeted training to close it.</p></div>
              </div>
              <div className="promise">
                <div className="pi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <div><b>Until you&apos;re placed</b><p>We work with you until you&apos;re in a role that fits your skills.</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* Process steps */}
        <section className="block white-sec">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow center">How our placement support works</span>
              <h2>A guided path from your final project to your first role</h2>
            </div>
            <div className="proc-grid">
              <div className="proc reveal"><div className="num">01</div><b>Career mapping</b><p>Match your skills to the roles hiring for them.</p></div>
              <div className="proc reveal"><div className="num">02</div><b>Evidence &amp; portfolio</b><p>Capstone projects that prove capability.</p></div>
              <div className="proc reveal"><div className="num">03</div><b>Resume &amp; LinkedIn</b><p>Built for the roles you target.</p></div>
              <div className="proc reveal"><div className="num">04</div><b>Interview prep</b><p>Mock interviews until you&apos;re confident.</p></div>
              <div className="proc reveal"><div className="num">05</div><b>Employer introductions</b><p>Direct connections in your domain.</p></div>
              <div className="proc reveal"><div className="num">06</div><b>Bridging training</b><p>Didn&apos;t land it yet? We close the gap.</p></div>
              <div className="proc  reveal"><div className="num">07</div><b>Placement</b><p>Into a role that fits your skills.</p></div>
              <div className="proc  reveal"><div className="num">08</div><b>Early-career support</b><p>We stay with you as you settle in.</p></div>

            </div>
          </div>
        </section>

        {/* Bridging readout */}
        <section className="block linen-sec">
          <div className="wrap bridge">
            <div className="reveal">
              <span className="eyebrow">Continuing training</span>
              <h2 style={{ fontSize: "clamp(26px,3.2vw,38px)", marginTop: "14px" }}>Not getting offers? We find the gap — and close it.</h2>
              <p style={{ fontSize: "16px", marginTop: "14px" }}>Sometimes you&apos;re literally one skill away from an offer. We figure out exactly what that is, train you on it, and get you back in front of employers. It&apos;s the whole idea behind Veritas: find the real gap, then close it.</p>
              <div className="hero-cta" style={{ marginTop: "24px" }}>
                <Link className="btn btn-primary" href="/book">Talk to a counsellor <span className="arrow">→</span></Link>
              </div>
            </div>
            <div className="readout flat reveal">
              <div className="rtitle">Bridging readout</div>
              <div className="rname" style={{ margin: "3px 0 16px" }}>Closing the gap to an offer</div>
              <div className="metric">
                <div className="mlabel"><b>Tooling &amp; platform depth</b> <span className="mono">+ training</span></div>
                <div className="track"><span className="floor g" style={{ width: "90%" }}></span></div>
              </div>
              <div className="metric">
                <div className="mlabel"><b>Added specialisation</b> <span className="mono">+ training</span></div>
                <div className="track"><span className="floor g" style={{ width: "84%" }}></span></div>
              </div>
              <div className="metric">
                <div className="mlabel"><b>Interview &amp; communication</b> <span className="mono">+ coaching</span></div>
                <div className="track"><span className="floor g" style={{ width: "92%" }}></span></div>
              </div>
              <div className="legend">
                <span><i className="dot" style={{ background: "var(--forest)" }}></i> Strengthened through bridging</span>
              </div>
            </div>
          </div>
        </section>

        {/* Who's hiring */}
        <section className="block white-sec">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Who&apos;s hiring</span>
              <h2>The sectors and roles hiring for these skills</h2>
              <p>There&apos;s a real shortage of people who can actually do this work — in India, and more and more in Europe too.</p>
            </div>
            <div className="reveal">
              <p className="mono" style={{ fontSize: "12px", color: "var(--slate)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Hiring sectors</p>
              <div className="chips">
                {["Automotive","Semiconductor & electronics","Electric vehicles","Industrial automation","FMCG & packaging","Pharmaceuticals","Energy & utilities","Railways","System integrators"].map((c) => (
                  <span className="chip" key={c}>{c}</span>
                ))}
              </div>
              <p className="mono" style={{ fontSize: "12px", color: "var(--slate)", letterSpacing: ".1em", textTransform: "uppercase", margin: "24px 0 4px" }}>Roles we prepare you for</p>
              <div className="chips">
                {["Automation Engineer","PLC / SCADA Programmer","Robotics Technician","Process Associate","EV Systems Engineer","Embedded Engineer","Quality Engineer"].map((r) => (
                  <span className="chip role" key={r}>{r}</span>
                ))}
              </div>
              <p className="gap-note" style={{ marginTop: "18px" }}>Indicative sectors and roles — verify before publishing.</p>
            </div>
          </div>
        </section>

        {/* Quiz */}
        <section className="block linen-sec">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow center">2-minute check</span>
              <h2>Not sure where you stand? Find out.</h2>
              <p>Answer three quick questions and we&apos;ll point you to the right next step — no sign-up to see your result.</p>
            </div>
            <QuizSection />
          </div>
        </section>

        {/* Final CTA */}
        <section className="final">
          <div className="wrap reveal">
            <span className="eyebrow center">From classroom to career</span>
            <h2>You&apos;ve waited long enough. Let&apos;s change that.</h2>
            <p>Enrol with confidence: train hands-on, and let our team work with you — including extra training — all the way until you&apos;re in your career.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">Book your free consultation <span className="arrow">→</span></Link>
              <Link className="btn btn-ghost" href="/faq">Read the FAQ</Link>
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
