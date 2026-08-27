"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";
import { DEFAULT_PLACEMENT_CONTENT } from "@/lib/placement-content";

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

export default function AdminPlacement() {
  const [content, setContent] = useState(() => cloneContent(DEFAULT_PLACEMENT_CONTENT));
  const [savedContent, setSavedContent] = useState(() => cloneContent(DEFAULT_PLACEMENT_CONTENT));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    fetch("/api/admin/placement-settings")
      .then((r) => r.json())
      .then((d) => {
        const next = d.content || DEFAULT_PLACEMENT_CONTENT;
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
      const res = await fetch("/api/admin/placement-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_PLACEMENT_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "Placement content saved successfully", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to save placement content", type: "error" });
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
      const res = await fetch("/api/admin/placement-settings", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const next = data.content || DEFAULT_PLACEMENT_CONTENT;
        setContent(cloneContent(next));
        setSavedContent(cloneContent(next));
        setToast({ message: "Placement content reset to defaults", type: "success" });
      } else {
        setToast({ message: data.message || "Failed to reset placement content", type: "error" });
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
          <h1 className="adm-title">Placement Content</h1>
          <p className="adm-sub">
            Edit the Placement page with normal fields. Saved changes will
            reflect on the public page without changing the design.
          </p>
        </div>
      </div>

      <div className="adm-settings-grid">
        <SectionCard fullWidth title="Publish notes" description="This editor updates the Placement copy only. The page layout, spacing, and design stay the same.">
          <div style={{ padding: "0 0 4px", color: "#2E6B4E", fontSize: "13px", lineHeight: 1.6 }}>
            Save once here and the public Placement page will use the new copy on refresh.
          </div>
        </SectionCard>

        <SectionCard fullWidth title="Metadata" description="These values control the page title and description.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Page title" value={content.metadata.title} onChange={(v) => updatePath(["metadata", "title"], v)} />
            <InputField label="Page description" value={content.metadata.description} onChange={(v) => updatePath(["metadata", "description"], v)} />
          </div>
        </SectionCard>

        <SectionCard fullWidth title="Hero" description="These fields appear at the top of the Placement page.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.hero.eyebrow} onChange={(v) => updatePath(["hero", "eyebrow"], v)} />
            <InputField label="Title prefix" value={content.hero.titlePrefix} onChange={(v) => updatePath(["hero", "titlePrefix"], v)} />
            <InputField label="Accent line" value={content.hero.titleAccent} onChange={(v) => updatePath(["hero", "titleAccent"], v)} />
            <InputField label="Primary CTA" value={content.hero.primaryCta} onChange={(v) => updatePath(["hero", "primaryCta"], v)} />
            <InputField label="Secondary CTA" value={content.hero.secondaryCta} onChange={(v) => updatePath(["hero", "secondaryCta"], v)} />
          </div>
          <TextAreaField label="Hero text" value={content.hero.lead} onChange={(v) => updatePath(["hero", "lead"], v)} rows={5} />
        </SectionCard>

        <SectionCard fullWidth title="Assurance" description="The placement assurance copy and highlighted pull quote.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.assurance.eyebrow} onChange={(v) => updatePath(["assurance", "eyebrow"], v)} />
            <InputField label="Title" value={content.assurance.title} onChange={(v) => updatePath(["assurance", "title"], v)} />
          </div>
          <TextAreaField label="Body" value={content.assurance.body} onChange={(v) => updatePath(["assurance", "body"], v)} rows={5} />
          <TextAreaField label="Pull quote" value={content.assurance.pull} onChange={(v) => updatePath(["assurance", "pull"], v)} rows={3} />
          <TextAreaField label="Note" value={content.assurance.note} onChange={(v) => updatePath(["assurance", "note"], v)} rows={3} />

          <ArraySection
            title="Promises"
            description="Edit the four promise cards shown beside the assurance copy."
            items={content.promises}
            onAdd={() => addArrayItem(["promises"], { h: "", p: "" })}
            addLabel="Add promise"
          >
            {{
              remove: (index) => removeArrayItem(["promises"], index),
              render: (item, index) => (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <InputField label="Heading" value={item.h} onChange={(v) => updateArrayItem(["promises"], index, "h", v)} />
                  <TextAreaField label="Body" value={item.p} onChange={(v) => updateArrayItem(["promises"], index, "p", v)} rows={4} />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard fullWidth title="Process Steps" description="The eight numbered cards in the support flow.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.process.eyebrow} onChange={(v) => updatePath(["process", "eyebrow"], v)} />
            <InputField label="Title" value={content.process.title} onChange={(v) => updatePath(["process", "title"], v)} />
          </div>
          <ArraySection
            title="Steps"
            description="Edit each numbered step."
            items={content.process.steps}
            onAdd={() => addArrayItem(["process", "steps"], { n: "", h: "", p: "" })}
            addLabel="Add step"
          >
            {{
              remove: (index) => removeArrayItem(["process", "steps"], index),
              render: (item, index) => (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <InputField label="Number" value={item.n} onChange={(v) => updateArrayItem(["process", "steps"], index, "n", v)} />
                  <InputField label="Heading" value={item.h} onChange={(v) => updateArrayItem(["process", "steps"], index, "h", v)} />
                  <TextAreaField label="Body" value={item.p} onChange={(v) => updateArrayItem(["process", "steps"], index, "p", v)} rows={4} />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard fullWidth title="Continuing Training" description="The bridging section and its call to action.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.bridge.eyebrow} onChange={(v) => updatePath(["bridge", "eyebrow"], v)} />
            <InputField label="Title" value={content.bridge.title} onChange={(v) => updatePath(["bridge", "title"], v)} />
            <InputField label="CTA label" value={content.bridge.cta} onChange={(v) => updatePath(["bridge", "cta"], v)} />
          </div>
          <TextAreaField label="Body" value={content.bridge.body} onChange={(v) => updatePath(["bridge", "body"], v)} rows={5} />
        </SectionCard>

        <SectionCard fullWidth title="Bridging Readout" description="The right-hand metric panel in the bridging section.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Title" value={content.readout.title} onChange={(v) => updatePath(["readout", "title"], v)} />
            <InputField label="Name" value={content.readout.name} onChange={(v) => updatePath(["readout", "name"], v)} />
            <InputField label="Legend" value={content.readout.legend} onChange={(v) => updatePath(["readout", "legend"], v)} />
          </div>
          <ArraySection
            title="Metrics"
            description="Edit the three readout bars."
            items={content.readout.metrics}
            onAdd={() => addArrayItem(["readout", "metrics"], { label: "", suffix: "", width: "80%" })}
            addLabel="Add metric"
          >
            {{
              remove: (index) => removeArrayItem(["readout", "metrics"], index),
              render: (item, index) => (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
                  <InputField label="Label" value={item.label} onChange={(v) => updateArrayItem(["readout", "metrics"], index, "label", v)} />
                  <InputField label="Suffix" value={item.suffix} onChange={(v) => updateArrayItem(["readout", "metrics"], index, "suffix", v)} />
                  <InputField label="Width" value={item.width} onChange={(v) => updateArrayItem(["readout", "metrics"], index, "width", v)} help="Use a percentage like 90%." />
                </div>
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard fullWidth title="Who's Hiring" description="The hiring sectors, roles, and note near the lower part of the page.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.hiring.eyebrow} onChange={(v) => updatePath(["hiring", "eyebrow"], v)} />
            <InputField label="Title" value={content.hiring.title} onChange={(v) => updatePath(["hiring", "title"], v)} />
            <InputField label="Sectors label" value={content.hiring.sectorsLabel} onChange={(v) => updatePath(["hiring", "sectorsLabel"], v)} />
            <InputField label="Roles label" value={content.hiring.rolesLabel} onChange={(v) => updatePath(["hiring", "rolesLabel"], v)} />
          </div>
          <TextAreaField label="Body" value={content.hiring.body} onChange={(v) => updatePath(["hiring", "body"], v)} rows={4} />
          <TextAreaField label="Note" value={content.hiring.note} onChange={(v) => updatePath(["hiring", "note"], v)} rows={3} />

          <ArraySection
            title="Sectors"
            description="Edit the hiring sectors shown as chips."
            items={content.hiring.sectors}
            onAdd={() => addArrayItem(["hiring", "sectors"], "")}
            addLabel="Add sector"
          >
            {{
              remove: (index) => removeArrayItem(["hiring", "sectors"], index),
              render: (item, index) => (
                <InputField
                  label={`Sector ${index + 1}`}
                  value={item}
                  onChange={(v) => updatePrimitiveArrayItem(["hiring", "sectors"], index, v)}
                />
              ),
            }}
          </ArraySection>

          <ArraySection
            title="Roles"
            description="Edit the roles shown as chips."
            items={content.hiring.roles}
            onAdd={() => addArrayItem(["hiring", "roles"], "")}
            addLabel="Add role"
          >
            {{
              remove: (index) => removeArrayItem(["hiring", "roles"], index),
              render: (item, index) => (
                <InputField
                  label={`Role ${index + 1}`}
                  value={item}
                  onChange={(v) => updatePrimitiveArrayItem(["hiring", "roles"], index, v)}
                />
              ),
            }}
          </ArraySection>
        </SectionCard>

        <SectionCard fullWidth title="Quiz" description="The 2-minute check and result copy.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <InputField label="Eyebrow" value={content.quiz.eyebrow} onChange={(v) => updatePath(["quiz", "eyebrow"], v)} />
            <InputField label="Title" value={content.quiz.title} onChange={(v) => updatePath(["quiz", "title"], v)} />
          </div>
          <TextAreaField label="Body" value={content.quiz.body} onChange={(v) => updatePath(["quiz", "body"], v)} rows={4} />

          <ArraySection
            title="Questions"
            description="Edit the three quiz questions and their answer options."
            items={content.quiz.questions}
            onAdd={() => addArrayItem(["quiz", "questions"], { q: "", opts: [{ label: "", val: "" }] })}
            addLabel="Add question"
          >
            {{
              remove: (index) => removeArrayItem(["quiz", "questions"], index),
              render: (item, index) => (
                <div>
                  <TextAreaField
                    label="Question"
                    value={item.q}
                    onChange={(v) => updateArrayItem(["quiz", "questions"], index, "q", v)}
                    rows={3}
                  />
                  <ArraySection
                    title="Options"
                    description="Edit the answer labels. Keep the values aligned with the result mapping."
                    items={item.opts}
                    onAdd={() => addArrayItem(["quiz", "questions", index, "opts"], { label: "", val: "" })}
                    addLabel="Add option"
                  >
                    {{
                      remove: (optIndex) => removeArrayItem(["quiz", "questions", index, "opts"], optIndex),
                      render: (opt, optIndex) => (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                          <InputField
                            label="Option label"
                            value={opt.label}
                            onChange={(v) => updateArrayItem(["quiz", "questions", index, "opts"], optIndex, "label", v)}
                          />
                          <InputField
                            label="Option key"
                            value={opt.val}
                            onChange={(v) => updateArrayItem(["quiz", "questions", index, "opts"], optIndex, "val", v)}
                            help="Used by the result logic."
                          />
                        </div>
                      ),
                    }}
                  </ArraySection>
                </div>
              ),
            }}
          </ArraySection>

          <div style={{ marginTop: "18px" }}>
            <h4 style={{ margin: 0, color: "#16294A", fontSize: "15px", fontFamily: "'Space Grotesk', sans-serif" }}>
              Result messages
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px", marginTop: "12px" }}>
              <TextAreaField label="Graduate result" value={content.quiz.messages.grad} onChange={(v) => updatePath(["quiz", "messages", "grad"], v)} rows={4} />
              <TextAreaField label="Unemployed result" value={content.quiz.messages.unemp} onChange={(v) => updatePath(["quiz", "messages", "unemp"], v)} rows={4} />
              <TextAreaField label="Career change result" value={content.quiz.messages.switch} onChange={(v) => updatePath(["quiz", "messages", "switch"], v)} rows={4} />
              <TextAreaField label="Default result" value={content.quiz.messages.default} onChange={(v) => updatePath(["quiz", "messages", "default"], v)} rows={4} />
              <TextAreaField label="Abroad suffix" value={content.quiz.messages.abroadSuffix} onChange={(v) => updatePath(["quiz", "messages", "abroadSuffix"], v)} rows={3} />
            </div>
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
              Placement actions
            </div>
            <div style={{ fontSize: "12px", color: "#54607A", lineHeight: 1.5 }}>
              Save changes here and the Placement page updates on refresh.
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
