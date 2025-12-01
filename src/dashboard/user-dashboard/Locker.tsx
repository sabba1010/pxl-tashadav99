import React, { useState } from "react";

/* ------------------ Fake Virtual Locker Data ------------------ */
export const FAKE_LOCKER = {
  id: "XG15STV",
  warehouseAddress: "12345 SW 162nd Ave",
  warehouseLabel: "EXPRESUR XG15STV",
  city: "Miami",
  state: "FL",
  zip: "33032",
  phone: "786-314-4045",
  notes: "This locker is active and ready for receiving packages.",
  createdAt: "2024-03-12",
  owner: {
    name: "Juan Carlos",
    email: "juanc@example.com",
    phone: "+1 786-555-0147",
  },
  recent: [
    { id: "SHP-1001", date: "2025-01-10", status: "Delivered", summary: "Small parcel from Cuba" },
    { id: "SHP-1002", date: "2025-01-09", status: "In Transit", summary: "Clothing box" },
    { id: "SHP-1003", date: "2025-01-07", status: "Received", summary: "Electronics (fragile)" },
  ],
};

function copyToClipboard(text: string) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
  return Promise.resolve();
}

export default function Locker() {
  const [copied, setCopied] = useState(false);
  const [showJSON, setShowJSON] = useState(false);

  async function handleCopy() {
    await copyToClipboard(FAKE_LOCKER.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function handleDownloadJSON() {
    const blob = new Blob([JSON.stringify(FAKE_LOCKER, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${FAKE_LOCKER.id}_locker.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className=" mx-auto px-4">
        {/* Full-width header */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="text-sm text-gray-500">VIRTUAL LOCKER</div>
            <h1 className="text-2xl font-extrabold text-[#166534]">{FAKE_LOCKER.warehouseLabel}</h1>
            <div className="mt-1 text-sm text-gray-600">Unique Locker ID: <span className="font-medium">{FAKE_LOCKER.id}</span></div>
            <div className="mt-2 text-xs text-gray-500">Created: {FAKE_LOCKER.createdAt} • Owner: {FAKE_LOCKER.owner.name} • {FAKE_LOCKER.owner.email}</div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button onClick={handleCopy} className="px-3 py-2 bg-[#166534] text-white rounded-md shadow">{copied ? "Copied" : "Copy Locker ID"}</button>
            <button onClick={handleDownloadJSON} className="px-3 py-2 border rounded-md">Download JSON</button>
            <button onClick={() => window.print()} className="px-3 py-2 border rounded-md">Print</button>

            {/* Removed QR / barcode — show simple badge instead */}
            <div className="ml-2">
           
              <div className="px-3 py-2 bg-white rounded-md font-mono text-sm border">{FAKE_LOCKER.id}</div>
            </div>
          </div>
        </div>

        {/* Main grid — full width (two columns on lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left: Address + details (wide) */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Address & Receiving Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Address Line 1</div>
                <div className="font-medium">{FAKE_LOCKER.warehouseAddress}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Address Line 2</div>
                <div className="font-medium">{FAKE_LOCKER.warehouseLabel}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">City</div>
                <div className="font-medium">{FAKE_LOCKER.city}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">State / Zip</div>
                <div className="font-medium">{FAKE_LOCKER.state} • {FAKE_LOCKER.zip}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Warehouse Phone</div>
                <div className="font-medium">{FAKE_LOCKER.phone}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">User Contact</div>
                <div className="font-medium">{FAKE_LOCKER.owner.name} • {FAKE_LOCKER.owner.phone}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-500">Notes</div>
              <div className="mt-1 text-gray-700">{FAKE_LOCKER.notes}</div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold">Recent Shipments</h3>
              <div className="mt-3 space-y-2">
                {FAKE_LOCKER.recent.map((r) => (
                  <div key={r.id} className="flex items-center justify-between border rounded p-3">
                    <div>
                      <div className="text-sm font-medium">{r.id} — {r.summary}</div>
                      <div className="text-xs text-gray-500">{r.date}</div>
                    </div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${r.status === 'Delivered' ? 'bg-green-100 text-green-700' : r.status === 'In Transit' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: compact info + activity */}
          <aside className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <div className="text-sm text-gray-500">Locker Status</div>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">Active</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Share / Actions</div>
              <div className="mt-2 flex flex-col gap-2">
                <button onClick={handleCopy} className="px-3 py-2 bg-[#166534] text-white rounded-md">Copy ID</button>
                <button onClick={() => setShowJSON(s => !s)} className="px-3 py-2 border rounded-md">Toggle JSON</button>
                <button onClick={handleDownloadJSON} className="px-3 py-2 border rounded-md">Download JSON</button>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Quick Info</div>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                <li><b>Phone:</b> {FAKE_LOCKER.phone}</li>
                <li><b>Zip:</b> {FAKE_LOCKER.zip}</li>
                <li><b>Owner:</b> {FAKE_LOCKER.owner.name}</li>
              </ul>
            </div>

            <div>
              <div className="text-sm text-gray-500">Activity (Timeline)</div>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1" />
                  <div>
                    <div className="font-medium">Parcel received</div>
                    <div className="text-xs text-gray-500">2025-01-12 • 11:00 AM</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1" />
                  <div>
                    <div className="font-medium">Customs cleared</div>
                    <div className="text-xs text-gray-500">2025-01-11 • 09:30 AM</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-1" />
                  <div>
                    <div className="font-medium">Shipment created (Cuba)</div>
                    <div className="text-xs text-gray-500">2025-01-09 • 07:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Optional: raw JSON viewer */}
        {showJSON && (
          <div className="mt-6 bg-white rounded-lg shadow p-4 overflow-auto">
            <pre className="text-xs">{JSON.stringify(FAKE_LOCKER, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
