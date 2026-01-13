import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const API_URL = "http://localhost:3200";

const AdminSettings: React.FC = () => {
  const location = useLocation();
  const isFullPage = location.pathname === "/admin-dashboard/settings" || location.pathname === "/admin-dashboard/settings/";
  const [fee, setFee] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings`);
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        const current = data?.settings?.registrationFee;
        setFee(current ?? 15);
      } catch (err) {
        console.error(err);
        setMessage({ text: "Could not load current fee", type: "error" });
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
        setMessage({
          text: `Saved successfully — $${data.registrationFee.toFixed(2)}`,
          type: "success",
        });
        setFee(data.registrationFee); // keep in sync
      } else {
        setMessage({ text: data.message || "Failed to save", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const outerWrapperClass = isFullPage
    ? "min-h-screen flex items-center justify-center bg-gray-50/40 px-4"
    : "px-0";

  const innerMaxWidth = isFullPage ? "max-w-3xl" : "max-w-md";

  return (
    <div className={outerWrapperClass}>
      <div className={`w-full mx-auto ${innerMaxWidth} px-4`}>
        {/* Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200/70 transition-shadow hover:shadow-2xl">
          <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-10 py-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Seller Account Activation
            </h2>
            <p className="mt-1.5 text-sm text-gray-600">
              Set the one-time registration fee for new sellers (USD)
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-7 p-10">
            <div>
              <label
                htmlFor="fee"
                className="block text-sm font-medium text-gray-700"
              >
                Registration / Activation Fee
              </label>
              <div className="relative mt-2 rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-gray-500 sm:text-base">$</span>
                </div>
                <input
                  id="fee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={fee}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFee(val === "" ? "" : Number(val));
                  }}
                  placeholder="15.00"
                  className={`
                    block w-full rounded-lg border-gray-300 pl-10 
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                    disabled:cursor-not-allowed disabled:bg-gray-100
                    sm:text-base py-3.5 transition-colors
                  `}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={loading}
                className={`
                  inline-flex items-center justify-center gap-2
                  rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600
                  px-7 py-3.5 text-base font-semibold text-white shadow-md
                  hover:from-indigo-700 hover:to-blue-700 focus:outline-none
                  focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2
                  disabled:from-indigo-400 disabled:to-blue-400 disabled:cursor-not-allowed
                  transition-all duration-200
                `}
              >
                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>

              {message && (
                <p
                  className={`
                    text-sm font-medium
                    ${message.type === "success" ? "text-green-700" : ""}
                    ${message.type === "error" ? "text-red-700" : ""}
                    ${message.type === "info" ? "text-gray-700" : ""}
                  `}
                >
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