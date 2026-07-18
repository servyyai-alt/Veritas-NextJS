import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const blog = await Blog.findOne({ slug, status: { $in: ["published", "coming_soon"] } }).lean();
  if (!blog) return { title: "Blog Not Found" };
  return {
    title: blog.metaTitle || `${blog.title} — Veritas by IQgrads`,
    description: blog.metaDesc || blog.excerpt || "",
    openGraph: { title: blog.metaTitle || blog.title, description: blog.metaDesc || blog.excerpt || "" },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  await connectDB();
  const blog = await Blog.findOne({ slug, status: { $in: ["published", "coming_soon"] } }).lean();
  if (!blog) notFound();

  // Coming Soon state
  if (blog.status === "coming_soon") {
    return (
      <>
        <Navbar />
        <main id="main" tabIndex="-1">
          <section className="page-hero">
            <div className="wrap">
              <div className="breadcrumb">
                <Link href="/">Home</Link><span className="sep">/</span>
                <Link href="/blog">Blog</Link><span className="sep">/</span>
                <span>{blog.category}</span>
              </div>
              <h1>{blog.title}</h1>
            </div>
          </section>
          <section className="block white-sec">
            <div className="wrap" style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--wine-tint)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--wine)" strokeWidth="1.8" width="28" height="28">
                  <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize: "28px", color: "var(--navy)", marginBottom: "12px" }}>Coming Soon</h2>
              <p style={{ fontSize: "16px", color: "var(--slate)", maxWidth: "480px", margin: "0 auto 28px" }}>
                This article will be published soon. Check back later or explore our other posts.
              </p>
              <Link className="btn btn-primary" href="/blog">← Back to Blog</Link>
            </div>
          </section>
        </main>
        <Footer />
        <WhatsApp />
      </>
    );
  }

  // Fetch related posts
  let relatedPosts = [];
  if (blog.relatedSlugs?.length) {
    relatedPosts = await Blog.find({ slug: { $in: blog.relatedSlugs }, status: "published" })
      .select("title slug category excerpt").lean();
  }

  return (
    <>
      <Navbar />
      <main id="main" tabIndex="-1">
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumb">
              <Link href="/">Home</Link><span className="sep">/</span>
              <Link href="/blog">Blog</Link><span className="sep">/</span>
              <span>{blog.category}</span>
            </div>
            <h1>{blog.title}</h1>
            {blog.excerpt && <p>{blog.excerpt}</p>}
          </div>
        </section>

        <section className="block white-sec">
          <div className="wrap">
            <div className="article">
              <p className="a-meta">
                {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" }) : ""}
                {blog.publishedAt && blog.category ? " · " : ""}{blog.category}
                {blog.author ? ` · ${blog.author}` : ""}
              </p>

              {/* Render HTML content safely */}
              {blog.content ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <p className="lead">{blog.excerpt}</p>
              )}

              {/* CTA block */}
              <div className="a-cta">
                <b>Ready to close the gap?</b>
                <p>We&apos;re an Authorised Pearson Partner — hands-on training to a globally trusted standard, with placement support until you&apos;re hired.</p>
                <Link className="btn btn-primary !text-white" href="/book" style={{ marginTop: "14px", display: "inline-flex" }}>
                  Book a free consultation <span className="arrow">→</span>
                </Link>
              </div>

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div className="a-related">
                  {relatedPosts.map((r) => (
                    <Link className="post-card" href={`/blog/${r.slug}`} key={r._id}>
                      <span className="post-cat">{r.category}</span>
                      <h3>{r.title}</h3>
                      <div className="post-meta"><span></span><span className="more">Read →</span></div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}
