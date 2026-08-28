import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import BookFormOrCrm from "./BookFormOrCrm";
import Link from "next/link";
import Image from "next/image";
import { loadBookContent } from "@/lib/book-settings";

export async function generateMetadata() {
  const content = await loadBookContent();

  return {
    title: content.metadata.title,
    description: content.metadata.description,
  };
}

export default async function Book() {
  const content = await loadBookContent();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1" className="home-sans">
        <section className="block white-sec">
          <div className="wrap book-grid">
            <div className="reveal">
              <div className="breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Book counselling</span></div>
              <h1 style={{ marginTop: "14px", fontSize: "clamp(28px,3.6vw,40px)" }}>{content.hero.title}</h1>
              <p style={{ fontSize: "17px", marginTop: "14px" }}>{content.hero.description}</p>
              <div className="book-points">
                {content.points.map((bp) => (
                  <div className="book-point" key={bp.title}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <div><b>{bp.title}</b><span>{bp.text}</span></div>
                  </div>
                ))}
              </div>
              <div className="book-trust">
                <Image className="plogo lg" src="/pearson-navy.png" alt="Pearson" width={82} height={28} />
                <div><b>{content.trust.title}</b><span>{content.trust.subtitle}</span></div>
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
