import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface PostFormData {
  title: string;
  description: string;
}

const Post: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    //  to get form data
    const form = e.currentTarget as HTMLFormElement;

    const title = (
      form.elements.namedItem("title") as HTMLInputElement
    ).value.trim();
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value.trim();

    if (!title || !description) {
      toast.error("Please fill out all fields!");
      setLoading(false);
      return;
    }

    const formData: PostFormData = {
      title,
      description,
    };

    try {
      const res = await axios.post(
        "http://localhost:3200/api/notification/notify",
        formData
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("📢 Notification posted successfully!");
        form.reset();
      }
    } catch (err: any) {
      if (err.response) {
        toast.error(
          "Error: " + (err.response.data.message || err.response.data.error)
        );
      } else {
        toast.error("❌ Something went wrong! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-5">Create Notification</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            required
            disabled={loading}
            className="w-full border px-3 py-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Notification title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            required
            disabled={loading}
            className="w-full border px-3 py-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Write something..."
            rows={4}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
        >
          {loading ? "Posting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Post;
