import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3200";

type Msg = { text: string; type?: "success" | "error" | "info" } | null;

const AdminSettings: React.FC = () => {
  const [fee, setFee] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Msg>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings`);
        if (!res.ok) return;
        const data = await res.json();
        const current = data?.settings?.registrationFee;
        setFee(current ?? 15);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fee === "" || isNaN(Number(fee)) || Number(fee) < 0) {
      setMessage({ text: "Please enter a valid amount (≥ 0)", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationFee: Number(fee) }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Saved successfully — $${Number(data.registrationFee).toFixed(2)}`, type: "success" });
        setFee(Number(data.registrationFee));
      } else {
        setMessage({ text: data.message || "Save failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Network error. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
            <h3 className="text-2xl font-extrabold text-gray-900">Seller Account Activation</h3>
            <p className="mt-1 text-sm text-gray-600">Set the one-time registration fee for new sellers (USD)</p>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div>
              <label htmlFor="fee" className="block text-sm font-medium text-gray-700">
                Registration / Activation Fee
              </label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input
                  id="fee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={fee as any}
                  onChange={(e) => setFee(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="15.00"
                  className="block w-full rounded-xl border border-gray-200 bg-white px-10 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60"
              >
                {loading ? (
                  <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                  </svg>
                ) : null}
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>

              {message && (
                <p className={`text-sm font-medium ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>
                  {message.text}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;