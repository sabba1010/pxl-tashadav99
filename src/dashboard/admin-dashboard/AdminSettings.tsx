import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3200";

const AdminSettings: React.FC = () => {
  const [fee, setFee] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings`);
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
    if (fee === "" || isNaN(Number(fee))) return setMessage("Enter a valid amount");
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
        setMessage(`Saved: $${data.registrationFee}`);
      } else {
        setMessage(data.message || "Save failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Activate Seller Account</h2>
      <form onSubmit={handleSave} className="space-y-4 max-w-sm">
        <label className="block">
          <span className="text-sm text-gray-600">Registration / Activation Fee (USD)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={fee as any}
            onChange={(e) => setFee(e.target.value === "" ? "" : Number(e.target.value))}
            className="mt-2 w-full px-3 py-2 border rounded"
          />
        </label>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default AdminSettings;