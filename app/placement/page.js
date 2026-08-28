import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import QuizSection from "./QuizSection";
import Link from "next/link";
import { loadPlacementContent } from "@/lib/placement-settings";

export async function generateMetadata() {
  const content = await loadPlacementContent();

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: { canonical: "https://www.veritasbyiqgrads.com/placement.html" },
    openGraph: {
      type: "website",
      title: content.metadata.title,
      description: content.metadata.description,
      url: "https://www.veritasbyiqgrads.com/placement.html",
      images: [{ url: "https://www.veritasbyiqgrads.com/assets/img/og-cover.jpg" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function Placement() {
  const content = await loadPlacementContent();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1" className="home-sans">

        <section className="hero cine s-place kb" style={{ minHeight: "540px" }}>
          <div className="ph"></div><div className="tint"></div>
          <div className="wrap hero-inner single">
            <span className="eyebrow on-img">{content.hero.eyebrow}</span>
            <h1>{content.hero.titlePrefix} <span className="accent">{content.hero.titleAccent}</span></h1>
            <p className="lead">{content.hero.lead}</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">{content.hero.primaryCta} <span className="arrow">→</span></Link>
              <Link className="btn btn-light" href="/placement">{content.hero.secondaryCta}</Link>
            </div>
          </div>
        </section>

        <section className="block light-sec">
          <div className="wrap assure">
            <div className="assure-copy reveal">
              <span className="eyebrow">{content.assurance.eyebrow}</span>
              <h2 className="text-2xl">{content.assurance.title}</h2>
              <p>{content.assurance.body}</p>
              <div className="assure-copy pull" style={{ fontFamily: "'Space Grotesk'", fontSize: "20px", color: "var(--navy)", fontWeight: 600, marginTop: "22px", paddingLeft: "18px", borderLeft: "3px solid var(--wine)", lineHeight: 1.35 }}>
                {content.assurance.pull}
              </div>
              <p className="gap-note" style={{ marginTop: "16px" }}>{content.assurance.note}</p>
            </div>
            <div className="promises reveal">
              {content.promises.map((promise, index) => (
                <div className="promise" key={`${promise.h}-${index}`}>
                  <div className="pi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7l-9-5z"/><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <div><b>{promise.h}</b><p>{promise.p}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block white-sec">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow center">{content.process.eyebrow}</span>
              <h2>{content.process.title}</h2>
            </div>
            <div className="proc-grid">
              {content.process.steps.map((step) => (
                <div className="proc reveal" key={`${step.n}-${step.h}`}>
                  <div className="num">{step.n}</div>
                  <b>{step.h}</b>
                  <p>{step.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block linen-sec">
          <div className="wrap bridge">
            <div className="reveal">
              <span className="eyebrow">{content.bridge.eyebrow}</span>
              <h2 style={{ fontSize: "clamp(26px,3.2vw,38px)", marginTop: "14px" }}>{content.bridge.title}</h2>
              <p style={{ fontSize: "16px", marginTop: "14px" }}>{content.bridge.body}</p>
              <div className="hero-cta" style={{ marginTop: "24px" }}>
                <Link className="btn btn-primary" href="/book">{content.bridge.cta} <span className="arrow">→</span></Link>
              </div>
            </div>
            <div className="readout flat reveal">
              <div className="rtitle">{content.readout.title}</div>
              <div className="rname" style={{ margin: "3px 0 16px" }}>{content.readout.name}</div>
              {content.readout.metrics.map((metric) => (
                <div className="metric" key={metric.label}>
                  <div className="mlabel"><b>{metric.label}</b> <span className="mono">{metric.suffix}</span></div>
                  <div className="track"><span className="floor g" style={{ width: metric.width }}></span></div>
                </div>
              ))}
              <div className="legend">
                <span><i className="dot" style={{ background: "var(--forest)" }}></i> {content.readout.legend}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="block white-sec">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">{content.hiring.eyebrow}</span>
              <h2>{content.hiring.title}</h2>
              <p>{content.hiring.body}</p>
            </div>
            <div className="reveal">
              <p className="mono" style={{ fontSize: "12px", color: "var(--slate)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>{content.hiring.sectorsLabel}</p>
              <div className="chips">
                {content.hiring.sectors.map((c) => (
                  <span className="chip" key={c}>{c}</span>
                ))}
              </div>
              <p className="mono" style={{ fontSize: "12px", color: "var(--slate)", letterSpacing: ".1em", textTransform: "uppercase", margin: "24px 0 4px" }}>{content.hiring.rolesLabel}</p>
              <div className="chips">
                {content.hiring.roles.map((r) => (
                  <span className="chip role" key={r}>{r}</span>
                ))}
              </div>
              <p className="gap-note" style={{ marginTop: "18px" }}>{content.hiring.note}</p>
            </div>
          </div>
        </section>

        <section className="block linen-sec">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow center">{content.quiz.eyebrow}</span>
              <h2>{content.quiz.title}</h2>
              <p>{content.quiz.body}</p>
            </div>
            <QuizSection content={content.quiz} />
          </div>
        </section>

        <section className="final">
          <div className="wrap reveal">
            <span className="eyebrow center">{content.finalCta.eyebrow}</span>
            <h2>{content.finalCta.title}</h2>
            <p>{content.finalCta.body}</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">{content.finalCta.primaryCta} <span className="arrow">→</span></Link>
              <Link className="btn btn-ghost" href="/faq">{content.finalCta.secondaryCta}</Link>
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
