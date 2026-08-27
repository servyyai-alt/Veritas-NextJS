import { connectDB } from "@/lib/mongodb";
import Programme from "@/models/Programme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import ProgrammesGrid from "./ProgrammesGrid";
import Link from "next/link";
import { loadProgrammesPageContent } from "@/lib/programmes-page-settings";

export const revalidate = 0;

export async function generateMetadata() {
  const content = await loadProgrammesPageContent();

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: { canonical: "https://www.veritasbyiqgrads.com/programmes" },
    openGraph: {
      type: "website",
      title: content.metadata.title,
      description: content.metadata.description,
      url: "https://www.veritasbyiqgrads.com/programmes",
      images: [{ url: "https://www.veritasbyiqgrads.com/assets/img/og-cover.jpg" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ProgrammesPage() {
  const content = await loadProgrammesPageContent();
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
            <div className="breadcrumb">
              <Link href="/">{content.hero.breadcrumbHome}</Link>
              <span className="sep">/</span>
              <span>{content.hero.breadcrumbCurrent}</span>
            </div>
            <h1>{content.hero.title}</h1>
            <p>{content.hero.description}</p>
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
