import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import Link from "next/link";
import Image from "next/image";
import { loadAboutContent } from "@/lib/about-settings";

export async function generateMetadata() {
  const content = await loadAboutContent();

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: { canonical: "https://www.veritasbyiqgrads.com/about" },
    openGraph: {
      type: "website",
      title: content.metadata.title,
      description: content.metadata.description,
      url: "https://www.veritasbyiqgrads.com/about",
      images: [{ url: "https://www.veritasbyiqgrads.com/assets/img/og-cover.jpg" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function About() {
  const content = await loadAboutContent();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1" className="home-sans">
        <section
          className="hero cine s-hero kb"
          style={{
            ...(content.hero.backgroundImage
              ? { "--img": `url(${JSON.stringify(content.hero.backgroundImage)})` }
              : {}),
          }}
        >
          <div className="ph"></div><div className="tint"></div>
          <div className="wrap hero-inner">
            <div>
              <div className="breadcrumb" style={{ color: "rgba(255,255,255,.75)" }}>
                <Link href="/" style={{ color: "var(--gold-lt)" }}>{content.hero.breadcrumbHome}</Link>
                <span className="sep" style={{ color: "var(--gold-lt)" }}>/</span>
                <span>{content.hero.breadcrumbCurrent}</span>
              </div>
              <span className="eyebrow on-img" style={{ marginTop: "18px" }}>{content.hero.eyebrow || "About Veritas"}</span>
              <h1>{content.hero.titlePrefix} <span className="accent">{content.hero.titleAccent}</span></h1>
              <p className="lead">{content.hero.lead || content.hero.description}</p>
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
                  <div className="rtitle">{content.hero.readout.title}</div>
                  <div className="rname">{content.hero.readout.name}</div>
                </div>
                <div className="pill">{content.hero.readout.verifiedLabel}</div>
              </div>
              {content.hero.readout.metrics.map((metric, index) => (
                <div className="metric" key={`${metric.label}-${index}`}>
                  <div className="mlabel"><b>{metric.label}</b> <span className="mval">{metric.val}</span></div>
                  <div className="track">
                    <span className="paper" style={{ width: metric.paper }}></span>
                    <span className="floor" style={{ width: metric.floor }}></span>
                  </div>
                </div>
              ))}
              <div className="legend">
                <span><i className="dot" style={{ background: "#C2C8D3" }}></i> {content.hero.readout.legendOnPaper}</span>
                <span><i className="dot" style={{ background: "var(--wine)" }}></i> {content.hero.readout.legendAfter}</span>
              </div>
              <div className="rfoot">{content.hero.readout.footnote}</div>
            </div>
          </div>
        </section>

        <section className="block white-sec">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">{content.gap.eyebrow}</span>
              <h2>{content.gap.title}</h2>
              <p>{content.gap.description}</p>
            </div>
            <div className="cards">
              {content.gap.cards.map((card, index) => {
                const icons = [
                  <g key="vision">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" strokeLinecap="round" />
                  </g>,
                  <path key="mission" d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7l-9-5z" />,
                  <path key="promise" d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />,
                  <path key="parent" d="M3 21h18M5 21V9l7-5 7 5v12" strokeLinecap="round" strokeLinejoin="round" />,
                ];
                return (
                  <div className="card reveal" key={`${card.h}-${index}`}>
                    <div className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        {icons[index % icons.length]}
                      </svg>
                    </div>
                    <h3>{card.h}</h3>
                    <p>{card.p}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="block light-sec">
          <div className="wrap">
            <div className="honest reveal">
              <span className="eyebrow">{content.honest.eyebrow}</span>
              <h3>{content.honest.title}</h3>
              <p>{content.honest.body}</p>
              <div className="points">
                {content.honest.points.map((point, index) => (
                  <div className="pt" key={`${point.h}-${index}`}>
                    <b>{point.h}</b>
                    <p>{point.p}</p>
                  </div>
                ))}
              </div>
              <p className="gap-note" style={{ marginTop: "16px" }}>{content.honest.note}</p>
            </div>
          </div>
        </section>

        <section className="final">
          <div className="wrap reveal">
            <span className="eyebrow center">{content.finalCta.eyebrow}</span>
            <h2>{content.finalCta.title}</h2>
            <p>{content.finalCta.body}</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">{content.finalCta.primaryCta} <span className="arrow">→</span></Link>
              <Link className="btn btn-ghost" href="/why-pearson">{content.finalCta.secondaryCta}</Link>
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
