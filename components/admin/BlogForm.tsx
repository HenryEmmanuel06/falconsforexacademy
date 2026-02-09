"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface BlogFormProps {
  onSuccess?: () => void;
  initialData?: {
    id?: string;
    blog_title: string;
    blog_content: string;
    blog_author: string;
    blog_image?: string | null;
  };
}

export default function BlogForm({ onSuccess, initialData }: BlogFormProps) {
  const [formData, setFormData] = useState({
    blog_title: initialData?.blog_title || "",
    blog_content: initialData?.blog_content || "",
    blog_author: initialData?.blog_author || "",
    blog_image: initialData?.blog_image || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        blog_image: publicUrl
      }));

      setSuccess("Image uploaded successfully!");
    } catch (error) {
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Get the current authenticated user from session
      const response = await fetch("/api/admin/auth/check");
      if (!response.ok) {
        throw new Error("User not authenticated");
      }
      
      const { user } = await response.json();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const blogData = {
        ...formData,
        user_id: user.email, // Use email as user_id
      };

      let result;
      if (initialData?.id) {
        // Update existing blog
        result = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', initialData.id);
      } else {
        // Create new blog
        result = await supabase
          .from('blogs')
          .insert(blogData);
      }

      if (result.error) throw result.error;

      setSuccess(initialData?.id ? "Blog updated successfully!" : "Blog created successfully!");
      
      // Reset form if creating new blog
      if (!initialData?.id) {
        setFormData({
          blog_title: "",
          blog_content: "",
          blog_author: "",
          blog_image: "",
        });
      }

      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {initialData?.id ? "Edit Blog" : "Create New Blog"}
        </h3>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="blog_title" className="block text-sm font-medium text-gray-700">
              Blog Title
            </label>
            <input
              type="text"
              name="blog_title"
              id="blog_title"
              required
              value={formData.blog_title}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label htmlFor="blog_author" className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              name="blog_author"
              id="blog_author"
              required
              value={formData.blog_author}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label htmlFor="blog_image" className="block text-sm font-medium text-gray-700">
              Blog Image
            </label>
            <input
              type="file"
              id="blog_image"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {formData.blog_image && (
              <div className="mt-2">
                <img 
                  src={formData.blog_image} 
                  alt="Blog preview" 
                  className="h-32 w-auto object-cover rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="blog_content" className="block text-sm font-medium text-gray-700">
              Blog Content
            </label>
            <textarea
              name="blog_content"
              id="blog_content"
              required
              rows={10}
              value={formData.blog_content}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#091B25] hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Saving..." : (initialData?.id ? "Update Blog" : "Create Blog")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
