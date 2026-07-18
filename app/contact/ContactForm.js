"use client";
import { useState } from "react";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", consent: false });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { alert("Please enter your name and phone number."); return; }
    if (!form.consent) { alert("Please tick the consent box."); return; }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "contact", name: form.name, phone: form.phone, email: form.email, message: form.message }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
      else alert(data.message || "Something went wrong. Please try again.");
    } catch { alert("Something went wrong. Please try again."); }
    setSending(false);
  };

  return (
    <div className="form-card reveal">
      {sent ? (
        <div className="form-success">
          <div className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <h3>Message sent ✓</h3>
          <p>Thanks — we&apos;ll get back to you within one working day.</p>
        </div>
      ) : (
        <>
          <div className="field"><label htmlFor="c-name">Name <span className="req">*</span></label><input id="c-name" type="text" placeholder="Your name" required value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="field-row">
            <div className="field"><label htmlFor="c-phone">Phone <span className="req">*</span></label><input id="c-phone" type="tel" placeholder="+91" required value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
          </div>
          <div className="field"><label htmlFor="c-msg">Message</label><input id="c-msg" type="text" placeholder="How can we help?" value={form.message} onChange={(e) => set("message", e.target.value)} /></div>
          <label className="consent">
            <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} />
            <span>I agree to be contacted by Veritas by IQgrads. See our <a href="/privacy-policy">Privacy Policy</a>.</span>
          </label>
          <button className="btn btn-primary" disabled={sending} onClick={handleSubmit}>
            {sending ? "Sending…" : <>Send message <span className="arrow">→</span></>}
          </button>
          <p className="form-note">We&apos;ll never share your details.</p>
        </>
      )}
    </div>
  );
}
