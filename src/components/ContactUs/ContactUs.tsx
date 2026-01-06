import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, User, Send } from "lucide-react";

const ContactUs: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSent(true);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-lg p-8 md:p-12">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-full bg-[#e6c06c]/20 flex items-center justify-center text-[#e6c06c]">
            <Mail className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Contact Support</h1>
            <p className="text-gray-600 mt-2 max-w-xl">Need help? Send us a message and our Support team will reply within 24–72 hours.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 mb-2">Name</span>
              <div className="relative">
                <input
                  value={user?.name || ""}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900"
                />
                <User className="absolute right-3 top-3 text-gray-400" />
              </div>
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 mb-2">Email</span>
              <div className="relative">
                <input
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900"
                />
                <Mail className="absolute right-3 top-3 text-gray-400" />
              </div>
            </label>
          </div>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your issue"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain the problem and attach any relevant screenshots or order IDs."
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 resize-y"
            />
          </label>

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-500">Our team usually replies within 24–72 hours.</div>

            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 bg-[#33ac6f] hover:bg-[#2ea969] text-white font-semibold px-5 py-3 rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>

          {sent && (
            <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">Your message has been sent — we'll be in touch soon.</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
