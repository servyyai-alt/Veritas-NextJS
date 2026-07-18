"use client";
import { useState } from "react";
import ProgrammeForm from "@/components/admin/ProgrammeForm";

export default function NewProgramme() {
  const [mounted] = useState(true);
  return (
    <div className={`adm-page ${mounted ? "adm-page-in" : ""}`}>
      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Add Programme</h1>
          <p className="adm-sub">Create a new programme listing</p>
        </div>
      </div>
      <ProgrammeForm />
    </div>
  );
}
