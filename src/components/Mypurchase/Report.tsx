// src/Mypurchase/Report.tsx
import React, { useEffect, useRef, useState } from "react";

type TicketForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const SUBJECTS = [
  "Account issue",
  "Payment / Billing",
  "Order / Delivery",
  "Appeal / Ban",
  "Other",
];

const LOCAL_KEY = "aAAcctEmpire:ticket:draft";

export default function Report(): React.ReactElement {
  const [form, setForm] = useState<TicketForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TicketForm, string>>>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showFloating, setShowFloating] = useState(true);

  const mounted = useRef(true);

  // load draft on mount
  useEffect(() => {
    mounted.current = true;
    const draft = localStorage.getItem(LOCAL_KEY);
    if (draft) {
      try {
        setForm(JSON.parse(draft));
      } catch {
        // ignore parse error
      }
    }
    return () => {
      mounted.current = false;
    };
  }, []);

  // autosave draft (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(form));
    }, 600);
    return () => clearTimeout(t);
  }, [form]);

  // hide notices after a while
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(t);
  }, [notice]);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Select a subject";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (k: keyof TicketForm) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [k]: ev.target.value }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) {
      setNotice({ type: "error", text: "Please fix the errors before sending." });
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      // Replace this with your real API endpoint.
      // const res = await fetch("/api/tickets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data?.message || "Submission failed");

      // Mock API (simulate network)
      await new Promise((res) => setTimeout(res, 1200));
      if (!mounted.current) return;

      setNotice({ type: "success", text: "Ticket submitted successfully. We'll reply soon." });
      // keep name & email, clear subject/message
      setForm((prev) => ({ ...prev, subject: "", message: "" }));
      localStorage.removeItem(LOCAL_KEY);
    } catch (err: any) {
      if (!mounted.current) return;
      setNotice({ type: "error", text: err?.message || "Submission failed. Try again." });
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const clearDraft = () => {
    setForm({ name: "", email: "", subject: "", message: "" });
    localStorage.removeItem(LOCAL_KEY);
    setNotice({ type: "success", text: "Draft cleared." });
  };

  return (
    <div className="min-h-[80vh] bg-[#faf6f6]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">New Ticket</h1>

        {/* Notice / Toast */}
        {notice && (
          <div
            role="status"
            className={`mb-4 px-4 py-2 rounded-md text-sm ${notice.type === "success" ? "bg-green-50 text-green-800 border border-green-100" : "bg-red-50 text-red-800 border border-red-100"}`}
          >
            {notice.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name + Email row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Your Name"
                className={`w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 ${errors.name ? "border-red-300" : "border-gray-200"}`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "err-name" : undefined}
              />
              {errors.name && <p id="err-name" className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
                className={`w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 ${errors.email ? "border-red-300" : "border-gray-200"}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "err-email" : undefined}
              />
              {errors.email && <p id="err-email" className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={form.subject}
              onChange={handleChange("subject")}
              className={`w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 ${errors.subject ? "border-red-300" : "border-gray-200"}`}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "err-subject" : undefined}
            >
              <option value="">Select subject</option>
              {SUBJECTS.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
            {errors.subject && <p id="err-subject" className="text-xs text-red-600 mt-1">{errors.subject}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows={6}
              value={form.message}
              onChange={handleChange("message")}
              placeholder="Enter your message here"
              className={`w-full rounded-lg border px-3 py-3 bg-white resize-vertical focus:outline-none focus:ring-2 focus:ring-orange-400 ${errors.message ? "border-red-300" : "border-gray-200"}`}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "err-message" : undefined}
            />
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              {errors.message ? <span id="err-message" className="text-red-600">{errors.message}</span> : <span>&nbsp;</span>}
              <span>{form.message.length} / 2000</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-start gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-white font-medium transition ${loading ? "bg-orange-300 cursor-wait" : "bg-orange-500 hover:bg-orange-600"}`}
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : null}
              Send Message
            </button>

            <button
              type="button"
              onClick={clearDraft}
              className="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => {
                setShowFloating((s) => !s);
                setNotice({ type: "success", text: showFloating ? "Floating button hidden" : "Floating button visible" });
              }}
              className="ml-auto text-sm text-gray-600 hover:text-gray-800"
            >
              Toggle FAB
            </button>
          </div>

          <p className="text-sm text-gray-600 pt-2">
            If you encounter any issues with the ticket system or haven't received a response, please reach out at{" "}
            <a href="mailto:help@aAAcctEmpire.com" className="text-orange-600 hover:underline">help@aAAcctEmpire.com</a>.
            Our technical support is available in English.
          </p>
        </form>
      </div>

      {/* Floating + button */}
      {showFloating && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setNotice({ type: "success", text: "Scrolled to form" });
          }}
          aria-label="Open new ticket"
          className="fixed right-5 bottom-5 z-50 w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg hover:bg-orange-600 transition"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
