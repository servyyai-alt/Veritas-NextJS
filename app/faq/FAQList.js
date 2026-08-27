"use client";
import { useState } from "react";
import { DEFAULT_FAQ_CONTENT } from "@/lib/faq-content";

export default function FAQList({ content = DEFAULT_FAQ_CONTENT }) {
  const [open, setOpen] = useState(null);
  const faqs = content.faqs || DEFAULT_FAQ_CONTENT.faqs;

  return (
    <div className="faq-list reveal">
      {faqs.map((f, i) => (
        <div className={`faq${open === i ? " open" : ""}`} key={`${f.q}-${i}`}>
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
