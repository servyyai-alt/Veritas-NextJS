import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Veritas by IQgrads — Authorised Pearson Partner",
  description: "Hands-on, industry-aligned training to a globally trusted Pearson standard, with placement support until you're in your career.",
  alternates: { canonical: "https://www.veritasbyiqgrads.com/" },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        {/* Hero */}
        <section className="hero cine s-hero kb">
          <div className="ph"></div><div className="tint"></div>
          <div className="wrap hero-inner">
            <div>
              <span className="eyebrow on-img">Authorised Pearson Partner</span>
              <h1>Theory got you the degree. <span className="accent">Practice gets you the career.</span></h1>
              <p className="lead">We&apos;re an Authorised Pearson Partner — so you train to a standard the world already trusts, on real industrial equipment, not slides. It&apos;s the hands-on kind of learning that actually gets graduates hired.</p>
              <div className="hero-cta">
                <Link className="btn btn-primary" href="/book">Book a career consultation <span className="arrow">→</span></Link>
                <Link className="btn btn-light" href="/why-pearson">Why Pearson?</Link>
              </div>
              <div className="hero-seal">
                <div className="pseal on-img">
                  <Image className="plogo plogo-w" src="/pearson-white.png" alt="Pearson" width={0} height={0} style={{ width: "auto", height: "22px" }} />
                  <div className="t"><b>Authorised Pearson Partner</b><span>Selected to deliver to Pearson standards</span></div>
                </div>
              </div>
            </div>
            <div className="readout reveal">
              <div className="rhead">
                <div>
                  <div className="rtitle">Capability readout</div>
                  <div className="rname">Graduate profile</div>
                </div>
                <div className="pill">Verified ✓</div>
              </div>
              {[
                { label: "Live equipment fluency", val: "92%", paper: "24%", floor: "92" },
                { label: "Industry tools & software", val: "88%", paper: "18%", floor: "88" },
                { label: "Project delivery", val: "90%", paper: "30%", floor: "90" },
                { label: "Interview & workplace readiness", val: "94%", paper: "35%", floor: "94" },
              ].map((m) => (
                <div className="metric" key={m.label}>
                  <div className="mlabel"><b>{m.label}</b> <span className="mval">{m.val}</span></div>
                  <div className="track">
                    <span className="paper" style={{ width: m.paper }}></span>
                    <span className="floor" data-w={m.floor}></span>
                  </div>
                </div>
              ))}
              <div className="legend">
                <span><i className="dot" style={{ background: "#C2C8D3" }}></i> On paper (degree)</span>
                <span><i className="dot" style={{ background: "var(--wine)" }}></i> After Veritas</span>
              </div>
              <div className="rfoot">Illustrative — shows what the programme is designed to build.</div>
            </div>
          </div>
        </section>

        {/* Cred bar */}
        <div className="cred">
          <div className="wrap cred-inner">
            <div className="pearson">
              <Image className="plogo lg" src="/pearson-navy.png" alt="Pearson" width={82} height={28} />
              <div className="ptxt"><b>Authorised Pearson Partner</b><span>Selected to deliver to Pearson standards</span></div>
            </div>
            <div className="chips-row">
              {["Globally trusted standard", "Live equipment, not slideware", "Support until you're placed"].map((c) => (
                <div className="chk" key={c}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audience */}
        <section className="block white-sec">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow center">Is this you?</span>
              <h2>Wherever you&apos;re starting from, this is built for you</h2>
              <p>Most people who come to Veritas feel stuck — and almost none are actually out of options. They were simply never given the practical, job-ready skills employers look for.</p>
            </div>
            <div className="aud-grid">
              {[
                { tag: "Recent graduate", h: "The degree — but not the experience every job wants", feel: "You did everything right, then every opening asked for experience no one let you get. It's a catch-22 — and it isn't your fault.", help: "real, demonstrable skills and projects, so you walk in with something to show." },
                { tag: "Unemployed / between jobs", h: "The applications go out — nothing comes back", feel: "Months of silence wears anyone down. It isn't a verdict on you — you were taught theory, not the hands-on capability employers hire for.", help: "we close the skills gap, then stay with you until you're placed." },
                { tag: "Career changer", h: "Stuck in a job that isn't going anywhere", feel: "Watching the industries that are actually growing while yours stalls. Switching feels risky — but with the right skills it's far more realistic than it looks.", help: "a focused, hands-on path into a high-demand field, with support the whole way." },
              ].map((a) => (
                <div className="aud reveal" key={a.tag}>
                  <span className="tagchip">{a.tag}</span>
                  <h3>{a.h}</h3>
                  <p className="feel">{a.feel}</p>
                  <div className="help"><b>How we help:</b> {a.help}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="block light-sec">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Why Veritas</span>
              <h2>Built like a workplace, not a classroom</h2>
              <p>We started with one question: what does an employer actually need someone to be able to do on day one? Then we built the training around that — to a globally recognised Pearson standard.</p>
            </div>
            <div className="pillars">
              {[
                { idx: "01", icon: <><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round"/></>, h: "Built around real jobs", p: "Every programme maps to a role someone is hiring for right now." },
                { idx: "02", icon: <path d="M14 4l6 6M3 21l3.5-.7L18 8.8a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L2.7 16.5 2 20z" strokeLinecap="round" strokeLinejoin="round"/>, h: "Hands-on, always", p: "Real equipment, real software. Less watching, a lot more doing." },
                { idx: "03", icon: <><path d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7l-9-5z"/><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></>, h: "A standard people trust", p: "It all lines up with Pearson's globally recognised standards — so your learning travels." },
              ].map((p) => (
                <div className="pillar reveal" key={p.idx}>
                  <span className="idx">{p.idx}</span>
                  <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{p.icon}</svg></div>
                  <h3>{p.h}</h3>
                  <p>{p.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="block linen-sec">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">The learning model</span>
              <h2>One path, from classroom to career</h2>
              <p>Seven steps, each one building proof you can actually do the work — the kind that gets you hired.</p>
            </div>
            <div className="reveal">
              <div className="steps">
                {[
                  { n: "01", h: "Discover", p: "Right domain & fit." },
                  { n: "02", h: "Learn", p: "Concepts for application." },
                  { n: "03", h: "Practise", p: "Live equipment." },
                  { n: "04", h: "Build", p: "Real projects." },
                  { n: "05", h: "Expose", p: "Industry exposure." },
                  { n: "06", h: "Prepare", p: "Interview & resume." },
                  { n: "07", h: "Employ", p: "Placement support." },
                ].map((s) => (
                  <div className="step" key={s.n}>
                    <div className="node">{s.n}</div>
                    <h4>{s.h}</h4>
                    <p>{s.p}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Labs */}
        <section className="block white-sec">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow center">Inside our labs</span>
              <h2>Where you train is where industry works</h2>
            </div>
            <div className="labs-grid">
              {[
                { cls: "s-auto", tag: "Automation cell", h: "PLC, SCADA & robotics bay", p: "Program real controllers and robotic work cells." },
                { cls: "s-semi", tag: "Cleanroom & electronics", h: "Semiconductor & embedded lab", p: "Fabrication concepts and embedded hardware." },
                { cls: "s-ev", tag: "Mobility & energy", h: "EV & renewable systems lab", p: "Battery systems, powertrains, renewables." },
              ].map((lab) => (
                <div className={`lab cine ${lab.cls} kb reveal`} key={lab.cls}>
                  <div className="ph"></div><div className="tint"></div>
                  <div className="lab-cap">
                    <span className="lab-tag">{lab.tag}</span>
                    <h3>{lab.h}</h3>
                    <p>{lab.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Domains */}
        <section className="block light-sec">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Technology domains</span>
              <h2>The fields that are actually hiring right now</h2>
              <p>Pick the field you want to work in — each one&apos;s a hands-on path into a real industry.</p>
            </div>
            <div className="dom-grid">
              {[
                { num: "D-01", h: "Railway Engineering", p: "Signalling, rolling stock, rail systems.", cls: "s-rail" },
                { num: "D-02", h: "Semiconductor Manufacturing", p: "Fabrication, cleanroom, packaging.", cls: "s-semi" },
                { num: "D-03", h: "Robotics", p: "Industrial arms, cells, programming.", cls: "s-robot" },
                { num: "D-06", h: "Industrial Automation", p: "Control systems and process lines.", cls: "s-auto" },
              ].map((d) => (
                <Link className="dom reveal" href="/programme" key={d.num}>
                  <div className={`dom-img cine ${d.cls}`}><div className="ph"></div><div className="tint"></div></div>
                  <div className="dom-body">
                    <div className="dnum">{d.num}</div>
                    <h4>{d.h}</h4>
                    <p>{d.p}</p>
                    <span className="dgo">View pathway →</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="dom-more"><Link className="btn btn-ghost-dark" href="/programmes">See all 22 industry pathways <span className="arrow">→</span></Link></div>
          </div>
        </section>

        {/* Honest box */}
        <section className="block linen-sec">
          <div className="wrap">
            <div className="honest reveal">
              <span className="eyebrow">Why this matters</span>
              <h3>You&apos;ll learn to a standard employers already rely on</h3>
              <p>Pearson doesn&apos;t just set standards — it works with employers all over the world to build skilled, future-ready workforces, partnering with some <b>7,000 employers worldwide.*</b> Because Veritas is an Authorised Pearson Partner, the benchmark you train to is the very one those employers already trust. So even though our name is new, you&apos;re not learning to an unknown standard — you&apos;re learning to one industry recognises.</p>
              <div className="points">
                <div className="pt"><b>Built with employers</b><p>Standards shaped around the skills industry actually needs on the floor.</p></div>
                <div className="pt"><b>A global workforce network</b><p>Pearson works with employers around the world to close real skills gaps.*</p></div>
                <div className="pt"><b>Future-ready & sustainable</b><p>Skills aligned to where advanced industries are heading — not where they&apos;ve been.</p></div>
              </div>
              <p className="gap-note" style={{ marginTop: "16px" }}>* Figures and statements about Pearson&apos;s employer reach (including the 7,000 figure) must be verified against Pearson&apos;s official sources and permitted wording before publishing — do not publish unverified numbers.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final">
          <div className="wrap reveal">
            <span className="eyebrow center">From classroom to career</span>
            <h2>Learn to a standard the world already trusts.</h2>
            <p>Be part of our founding cohort. Train hands-on, to globally recognised Pearson-aligned standards, with support all the way into your career.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">Book a career consultation <span className="arrow">→</span></Link>
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
