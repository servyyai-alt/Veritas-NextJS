import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import RevealObserver from "@/components/RevealObserver";
import Link from "next/link";

export const metadata = {
  title: "Blog — Veritas by IQgrads",
  description: "Honest, practical advice on careers in advanced industries, employability and getting hired.",
};

export const revalidate = 60;

const STATIC_BLOGS = [
  { _id: "s1", slug: "degree-no-job", category: "Careers", title: "Your engineering degree didn't get you a job. Here's why — and what does.", excerpt: "The gap between a qualification and a hire, and the practical moves that actually lead to an offer.", status: "published", createdAt: new Date("2026-06-01") },
  { _id: "s2", slug: "automation-roles-india", category: "Industry", title: "Industrial automation in India: the roles companies are actually hiring for", excerpt: "A plain-English guide to entry-level automation roles and the skills behind each one.", status: "published", createdAt: new Date("2026-06-01") },
];

export default async function BlogPage() {
  let blogs = [];
  try {
    await connectDB();
    const dbBlogs = await Blog.find({ status: { $in: ["published", "coming_soon"] } }).sort({ createdAt: -1 }).lean();
    blogs = dbBlogs.length > 0 ? dbBlogs : STATIC_BLOGS;
  } catch {
    blogs = STATIC_BLOGS;
  }

  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Blog</span></div>
            <h1>Practical, honest advice on building a career</h1>
            <p>No fluff — just useful guidance on employability, the industries that are hiring, and how to actually get into them.</p>
          </div>
        </section>
        <section className="block light-sec">
          <div className="wrap">
            <div className="blog-grid">
              {blogs.map((b) => {
                const isComingSoon = b.status === "coming_soon";
                const dateStr = (b.publishedAt || b.createdAt) ? new Date(b.publishedAt || b.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "";
                if (isComingSoon) {
                  return (
                    <div className="post-card soon" key={String(b._id)}>
                      <span className="post-cat">{b.category}</span>
                      <h3>{b.title}</h3>
                      <p>{b.excerpt}</p>
                      <div className="post-meta"><span>Coming soon</span><span></span></div>
                    </div>
                  );
                }
                return (
                  <Link className="post-card" href={`/blog/${b.slug}`} key={String(b._id)}>
                    <span className="post-cat">{b.category}</span>
                    <h3>{b.title}</h3>
                    <p>{b.excerpt}</p>
                    <div className="post-meta"><span>{dateStr}</span><span className="more">Read →</span></div>
                  </Link>
                );
              })}
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
