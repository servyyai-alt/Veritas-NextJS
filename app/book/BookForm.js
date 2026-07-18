"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BookForm() {
  const [view, setView] = useState("form");
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", qual: "Engineering (B.E./B.Tech)", city: "", prog: "Industrial Automation", consent: false });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { alert("Please enter your name and phone number."); return; }
    if (!form.consent) { alert("Please tick the consent box so we can contact you."); return; }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "book", name: form.name, phone: form.phone, email: form.email, subject: `Consultation request — ${form.prog}`, message: `Qualification: ${form.qual} | City: ${form.city} | Programme: ${form.prog}` }),
      });
      const data = await res.json();
      if (data.success) setView("success");
      else alert(data.message || "Something went wrong. Please try again.");
    } catch { alert("Something went wrong. Please try again."); }
    setSending(false);
  };

  const handleReset = () => {
    setView("form"); setSending(false);
    setForm({ name: "", phone: "", email: "", qual: "Engineering (B.E./B.Tech)", city: "", prog: "Industrial Automation", consent: false });
  };

  return (
    <div className="form-card reveal">
      {view === "form" ? (
        <>
          <div className="field"><label htmlFor="f-name">Full name <span className="req">*</span></label><input id="f-name" type="text" placeholder="Your name" autoComplete="name" required value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="field-row">
            <div className="field"><label htmlFor="f-phone">Phone <span className="req">*</span></label><input id="f-phone" type="tel" placeholder="+91" autoComplete="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div className="field"><label htmlFor="f-email">Email</label><input id="f-email" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="f-qual">Qualification</label>
              <select id="f-qual" value={form.qual} onChange={(e) => set("qual", e.target.value)}>
                <option>Engineering (B.E./B.Tech)</option>
                <option>Diploma / Polytechnic</option>
                <option>Science graduate</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field"><label htmlFor="f-city">City</label><input id="f-city" type="text" placeholder="Your city" value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
          </div>
          <div className="field">
            <label htmlFor="f-prog">Programme of interest</label>
            <select id="f-prog" value={form.prog} onChange={(e) => set("prog", e.target.value)}>
              <option>Industrial Automation</option>
              <option>Robotics</option>
              <option>Semiconductor Manufacturing</option>
              <option>PLC &amp; SCADA</option>
              <option>Electric Vehicles</option>
              <option>Not sure — recommend one</option>
            </select>
          </div>
          <label className="consent">
            <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} />
            <span>I agree to be contacted by Veritas by IQgrads. See our <Link href="/privacy-policy">Privacy Policy</Link>.</span>
          </label>
          <div className="form-pearson">
            <div className="pseal">
              <Image className="plogo" src="/pearson-navy.png" alt="Pearson" width={66} height={22} />
              <div className="t"><b>Authorised Pearson Partner</b><span>You train to a globally trusted standard</span></div>
            </div>
          </div>
          <button className="btn btn-primary" disabled={sending} onClick={handleSubmit}>
            {sending ? "Sending…" : <>Request my consultation <span className="arrow">→</span></>}
          </button>
          <p className="form-note">We&apos;ll never share your details.</p>
        </>
      ) : (
        <div className="form-success">
          <div className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <h3>Request received</h3>
          <p>Thanks — a Veritas counsellor will call you within one working day.</p>
          <button className="btn btn-ghost-dark" style={{ marginTop: "22px" }} onClick={handleReset}>Submit another</button>
        </div>
      )}
    </div>
  );
}
