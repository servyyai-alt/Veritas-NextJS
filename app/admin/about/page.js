"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";
import { DEFAULT_ABOUT_CONTENT } from "@/lib/about-content";

function cloneContent(value) {
  return JSON.parse(JSON.stringify(value));
}

function getAtPath(obj, path) {
  return path.reduce((acc, key) => acc[key], obj);
}

function setAtPath(obj, path, value) {
  let node = obj;
  for (let i = 0; i < path.length - 1; i += 1) {
    node = node[path[i]];
  }
  node[path[path.length - 1]] = value;
}

function InputField({ label, value, onChange, placeholder, type = "text", help }) {
  return (
    <div className="adm-settings-field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {help && (
        <div style={{ marginTop: "6px", color: "#54607A", fontSize: "12px", lineHeight: 1.5 }}>
          {help}
        </div>
      )}
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4, help }) {
  return (
    <div className="adm-settings-field">
      <label>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1px solid #E6DFD3",
          borderRadius: "10px",
          fontSize: "14px",
          fontFamily: "'IBM Plex Sans', sans-serif",
          color: "#16294A",
          background: "#fff",
          boxSizing: "border-box",
          outline: "none",
          resize: "vertical",
          lineHeight: "1.6",
        }}
      />
      {help && (
        <div style={{ marginTop: "6px", color: "#54607A", fontSize: "12px", lineHeight: 1.5 }}>
          {help}
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, description, children, fullWidth = false }) {
  return (
    <div className="adm-settings-card" style={fullWidth ? { gridColumn: "1 / -1" } : undefined}>
      <div className="adm-settings-card-header">
        <div className="adm-settings-icon" style={{ background: "rgba(138,36,52,.08)", color: "#8A2434" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </div>
        <div>
          <h3 className="adm-settings-card-title">{title}</h3>
          <p className="adm-settings-card-sub">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ArraySection({ title, description, items, onAdd, addLabel, children }) {
  return (
    <div style={{ marginTop: "18px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
        <div>
          <h4 style={{ margin: 0, color: "#16294A", fontSize: "15px", fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h4>
          <p style={{ margin: "4px 0 0", color: "#54607A", fontSize: "12px", lineHeight: 1.5 }}>
            {description}
          </p>
        </div>
        <button className="adm-btn-ghost" onClick={onAdd} type="button" style={{ whiteSpace: "nowrap" }}>
          {addLabel}
        </button>
      </div>
      <div style={{ display: "grid", gap: "12px" }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #E6DFD3",
              borderRadius: "14px",
              padding: "14px",
              background: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ color: "#16294A", fontSize: "13px", fontWeight: 600 }}>
                Item {index + 1}
              </div>
              <button
                type="button"
                className="adm-btn-danger"
                onClick={() => children.remove(index)}
                style={{ padding: "8px 10px", minHeight: "auto" }}
              >
                Remove
              </button>
            </div>
            {children.render(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAbout() {
  const [content, setContent] = useState(() => cloneContent(DEFAULT_ABOUT_CONTENT));
  const [savedContent, setSavedContent] = useState(() => cloneContent(DEFAULT_ABOUT_CONTENT));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    fetch("/api/admin/about-settings")
      .then((r) => r.json())
      .then((d) => {
        const next = d.content || DEFAULT_ABOUT_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  const updatePath = (path, value) => {
    setContent((prev) => {
      const next = cloneContent(prev);
      setAtPath(next, path, value);
      return next;
    });
  };

  const updateArrayItem = (path, index, key, value) => {
    setContent((prev) => {
      const next = cloneContent(prev);
      const arr = getAtPath(next, path);
      arr[index] = { ...arr[index], [key]: value };
      return next;
    });
  };

  const addArrayItem = (path, item) => {
    setContent((prev) => {
      const next = cloneContent(prev);
      const arr = getAtPath(next, path);
      arr.push(item);
      return next;
    });
  };

  const removeArrayItem = (path, index) => {
    setContent((prev) => {
      const next = cloneContent(prev);
      const arr = getAtPath(next, path);
      arr.splice(index, 1);
      return next;
    });
  };

  const handleHeroImageUpload = async (file) => {
    if (!file) return;

    setToast(null);
    setUploadingHeroImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success || !data.url) {
        setToast({ message: data.message || "Failed to upload image", type: "error" });
        return;
      }
      updatePath(["hero", "backgroundImage"], data.url);
      setToast({ message: "Hero image uploaded. Save changes to publish it.", type: "success" });
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const handleSave = async () => {
    setToast(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_ABOUT_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "About content saved successfully", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to save About content", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setToast(null);
    setResetting(true);
    try {
      const res = await fetch("/api/admin/about-settings", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_ABOUT_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "About content reset to defaults", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to reset About content", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setResetting(false);
    }
  };

  const dirty = JSON.stringify(content) !== JSON.stringify(savedContent);

  return (
    <div className={`adm-page mtop ${mounted ? "adm-page-in" : ""}`} style={{ paddingBottom: "120px" }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">About Content</h1>
          <p className="adm-sub">
            Edit the About page with normal fields. Saved changes will reflect
            on the public page without changing the design.
          </p>
        </div>
      </div>

      <div className="adm-settings-grid">
        <SectionCard fullWidth title="Publish notes" description="This editor updates the About copy only. The page layout, spacing, and design stay the same.">
          <div style={{ padding: "0 0 4px", color: "#2E6B4E", fontSize: "13px", lineHeight: 1.6 }}>
            Save here and the public About page will use the updated text on refresh.
          </div>
        </SectionCard>

        <SectionCard fullWidth title="Metadata" description="These values control the page title and description.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Page title" value={content.metadata.title} onChange={(v) => updatePath(["metadata", "title"], v)} />
            <InputField label="Page description" value={content.metadata.description} onChange={(v) => updatePath(["metadata", "description"], v)} />
          </div>
        </SectionCard>

        <SectionCard fullWidth title="Hero" description="The Home-style cinematic About hero, including its background image and readiness panel.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Breadcrumb home" value={content.hero.breadcrumbHome} onChange={(v) => updatePath(["hero", "breadcrumbHome"], v)} />
            <InputField label="Breadcrumb current" value={content.hero.breadcrumbCurrent} onChange={(v) => updatePath(["hero", "breadcrumbCurrent"], v)} />
            <InputField label="Eyebrow" value={content.hero.eyebrow} onChange={(v) => updatePath(["hero", "eyebrow"], v)} />
            <InputField label="Title prefix" value={content.hero.titlePrefix} onChange={(v) => updatePath(["hero", "titlePrefix"], v)} />
            <InputField label="Accent line" value={content.hero.titleAccent} onChange={(v) => updatePath(["hero", "titleAccent"], v)} />
            <InputField label="Primary CTA" value={content.hero.primaryCta} onChange={(v) => updatePath(["hero", "primaryCta"], v)} />
            <InputField label="Secondary CTA" value={content.hero.secondaryCta} onChange={(v) => updatePath(["hero", "secondaryCta"], v)} />
            <InputField label="Seal title" value={content.hero.sealTitle} onChange={(v) => updatePath(["hero", "sealTitle"], v)} />
            <InputField label="Seal subtitle" value={content.hero.sealSubtitle} onChange={(v) => updatePath(["hero", "sealSubtitle"], v)} />
          </div>
          <TextAreaField label="Hero lead" value={content.hero.lead} onChange={(v) => updatePath(["hero", "lead"], v)} rows={4} />
          <div style={{ marginTop: "18px", padding: "16px", border: "1px solid #E6DFD3", borderRadius: "14px", background: "#FBFAF7" }}>
            <InputField
              label="Hero background image URL"
              value={content.hero.backgroundImage}
              onChange={(v) => updatePath(["hero", "backgroundImage"], v)}
              placeholder="https://res.cloudinary.com/..."
              help="This image fills the About hero. Leave blank to use the default scene."
            />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <label className="adm-btn-ghost" style={{ display: "inline-flex", alignItems: "center", position: "relative", overflow: "hidden", cursor: uploadingHeroImage ? "not-allowed" : "pointer", opacity: uploadingHeroImage ? 0.6 : 1 }}>
                <input type="file" accept="image/*" disabled={uploadingHeroImage} onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; handleHeroImageUpload(file); }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                {uploadingHeroImage ? "Uploading..." : "Upload to Cloudinary"}
              </label>
              <button className="adm-btn-ghost" type="button" onClick={() => updatePath(["hero", "backgroundImage"], "")} disabled={uploadingHeroImage || saving || resetting}>Remove image</button>
            </div>
          </div>
          <div style={{ marginTop: "18px" }}>
            <h4 style={{ margin: "0 0 12px", color: "#16294A", fontSize: "15px", fontFamily: "'Space Grotesk', sans-serif" }}>Readiness panel</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
              <InputField label="Panel title" value={content.hero.readout.title} onChange={(v) => updatePath(["hero", "readout", "title"], v)} />
              <InputField label="Panel name" value={content.hero.readout.name} onChange={(v) => updatePath(["hero", "readout", "name"], v)} />
              <InputField label="Status label" value={content.hero.readout.verifiedLabel} onChange={(v) => updatePath(["hero", "readout", "verifiedLabel"], v)} />
              <InputField label="Paper legend" value={content.hero.readout.legendOnPaper} onChange={(v) => updatePath(["hero", "readout", "legendOnPaper"], v)} />
              <InputField label="Result legend" value={content.hero.readout.legendAfter} onChange={(v) => updatePath(["hero", "readout", "legendAfter"], v)} />
              <InputField label="Panel footnote" value={content.hero.readout.footnote} onChange={(v) => updatePath(["hero", "readout", "footnote"], v)} />
            </div>
            <ArraySection title="Panel metrics" description="Edit the bars shown in the About hero panel." items={content.hero.readout.metrics} onAdd={() => addArrayItem(["hero", "readout", "metrics"], { label: "", val: "", paper: "40%", floor: "80%" })} addLabel="Add metric">
              {{
                remove: (index) => removeArrayItem(["hero", "readout", "metrics"], index),
                render: (item, index) => (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px" }}>
                    <InputField label="Label" value={item.label} onChange={(v) => updateArrayItem(["hero", "readout", "metrics"], index, "label", v)} />
                    <InputField label="Value" value={item.val} onChange={(v) => updateArrayItem(["hero", "readout", "metrics"], index, "val", v)} />
                    <InputField label="Paper width" value={item.paper} onChange={(v) => updateArrayItem(["hero", "readout", "metrics"], index, "paper", v)} help="Example: 70%" />
                    <InputField label="Result width" value={item.floor} onChange={(v) => updateArrayItem(["hero", "readout", "metrics"], index, "floor", v)} help="Example: 85%" />
                  </div>
                ),
              }}
            </ArraySection>
          </div>
        </SectionCard>

        <SectionCard fullWidth title="Gap Section" description="The first cards section on the page.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.gap.eyebrow} onChange={(v) => updatePath(["gap", "eyebrow"], v)} />
            <InputField label="Title" value={content.gap.title} onChange={(v) => updatePath(["gap", "title"], v)} />
          </div>
          <TextAreaField label="Section description" value={content.gap.description} onChange={(v) => updatePath(["gap", "description"], v)} rows={4} />

          <ArraySection
            title="Cards"
            description="Edit the four cards under the gap section."
            items={content.gap.cards}
            onAdd={() => addArrayItem(["gap", "cards"], { h: "", p: "" })}
            addLabel="Add card"
          >
            {{
              remove: (index) => removeArrayItem(["gap", "cards"], index),
              render: (item, index) => (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <InputField
                    label="Heading"
                    value={item.h}
                    onChange={(v) => updateArrayItem(["gap", "cards"], index, "h", v)}
                  />
                  <TextAreaField
                    label="Body"
                    value={item.p}
                    onChange={(v) => updateArrayItem(["gap", "cards"], index, "p", v)}
                    rows={4}
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard fullWidth title="Straight Talk" description="The lower explanatory block and its support points.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.honest.eyebrow} onChange={(v) => updatePath(["honest", "eyebrow"], v)} />
            <InputField label="Title" value={content.honest.title} onChange={(v) => updatePath(["honest", "title"], v)} />
          </div>
          <TextAreaField label="Body" value={content.honest.body} onChange={(v) => updatePath(["honest", "body"], v)} rows={5} />
          <TextAreaField label="Note" value={content.honest.note} onChange={(v) => updatePath(["honest", "note"], v)} rows={3} />

          <ArraySection
            title="Points"
            description="Edit the support points shown under the straight talk block."
            items={content.honest.points}
            onAdd={() => addArrayItem(["honest", "points"], { h: "", p: "" })}
            addLabel="Add point"
          >
            {{
              remove: (index) => removeArrayItem(["honest", "points"], index),
              render: (item, index) => (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <InputField
                    label="Heading"
                    value={item.h}
                    onChange={(v) => updateArrayItem(["honest", "points"], index, "h", v)}
                  />
                  <TextAreaField
                    label="Body"
                    value={item.p}
                    onChange={(v) => updateArrayItem(["honest", "points"], index, "p", v)}
                    rows={4}
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard fullWidth title="Final CTA" description="The closing call to action at the bottom of the page.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.finalCta.eyebrow} onChange={(v) => updatePath(["finalCta", "eyebrow"], v)} />
            <InputField label="Title" value={content.finalCta.title} onChange={(v) => updatePath(["finalCta", "title"], v)} />
            <InputField label="Primary CTA" value={content.finalCta.primaryCta} onChange={(v) => updatePath(["finalCta", "primaryCta"], v)} />
            <InputField label="Secondary CTA" value={content.finalCta.secondaryCta} onChange={(v) => updatePath(["finalCta", "secondaryCta"], v)} />
          </div>
          <TextAreaField label="Body" value={content.finalCta.body} onChange={(v) => updatePath(["finalCta", "body"], v)} rows={4} />
        </SectionCard>
      </div>

      <div className="adm-home-savebar">
        <div className="adm-home-savebar-inner">
          <div style={{ minWidth: "240px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#16294A" }}>
              About actions
            </div>
            <div style={{ fontSize: "12px", color: "#54607A", lineHeight: 1.5 }}>
              Save changes here and the About page updates on refresh.
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="adm-btn-primary"
              onClick={handleSave}
              disabled={saving || loading || !dirty}
              style={{
                opacity: saving || loading || !dirty ? 0.6 : 1,
                cursor: saving || loading || !dirty ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Content"}
            </button>
            <button
              className="adm-btn-danger"
              onClick={handleReset}
              disabled={resetting || loading}
              style={{
                opacity: resetting || loading ? 0.6 : 1,
                cursor: resetting || loading ? "not-allowed" : "pointer",
              }}
            >
              {resetting ? "Resetting..." : "Reset to Defaults"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
