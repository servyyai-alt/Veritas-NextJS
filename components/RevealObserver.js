"use client";
import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    function fillBars(scope) {
      scope.querySelectorAll(".track .floor[data-w]").forEach((f) => {
        f.style.width = f.getAttribute("data-w") + "%";
      });
    }

    if ("IntersectionObserver" in window && !reduce) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            fillBars(e.target);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.14 });
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
      return () => io.disconnect();
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
      fillBars(document);
    }
  }, []);

  return null;
}
