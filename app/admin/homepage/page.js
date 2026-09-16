"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";
import { DEFAULT_HOMEPAGE_CONTENT } from "@/lib/homepage-content";

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

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  help,
}) {
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
        <div
          style={{
            marginTop: "6px",
            color: "#54607A",
            fontSize: "12px",
            lineHeight: 1.5,
          }}
        >
          {help}
        </div>
      )}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  help,
}) {
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
        <div
          style={{
            marginTop: "6px",
            color: "#54607A",
            fontSize: "12px",
            lineHeight: 1.5,
          }}
        >
          {help}
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, description, children, fullWidth = false }) {
  return (
    <div
      className="adm-settings-card"
      style={fullWidth ? { gridColumn: "1 / -1" } : undefined}
    >
      <div className="adm-settings-card-header">
        <div
          className="adm-settings-icon"
          style={{ background: "rgba(138,36,52,.08)", color: "#8A2434" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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

function ArraySection({
  title,
  description,
  items,
  onAdd,
  addLabel,
  children,
}) {
  return (
    <div style={{ marginTop: "18px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div>
          <h4
            style={{
              margin: 0,
              color: "#16294A",
              fontSize: "15px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {title}
          </h4>
          <p
            style={{
              margin: "4px 0 0",
              color: "#54607A",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </div>
        <button
          className="adm-btn-ghost"
          onClick={onAdd}
          type="button"
          style={{ whiteSpace: "nowrap" }}
        >
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{ color: "#16294A", fontSize: "13px", fontWeight: 600 }}
              >
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

export default function AdminHomepage() {
  const [content, setContent] = useState(() =>
    cloneContent(DEFAULT_HOMEPAGE_CONTENT),
  );
  const [savedContent, setSavedContent] = useState(() =>
    cloneContent(DEFAULT_HOMEPAGE_CONTENT),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [uploadingCardImage, setUploadingCardImage] = useState(null);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    fetch("/api/admin/homepage-settings")
      .then((r) => r.json())
      .then((d) => {
        const next = d.content || DEFAULT_HOMEPAGE_CONTENT;
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

  const updatePrimitiveArrayItem = (path, index, value) => {
    setContent((prev) => {
      const next = cloneContent(prev);
      const arr = getAtPath(next, path);
      arr[index] = value;
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

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.success || !data.url) {
        setToast({
          message: data.message || "Failed to upload image",
          type: "error",
        });
        return;
      }

      updatePath(["hero", "backgroundImage"], data.url);
      setToast({
        message: "Hero image uploaded. Save changes to publish it.",
        type: "success",
      });
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const handleCardImageUpload = async (section, index, file) => {
    if (!file) return;

    const uploadKey = `${section}-${index}`;
    setToast(null);
    setUploadingCardImage(uploadKey);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!data.success || !data.url) {
        setToast({ message: data.message || "Failed to upload image", type: "error" });
        return;
      }

      updateArrayItem([section, "cards"], index, "backgroundImage", data.url);
      setToast({ message: "Card image uploaded. Save changes to publish it.", type: "success" });
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setUploadingCardImage(null);
    }
  };

  const handleBrochureUpload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf") || !file.size || file.size > 4 * 1024 * 1024) {
      setToast({ message: "Please select a non-empty PDF up to 4 MB", type: "error" });
      return;
    }
    setUploadingBrochure(true);
    setToast(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/brochure", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Brochure upload failed");
      updatePath(["brochure"], data.brochure);
      setToast({ message: "Brochure uploaded. Save changes to publish it.", type: "success" });
    } catch (error) {
      setToast({ message: error.message || "Brochure upload failed. Please try again.", type: "error" });
    } finally {
      setUploadingBrochure(false);
    }
  };

  const handleSave = async () => {
    setToast(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_HOMEPAGE_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({
          message: "Homepage content saved successfully",
          type: "success",
        });
      } else {
        setToast({
          message: data.message || "Failed to save homepage content",
          type: "error",
        });
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
      const res = await fetch("/api/admin/homepage-settings", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_HOMEPAGE_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({
          message: "Homepage content reset to defaults",
          type: "success",
        });
      } else {
        setToast({
          message: data.message || "Failed to reset homepage content",
          type: "error",
        });
      }
    } catch {
      setToast({ message: "Something went wrong", type: "error" });
    } finally {
      setResetting(false);
    }
  };

  const dirty = JSON.stringify(content) !== JSON.stringify(savedContent);

  return (
    <div
      className={`adm-page mtop ${mounted ? "adm-page-in" : ""}`}
      style={{ paddingBottom: "120px" }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Homepage Content</h1>
          <p className="adm-sub">
            Edit the homepage with normal fields. Any saved change will reflect
            on the home page.
          </p>
        </div>
      </div>

      <div className="adm-settings-grid">
        <SectionCard
          fullWidth
          title="Publish notes"
          description="Manage homepage text, images, and the downloadable brochure."
        >
          <div
            style={{
              padding: "0 0 4px",
              color: "#2E6B4E",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            Changes you save here are used by the home page immediately on
            refresh.
          </div>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Metadata"
          description="These values control the homepage title and description."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InputField
              label="Page title"
              value={content.metadata.title}
              onChange={(v) => updatePath(["metadata", "title"], v)}
              placeholder="Homepage title"
            />
            <InputField
              label="Page description"
              value={content.metadata.description}
              onChange={(v) => updatePath(["metadata", "description"], v)}
              placeholder="Homepage description"
            />
          </div>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Brochure"
          description="Upload a PDF for visitors to download from the homepage. Save changes to publish or remove it."
        >
          <div className="adm-settings-field">
            <label htmlFor="homepage-brochure">{content.brochure.id ? "Replace brochure" : "Upload brochure"}</label>
            <input
              id="homepage-brochure"
              type="file"
              accept="application/pdf,.pdf"
              disabled={uploadingBrochure || saving || resetting || loading}
              aria-describedby="brochure-help"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                handleBrochureUpload(file);
              }}
            />
            <p id="brochure-help">PDF only, up to 4 MB.</p>
            <p role="status">{uploadingBrochure ? "Uploading brochure…" : content.brochure.filename || "No brochure uploaded."}</p>
            {content.brochure.id && (
              <button
                type="button"
                className="adm-btn-ghost"
                disabled={uploadingBrochure || saving || resetting}
                onClick={() => updatePath(["brochure"], { id: "", filename: "" })}
              >
                Remove brochure
              </button>
            )}
          </div>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Hero"
          description="These fields appear at the top of the homepage."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InputField
              label="Eyebrow"
              value={content.hero.eyebrow}
              onChange={(v) => updatePath(["hero", "eyebrow"], v)}
            />
            <InputField
              label="Primary line"
              value={content.hero.titlePrefix}
              onChange={(v) => updatePath(["hero", "titlePrefix"], v)}
            />
            <InputField
              label="Accent line"
              value={content.hero.titleAccent}
              onChange={(v) => updatePath(["hero", "titleAccent"], v)}
            />
            <InputField
              label="Primary CTA"
              value={content.hero.primaryCta}
              onChange={(v) => updatePath(["hero", "primaryCta"], v)}
            />
            <InputField
              label="Secondary CTA"
              value={content.hero.secondaryCta}
              onChange={(v) => updatePath(["hero", "secondaryCta"], v)}
            />
            <InputField
              label="Seal title"
              value={content.hero.sealTitle}
              onChange={(v) => updatePath(["hero", "sealTitle"], v)}
            />
          </div>
          <TextAreaField
            label="Hero text"
            value={content.hero.lead}
            onChange={(v) => updatePath(["hero", "lead"], v)}
            rows={5}
          />
          <InputField
            label="Seal subtitle"
            value={content.hero.sealSubtitle}
            onChange={(v) => updatePath(["hero", "sealSubtitle"], v)}
          />
          <div
            style={{
              marginTop: "18px",
              padding: "16px",
              border: "1px solid #E6DFD3",
              borderRadius: "14px",
              background: "#FBFAF7",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "14px",
              }}
            >
              <div>
                <h4
                  style={{
                    margin: 0,
                    color: "#16294A",
                    fontSize: "15px",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Hero background image
                </h4>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#54607A",
                    fontSize: "12px",
                    lineHeight: 1.5,
                  }}
                >
                  This image fills the homepage hero behind the copy and readout
                  card.
                </p>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr .8fr",
                gap: "14px",
                alignItems: "start",
              }}
            >
              <div>
                <InputField
                  label="Image URL"
                  value={content.hero.backgroundImage}
                  onChange={(v) => updatePath(["hero", "backgroundImage"], v)}
                  placeholder="/uploads/hero-bg.jpg"
                  help="You can paste a local upload path or a full remote image URL."
                />
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <label
                    className="adm-btn-ghost"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                      cursor: uploadingHeroImage ? "not-allowed" : "pointer",
                      opacity: uploadingHeroImage ? 0.6 : 1,
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        handleHeroImageUpload(file);
                      }}
                      disabled={uploadingHeroImage}
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0,
                        cursor: uploadingHeroImage ? "not-allowed" : "pointer",
                      }}
                    />
                    {uploadingHeroImage ? "Uploading..." : "Upload image"}
                  </label>
                  <button
                    className="adm-btn-ghost"
                    type="button"
                    onClick={() => updatePath(["hero", "backgroundImage"], "")}
                    disabled={uploadingHeroImage || saving || resetting}
                  >
                    Remove image
                  </button>
                </div>
              </div>
              <div
                style={{
                  minHeight: "150px",
                  borderRadius: "14px",
                  border: "1px solid #E6DFD3",
                  overflow: "hidden",
                  position: "relative",
                  background: "#0b1830",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: content.hero.backgroundImage
                      ? `url(${JSON.stringify(content.hero.backgroundImage)})`
                      : `url(${JSON.stringify("/scene-728428.svg")})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transform: "scale(1.04)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(118deg, rgba(11,21,40,.84), rgba(18,42,76,.5) 48%, rgba(138,36,52,.42))",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "14px",
                    color: "#fff",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                  }}
                >
                  Preview
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Capability Readout"
          description="Text shown beside the hero metrics."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InputField
              label="Title"
              value={content.capability.title}
              onChange={(v) => updatePath(["capability", "title"], v)}
            />
            <InputField
              label="Profile name"
              value={content.capability.name}
              onChange={(v) => updatePath(["capability", "name"], v)}
            />
            <InputField
              label="Verified label"
              value={content.capability.verifiedLabel}
              onChange={(v) => updatePath(["capability", "verifiedLabel"], v)}
            />
            <InputField
              label="Legend left"
              value={content.capability.legendOnPaper}
              onChange={(v) => updatePath(["capability", "legendOnPaper"], v)}
            />
            <InputField
              label="Legend right"
              value={content.capability.legendAfter}
              onChange={(v) => updatePath(["capability", "legendAfter"], v)}
            />
          </div>
          <TextAreaField
            label="Footnote"
            value={content.capability.footnote}
            onChange={(v) => updatePath(["capability", "footnote"], v)}
            rows={3}
          />

          <ArraySection
            title="Metrics"
            description="Edit each metric label and percentage."
            items={content.capability.metrics}
            onAdd={() =>
              addArrayItem(["capability", "metrics"], {
                label: "",
                val: "",
                paper: "20%",
                floor: "80",
              })
            }
            addLabel="Add metric"
          >
            {{
              remove: (index) =>
                removeArrayItem(["capability", "metrics"], index),
              render: (item, index) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  <InputField
                    label="Label"
                    value={item.label}
                    onChange={(v) =>
                      updateArrayItem(
                        ["capability", "metrics"],
                        index,
                        "label",
                        v,
                      )
                    }
                  />
                  <InputField
                    label="Value"
                    value={item.val}
                    onChange={(v) =>
                      updateArrayItem(
                        ["capability", "metrics"],
                        index,
                        "val",
                        v,
                      )
                    }
                  />
                  <InputField
                    label="Paper width"
                    value={item.paper}
                    onChange={(v) =>
                      updateArrayItem(
                        ["capability", "metrics"],
                        index,
                        "paper",
                        v,
                      )
                    }
                  />
                  <InputField
                    label="Floor width"
                    value={item.floor}
                    onChange={(v) =>
                      updateArrayItem(
                        ["capability", "metrics"],
                        index,
                        "floor",
                        v,
                      )
                    }
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Credibility Bar"
          description="The bar under the hero, including the highlight chips."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InputField
              label="Logo alt text"
              value={content.credibility.logoAlt}
              onChange={(v) => updatePath(["credibility", "logoAlt"], v)}
            />
            <InputField
              label="Title"
              value={content.credibility.title}
              onChange={(v) => updatePath(["credibility", "title"], v)}
            />
            <InputField
              label="Subtitle"
              value={content.credibility.subtitle}
              onChange={(v) => updatePath(["credibility", "subtitle"], v)}
            />
          </div>

          <ArraySection
            title="Chips"
            description="Short trust statements shown in the credibility bar."
            items={content.credibility.chips}
            onAdd={() => addArrayItem(["credibility", "chips"], "")}
            addLabel="Add chip"
          >
            {{
              remove: (index) =>
                removeArrayItem(["credibility", "chips"], index),
              render: (item, index) => (
                <InputField
                  label={`Chip ${index + 1}`}
                  value={item}
                  onChange={(v) =>
                    updatePrimitiveArrayItem(["credibility", "chips"], index, v)
                  }
                  placeholder="Trust statement"
                />
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Audience"
          description="The three audience cards on the homepage."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InputField
              label="Eyebrow"
              value={content.audience.eyebrow}
              onChange={(v) => updatePath(["audience", "eyebrow"], v)}
            />
            <InputField
              label="Title"
              value={content.audience.title}
              onChange={(v) => updatePath(["audience", "title"], v)}
            />
          </div>
          <TextAreaField
            label="Section description"
            value={content.audience.description}
            onChange={(v) => updatePath(["audience", "description"], v)}
            rows={4}
          />

          <ArraySection
            title="Audience cards"
            description="Edit the cards shown under the audience section."
            items={content.audience.cards}
            onAdd={() =>
              addArrayItem(["audience", "cards"], {
                tag: "",
                h: "",
                feel: "",
                help: "",
              })
            }
            addLabel="Add audience card"
          >
            {{
              remove: (index) => removeArrayItem(["audience", "cards"], index),
              render: (item, index) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  <InputField
                    label="Tag"
                    value={item.tag}
                    onChange={(v) =>
                      updateArrayItem(["audience", "cards"], index, "tag", v)
                    }
                  />
                  <InputField
                    label="Heading"
                    value={item.h}
                    onChange={(v) =>
                      updateArrayItem(["audience", "cards"], index, "h", v)
                    }
                  />
                  <TextAreaField
                    label="Feeling text"
                    value={item.feel}
                    onChange={(v) =>
                      updateArrayItem(["audience", "cards"], index, "feel", v)
                    }
                    rows={4}
                  />
                  <TextAreaField
                    label="Help text"
                    value={item.help}
                    onChange={(v) =>
                      updateArrayItem(["audience", "cards"], index, "help", v)
                    }
                    rows={4}
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Why Veritas"
          description="The three pillar cards that explain the offer."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InputField
              label="Eyebrow"
              value={content.pillars.eyebrow}
              onChange={(v) => updatePath(["pillars", "eyebrow"], v)}
            />
            <InputField
              label="Title"
              value={content.pillars.title}
              onChange={(v) => updatePath(["pillars", "title"], v)}
            />
          </div>
          <TextAreaField
            label="Section description"
            value={content.pillars.description}
            onChange={(v) => updatePath(["pillars", "description"], v)}
            rows={4}
          />

          <ArraySection
            title="Pillar cards"
            description="Edit the 3 cards in the Why Veritas section."
            items={content.pillars.cards}
            onAdd={() =>
              addArrayItem(["pillars", "cards"], { idx: "", h: "", p: "" })
            }
            addLabel="Add pillar"
          >
            {{
              remove: (index) => removeArrayItem(["pillars", "cards"], index),
              render: (item, index) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  <InputField
                    label="Index"
                    value={item.idx}
                    onChange={(v) =>
                      updateArrayItem(["pillars", "cards"], index, "idx", v)
                    }
                  />
                  <InputField
                    label="Heading"
                    value={item.h}
                    onChange={(v) =>
                      updateArrayItem(["pillars", "cards"], index, "h", v)
                    }
                  />
                  <TextAreaField
                    label="Body text"
                    value={item.p}
                    onChange={(v) =>
                      updateArrayItem(["pillars", "cards"], index, "p", v)
                    }
                    rows={4}
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Learning Model"
          description="The seven steps from classroom to career."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InputField
              label="Eyebrow"
              value={content.steps.eyebrow}
              onChange={(v) => updatePath(["steps", "eyebrow"], v)}
            />
            <InputField
              label="Title"
              value={content.steps.title}
              onChange={(v) => updatePath(["steps", "title"], v)}
            />
          </div>
          <TextAreaField
            label="Section description"
            value={content.steps.description}
            onChange={(v) => updatePath(["steps", "description"], v)}
            rows={4}
          />

          <ArraySection
            title="Step cards"
            description="Edit the seven numbered steps."
            items={content.steps.cards}
            onAdd={() =>
              addArrayItem(["steps", "cards"], { n: "", h: "", p: "" })
            }
            addLabel="Add step"
          >
            {{
              remove: (index) => removeArrayItem(["steps", "cards"], index),
              render: (item, index) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  <InputField
                    label="Number"
                    value={item.n}
                    onChange={(v) =>
                      updateArrayItem(["steps", "cards"], index, "n", v)
                    }
                  />
                  <InputField
                    label="Heading"
                    value={item.h}
                    onChange={(v) =>
                      updateArrayItem(["steps", "cards"], index, "h", v)
                    }
                  />
                  <TextAreaField
                    label="Body"
                    value={item.p}
                    onChange={(v) =>
                      updateArrayItem(["steps", "cards"], index, "p", v)
                    }
                    rows={4}
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Labs"
          description="The lab cards with background scenes."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InputField
              label="Eyebrow"
              value={content.labs.eyebrow}
              onChange={(v) => updatePath(["labs", "eyebrow"], v)}
            />
            <InputField
              label="Title"
              value={content.labs.title}
              onChange={(v) => updatePath(["labs", "title"], v)}
            />
          </div>

          <ArraySection
            title="Lab cards"
            description="Edit the three lab callouts."
            items={content.labs.cards}
            onAdd={() =>
              addArrayItem(["labs", "cards"], {
                cls: "",
                backgroundImage: "",
                tag: "",
                h: "",
                p: "",
              })
            }
            addLabel="Add lab"
          >
            {{
              remove: (index) => removeArrayItem(["labs", "cards"], index),
              render: (item, index) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  <InputField
                    label="Scene class"
                    value={item.cls}
                    onChange={(v) =>
                      updateArrayItem(["labs", "cards"], index, "cls", v)
                    }
                  />
                  <InputField
                    label="Image URL"
                    value={item.backgroundImage}
                    onChange={(v) => updateArrayItem(["labs", "cards"], index, "backgroundImage", v)}
                    placeholder="/uploads/lab.jpg"
                    help="Leave blank to use the selected scene class."
                  />
                  <div style={{ display: "flex", gap: "10px", alignItems: "end", flexWrap: "wrap" }}>
                    <label className="adm-btn-ghost" style={{ position: "relative", overflow: "hidden", cursor: uploadingCardImage === `labs-${index}` ? "not-allowed" : "pointer", opacity: uploadingCardImage === `labs-${index}` ? 0.6 : 1 }}>
                      <input type="file" accept="image/*" disabled={Boolean(uploadingCardImage)} onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; handleCardImageUpload("labs", index, file); }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                      {uploadingCardImage === `labs-${index}` ? "Uploading..." : "Upload image"}
                    </label>
                    <button className="adm-btn-ghost" type="button" onClick={() => updateArrayItem(["labs", "cards"], index, "backgroundImage", "")} disabled={Boolean(uploadingCardImage)}>Remove image</button>
                  </div>
                  <InputField
                    label="Tag"
                    value={item.tag}
                    onChange={(v) =>
                      updateArrayItem(["labs", "cards"], index, "tag", v)
                    }
                  />
                  <InputField
                    label="Heading"
                    value={item.h}
                    onChange={(v) =>
                      updateArrayItem(["labs", "cards"], index, "h", v)
                    }
                  />
                  <TextAreaField
                    label="Body"
                    value={item.p}
                    onChange={(v) =>
                      updateArrayItem(["labs", "cards"], index, "p", v)
                    }
                    rows={4}
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Technology Domains"
          description="The pathway cards that link to the programme page."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InputField
              label="Eyebrow"
              value={content.domains.eyebrow}
              onChange={(v) => updatePath(["domains", "eyebrow"], v)}
            />
            <InputField
              label="Title"
              value={content.domains.title}
              onChange={(v) => updatePath(["domains", "title"], v)}
            />
            <InputField
              label="More label"
              value={content.domains.moreLabel}
              onChange={(v) => updatePath(["domains", "moreLabel"], v)}
            />
          </div>
          <TextAreaField
            label="Section description"
            value={content.domains.description}
            onChange={(v) => updatePath(["domains", "description"], v)}
            rows={4}
          />

          <ArraySection
            title="Domain cards"
            description="Edit the domain cards shown in the grid."
            items={content.domains.cards}
            onAdd={() =>
              addArrayItem(["domains", "cards"], {
                num: "",
                h: "",
                p: "",
                cls: "",
                backgroundImage: "",
              })
            }
            addLabel="Add domain"
          >
            {{
              remove: (index) => removeArrayItem(["domains", "cards"], index),
              render: (item, index) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  <InputField
                    label="Number"
                    value={item.num}
                    onChange={(v) =>
                      updateArrayItem(["domains", "cards"], index, "num", v)
                    }
                  />
                  <InputField
                    label="Heading"
                    value={item.h}
                    onChange={(v) =>
                      updateArrayItem(["domains", "cards"], index, "h", v)
                    }
                  />
                  <InputField
                    label="Scene class"
                    value={item.cls}
                    onChange={(v) =>
                      updateArrayItem(["domains", "cards"], index, "cls", v)
                    }
                  />
                  <InputField
                    label="Image URL"
                    value={item.backgroundImage}
                    onChange={(v) => updateArrayItem(["domains", "cards"], index, "backgroundImage", v)}
                    placeholder="/uploads/domain.jpg"
                    help="Leave blank to use the selected scene class."
                  />
                  <div style={{ display: "flex", gap: "10px", alignItems: "end", flexWrap: "wrap" }}>
                    <label className="adm-btn-ghost" style={{ position: "relative", overflow: "hidden", cursor: uploadingCardImage === `domains-${index}` ? "not-allowed" : "pointer", opacity: uploadingCardImage === `domains-${index}` ? 0.6 : 1 }}>
                      <input type="file" accept="image/*" disabled={Boolean(uploadingCardImage)} onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; handleCardImageUpload("domains", index, file); }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                      {uploadingCardImage === `domains-${index}` ? "Uploading..." : "Upload image"}
                    </label>
                    <button className="adm-btn-ghost" type="button" onClick={() => updateArrayItem(["domains", "cards"], index, "backgroundImage", "")} disabled={Boolean(uploadingCardImage)}>Remove image</button>
                  </div>
                  <TextAreaField
                    label="Body"
                    value={item.p}
                    onChange={(v) =>
                      updateArrayItem(["domains", "cards"], index, "p", v)
                    }
                    rows={4}
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Trust Section"
          description="The long explanatory block near the bottom of the homepage."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InputField
              label="Eyebrow"
              value={content.honest.eyebrow}
              onChange={(v) => updatePath(["honest", "eyebrow"], v)}
            />
            <InputField
              label="Title"
              value={content.honest.title}
              onChange={(v) => updatePath(["honest", "title"], v)}
            />
          </div>
          <TextAreaField
            label="Body"
            value={content.honest.body}
            onChange={(v) => updatePath(["honest", "body"], v)}
            rows={5}
          />
          <TextAreaField
            label="Note"
            value={content.honest.note}
            onChange={(v) => updatePath(["honest", "note"], v)}
            rows={3}
          />

          <ArraySection
            title="Trust points"
            description="Edit the three supporting trust statements."
            items={content.honest.points}
            onAdd={() => addArrayItem(["honest", "points"], { h: "", p: "" })}
            addLabel="Add point"
          >
            {{
              remove: (index) => removeArrayItem(["honest", "points"], index),
              render: (item, index) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  <InputField
                    label="Heading"
                    value={item.h}
                    onChange={(v) =>
                      updateArrayItem(["honest", "points"], index, "h", v)
                    }
                  />
                  <TextAreaField
                    label="Body"
                    value={item.p}
                    onChange={(v) =>
                      updateArrayItem(["honest", "points"], index, "p", v)
                    }
                    rows={4}
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard
          fullWidth
          title="Final CTA"
          description="The closing call to action at the bottom of the page."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InputField
              label="Eyebrow"
              value={content.finalCta.eyebrow}
              onChange={(v) => updatePath(["finalCta", "eyebrow"], v)}
            />
            <InputField
              label="Title"
              value={content.finalCta.title}
              onChange={(v) => updatePath(["finalCta", "title"], v)}
            />
            <InputField
              label="Primary CTA"
              value={content.finalCta.primaryCta}
              onChange={(v) => updatePath(["finalCta", "primaryCta"], v)}
            />
            <InputField
              label="Secondary CTA"
              value={content.finalCta.secondaryCta}
              onChange={(v) => updatePath(["finalCta", "secondaryCta"], v)}
            />
          </div>
          <TextAreaField
            label="Body"
            value={content.finalCta.body}
            onChange={(v) => updatePath(["finalCta", "body"], v)}
            rows={4}
          />
        </SectionCard>
      </div>

      <div className="adm-home-savebar">
        <div className="adm-home-savebar-inner">
          <div style={{ minWidth: "240px" }}>
            <div
              style={{ fontSize: "13px", fontWeight: 600, color: "#16294A" }}
            >
              Homepage actions
            </div>
            <div
              style={{ fontSize: "12px", color: "#54607A", lineHeight: 1.5 }}
            >
              Save changes here and the homepage updates on refresh.
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="adm-btn-primary"
              onClick={handleSave}
              disabled={saving || resetting || loading || uploadingBrochure || !dirty}
              style={{
                opacity: saving || loading || !dirty ? 0.6 : 1,
                cursor: saving || loading || !dirty ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving…" : "Save Content"}
            </button>
            <button
              className="adm-btn-danger"
              onClick={handleReset}
              disabled={resetting || saving || loading || uploadingBrochure}
              style={{
                opacity: resetting || loading ? 0.6 : 1,
                cursor: resetting || loading ? "not-allowed" : "pointer",
              }}
            >
              {resetting ? "Resetting…" : "Reset to Defaults"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
