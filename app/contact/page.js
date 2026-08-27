import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import ContactFormOrCrm from "./ContactFormOrCrm";
import Link from "next/link";
import Image from "next/image";
import { loadContactContent } from "@/lib/contact-settings";

export async function generateMetadata() {
  const content = await loadContactContent();

  return {
    title: content.metadata.title,
    description: content.metadata.description,
  };
}

export default async function Contact() {
  const content = await loadContactContent();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span className="sep">/</span>
              <span>Contact</span>
            </div>
            <h1>{content.hero.title}</h1>
            <p>{content.hero.description}</p>
          </div>
        </section>
        <section className="block white-sec">
          <div className="wrap">
            <div className="contact-grid reveal">
              <div className="cc">
                <div className="ic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <b>{content.cards[0].label}</b>
                <p>
                  {content.cards[0].line1}
                  <br />
                  {content.cards[0].line2 ? (
                    <span className="gap-note">{content.cards[0].line2}</span>
                  ) : null}
                </p>
              </div>
              <div className="cc">
                <div className="ic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path
                      d="M3 7l9 6 9-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <b>{content.cards[1].label}</b>
                <p>
                  {content.cards[1].line1}
                  <br />
                  {content.cards[1].line2 ? (
                    <span className="gap-note">{content.cards[1].line2}</span>
                  ) : null}
                </p>
              </div>
              <div className="cc">
                <div className="ic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <b>{content.cards[2].label}</b>
                <p>{content.cards[2].line1}</p>
              </div>
            </div>
            <div className="book-grid">
              <div className="reveal">
                <span className="eyebrow">{content.message.eyebrow}</span>
                <h2 style={{ fontSize: "28px", marginTop: "14px" }}>
                  {content.message.title}
                </h2>
                <div className="book-points">
                  <div className="book-point">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M20 6 9 17l-5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <b>{content.message.points[0].title}</b>
                      <span>{content.message.points[0].text}</span>
                    </div>
                  </div>
                  <div className="book-point">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M20 6 9 17l-5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <b>{content.message.points[1].title}</b>
                      <span>{content.message.points[1].text}</span>
                    </div>
                  </div>
                </div>
                <div className="book-trust">
                  <Image
                    className="plogo lg"
                    src="/pearson-navy.png"
                    alt="Pearson"
                    width={82}
                    height={28}
                  />
                  <div>
                    <b>{content.trust.title}</b>
                    <span>{content.trust.subtitle}</span>
                  </div>
                </div>
              </div>
              <ContactFormOrCrm />
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
