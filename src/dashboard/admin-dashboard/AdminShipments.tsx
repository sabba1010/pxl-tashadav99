import React, { useEffect, useMemo, useState } from "react";

/** ---------------- Types ---------------- */
type ShipmentStatus = "pending" | "processing" | "in_transit" | "delivered" | "cancelled";

interface Shipment {
  id: string;
  trackingNumber: string;
  sender: string;
  receiver: string;
  weight: number;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  origin: string;
  destination: string;
  price: number;
}

/** ---------------- Helpers ---------------- */
const BOTTLE = "#166534";
const BOTTLE_DARK = "#14572b";

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
}

const statusColors: Record<ShipmentStatus, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  processing: { bg: "bg-blue-100", text: "text-blue-800" },
  in_transit: { bg: "bg-indigo-100", text: "text-indigo-800" },
  delivered: { bg: "bg-green-100", text: "text-green-800" },
  cancelled: { bg: "bg-red-100", text: "text-red-800" },
};

/** --------------- Dummy data (same content you used earlier) --------------- */
const DUMMY: Shipment[] = [
  { id: "24", trackingNumber: "PKG-556677", sender: "Kevin Brown", receiver: "Shimu", weight: 4.8, status: "processing", createdAt: "2025-01-26", updatedAt: "2025-01-28", origin: "Atlanta Cargo", destination: "Sylhet, Bangladesh", price: 36 },
  { id: "244", trackingNumber: "PKG-111677", sender: "Kevin Brown", receiver: "Shimu", weight: 4.8, status: "processing", createdAt: "2025-01-26", updatedAt: "2025-01-28", origin: "Atlanta Cargo", destination: "Sylhet, Bangladesh", price: 36 },
  { id: "25", trackingNumber: "PKG-889900", sender: "Chloe Davis", receiver: "Kamal", weight: 0.9, status: "in_transit", createdAt: "2025-01-20", updatedAt: "2025-01-25", origin: "Phoenix Depot", destination: "Dhaka, Bangladesh", price: 17 },
  { id: "26", trackingNumber: "PKG-110022", sender: "Ryan Miller", receiver: "Laila", weight: 16.2, status: "delivered", createdAt: "2025-01-07", updatedAt: "2025-01-14", origin: "Denver Sorting Facility", destination: "Chattogram", price: 72 },
  { id: "27", trackingNumber: "PKG-334455", sender: "Grace Smith", receiver: "Hasib", weight: 2.1, status: "cancelled", createdAt: "2025-01-18", updatedAt: "2025-01-19", origin: "Boston Terminal", destination: "Rajshahi, Bangladesh", price: 26 },
  { id: "28", trackingNumber: "PKG-667788", sender: "Henry Williams", receiver: "Muna", weight: 14.5, status: "pending", createdAt: "2025-01-28", updatedAt: "2025-01-28", origin: "Dallas Freight", destination: "Barishal, Bangladesh", price: 65 },
  { id: "29", trackingNumber: "PKG-991122", sender: "Isabella Jones", receiver: "Hasan", weight: 7.0, status: "processing", createdAt: "2025-01-25", updatedAt: "2025-01-27", origin: "San Diego Warehouse", destination: "Mymensingh, Bangladesh", price: 43 },
  { id: "30", trackingNumber: "PKG-446688", sender: "Jack Nguyen", receiver: "Afia", weight: 5.3, status: "in_transit", createdAt: "2025-01-15", updatedAt: "2025-01-23", origin: "Philadelphia Logistics", destination: "Rangpur, Bangladesh", price: 38 },
  { id: "31", trackingNumber: "PKG-779911", sender: "Lily Chen", receiver: "Rifat", weight: 1.5, status: "delivered", createdAt: "2025-01-04", updatedAt: "2025-01-09", origin: "Portland Hub", destination: "Khulna, Bangladesh", price: 24 },
  { id: "32", trackingNumber: "PKG-223344", sender: "Max Walker", receiver: "Sumaiya", weight: 19.0, status: "cancelled", createdAt: "2025-01-10", updatedAt: "2025-01-11", origin: "Orlando Terminal", destination: "Dhaka, Bangladesh", price: 78 },
  { id: "33", trackingNumber: "PKG-558800", sender: "Mia Perez", receiver: "Alif", weight: 1.1, status: "pending", createdAt: "2025-01-29", updatedAt: "2025-01-29", origin: "Detroit Depot", destination: "Chattogram", price: 21 },
  { id: "34", trackingNumber: "PKG-990033", sender: "Noah Baker", receiver: "Shaila", weight: 8.5, status: "processing", createdAt: "2025-01-22", updatedAt: "2025-01-24", origin: "Salt Lake City Warehouse", destination: "Sylhet, Bangladesh", price: 47 },
  { id: "35", trackingNumber: "PKG-124578", sender: "Phoebe Scott", receiver: "Naim", weight: 2.9, status: "in_transit", createdAt: "2025-01-16", updatedAt: "2025-01-23", origin: "Miami Warehouse", destination: "Rajshahi, Bangladesh", price: 29 },
  { id: "36", trackingNumber: "PKG-346790", sender: "Quinn Adams", receiver: "Tania", weight: 13.0, status: "delivered", createdAt: "2025-01-02", updatedAt: "2025-01-08", origin: "New York Warehouse", destination: "Barishal, Bangladesh", price: 62 },
  { id: "37", trackingNumber: "PKG-568901", sender: "Ruby Lopez", receiver: "Ashraf", weight: 0.7, status: "cancelled", createdAt: "2025-01-20", updatedAt: "2025-01-21", origin: "Texas Warehouse", destination: "Mymensingh, Bangladesh", price: 14 },
  { id: "38", trackingNumber: "PKG-780123", sender: "Sam Johnson", receiver: "Nazmul", weight: 11.0, status: "pending", createdAt: "2025-01-30", updatedAt: "2025-01-30", origin: "LA Warehouse", destination: "Rangpur, Bangladesh", price: 58 },
  { id: "39", trackingNumber: "PKG-902345", sender: "Taylor Rodriguez", receiver: "Sonia", weight: 4.2, status: "processing", createdAt: "2025-01-23", updatedAt: "2025-01-25", origin: "Chicago Distribution Center", destination: "Dhaka, Bangladesh", price: 34 },
  { id: "40", trackingNumber: "PKG-123456", sender: "Victor Gomez", receiver: "Babu", weight: 6.5, status: "in_transit", createdAt: "2025-01-17", updatedAt: "2025-01-24", origin: "Seattle Hub", destination: "Khulna, Bangladesh", price: 41 },
  { id: "41", trackingNumber: "PKG-345678", sender: "Willow Hayes", receiver: "Jui", weight: 17.5, status: "delivered", createdAt: "2025-01-05", updatedAt: "2025-01-12", origin: "Atlanta Cargo", destination: "Chattogram", price: 70 },
  { id: "42", trackingNumber: "PKG-567890", sender: "Xavier Reed", receiver: "Amin", weight: 0.4, status: "cancelled", createdAt: "2025-01-21", updatedAt: "2025-01-22", origin: "Phoenix Depot", destination: "Sylhet, Bangladesh", price: 10 },
  { id: "43", trackingNumber: "PKG-789012", sender: "Yara Evans", receiver: "Raima", weight: 9.8, status: "pending", createdAt: "2025-01-31", updatedAt: "2025-01-31", origin: "Denver Sorting Facility", destination: "Rajshahi, Bangladesh", price: 50 },
  { id: "44", trackingNumber: "PKG-901234", sender: "Zane Cooper", receiver: "Dipu", weight: 3.3, status: "processing", createdAt: "2025-01-24", updatedAt: "2025-01-26", origin: "Boston Terminal", destination: "Barishal, Bangladesh", price: 32 },
  { id: "45", trackingNumber: "PKG-123045", sender: "Amy Flores", receiver: "Shuvo", weight: 15.5, status: "in_transit", createdAt: "2025-01-18", updatedAt: "2025-01-25", origin: "Dallas Freight", destination: "Mymensingh, Bangladesh", price: 67 },
  { id: "46", trackingNumber: "PKG-345067", sender: "Ben Carter", receiver: "Nitu", weight: 5.0, status: "delivered", createdAt: "2025-01-03", updatedAt: "2025-01-10", origin: "San Diego Warehouse", destination: "Rangpur, Bangladesh", price: 37 },
  { id: "47", trackingNumber: "PKG-567089", sender: "Cara Bell", receiver: "Fardin", weight: 1.4, status: "cancelled", createdAt: "2025-01-25", updatedAt: "2025-01-26", origin: "Philadelphia Logistics", destination: "Khulna, Bangladesh", price: 23 },
  { id: "48", trackingNumber: "PKG-789011", sender: "Devon King", receiver: "Sumon", weight: 20.0, status: "pending", createdAt: "2025-02-01", updatedAt: "2025-02-01", origin: "Portland Hub", destination: "Dhaka, Bangladesh", price: 80 },
  { id: "49", trackingNumber: "PKG-901233", sender: "Eli Roth", receiver: "Jahanara", weight: 0.6, status: "processing", createdAt: "2025-01-27", updatedAt: "2025-01-28", origin: "Orlando Terminal", destination: "Chattogram", price: 13 },
  { id: "50", trackingNumber: "PKG-112355", sender: "Fiona Lee", receiver: "Anika", weight: 12.5, status: "in_transit", createdAt: "2025-01-19", updatedAt: "2025-01-26", origin: "Detroit Depot", destination: "Sylhet, Bangladesh", price: 61 },
  { id: "51", trackingNumber: "PKG-334577", sender: "Gabe West", receiver: "Maruf", weight: 8.0, status: "delivered", createdAt: "2025-01-07", updatedAt: "2025-01-13", origin: "Salt Lake City Warehouse", destination: "Rajshahi, Bangladesh", price: 46 },
  { id: "52", trackingNumber: "PKG-556799", sender: "Holly Chen", receiver: "Labib", weight: 2.2, status: "cancelled", createdAt: "2025-01-22", updatedAt: "2025-01-23", origin: "Miami Warehouse", destination: "Barishal, Bangladesh", price: 27 },
  { id: "53", trackingNumber: "PKG-778911", sender: "Ian Price", receiver: "Nabila", weight: 10.5, status: "pending", createdAt: "2025-02-02", updatedAt: "2025-02-02", origin: "New York Warehouse", destination: "Mymensingh, Bangladesh", price: 54 },
];

/** ---------------- Component ---------------- */
export default function AdminShipmentsResponsive() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [query, setQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
  const [page, setPage] = useState<number>(1);
  const perPage = 6;
  const [sortBy, setSortBy] = useState<keyof Shipment | "createdAt">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [selected, setSelected] = useState<Shipment | null>(null);
  const [updateModal, setUpdateModal] = useState<Shipment | null>(null);

  useEffect(() => {
    setShipments(DUMMY);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = shipments.filter(s => {
      const matchesQ =
        s.trackingNumber.toLowerCase().includes(q) ||
        s.sender.toLowerCase().includes(q) ||
        s.receiver.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesQ && matchesStatus;
    });

    // sort
    list.sort((a, b) => {
      const aVal = (a as any)[sortBy] as any;
      const bVal = (b as any)[sortBy] as any;
      if (aVal == null || bVal == null) return 0;
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [shipments, query, statusFilter, sortBy, sortDir]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  function toggleSort(col: keyof Shipment | "createdAt") {
    if (sortBy === col) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("asc");
    }
  }

  const updateStatus = (id: string, status: ShipmentStatus) => {
    setShipments(prev => prev.map(s => (s.id === id ? { ...s, status, updatedAt: new Date().toISOString().slice(0, 10) } : s)));
    setUpdateModal(null);
  };

  useEffect(() => setPage(1), [query, statusFilter, sortBy, sortDir]);

  return (
    <div className="p-6 bg-[#f7faf7] min-h-screen">
      <div className=" mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Shipments</h2>
         
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tracking, sender, receiver..."
              className="px-3 py-2 border rounded-md shadow-sm w-full sm:w-80 focus:outline-none focus:ring-2"
              style={{ borderColor: "#d1e9e2", boxShadow: "0 0 0 4px rgba(22,101,52,0.06)" }}
            />
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | "all")}
                className="px-3 py-2 border rounded-md"
                style={{ borderColor: "#d1e9e2" }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                onClick={() => { setQuery(""); setStatusFilter("all"); setSortBy("createdAt"); setSortDir("desc"); }}
                className="px-3 py-2 border rounded-md"
              >
                Reset
              </button>

         
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-xs text-gray-500">Total Shipments</div>
            <div className="text-2xl font-bold text-[#166534]">{DUMMY.length}</div>
            <div className="text-xs text-gray-400 mt-1">Total records</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-xs text-gray-500">In Transit</div>
            <div className="text-2xl font-bold text-indigo-700">{DUMMY.filter(d=>d.status==="in_transit").length}</div>
            <div className="text-xs text-gray-400 mt-1">Currently moving</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-xs text-gray-500">Delivered</div>
            <div className="text-2xl font-bold text-green-600">{DUMMY.filter(d=>d.status==="delivered").length}</div>
            <div className="text-xs text-gray-400 mt-1">Completed</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-xs text-gray-500">Pending / Processing</div>
            <div className="text-2xl font-bold text-yellow-700">{DUMMY.filter(d=>d.status==="pending" || d.status==="processing").length}</div>
            <div className="text-xs text-gray-400 mt-1">Needs attention</div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#166534] text-white">
              <tr>
                <th className="text-left p-4">Tracking</th>
                <th className="text-left p-4">Sender</th>
                <th className="text-left p-4">Receiver</th>
                <th className="text-left p-4">Weight</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 cursor-pointer" onClick={() => toggleSort("createdAt")}>Created {sortBy === "createdAt" ? (sortDir === "asc" ? "▲" : "▼") : ""}</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paged.map(s => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{s.trackingNumber}</td>
                  <td className="p-4 text-gray-700">{s.sender}</td>
                  <td className="p-4 text-gray-700">{s.receiver}</td>
                  <td className="p-4 text-gray-700">{s.weight} lb</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[s.status].bg} ${statusColors[s.status].text}`}>
                      {s.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">{fmtDate(s.createdAt)}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      <button onClick={() => setSelected(s)} className="px-3 py-1 border rounded-md text-sm">View</button>
                      <button onClick={() => setUpdateModal(s)} className="px-3 py-1 bg-[#166534] text-white rounded-md text-sm hover:bg-[#14572b]">Update</button>
                    </div>
                  </td>
                </tr>
              ))}

              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">No shipments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {paged.map(s => (
            <article key={s.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-gray-800">{s.trackingNumber}</div>
                  <div className="text-xs text-gray-500">{s.origin} → {s.destination}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold">{fmtDate(s.createdAt)}</div>
                  <div className="text-xs mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full ${statusColors[s.status].bg} ${statusColors[s.status].text}`}>{s.status.replace("_", " ")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <div><b>Sender:</b> {s.sender}</div>
                <div><b>Receiver:</b> {s.receiver}</div>
                <div className="mt-2 flex gap-2 justify-end">
                  <button onClick={() => setSelected(s)} className="px-3 py-1 border rounded-md text-sm">View</button>
                  <button onClick={() => setUpdateModal(s)} className="px-3 py-1 bg-[#166534] text-white rounded-md text-sm hover:bg-[#14572b]">Update</button>
                </div>
              </div>
            </article>
          ))}

          {paged.length === 0 && (
            <div className="text-center text-gray-500">No shipments found.</div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-3">
          <div className="text-sm text-gray-600">Showing {total === 0 ? 0 : start + 1} - {Math.min(start + perPage, total)} of {total}</div>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded-md disabled:opacity-50">Prev</button>
            <div className="flex gap-1">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded-md ${page === i + 1 ? "bg-[#166534] text-white" : "border"}`}>{i + 1}</button>
              ))}
            </div>
            <button disabled={page === pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
          </div>
        </div>

      </div>

      {/* Selected Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold">{selected.trackingNumber}</h3>
                <p className="text-sm text-gray-500">{selected.origin} → {selected.destination}</p>
              </div>
              <div>
                <button onClick={() => setSelected(null)} className="text-gray-600">✕</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Shipment Info</h4>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li><b>Sender:</b> {selected.sender}</li>
                  <li><b>Receiver:</b> {selected.receiver}</li>
                  <li><b>Weight:</b> {selected.weight} lb</li>
                  <li><b>Price:</b> ${selected.price}</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700">Status</h4>
                <p className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full ${statusColors[selected.status].bg} ${statusColors[selected.status].text}`}>
                    {selected.status.replace("_", " ")}
                  </span>
                </p>
                <div className="mt-4 text-sm text-gray-500"><b>Created:</b> {fmtDate(selected.createdAt)}</div>
                <div className="mt-1 text-sm text-gray-500"><b>Updated:</b> {fmtDate(selected.updatedAt)}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded-md">Close</button>
              <button onClick={() => { setUpdateModal(selected); setSelected(null); }} className="px-4 py-2 bg-[#166534] text-white rounded-md hover:bg-[#14572b]">Update Status</button>
            </div>
          </div>
        </div>
      )}

      {/* Update status modal */}
      {updateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-2">Update Status — {updateModal.trackingNumber}</h3>
            <p className="text-sm text-gray-500 mb-4">Current: <span className={`px-2 py-1 rounded-full ${statusColors[updateModal.status].bg} ${statusColors[updateModal.status].text}`}>{updateModal.status.replace("_"," ")}</span></p>

            <select
              value={updateModal.status}
              onChange={(e) => setUpdateModal({ ...updateModal, status: e.target.value as ShipmentStatus })}
              className="w-full px-3 py-2 border rounded-md mb-4"
              style={{ borderColor: "#d1e9e2" }}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={() => setUpdateModal(null)} className="px-4 py-2 border rounded-md">Cancel</button>
              <button onClick={() => { if (updateModal) updateStatus(updateModal.id, updateModal.status); }} className="px-4 py-2 bg-[#166534] text-white rounded-md hover:bg-[#14572b]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
