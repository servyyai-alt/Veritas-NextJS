"use client";
import { useState, useEffect } from "react";

export default function WhatsApp() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 620);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <a className="wa" aria-label="Chat on WhatsApp" href="#">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"/>
        </svg>
      </a>
      <div className={`sticky-cta${showSticky ? " show" : ""}`} id="stickyCta">
        <div className="wrap sticky-inner">
          <div className="st-txt">
            <b>Authorised Pearson Partner</b>
            <span>From classroom to career — book a free consultation</span>
          </div>
          <a className="btn btn-primary" href="/book">Book now</a>
        </div>
      </div>
    </>
  );
}
