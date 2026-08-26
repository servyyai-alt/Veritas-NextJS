import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import Link from "next/link";
import Image from "next/image";
import { loadHomepageContent } from "@/lib/homepage-settings";

export async function generateMetadata() {
  const content = await loadHomepageContent();

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: { canonical: "https://www.veritasbyiqgrads.com/" },
    openGraph: {
      type: "website",
      title: content.metadata.title,
      description: content.metadata.description,
      url: "https://www.veritasbyiqgrads.com/",
      images: [{ url: "https://www.veritasbyiqgrads.com/assets/img/og-cover.jpg" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function Home() {
  const content = await loadHomepageContent();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        {/* Hero */}
        <section className="hero cine s-hero kb">
          <div className="ph"></div><div className="tint"></div>
          <div className="wrap hero-inner">
            <div>
              <span className="eyebrow on-img">{content.hero.eyebrow}</span>
              <h1>{content.hero.titlePrefix} <span className="accent">{content.hero.titleAccent}</span></h1>
              <p className="lead">{content.hero.lead}</p>
              <div className="hero-cta">
                <Link className="btn btn-primary" href="/book">{content.hero.primaryCta} <span className="arrow">→</span></Link>
                <Link className="btn btn-light" href="/why-pearson">{content.hero.secondaryCta}</Link>
              </div>
              <div className="hero-seal">
                <div className="pseal on-img">
                  <Image className="plogo plogo-w" src="/pearson-white.png" alt="Pearson" width={66} height={22} />
                  <div className="t"><b>{content.hero.sealTitle}</b><span>{content.hero.sealSubtitle}</span></div>
                </div>
              </div>
            </div>
            <div className="readout reveal">
              <div className="rhead">
                <div>
                  <div className="rtitle">{content.capability.title}</div>
                  <div className="rname">{content.capability.name}</div>
                </div>
                <div className="pill">{content.capability.verifiedLabel}</div>
              </div>
              {content.capability.metrics.map((m, index) => (
                <div className="metric" key={`${m.label}-${index}`}>
                  <div className="mlabel"><b>{m.label}</b> <span className="mval">{m.val}</span></div>
                  <div className="track">
                    <span className="paper" style={{ width: m.paper }}></span>
                    <span className="floor" data-w={m.floor}></span>
                  </div>
                </div>
              ))}
              <div className="legend">
                <span><i className="dot" style={{ background: "#C2C8D3" }}></i> {content.capability.legendOnPaper}</span>
                <span><i className="dot" style={{ background: "var(--wine)" }}></i> {content.capability.legendAfter}</span>
              </div>
              <div className="rfoot">{content.capability.footnote}</div>
            </div>
          </div>
        </section>

        {/* Cred bar */}
        <div className="cred">
          <div className="wrap cred-inner">
            <div className="pearson">
              <Image className="plogo lg" src="/pearson-navy.png" alt={content.credibility.logoAlt} width={82} height={28} />
              <div className="ptxt"><b>{content.credibility.title}</b><span>{content.credibility.subtitle}</span></div>
            </div>
            <div className="chips-row">
              {content.credibility.chips.map((c, index) => (
                <div className="chk" key={`${c}-${index}`}>
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
              <span className="eyebrow center">{content.audience.eyebrow}</span>
              <h2>{content.audience.title}</h2>
              <p>{content.audience.description}</p>
            </div>
            <div className="aud-grid">
              {content.audience.cards.map((a, index) => (
                <div className="aud reveal" key={`${a.tag}-${index}`}>
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
              <span className="eyebrow">{content.pillars.eyebrow}</span>
              <h2>{content.pillars.title}</h2>
              <p>{content.pillars.description}</p>
            </div>
            <div className="pillars">
              {content.pillars.cards.map((p, index) => (
                <div className="pillar reveal" key={`${p.idx}-${index}`}>
                  <span className="idx">{p.idx}</span>
                  <div className="ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      {p.idx === "01" ? (
                        <>
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
                        </>
                      ) : p.idx === "02" ? (
                        <path d="M14 4l6 6M3 21l3.5-.7L18 8.8a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L2.7 16.5 2 20z" strokeLinecap="round" strokeLinejoin="round" />
                      ) : (
                        <>
                          <path d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7l-9-5z" />
                          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      )}
                    </svg>
                  </div>
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
              <span className="eyebrow">{content.steps.eyebrow}</span>
              <h2>{content.steps.title}</h2>
              <p>{content.steps.description}</p>
            </div>
            <div className="reveal">
              <div className="steps">
                {content.steps.cards.map((s, index) => (
                  <div className="step" key={`${s.n}-${index}`}>
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
              <span className="eyebrow center">{content.labs.eyebrow}</span>
              <h2>{content.labs.title}</h2>
            </div>
            <div className="labs-grid">
              {content.labs.cards.map((lab, index) => (
                <div className={`lab cine ${lab.cls} kb reveal`} key={`${lab.cls}-${index}`}>
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
              <span className="eyebrow">{content.domains.eyebrow}</span>
              <h2>{content.domains.title}</h2>
              <p>{content.domains.description}</p>
            </div>
            <div className="dom-grid">
              {content.domains.cards.map((d, index) => (
                <Link className="dom reveal" href="/programme" key={`${d.num}-${index}`}>
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
            <div className="dom-more"><Link className="btn btn-ghost-dark" href="/programmes">{content.domains.moreLabel} <span className="arrow">→</span></Link></div>
          </div>
        </section>

        {/* Honest box */}
        <section className="block linen-sec">
          <div className="wrap">
            <div className="honest reveal">
              <span className="eyebrow">{content.honest.eyebrow}</span>
              <h3>{content.honest.title}</h3>
              <p>{content.honest.body}</p>
              <div className="points">
                {content.honest.points.map((pt, index) => (
                  <div className="pt" key={`${pt.h}-${index}`}>
                    <b>{pt.h}</b>
                    <p>{pt.p}</p>
                  </div>
                ))}
              </div>
              <p className="gap-note" style={{ marginTop: "16px" }}>{content.honest.note}</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final">
          <div className="wrap reveal">
            <span className="eyebrow center">{content.finalCta.eyebrow}</span>
            <h2>{content.finalCta.title}</h2>
            <p>{content.finalCta.body}</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">{content.finalCta.primaryCta} <span className="arrow">→</span></Link>
              <Link className="btn btn-ghost" href="/programmes">{content.finalCta.secondaryCta}</Link>
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
