import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import FAQList from "./FAQList";
import Link from "next/link";
import { loadFAQContent } from "@/lib/faq-settings";

export async function generateMetadata() {
  const content = await loadFAQContent();

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: { canonical: "https://www.veritasbyiqgrads.com/faq" },
    openGraph: {
      type: "website",
      title: content.metadata.title,
      description: content.metadata.description,
      url: "https://www.veritasbyiqgrads.com/faq",
      images: [{ url: "https://www.veritasbyiqgrads.com/assets/img/og-cover.jpg" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function FAQ() {
  const content = await loadFAQContent();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumb">
              <Link href="/">{content.hero.breadcrumbHome}</Link>
              <span className="sep">/</span>
              <span>{content.hero.breadcrumbCurrent}</span>
            </div>
            <h1>{content.hero.title}</h1>
            <p>{content.hero.description}</p>
          </div>
        </section>
        <section className="block white-sec">
          <div className="wrap"><FAQList content={content} /></div>
        </section>
        <section className="final">
          <div className="wrap reveal">
            <span className="eyebrow center">{content.finalCta.eyebrow}</span>
            <h2>{content.finalCta.title}</h2>
            <p>{content.finalCta.body}</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">{content.finalCta.primaryCta} <span className="arrow">→</span></Link>
              <Link className="btn btn-ghost" href="/contact">{content.finalCta.secondaryCta}</Link>
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
