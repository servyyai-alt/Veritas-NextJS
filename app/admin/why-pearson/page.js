"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";
import { DEFAULT_WHY_PEARSON_CONTENT } from "@/lib/why-pearson-content";

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

export default function AdminWhyPearson() {
  const [content, setContent] = useState(() => cloneContent(DEFAULT_WHY_PEARSON_CONTENT));
  const [savedContent, setSavedContent] = useState(() => cloneContent(DEFAULT_WHY_PEARSON_CONTENT));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    fetch("/api/admin/why-pearson-settings")
      .then((r) => r.json())
      .then((d) => {
        const next = d.content || DEFAULT_WHY_PEARSON_CONTENT;
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

  const handleSave = async () => {
    setToast(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/why-pearson-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_WHY_PEARSON_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "Why Pearson content saved successfully", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to save Why Pearson content", type: "error" });
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
      const res = await fetch("/api/admin/why-pearson-settings", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_WHY_PEARSON_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "Why Pearson content reset to defaults", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to reset Why Pearson content", type: "error" });
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
          <h1 className="adm-title">Why Pearson Content</h1>
          <p className="adm-sub">
            Edit the Why Pearson page with normal fields. Saved changes will
            reflect on the public page without changing the layout.
          </p>
        </div>
      </div>

      <div className="adm-settings-grid">
        <SectionCard
          fullWidth
          title="Publish notes"
          description="This editor updates the Why Pearson text only. The page layout, spacing, and design stay the same."
        >
          <div style={{ padding: "0 0 4px", color: "#2E6B4E", fontSize: "13px", lineHeight: 1.6 }}>
            Save once here and the public Why Pearson page will use the new copy on refresh.
          </div>
        </SectionCard>

        <SectionCard fullWidth title="Metadata" description="These values control the page title and description.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField
              label="Page title"
              value={content.metadata.title}
              onChange={(v) => updatePath(["metadata", "title"], v)}
              placeholder="Why Pearson title"
            />
            <InputField
              label="Page description"
              value={content.metadata.description}
              onChange={(v) => updatePath(["metadata", "description"], v)}
              placeholder="Why Pearson description"
            />
          </div>
        </SectionCard>

        <SectionCard fullWidth title="Hero" description="These fields appear at the top of the Why Pearson page.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.hero.eyebrow} onChange={(v) => updatePath(["hero", "eyebrow"], v)} />
            <InputField label="Title prefix" value={content.hero.titlePrefix} onChange={(v) => updatePath(["hero", "titlePrefix"], v)} />
            <InputField label="Accent line" value={content.hero.titleAccent} onChange={(v) => updatePath(["hero", "titleAccent"], v)} />
            <InputField label="Primary CTA" value={content.hero.primaryCta} onChange={(v) => updatePath(["hero", "primaryCta"], v)} />
            <InputField label="Secondary CTA" value={content.hero.secondaryCta} onChange={(v) => updatePath(["hero", "secondaryCta"], v)} />
          </div>
          <TextAreaField
            label="Hero text"
            value={content.hero.lead}
            onChange={(v) => updatePath(["hero", "lead"], v)}
            rows={5}
          />
        </SectionCard>

        <SectionCard fullWidth title="Who is Pearson" description="The four cards and supporting note in the first body section.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.who.eyebrow} onChange={(v) => updatePath(["who", "eyebrow"], v)} />
            <InputField label="Title" value={content.who.title} onChange={(v) => updatePath(["who", "title"], v)} />
          </div>
          <TextAreaField
            label="Section description"
            value={content.who.description}
            onChange={(v) => updatePath(["who", "description"], v)}
            rows={4}
          />
          <TextAreaField
            label="Gap note"
            value={content.who.gapNote}
            onChange={(v) => updatePath(["who", "gapNote"], v)}
            rows={3}
          />
          <ArraySection
            title="Cards"
            description="Edit each Pearson card."
            items={content.who.cards}
            onAdd={() => addArrayItem(["who", "cards"], { h: "", p: "" })}
            addLabel="Add card"
          >
            {{
              remove: (index) => removeArrayItem(["who", "cards"], index),
              render: (item, index) => (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <InputField
                    label="Card heading"
                    value={item.h}
                    onChange={(v) => updateArrayItem(["who", "cards"], index, "h", v)}
                  />
                  <TextAreaField
                    label="Card body"
                    value={item.p}
                    onChange={(v) => updateArrayItem(["who", "cards"], index, "p", v)}
                    rows={4}
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard fullWidth title="Benefits" description="The four benefit statements shown mid-page.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.benefits.eyebrow} onChange={(v) => updatePath(["benefits", "eyebrow"], v)} />
            <InputField label="Title" value={content.benefits.title} onChange={(v) => updatePath(["benefits", "title"], v)} />
          </div>
          <TextAreaField
            label="Section description"
            value={content.benefits.description}
            onChange={(v) => updatePath(["benefits", "description"], v)}
            rows={4}
          />
          <ArraySection
            title="Benefit cards"
            description="Edit the four benefit cards."
            items={content.benefits.cards}
            onAdd={() => addArrayItem(["benefits", "cards"], { h: "", p: "" })}
            addLabel="Add benefit"
          >
            {{
              remove: (index) => removeArrayItem(["benefits", "cards"], index),
              render: (item, index) => (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <InputField
                    label="Heading"
                    value={item.h}
                    onChange={(v) => updateArrayItem(["benefits", "cards"], index, "h", v)}
                  />
                  <TextAreaField
                    label="Body"
                    value={item.p}
                    onChange={(v) => updateArrayItem(["benefits", "cards"], index, "p", v)}
                    rows={4}
                  />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard fullWidth title="How we fit together" description="The split-column explanation and closing comparison line.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.fit.eyebrow} onChange={(v) => updatePath(["fit", "eyebrow"], v)} />
            <InputField label="Title" value={content.fit.title} onChange={(v) => updatePath(["fit", "title"], v)} />
          </div>
          <TextAreaField
            label="Section description"
            value={content.fit.description}
            onChange={(v) => updatePath(["fit", "description"], v)}
            rows={4}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Join left" value={content.fit.joinLeft} onChange={(v) => updatePath(["fit", "joinLeft"], v)} />
            <InputField label="Join middle" value={content.fit.joinMiddle} onChange={(v) => updatePath(["fit", "joinMiddle"], v)} />
            <InputField label="Join right" value={content.fit.joinRight} onChange={(v) => updatePath(["fit", "joinRight"], v)} />
            <TextAreaField label="Note" value={content.fit.note} onChange={(v) => updatePath(["fit", "note"], v)} rows={3} />
          </div>

          <div style={{ marginTop: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
              <InputField label="Pearson label" value={content.fit.pearson.label} onChange={(v) => updatePath(["fit", "pearson", "label"], v)} />
              <InputField label="Pearson title" value={content.fit.pearson.title} onChange={(v) => updatePath(["fit", "pearson", "title"], v)} />
            </div>
            <ArraySection
              title="Pearson points"
              description="Edit the left-column bullet points."
              items={content.fit.pearson.points}
              onAdd={() => addArrayItem(["fit", "pearson", "points"], "")}
              addLabel="Add point"
            >
              {{
                remove: (index) => removeArrayItem(["fit", "pearson", "points"], index),
                render: (item, index) => (
                  <InputField
                    label={`Point ${index + 1}`}
                    value={item}
                    onChange={(v) => updatePrimitiveArrayItem(["fit", "pearson", "points"], index, v)}
                  />
                ),
              }}
            </ArraySection>
          </div>

          <div style={{ marginTop: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
              <InputField label="Veritas label" value={content.fit.veritas.label} onChange={(v) => updatePath(["fit", "veritas", "label"], v)} />
              <InputField label="Veritas title" value={content.fit.veritas.title} onChange={(v) => updatePath(["fit", "veritas", "title"], v)} />
            </div>
            <ArraySection
              title="Veritas points"
              description="Edit the right-column bullet points."
              items={content.fit.veritas.points}
              onAdd={() => addArrayItem(["fit", "veritas", "points"], "")}
              addLabel="Add point"
            >
              {{
                remove: (index) => removeArrayItem(["fit", "veritas", "points"], index),
                render: (item, index) => (
                  <InputField
                    label={`Point ${index + 1}`}
                    value={item}
                    onChange={(v) => updatePrimitiveArrayItem(["fit", "veritas", "points"], index, v)}
                  />
                ),
              }}
            </ArraySection>
          </div>
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
              Why Pearson actions
            </div>
            <div style={{ fontSize: "12px", color: "#54607A", lineHeight: 1.5 }}>
              Save changes here and the Why Pearson page updates on refresh.
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
