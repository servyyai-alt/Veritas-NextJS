import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Veritas by IQgrads",
  description: "How Veritas by IQgrads collects, uses and protects your personal data.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Privacy Policy</span></div>
            <h1>Privacy Policy</h1>
            <p>How Veritas by IQgrads collects, uses, and protects your personal data.</p>
          </div>
        </section>
        <section className="block white-sec">
          <div className="wrap">
            <div className="legal article">
              <div className="note"><b>Template — review before publishing.</b> This is a starting draft, not legal advice. Have it reviewed by a qualified lawyer and tailored to your actual data practices and to India&rsquo;s Digital Personal Data Protection Act, 2023 (and any other laws that apply to you). Replace every <b>[bracketed]</b> placeholder.</div>
              <p className="a-meta">Last updated: [DATE]</p>
              <p>Veritas by IQgrads (&ldquo;Veritas&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operated by [LEGAL ENTITY NAME], [REGISTERED ADDRESS], respects your privacy. This policy explains what personal data we collect, why, and your rights over it.</p>
              <h2>1. What we collect</h2>
              <ul>
                <li><b>Information you give us</b> through our forms: name, phone number, email, qualification, city, programme of interest, and any message you send.</li>
                <li><b>Technical information</b> collected automatically: IP address, device and browser type, and usage data via cookies or analytics (see Cookies below).</li>
              </ul>
              <h2>2. Why we use it</h2>
              <ul>
                <li>To respond to your enquiry and arrange a career consultation.</li>
                <li>To provide information about programmes, fees and placement support you have asked about.</li>
                <li>With your consent, to send you relevant updates. You can opt out at any time.</li>
                <li>To improve our website and services.</li>
              </ul>
              <h2>3. Consent &amp; legal basis</h2>
              <p>We process your data on the basis of the consent you give when you submit a form, and to take steps at your request before providing our services. You may withdraw consent at any time by contacting us (see below); this will not affect processing already carried out.</p>
              <h2>4. Who we share it with</h2>
              <p>We do not sell your personal data. We may share it with service providers who help us operate (for example, our CRM, hosting and communication tools), under appropriate confidentiality and data-protection obligations. We may disclose data if required by law. [State whether any data is shared with partners; do not list Pearson here unless that sharing actually occurs and is permitted.]</p>
              <h2>5. How long we keep it</h2>
              <p>We keep your data only as long as needed for the purposes above, or as required by law, after which it is securely deleted. [State your retention period.]</p>
              <h2>6. How we protect it</h2>
              <p>We use reasonable technical and organisational measures to protect your data. No method of transmission over the internet is fully secure, so we cannot guarantee absolute security.</p>
              <h2>7. Your rights</h2>
              <p>Subject to applicable law, you may request to access, correct, update or erase your data, or withdraw consent. To exercise these rights, contact us at [PRIVACY EMAIL]. You may also raise a concern with our Grievance Officer, [NAME], at [GRIEVANCE EMAIL] / [PHONE].</p>
              <h2>8. Children</h2>
              <p>If you are under 18, please involve a parent or guardian. Where required, we obtain verifiable parental or guardian consent before processing a minor&rsquo;s data. [Confirm your approach, as some applicants and the parents who fund them may be involved.]</p>
              <h2>9. Cookies</h2>
              <p>We may use cookies and similar technologies for essential site function and, with your consent, for analytics. You can control cookies through your browser settings. [Add a cookie banner/consent tool if you use non-essential cookies.]</p>
              <h2>10. Changes</h2>
              <p>We may update this policy from time to time. The latest version will always be on this page with its date.</p>
              <h2>11. Contact</h2>
              <p>Questions about this policy or your data? Email [PRIVACY EMAIL] or write to [REGISTERED ADDRESS].</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
