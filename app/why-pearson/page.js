import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import Link from "next/link";
import { loadWhyPearsonContent } from "@/lib/why-pearson-settings";

export async function generateMetadata() {
  const content = await loadWhyPearsonContent();

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: { canonical: "https://www.veritasbyiqgrads.com/why-pearson" },
    openGraph: {
      type: "website",
      title: content.metadata.title,
      description: content.metadata.description,
      url: "https://www.veritasbyiqgrads.com/why-pearson",
      images: [{ url: "https://www.veritasbyiqgrads.com/assets/img/og-cover.jpg" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function WhyPearson() {
  const content = await loadWhyPearsonContent();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1" className="home-sans">
        <section className="hero cine s-pearson kb" style={{ minHeight: "520px" }}>
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
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">{content.who.eyebrow}</span>
              <h2>{content.who.title}</h2>
              <p>{content.who.description}</p>
            </div>
            <div className="cards">
              {content.who.cards.map((card, index) => (
                <div className="card reveal" key={`${card.h}-${index}`}>
                  <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21h18M5 21V9l7-5 7 5v12" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <h3>{card.h}</h3>
                  <p>{card.p}</p>
                </div>
              ))}
            </div>
            <p className="gap-note" style={{ marginTop: "22px" }}>{content.who.gapNote}</p>
          </div>
        </section>

        <section className="block white-sec">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow center">{content.benefits.eyebrow}</span>
              <h2>{content.benefits.title}</h2>
              <p>{content.benefits.description}</p>
            </div>
            <div className="benefits reveal">
              {content.benefits.cards.map((item, index) => (
                <div className="ben" key={`${item.h}-${index}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18" strokeLinecap="round"/></svg>
                  <div><b>{item.h}</b><p>{item.p}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block linen-sec">
          <div className="wrap">
            <div className="section-head center reveal">
              <span className="eyebrow center">{content.fit.eyebrow}</span>
              <h2>{content.fit.title}</h2>
              <p>{content.fit.description}</p>
            </div>
            <div className="fit reveal">
              <div className="fit-col fp">
                <span className="tag">{content.fit.pearson.label}</span>
                <h3>{content.fit.pearson.title}</h3>
                <ul>
                  {content.fit.pearson.points.map((point, index) => (
                    <li key={`${point}-${index}`}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="fit-col fv">
                <span className="tag">{content.fit.veritas.label}</span>
                <h3>{content.fit.veritas.title}</h3>
                <ul>
                  {content.fit.veritas.points.map((point, index) => (
                    <li key={`${point}-${index}`}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="fit-join reveal">{content.fit.joinLeft} <span>+</span> {content.fit.joinMiddle} <span>=</span> {content.fit.joinRight}</div>
            <p className="gap-note" style={{ textAlign: "center", marginTop: "20px" }}>{content.fit.note}</p>
          </div>
        </section>

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
