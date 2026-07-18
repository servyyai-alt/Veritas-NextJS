import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Industrial Automation — Veritas by IQgrads",
  description: "Design, program and commission industrial control systems on real PLCs, SCADA and robotic cells — to a globally recognised standard.",
};

export default function Programme() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="pd-hero cine s-auto kb">
          <div className="ph"></div><div className="tint"></div>
          <div className="wrap pd-hero-inner">
            <div className="breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><Link href="/programmes">Programmes</Link><span className="sep">/</span><span>Industrial Automation</span></div>
            <span className="eyebrow on-img" style={{ marginTop: "16px" }}>Programme · D-06 · Authorised Pearson Partner</span>
            <h1>Industrial Automation</h1>
            <p className="pd-lead">Learn to design, program and commission the control systems that run modern factories — on real PLCs, SCADA and robotic cells, to a globally recognised standard.</p>
            <div className="pd-quickstats">
              {[["5–6 mo","Duration"],["Graduate","Entry level"],["On-campus","Lab-based"],["Pearson","Aligned standard"]].map(([qn,ql]) => (
                <div className="pd-qs" key={ql}><div className="qn">{qn}</div><div className="ql">{ql}</div></div>
              ))}
            </div>
          </div>
        </section>

        <section className="white-sec">
          <div className="wrap pd-body">
            <div className="pd-main">

              <div className="pd-sec">
                <span className="eyebrow">Industry overview</span>
                <h2>The nervous system of every modern factory</h2>
                <p>Automation is what keeps a modern factory running — the controllers, sensors and software all talking to each other. As Indian factories modernise, there simply aren&apos;t enough people who can set these systems up and fix them. That&apos;s the gap you&apos;d be stepping into.</p>
                <p>You&apos;ll go from the basics to genuinely confident — on the same equipment you&apos;d find on a real production line.</p>
              </div>

              <div className="pd-sec">
                <span className="eyebrow">Career pathways</span>
                <h2>Roles you&apos;ll be ready for</h2>
                <div className="role-list">
                  {[
                    ["Automation Engineer","Design, program and commission PLC/SCADA systems."],
                    ["PLC Programmer","Build and maintain ladder logic for production lines."],
                    ["Control Systems Technician","Install, calibrate and troubleshoot instrumentation."],
                    ["SCADA / HMI Engineer","Develop supervisory interfaces and monitor plants."],
                  ].map(([role, desc]) => (
                    <div className="role" key={role}><span className="rdot"></span><div><b>{role}</b><span>{desc}</span></div></div>
                  ))}
                </div>
              </div>

              <div className="pd-sec">
                <span className="eyebrow">Skills you&apos;ll build</span>
                <h2>What you&apos;ll be able to do</h2>
                <div className="tag-list">
                  {["PLC programming","SCADA configuration","HMI design","Sensor & actuator wiring","Industrial protocols","Motor drives & VFDs","Process control loops","Fault diagnosis","Electrical safety"].map((s, i) => (
                    <span className="tag" key={s}><span className="mono">0{i+1}</span>{s}</span>
                  ))}
                </div>
              </div>

              <div className="pd-sec">
                <span className="eyebrow">Hands-on projects</span>
                <h2>Real builds, not slideware</h2>
                <div className="proj-grid">
                  {[
                    ["PRJ-01","Automated bottling line","Conveyor + sensor + actuator sequence with fault handling."],
                    ["PRJ-02","Tank level control","Closed-loop control with a SCADA dashboard."],
                    ["PRJ-03","Robotic pick-and-place","Robot arm integrated with PLC logic and interlocks."],
                    ["PRJ-04","Capstone: mini line","An end-to-end automated process you can demo in interviews."],
                  ].map(([pnum, h, p]) => (
                    <div className="proj" key={pnum}><div className="pnum">{pnum}</div><b>{h}</b><p>{p}</p></div>
                  ))}
                </div>
              </div>

              <div className="pd-sec">
                <span className="eyebrow">Equipment &amp; software</span>
                <h2>You&apos;ll work on the real thing</h2>
                <p style={{ fontSize: "14px", marginBottom: "4px" }}><b style={{ fontFamily: "'Space Grotesk'", color: "var(--navy)" }}>Equipment</b></p>
                <div className="tag-list" style={{ marginBottom: "18px" }}>
                  {["PLC trainer rigs","HMI panels","VFD & motor sets","Sensor & actuator kits","Robotic work cell"].map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
                <p style={{ fontSize: "14px", marginBottom: "4px" }}><b style={{ fontFamily: "'Space Grotesk'", color: "var(--navy)" }}>Software</b></p>
                <div className="tag-list">
                  {["PLC programming suites","SCADA software","HMI tools","Simulation"].map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
                <p className="gap-note" style={{ marginTop: "14px" }}>* Specific brands and software listed per actual lab inventory.</p>
              </div>

              <div className="pd-sec">
                <span className="eyebrow">Certification</span>
                <h2>Recognised, competency-based</h2>
                <p>Finish the programme and you get a Veritas by IQgrads certification, with your learning aligned to Pearson&apos;s internationally recognised standards — real proof of what you can do.</p>
                <p className="gap-note">* Confirm exact certification and Pearson wording before publishing.</p>
              </div>

              <div className="pd-sec">
                <span className="eyebrow">Fees &amp; payment</span>
                <h2>Pay half now — the rest when it pays off</h2>
                <div
                  className="fee-pearson"
                  style={{ display: "inline-flex", alignItems: "center", gap: "9px", fontFamily: "'IBM Plex Mono'", fontSize: "11.5px", color: "var(--gold-deep)", marginTop: "4px" }}
                >
                  <span
                    style={{ width: "22px", height: "22px", border: "1px solid var(--gold)", borderRadius: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--gold-deep)", fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: "11px" }}
                  >P</span> Delivered to globally recognised Pearson standards
                </div>
                <div className="fee-total" style={{ marginTop: "14px" }}><span className="ft-l">Total programme fee*</span><span className="ft-v">₹3,00,000</span></div>
                <div className="fee-split">
                  <div className="fee-step s1">
                    <div className="fee-pct">Stage 1 · 50%</div>
                    <div className="fee-amt">₹1,50,000*</div>
                    <b>At enrolment</b>
                    <p>Secures your seat and begins hands-on training.</p>
                  </div>
                  <div className="fee-step s2">
                    <div className="fee-pct">Stage 2 · 50%</div>
                    <div className="fee-amt">₹1,50,000*</div>
                    <b>On offer letter or certification</b>
                    <p>The balance falls due only when you receive a job offer or complete certification.</p>
                  </div>
                </div>
                <p className="gap-note" style={{ marginTop: "14px" }}>* Illustrative. Scholarships and financing available — confirm exact fees in your consultation.</p>
              </div>

              <div className="pd-sec">
                <span className="eyebrow">After Veritas · study abroad</span>
                <h2>A springboard to a Master&apos;s degree in Europe</h2>
                <p>For a lot of people, Veritas is just step one. The hands-on, globally-recognised experience makes your profile stronger if you want to study abroad later — and these happen to be the exact skills European employers are short on.</p>
                <div className="abroad">
                  <div className="pnum">Primary pathway</div>
                  <b>A Master&apos;s degree abroad — Europe in focus</b>
                  <p>Automation, robotics, semiconductors, EV, Industry 4.0 — these skills are in real demand across Europe right now.</p>
                  <div className="tag-list" style={{ position: "relative", zIndex: 1 }}>
                    {["Germany","Netherlands","Ireland","Nordics","Wider EU"].map((c) => (
                      <span className="tag" key={c}>{c}</span>
                    ))}
                  </div>
                </div>
                <div className="path-grid">
                  <div className="path"><div className="pnum">ALSO</div><b>Global-standard foundation</b><p>Pearson-aligned learning that complements an international application.*</p></div>
                  <div className="path"><div className="pnum">ALSO</div><b>Stack a specialisation</b><p>Add advanced tracks before applying abroad.</p></div>
                  <div className="path"><div className="pnum">ALSO</div><b>Professional certifications</b><p>Industry certifications that travel internationally.</p></div>
                </div>
                <p className="gap-note" style={{ marginTop: "14px" }}>* Study-abroad outcomes depend on admissions, language, funding and visas, which Veritas does not control. Confirm guidance and any partnerships, and verify demand claims, before publishing.</p>
              </div>

              <div className="pd-sec" style={{ borderBottom: "none" }}>
                <span className="eyebrow">Hiring industries</span>
                <h2>Who hires for these skills</h2>
                <div className="tag-list">
                  {["Automotive","FMCG & packaging","Pharmaceuticals","Steel & metals","Electronics","Food & beverage","Energy & utilities","System integrators"].map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
                <p className="gap-note" style={{ marginTop: "14px" }}>Indicative sectors hiring for these skills — verify before publishing.</p>
              </div>

            </div>

            <aside className="pd-aside">
              <div className="apply-card">
                <div className="apply-pearson">
                  <div className="pseal">
                    <Image className="plogo" src="/pearson-navy.png" alt="Pearson" width={66} height={22} />
                    <div className="t"><b>Authorised Pearson Partner</b><span>Globally trusted standard</span></div>
                  </div>
                </div>
                <div className="ac-tag">Industrial Automation</div>
                <h3>Apply for this programme</h3>
                <div className="ac-row"><span>Duration</span><b>5–6 months</b></div>
                <div className="ac-row"><span>Mode</span><b>On-campus, lab-based</b></div>
                <div className="ac-row"><span>Eligibility</span><b>Engineering / diploma</b></div>
                <div className="ac-row"><span>Total fee*</span><b>₹3,00,000</b></div>
                <div className="ac-row"><span>At enrolment (50%)</span><b>₹1,50,000</b></div>
                <div className="ac-row"><span>On offer / certification</span><b>₹1,50,000</b></div>
                <Link className="btn btn-primary" href="/book">Apply now <span className="arrow">→</span></Link>
                <Link className="btn btn-ghost" style={{ marginTop: "10px", width: "100%", justifyContent: "center" }} href="/book">Book a free consultation</Link>
                <p className="ac-note">Pay 50% at enrolment, 50% only on your offer letter or certification. Fees illustrative — confirm in your consultation.</p>
              </div>
              <div className="salary-band">
                <div className="salary-row"><b>Entry (market)*</b><span className="amt">₹3–6 LPA</span></div>
                <div className="salary-row"><b>Mid-level (market)*</b><span className="amt">₹6–10 LPA</span></div>
                <div className="salary-row"><b>Senior (market)*</b><span className="amt">₹10–18 LPA</span></div>
              </div>
              <p className="gap-note" style={{ marginTop: "10px" }}>* Indicative market ranges, illustrative — not a Veritas outcome claim.</p>
            </aside>
          </div>
        </section>

        <section className="final">
          <div className="wrap reveal">
            <span className="eyebrow center">Ready to start?</span>
            <h2>Turn this programme into your first offer letter.</h2>
            <p>Have a quick chat with us — we&apos;ll sort out eligibility, fees and the quickest route into an automation job.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">Book a consultation <span className="arrow">→</span></Link>
              <Link className="btn btn-ghost" href="/programmes">See other programmes</Link>
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
