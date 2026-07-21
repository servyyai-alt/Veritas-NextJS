import { connectDB } from "@/lib/mongodb";
import Programme from "@/models/Programme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import ProgrammesGrid from "./ProgrammesGrid";
import Link from "next/link";

export const metadata = {
  title: "Programmes — Veritas by IQgrads",
  description: "22 hands-on industry pathways built to globally recognised Pearson standards.",
};

export const revalidate = 0;

export default async function ProgrammesPage() {
  let dbProgrammes = [];
  let knownCodes = [];
  try {
    await connectDB();
    dbProgrammes = await Programme.find({ published: true }).sort({ domainCode: 1 })
      .select("title slug domainCode shortDesc sceneClass").lean();
    const allProgrammes = await Programme.find({}, { domainCode: 1, _id: 0 }).lean();
    knownCodes = allProgrammes.map((p) => p.domainCode);
  } catch (e) { console.error("Programmes page DB error:", e); }

  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Programmes</span></div>
            <h1>22 fields to train in. One standard the world trusts.</h1>
            <p>All hands-on and built to Pearson&apos;s globally recognised standards. Pick one to see what you&apos;ll learn, what you&apos;ll build, what it costs, and how to join.</p>
          </div>
        </section>
        <section className="block light-sec">
          <div className="wrap">
            <ProgrammesGrid dbProgrammes={dbProgrammes.map(p => ({ ...p, _id: String(p._id) }))} knownCodes={knownCodes} />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
      <RevealObserver />
    </>
  );
}
