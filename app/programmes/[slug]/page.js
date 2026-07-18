import { connectDB } from "@/lib/mongodb";
import Programme from "@/models/Programme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const prog = await Programme.findOne({ slug, published: true }).lean();
  if (!prog) return { title: "Programme Not Found" };
  return {
    title: prog.metaTitle || `${prog.title} — Veritas by IQgrads`,
    description: prog.metaDesc || prog.shortDesc || "",
    openGraph: { title: prog.metaTitle || prog.title, description: prog.metaDesc || prog.shortDesc || "" },
  };
}

export default async function ProgrammePage({ params }) {
  const { slug } = await params;
  await connectDB();
  const prog = await Programme.findOne({ slug, published: true }).lean();
  if (!prog) notFound();

  const qs = prog.quickStats?.length
    ? prog.quickStats
    : [{ value: "5–6 mo", label: "Duration" }, { value: "Graduate", label: "Entry level" }, { value: "On-campus", label: "Format" }, { value: "Pearson", label: "Standard" }];

  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        {/* Hero */}
        <section className={`pd-hero cine ${prog.sceneClass || "s-auto"} kb`}>
          <div className="ph"></div><div className="tint"></div>
          <div className="wrap pd-hero-inner">
            <div className="breadcrumb">
              <Link href="/">Home</Link><span className="sep">/</span>
              <Link href="/programmes">Programmes</Link><span className="sep">/</span>
              <span>{prog.title}</span>
            </div>
            <span className="eyebrow on-img" style={{ marginTop: "16px" }}>
              Programme · {prog.domainCode} · Authorised Pearson Partner
            </span>
            <h1>{prog.title}</h1>
            {prog.lead && <p className="pd-lead">{prog.lead}</p>}
            <div className="pd-quickstats">
              {qs.map((q, i) => (
                <div className="pd-qs" key={i}>
                  <div className="qn">{q.value}</div>
                  <div className="ql">{q.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="white-sec">
          <div className="wrap pd-body">
            <div className="pd-main">

              {/* Overview */}
              {prog.overview && (
                <div className="pd-sec">
                  <span className="eyebrow">Industry overview</span>
                  <h2>About this field</h2>
                  <p>{prog.overview}</p>
                </div>
              )}

              {/* Roles */}
              {prog.roles?.length > 0 && (
                <div className="pd-sec">
                  <span className="eyebrow">Career pathways</span>
                  <h2>Roles you&apos;ll be ready for</h2>
                  <div className="role-list">
                    {prog.roles.map((r, i) => (
                      <div className="role" key={i}>
                        <span className="rdot"></span>
                        <div><b>{r.role}</b><span>{r.desc}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {prog.skills?.length > 0 && (
                <div className="pd-sec">
                  <span className="eyebrow">Skills you&apos;ll build</span>
                  <h2>What you&apos;ll be able to do</h2>
                  <div className="tag-list">
                    {prog.skills.map((s, i) => (
                      <span className="tag" key={i}>
                        <span className="mono">0{i + 1}</span>{s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {prog.projects?.length > 0 && (
                <div className="pd-sec">
                  <span className="eyebrow">Hands-on projects</span>
                  <h2>Real builds, not slideware</h2>
                  <div className="proj-grid">
                    {prog.projects.map((p, i) => (
                      <div className="proj" key={i}>
                        <div className="pnum">{p.pnum}</div>
                        <b>{p.title}</b>
                        <p>{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fees */}
              {prog.feeTotal && (
                <div className="pd-sec">
                  <span className="eyebrow">Programme fees</span>
                  <h2>How you pay</h2>
                  <div className="fee-total">
                    <span className="ft-l">Total fee</span>
                    <span className="ft-v">{prog.feeTotal}</span>
                  </div>
                  {prog.feeSteps?.length > 0 && (
                    <div className="fee-split">
                      {prog.feeSteps.map((fs, i) => (
                        <div className={`fee-step${i === 1 ? " s2" : ""}`} key={i}>
                          <div className="fee-pct">{fs.stage} — {fs.pct}</div>
                          <div className="fee-amt">{fs.amount}</div>
                          <b>{fs.title}</b>
                          <p>{fs.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {!prog.feeSteps?.length && (
                    <div className="fee-split">
                      <div className="fee-step">
                        <div className="fee-pct">Stage 1 — 50%</div>
                        <div className="fee-amt">At enrolment</div>
                        <b>Paid upfront</b>
                        <p>Paid before the programme starts to secure your place.</p>
                      </div>
                      <div className="fee-step s2">
                        <div className="fee-pct">Stage 2 — 50%</div>
                        <div className="fee-amt">On offer / cert</div>
                        <b>On offer or certification</b>
                        <p>Paid only when you receive an offer letter or complete certification.</p>
                      </div>
                    </div>
                  )}
                  <p className="gap-note" style={{ marginTop: "14px" }}>
                    Fees are illustrative — confirm in your consultation. Scholarships and financing are available.
                  </p>
                </div>
              )}
            </div>

            {/* Aside */}
            <div className="pd-aside">
              <div className="apply-card">
                <div className="apply-pearson">
                  <Image className="plogo" src="/pearson-navy.png" alt="Pearson" width={66} height={22} />
                  <div className="t"><b>Authorised Pearson Partner</b></div>
                </div>
                <div className="ac-tag">Programme · {prog.domainCode}</div>
                <h3>{prog.title}</h3>
                {qs.map((q, i) => (
                  <div className="ac-row" key={i}><span>{q.label}</span><b>{q.value}</b></div>
                ))}
                <Link className="btn btn-primary" href="/book">Apply now <span className="arrow">→</span></Link>
                <p className="ac-note">Free consultation first — no commitment to apply.</p>
              </div>

              {prog.salaryBands?.length > 0 && (
                <div className="salary-band">
                  <p className="mono" style={{ fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--slate)", marginBottom: "4px" }}>
                    Indicative salaries
                  </p>
                  {prog.salaryBands.map((s, i) => (
                    <div className="salary-row" key={i}>
                      <b>{s.level}</b><span className="amt">{s.amount}</span>
                    </div>
                  ))}
                  <p className="gap-note" style={{ marginTop: "10px" }}>Indicative — verify before publishing.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="final">
          <div className="wrap reveal">
            <span className="eyebrow center">Ready to start?</span>
            <h2>{prog.title} — book a free consultation.</h2>
            <p>Talk to a counsellor about whether this programme is right for you.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/book">Book a consultation <span className="arrow">→</span></Link>
              <Link className="btn btn-ghost" href="/programmes">All programmes</Link>
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
