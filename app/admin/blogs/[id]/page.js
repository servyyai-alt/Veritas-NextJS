"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";

export default function EditBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch(`/api/blogs/${id}`).then((r) => r.json()).then((d) => setBlog(d.data));
  }, [id]);

  if (!blog) {
    return (
      <div className={`adm-page ${mounted ? "adm-page-in" : ""}`}>
        <div className="adm-loading">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ animation: "spin .8s linear infinite" }}>
            <circle cx="12" cy="12" r="10" stroke="#E6DFD3" strokeWidth="3" />
            <path d="M12 2a10 10 0 019.75 7.75" stroke="#8A2434" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Loading blog post…
        </div>
      </div>
    );
  }

  return (
    <div className={`adm-page ${mounted ? "adm-page-in" : ""}`}>
      <div className="adm-header">
        <div className="adm-header-text">
          <h1 className="adm-title">Edit Blog Post</h1>
          <p className="adm-sub">{blog.title}</p>
        </div>
      </div>
      <BlogForm initial={blog} isEdit />
    </div>
  );
}
