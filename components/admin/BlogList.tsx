"use client";

import { useState, useEffect } from "react";
import { supabase, Blog } from "@/lib/supabase";
import BlogForm from "./BlogForm";

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (error) {
      setError("Failed to delete blog");
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBlog(null);
    fetchBlogs();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#091B25]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
        <button
          onClick={() => {
            setEditingBlog(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-[#091B25] text-white rounded-md hover:bg-zinc-800"
        >
          Create New Blog
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingBlog ? "Edit Blog" : "Create New Blog"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingBlog(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <BlogForm 
              onSuccess={handleFormSuccess}
              initialData={editingBlog || undefined}
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {blogs.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No blogs found. Create your first blog!
            </li>
          ) : (
            blogs.map((blog) => (
              <li key={blog.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#091B25] truncate">
                      {blog.blog_title}
                    </p>
                    <p className="text-sm text-gray-500">
                      By {blog.blog_author} • {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {blog.blog_content.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
