"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const S = {
  form: { background: "#fff", borderRadius: "14px", border: "1px solid #E6DFD3", padding: "28px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  field: { marginBottom: "18px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#16294A", marginBottom: "6px" },
  input: { width: "100%", padding: "11px 13px", border: "1px solid #E6DFD3", borderRadius: "9px", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "11px 13px", border: "1px solid #E6DFD3", borderRadius: "9px", fontSize: "14px", fontFamily: "inherit", outline: "none", minHeight: "120px", resize: "vertical", boxSizing: "border-box" },
  select: { width: "100%", padding: "11px 13px", border: "1px solid #E6DFD3", borderRadius: "9px", fontSize: "14px", fontFamily: "inherit", outline: "none" },
  btn: { background: "#8A2434", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 22px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnSec: { background: "#fff", color: "#16294A", border: "1px solid #E6DFD3", borderRadius: "10px", padding: "12px 22px", fontSize: "15px", cursor: "pointer", fontFamily: "inherit", marginLeft: "12px" },
  section: { marginBottom: "28px" },
  sh: { fontFamily: "'Space Grotesk',sans-serif", fontSize: "16px", color: "#16294A", margin: "0 0 14px", paddingBottom: "8px", borderBottom: "1px solid #E6DFD3" },
  tag: { display: "inline-block", background: "#f0ebe3", borderRadius: "6px", padding: "4px 9px", fontSize: "13px", margin: "3px", cursor: "pointer" },
  err: { background: "#F3E5E6", border: "1px solid #E7C9CD", borderRadius: "8px", padding: "12px", marginBottom: "16px", color: "#8A2434", fontSize: "14px" },
};

const SCENES = ["s-auto", "s-semi", "s-ev", "s-rail", "s-robot", "s-iot"];
const QS_DEFAULTS = [{ value: "5–6 mo", label: "Duration" }, { value: "Graduate", label: "Entry level" }, { value: "On-campus", label: "Format" }, { value: "Pearson", label: "Standard" }];

export default function ProgrammeForm({ initial = {}, isEdit = false }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", domainCode: "", slug: "", tag: "Programme", sceneClass: "s-auto",
    shortDesc: "", lead: "", overview: "", feeTotal: "",
    skills: [], hiringIndustries: [], published: false, metaTitle: "", metaDesc: "",
    quickStats: QS_DEFAULTS, roles: [], projects: [], feeSteps: [], salaryBands: [],
    ...initial,
    skills: initial.skills ? initial.skills.join(", ") : "",
    hiringIndustries: initial.hiringIndustries ? initial.hiringIndustries.join(", ") : "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError(""); setSaving(true);
    const payload = {
      ...form,
      skills: typeof form.skills === "string" ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : form.skills,
      hiringIndustries: typeof form.hiringIndustries === "string" ? form.hiringIndustries.split(",").map((s) => s.trim()).filter(Boolean) : form.hiringIndustries,
    };
    const url = isEdit ? `/api/programmes/${initial._id}` : "/api/programmes";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setSaving(false);
    if (data.success) router.push("/admin/programmes");
    else setError(data.message || "Save failed");
  };

  const addQS = () => set("quickStats", [...(form.quickStats || []), { value: "", label: "" }]);
  const setQS = (i, k, v) => { const qs = [...(form.quickStats || [])]; qs[i] = { ...qs[i], [k]: v }; set("quickStats", qs); };
  const removeQS = (i) => set("quickStats", (form.quickStats || []).filter((_, idx) => idx !== i));

  const addRole = () => set("roles", [...(form.roles || []), { role: "", desc: "" }]);
  const setRole = (i, k, v) => { const r = [...(form.roles || [])]; r[i] = { ...r[i], [k]: v }; set("roles", r); };
  const removeRole = (i) => set("roles", (form.roles || []).filter((_, idx) => idx !== i));

  const addProject = () => set("projects", [...(form.projects || []), { pnum: "", title: "", desc: "" }]);
  const setProj = (i, k, v) => { const p = [...(form.projects || [])]; p[i] = { ...p[i], [k]: v }; set("projects", p); };
  const removeProj = (i) => set("projects", (form.projects || []).filter((_, idx) => idx !== i));

  const addSalary = () => set("salaryBands", [...(form.salaryBands || []), { level: "", amount: "" }]);
  const setSalary = (i, k, v) => { const s = [...(form.salaryBands || [])]; s[i] = { ...s[i], [k]: v }; set("salaryBands", s); };
  const removeSalary = (i) => set("salaryBands", (form.salaryBands || []).filter((_, idx) => idx !== i));

  const addFeeStep = () => set("feeSteps", [...(form.feeSteps || []), { stage: "", pct: "", amount: "", title: "", desc: "" }]);
  const setFeeStep = (i, k, v) => { const fs = [...(form.feeSteps || [])]; fs[i] = { ...fs[i], [k]: v }; set("feeSteps", fs); };
  const removeFeeStep = (i) => set("feeSteps", (form.feeSteps || []).filter((_, idx) => idx !== i));

  return (
    <div style={S.form}>
      {error && <div style={S.err}>{error}</div>}

      {/* Basic Info */}
      <div style={S.section}>
        <h3 style={S.sh}>Basic Information</h3>
        <div style={S.grid2}>
          <div style={S.field}><label style={S.label}>Title *</label><input style={S.input} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Industrial Automation" /></div>
          <div style={S.field}><label style={S.label}>Domain Code *</label><input style={S.input} value={form.domainCode} onChange={(e) => set("domainCode", e.target.value)} placeholder="D-06" /></div>
          <div style={S.field}><label style={S.label}>Slug (auto-generated if blank)</label><input style={S.input} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="industrial-automation" /></div>
          <div style={S.field}>
            <label style={S.label}>Scene / Background</label>
            <select style={S.select} value={form.sceneClass} onChange={(e) => set("sceneClass", e.target.value)}>
              {SCENES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={S.field}><label style={S.label}>Short Description (card)</label><input style={S.input} value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} /></div>
        <div style={S.field}><label style={S.label}>Hero Lead Paragraph</label><textarea style={S.textarea} value={form.lead} onChange={(e) => set("lead", e.target.value)} /></div>
        <div style={S.field}><label style={S.label}>Industry Overview</label><textarea style={{ ...S.textarea, minHeight: "160px" }} value={form.overview} onChange={(e) => set("overview", e.target.value)} /></div>
      </div>

      {/* Quick Stats */}
      <div style={S.section}>
        <h3 style={S.sh}>Quick Stats</h3>
        {(form.quickStats || []).map((qs, i) => (
          <div key={i} style={{ ...S.grid2, marginBottom: "10px", alignItems: "center" }}>
            <input style={S.input} placeholder="Value (e.g. 5–6 mo)" value={qs.value} onChange={(e) => setQS(i, "value", e.target.value)} />
            <div style={{ display: "flex", gap: "8px" }}>
              <input style={{ ...S.input, flex: 1 }} placeholder="Label (e.g. Duration)" value={qs.label} onChange={(e) => setQS(i, "label", e.target.value)} />
              <button onClick={() => removeQS(i)} style={{ background: "#c0392b", color: "#fff", border: "none", borderRadius: "8px", padding: "0 12px", cursor: "pointer" }}>×</button>
            </div>
          </div>
        ))}
        <button onClick={addQS} style={{ fontSize: "13px", color: "#8A2434", background: "none", border: "1px dashed #E7C9CD", borderRadius: "8px", padding: "8px 14px", cursor: "pointer" }}>+ Add stat</button>
      </div>

      {/* Skills */}
      <div style={S.section}>
        <h3 style={S.sh}>Skills (comma separated)</h3>
        <textarea style={S.textarea} value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="PLC programming, SCADA configuration, HMI design…" />
      </div>

      {/* Roles */}
      <div style={S.section}>
        <h3 style={S.sh}>Career Roles</h3>
        {(form.roles || []).map((r, i) => (
          <div key={i} style={{ ...S.grid2, marginBottom: "10px", alignItems: "flex-start" }}>
            <input style={S.input} placeholder="Role title" value={r.role} onChange={(e) => setRole(i, "role", e.target.value)} />
            <div style={{ display: "flex", gap: "8px" }}>
              <input style={{ ...S.input, flex: 1 }} placeholder="Description" value={r.desc} onChange={(e) => setRole(i, "desc", e.target.value)} />
              <button onClick={() => removeRole(i)} style={{ background: "#c0392b", color: "#fff", border: "none", borderRadius: "8px", padding: "0 12px", cursor: "pointer" }}>×</button>
            </div>
          </div>
        ))}
        <button onClick={addRole} style={{ fontSize: "13px", color: "#8A2434", background: "none", border: "1px dashed #E7C9CD", borderRadius: "8px", padding: "8px 14px", cursor: "pointer" }}>+ Add role</button>
      </div>

      {/* Projects */}
      <div style={S.section}>
        <h3 style={S.sh}>Projects</h3>
        {(form.projects || []).map((p, i) => (
          <div key={i} style={{ background: "#f7f5ef", borderRadius: "10px", padding: "14px", marginBottom: "10px" }}>
            <div style={S.grid2}>
              <input style={{ ...S.input, marginBottom: "8px" }} placeholder="Project code (e.g. PRJ-01)" value={p.pnum} onChange={(e) => setProj(i, "pnum", e.target.value)} />
              <input style={{ ...S.input, marginBottom: "8px" }} placeholder="Project title" value={p.title} onChange={(e) => setProj(i, "title", e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input style={{ ...S.input, flex: 1 }} placeholder="Description" value={p.desc} onChange={(e) => setProj(i, "desc", e.target.value)} />
              <button onClick={() => removeProj(i)} style={{ background: "#c0392b", color: "#fff", border: "none", borderRadius: "8px", padding: "0 12px", cursor: "pointer" }}>×</button>
            </div>
          </div>
        ))}
        <button onClick={addProject} style={{ fontSize: "13px", color: "#8A2434", background: "none", border: "1px dashed #E7C9CD", borderRadius: "8px", padding: "8px 14px", cursor: "pointer" }}>+ Add project</button>
      </div>

      {/* Fees */}
      <div style={S.section}>
        <h3 style={S.sh}>Fees</h3>
        <div style={S.field}><label style={S.label}>Total Fee</label><input style={S.input} value={form.feeTotal} onChange={(e) => set("feeTotal", e.target.value)} placeholder="₹1,20,000" /></div>
        {(form.feeSteps || []).map((fs, i) => (
          <div key={i} style={{ background: "#f7f5ef", borderRadius: "10px", padding: "14px", marginBottom: "10px" }}>
            <div style={S.grid2}>
              <input style={{ ...S.input, marginBottom: "8px" }} placeholder="Stage (e.g. Stage 1)" value={fs.stage} onChange={(e) => setFeeStep(i, "stage", e.target.value)} />
              <input style={{ ...S.input, marginBottom: "8px" }} placeholder="Percentage (e.g. 50%)" value={fs.pct} onChange={(e) => setFeeStep(i, "pct", e.target.value)} />
            </div>
            <div style={S.grid2}>
              <input style={{ ...S.input, marginBottom: "8px" }} placeholder="Amount (e.g. ₹65,000)" value={fs.amount} onChange={(e) => setFeeStep(i, "amount", e.target.value)} />
              <input style={{ ...S.input, marginBottom: "8px" }} placeholder="Title (e.g. At enrolment)" value={fs.title} onChange={(e) => setFeeStep(i, "title", e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input style={{ ...S.input, flex: 1 }} placeholder="Description" value={fs.desc} onChange={(e) => setFeeStep(i, "desc", e.target.value)} />
              <button onClick={() => removeFeeStep(i)} style={{ background: "#c0392b", color: "#fff", border: "none", borderRadius: "8px", padding: "0 12px", cursor: "pointer" }}>×</button>
            </div>
          </div>
        ))}
        <button onClick={addFeeStep} style={{ fontSize: "13px", color: "#8A2434", background: "none", border: "1px dashed #E7C9CD", borderRadius: "8px", padding: "8px 14px", cursor: "pointer" }}>+ Add fee step</button>
      </div>

      {/* Hiring Industries */}
      <div style={S.section}>
        <h3 style={S.sh}>Hiring Industries (comma separated)</h3>
        <textarea style={S.textarea} value={form.hiringIndustries} onChange={(e) => set("hiringIndustries", e.target.value)} placeholder="Automotive, FMCG and packaging, Pharmaceuticals, Steel and metals…" />
      </div>

      {/* Salary */}
      <div style={S.section}>
        <h3 style={S.sh}>Salary Bands</h3>
        {(form.salaryBands || []).map((s, i) => (
          <div key={i} style={{ ...S.grid2, marginBottom: "10px" }}>
            <input style={S.input} placeholder="Level (e.g. Entry 0–2 yr)" value={s.level} onChange={(e) => setSalary(i, "level", e.target.value)} />
            <div style={{ display: "flex", gap: "8px" }}>
              <input style={{ ...S.input, flex: 1 }} placeholder="Amount (e.g. ₹3–5 LPA)" value={s.amount} onChange={(e) => setSalary(i, "amount", e.target.value)} />
              <button onClick={() => removeSalary(i)} style={{ background: "#c0392b", color: "#fff", border: "none", borderRadius: "8px", padding: "0 12px", cursor: "pointer" }}>×</button>
            </div>
          </div>
        ))}
        <button onClick={addSalary} style={{ fontSize: "13px", color: "#8A2434", background: "none", border: "1px dashed #E7C9CD", borderRadius: "8px", padding: "8px 14px", cursor: "pointer" }}>+ Add band</button>
      </div>

      {/* Publish */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "15px", color: "#16294A" }}>
          <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#8A2434" }} />
          Published (visible on site)
        </label>
      </div>

      <div>
        <button onClick={handleSubmit} disabled={saving} style={S.btn}>{saving ? "Saving…" : isEdit ? "Save Changes" : "Create Programme"}</button>
        <button onClick={() => router.push("/admin/programmes")} style={S.btnSec}>Cancel</button>
      </div>
    </div>
  );
}
