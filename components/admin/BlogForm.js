"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const S = {
  form: { background: "#fff", borderRadius: "14px", border: "1px solid #E6DFD3", padding: "28px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  field: { marginBottom: "18px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#16294A", marginBottom: "6px" },
  input: { width: "100%", padding: "11px 13px", border: "1px solid #E6DFD3", borderRadius: "9px", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "11px 13px", border: "1px solid #E6DFD3", borderRadius: "9px", fontSize: "14px", fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" },
  select: { width: "100%", padding: "11px 13px", border: "1px solid #E6DFD3", borderRadius: "9px", fontSize: "14px", fontFamily: "inherit", outline: "none" },
  btn: { background: "#8A2434", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 22px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnSec: { background: "#fff", color: "#16294A", border: "1px solid #E6DFD3", borderRadius: "10px", padding: "12px 22px", fontSize: "15px", cursor: "pointer", fontFamily: "inherit", marginLeft: "12px" },
  section: { marginBottom: "28px" },
  sh: { fontFamily: "'Space Grotesk',sans-serif", fontSize: "16px", color: "#16294A", margin: "0 0 14px", paddingBottom: "8px", borderBottom: "1px solid #E6DFD3" },
  err: { background: "#F3E5E6", border: "1px solid #E7C9CD", borderRadius: "8px", padding: "12px", marginBottom: "16px", color: "#8A2434", fontSize: "14px" },
  hint: { fontSize: "12px", color: "#54607A", marginTop: "5px", fontFamily: "'IBM Plex Mono',monospace" },
};

const CATEGORIES = ["Careers", "Industry", "Skills", "Advice", "Study abroad"];

const TOOLBAR_BUTTONS = [
  { label: "B", title: "Bold", tag: "b" },
  { label: "I", title: "Italic", tag: "i" },
  { label: "H2", title: "Heading 2", tag: "h2" },
  { label: "H3", title: "Heading 3", tag: "h3" },
  { label: "¶", title: "Paragraph", tag: "p" },
  { label: "• List", title: "Bullet list", wrap: "ul>li" },
  { label: "1. List", title: "Numbered list", wrap: "ol>li" },
  { label: "❝ Quote", title: "Blockquote", tag: "blockquote" },
  { label: "—", title: "Horizontal rule", tag: "hr" },
  { label: "Link", title: "Insert link", action: "link" },
];

export default function BlogForm({ initial = {}, isEdit = false }) {
  const router = useRouter();
  const textareaRef = useRef(null);
  const [form, setForm] = useState({
    title: "", slug: "", category: "Careers", excerpt: "", content: "",
    author: "Veritas Team", status: "draft", scheduledAt: "",
    image: "", metaTitle: "", metaDesc: "", relatedSlugs: "",
    ...initial,
    relatedSlugs: initial.relatedSlugs ? initial.relatedSlugs.join(", ") : "",
    scheduledAt: initial.scheduledAt ? new Date(initial.scheduledAt).toISOString().slice(0, 16) : "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const insertAtCursor = useCallback((before, after = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = form.content.substring(start, end);
    const replacement = before + (selected || "text") + after;
    const newContent = form.content.substring(0, start) + replacement + form.content.substring(end);
    set("content", newContent);
    setTimeout(() => {
      ta.focus();
      const cursorPos = start + before.length + (selected ? selected.length : 4) + after.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  }, [form.content]);

  const handleToolbar = (btn) => {
    if (btn.action === "link") {
      const url = prompt("Enter URL:");
      if (!url) return;
      insertAtCursor(`<a href="${url}">`, "</a>");
      return;
    }
    if (btn.wrap) {
      const [container, inner] = btn.wrap.split(">");
      insertAtCursor(`<${container}>\n<${inner}>`, `</${inner}>\n</${container}>`);
      return;
    }
    if (btn.tag === "hr") {
      insertAtCursor("<hr>\n");
      return;
    }
    insertAtCursor(`<${btn.tag}>`, `</${btn.tag}>`);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.success) set("image", data.url);
  };

  const handleSubmit = async () => {
    setError(""); setSaving(true);
    const payload = {
      ...form,
      relatedSlugs: typeof form.relatedSlugs === "string" ? form.relatedSlugs.split(",").map((s) => s.trim()).filter(Boolean) : form.relatedSlugs,
      scheduledAt: form.scheduledAt || undefined,
    };
    const url = isEdit ? `/api/blogs/${initial._id}` : "/api/blogs";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setSaving(false);
    if (data.success) router.push("/admin/blogs");
    else setError(data.message || "Save failed");
  };

  return (
    <div style={S.form}>
      {error && <div style={S.err}>{error}</div>}

      <div style={S.section}>
        <h3 style={S.sh}>Basic Information</h3>
        <div style={S.field}><label style={S.label}>Title *</label><input style={S.input} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Your blog post title" /></div>
        <div style={S.grid2}>
          <div style={S.field}><label style={S.label}>Slug (auto-generated if blank)</label><input style={S.input} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="your-blog-post" /></div>
          <div style={S.field}>
            <label style={S.label}>Category</label>
            <select style={S.select} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={S.field}><label style={S.label}>Excerpt / Summary</label><textarea style={{ ...S.textarea, minHeight: "80px" }} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short summary shown in blog listings…" /></div>
        <div style={S.field}><label style={S.label}>Author</label><input style={S.input} value={form.author} onChange={(e) => set("author", e.target.value)} /></div>
      </div>

      <div style={S.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", paddingBottom: "8px", borderBottom: "1px solid #E6DFD3" }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "16px", color: "#16294A", margin: 0 }}>Content</h3>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              padding: "6px 14px", borderRadius: "8px", border: "1px solid #E6DFD3",
              background: showPreview ? "#16294A" : "#fff", color: showPreview ? "#fff" : "#16294A",
              fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              transition: "all .2s",
            }}
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {showPreview ? (
          <div className="blog-preview-wrap">
            <div className="blog-preview-title">{form.title || "Untitled Post"}</div>
            {form.excerpt && <p className="blog-preview-excerpt">{form.excerpt}</p>}
            {form.content ? (
              <div className="article" dangerouslySetInnerHTML={{ __html: form.content }} />
            ) : (
              <p style={{ color: "#aaa", fontStyle: "italic" }}>No content yet. Switch to Edit to start writing.</p>
            )}
          </div>
        ) : (
          <>
            <div className="blog-editor-toolbar">
              {TOOLBAR_BUTTONS.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  title={btn.title}
                  onClick={() => handleToolbar(btn)}
                  className="blog-toolbar-btn"
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              style={{ ...S.textarea, minHeight: "380px", fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", borderTop: "none", borderRadius: "0 0 9px 9px" }}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder={"<h2>Your heading</h2>\n<p>Your article content here…</p>\n\n<h3>Sub heading</h3>\n<p>More content…</p>"}
            />
            <p style={S.hint}>HTML supported. Use the toolbar above for quick formatting, or type HTML directly.</p>
          </>
        )}
      </div>

      <div style={S.section}>
        <h3 style={S.sh}>Publishing</h3>
        <div style={S.grid2}>
          <div style={S.field}>
            <label style={S.label}>Status</label>
            <select style={S.select} value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
          <div style={S.field}>
            <label style={S.label}>Schedule (optional)</label>
            <input style={S.input} type="datetime-local" value={form.scheduledAt} onChange={(e) => set("scheduledAt", e.target.value)} />
          </div>
        </div>
        <div style={S.field}><label style={S.label}>Related Post Slugs (comma separated)</label><input style={S.input} value={form.relatedSlugs} onChange={(e) => set("relatedSlugs", e.target.value)} placeholder="degree-no-job, automation-roles-india" /></div>
      </div>

      <div style={S.section}>
        <h3 style={S.sh}>Image</h3>
        <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: "10px" }} />
        {uploading && <span style={{ fontSize: "13px", color: "#41506A" }}>Uploading…</span>}
        {form.image && <div style={{ marginTop: "8px" }}><img src={form.image} alt="" style={{ maxHeight: "120px", borderRadius: "8px" }} /></div>}
        <div style={{ marginTop: "8px" }}><label style={S.label}>Or paste image URL</label><input style={S.input} value={form.image} onChange={(e) => set("image", e.target.value)} /></div>
      </div>

      <div style={S.section}>
        <h3 style={S.sh}>SEO</h3>
        <div style={S.field}><label style={S.label}>Meta Title</label><input style={S.input} value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} /></div>
        <div style={S.field}><label style={S.label}>Meta Description</label><textarea style={{ ...S.textarea, minHeight: "80px" }} value={form.metaDesc} onChange={(e) => set("metaDesc", e.target.value)} /></div>
      </div>

      <div>
        <button onClick={handleSubmit} disabled={saving} style={S.btn}>{saving ? "Saving…" : isEdit ? "Save Changes" : "Create Post"}</button>
        <button onClick={() => router.push("/admin/blogs")} style={S.btnSec}>Cancel</button>
      </div>
    </div>
  );
}
