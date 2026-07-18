"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProgrammeForm from "@/components/admin/ProgrammeForm";

export default function EditProgramme() {
  const { id } = useParams();
  const [prog, setProg] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch(`/api/programmes/${id}`).then((r) => r.json()).then((d) => setProg(d.data));
  }, [id]);

  if (!prog) {
    return (
      <div className={`adm-page ${mounted ? "adm-page-in" : ""}`}>
        <div className="adm-loading">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ animation: "spin .8s linear infinite" }}>
            <circle cx="12" cy="12" r="10" stroke="#E6DFD3" strokeWidth="3" />
            <path d="M12 2a10 10 0 019.75 7.75" stroke="#8A2434" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Loading programme…
        </div>
      </div>
    );
  }

  return (
    <div className={`adm-page ${mounted ? "adm-page-in" : ""}`}>
      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Edit Programme</h1>
          <p className="adm-sub">{prog.title}</p>
        </div>
      </div>
      <ProgrammeForm initial={prog} isEdit />
    </div>
  );
}
