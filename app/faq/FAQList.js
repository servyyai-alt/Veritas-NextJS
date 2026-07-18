"use client";
import { useState } from "react";

const FAQS = [
  { q: "Veritas is new — why should I trust it?", a: "Fair question. We're upfront that we're new, which is exactly why we're an Authorised Pearson Partner: the standard you learn to is internationally recognised and trusted by employers worldwide, even though our name is new. Our fee model also puts the risk on us — you pay the second half only when you have an offer or certification." },
  { q: "What does the Pearson partnership actually mean?", a: "It means our learning is aligned to Pearson's internationally recognised, competency-based standards. It does not mean Pearson runs the programme or guarantees a job — Veritas delivers the hands-on training; Pearson provides the globally trusted standard it's built to." },
  { q: "I graduated a while ago / have a gap. Is it too late?", a: "No. Employers in these fields care far more about whether you can do the work than about a gap. We help you build demonstrable skills and a confident story — many learners are exactly in this position." },
  { q: "I'm in my late twenties and want to switch careers. Too old?", a: "Not at all. Career changers bring focus employers value. The programmes are intensive and practical so you can move into a new field quickly." },
  { q: "What does \"placement assurance\" mean — is a job guaranteed?", a: "It means we assure you of our support, backed by the skills you acquire: we keep working with you, and bridge any gap with further training, until you're placed. It is not a blanket guarantee of a specific job or salary — exact terms are explained in your consultation." },
  { q: "How do the fees work?", a: "You pay in two stages: 50% at enrolment, and the remaining 50% only when you receive your offer letter or complete certification. Scholarships and financing are available. (Figures shown are illustrative — confirm in your consultation.)" },
  { q: "Can this lead to studying abroad?", a: "Many graduates use Veritas as a springboard to a Master's abroad, especially in Europe where these skills are in demand. We can guide you, but admissions, language, funding and visas are outside our control." },
];

export default function FAQList() {
  const [open, setOpen] = useState(null);

  return (
    <div className="faq-list reveal">
      {FAQS.map((f, i) => (
        <div className={`faq${open === i ? " open" : ""}`} key={i}>
          <button
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {f.q}<span className="pm"></span>
          </button>
          <div className="ans" style={{ maxHeight: open === i ? "400px" : "0" }}>
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
