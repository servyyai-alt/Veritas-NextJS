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

export const revalidate = 60;

export default async function ProgrammesPage() {
  let dbProgrammes = [];
  try {
    await connectDB();
    dbProgrammes = await Programme.find({ published: true }).sort({ createdAt: -1 })
      .select("title slug domainCode shortDesc sceneClass").lean();
  } catch { /* fallback to static grid */ }

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
            <ProgrammesGrid dbProgrammes={dbProgrammes.map(p => ({ ...p, _id: String(p._id) }))} />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
      <RevealObserver />
    </>
  );
}
