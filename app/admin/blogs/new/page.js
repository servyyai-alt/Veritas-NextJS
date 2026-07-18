"use client";
import { useState } from "react";
import BlogForm from "@/components/admin/BlogForm";

export default function NewBlog() {
  const [mounted] = useState(true);
  return (
    <div className={`adm-page ${mounted ? "adm-page-in" : ""}`}>
      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Add Blog Post</h1>
          <p className="adm-sub">Write a new blog post</p>
        </div>
      </div>
      <BlogForm />
    </div>
  );
}
