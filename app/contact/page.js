import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import ContactFormOrCrm from "./ContactFormOrCrm";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Contact — Veritas by IQgrads",
  description:
    "Talk to Veritas by IQgrads — graduates, parents and employers welcome. Book a free career consultation.",
};

export default function Contact() {
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
            <h1>Talk to us</h1>
            <p>
              Graduate, parent or employer — we&apos;re glad you&apos;re here.
              Quickest way to get going is a free consultation.
            </p>
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
                <b>Call us</b>
                <p>
                  +91 00000 00000
                  <br />
                  <span className="gap-note">
                    Placeholder — add real number
                  </span>
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
                <b>Email us</b>
                <p>
                  hello@veritas.example
                  <br />
                  <span className="gap-note">Placeholder — add real email</span>
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
                <b>Visit us</b>
                <p>
                  No 4, 3rd Floor, Swathi Complex, No 34, Venkatnarayana Road, Nandanam, Chennai 600035
                </p>
              </div>
            </div>
            <div className="book-grid">
              <div className="reveal">
                <span className="eyebrow">Send a message</span>
                <h2 style={{ fontSize: "28px", marginTop: "14px" }}>
                  We&apos;ll get back within one working day
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
                      <b>For graduates &amp; parents</b>
                      <span>Programme advice, fees and the path to a job.</span>
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
                      <b>For employers</b>
                      <span>
                        Hiring our graduates or co-designing training.
                      </span>
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
                    <b>Authorised Pearson Partner</b>
                    <span>Globally trusted standard</span>
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
