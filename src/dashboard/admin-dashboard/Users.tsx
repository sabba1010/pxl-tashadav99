import React, { useMemo, useState, useEffect } from "react";

type Package = {
  id: string;
  trackingNumber: string;
  lockerId: string;
  customerName: string;
  customerLanguage: string;
  fromAddress: string;
  fromCountry: string;
  toAddress: string;
  toCountry: string;
  name: string;
  price: string;
  type: "Small" | "Medium" | "Large" | "Fleet";
  truckStatus: "moving" | "stopped" | "offline";
  created: string;
  location: { city: string; lat: number; lng: number; lastUpdate: string };
};

/* 30 REALISTIC FAKE PACKAGES — READY FOR DEMO */
const FAKE_PACKAGES: Package[] = [
  { id: "p1", trackingNumber: "BD-TRK-1001", lockerId: "LKR-1001", customerName: "Rahim Khan", customerLanguage: "bn", fromAddress: "Mirpur 10, Dhaka", fromCountry: "Bangladesh", toAddress: "Uttara Sector 13", toCountry: "Bangladesh", name: "Basic Cargo", price: "$29", type: "Small", truckStatus: "moving", created: "2025-01-10", location: { city: "Dhaka", lat: 23.8103, lng: 90.4125, lastUpdate: "2025-01-12 10:22 AM" } },
  { id: "p2", trackingNumber: "BD-TRK-1002", lockerId: "LKR-1002", customerName: "Ayesha Begum", customerLanguage: "bn", fromAddress: "Banani DOHS", fromCountry: "Bangladesh", toAddress: "Gulshan 2", toCountry: "Bangladesh", name: "Express Mini", price: "$15", type: "Small", truckStatus: "moving", created: "2025-01-11", location: { city: "Dhaka", lat: 23.8103, lng: 90.4125, lastUpdate: "2025-01-12 08:00 AM" } },
  { id: "p3", trackingNumber: "BD-TRK-1003", lockerId: "LKR-1003", customerName: "Mohammed Al-Saud", customerLanguage: "ar", fromAddress: "Riyadh Olaya Street", fromCountry: "Saudi Arabia", toAddress: "Jeddah Corniche", toCountry: "Saudi Arabia", name: "Premium Cargo", price: "$199", type: "Large", truckStatus: "stopped", created: "2025-01-08", location: { city: "Riyadh", lat: 24.7136, lng: 46.6753, lastUpdate: "2025-01-11 04:10 PM" } },
  { id: "p4", trackingNumber: "IN-TRK-2001", lockerId: "LKR-2001", customerName: "Priya Sharma", customerLanguage: "hi", fromAddress: "Andheri East, Mumbai", fromCountry: "India", toAddress: "Connaught Place, Delhi", toCountry: "India", name: "Business Cargo", price: "$99", type: "Medium", truckStatus: "moving", created: "2025-01-09", location: { city: "Mumbai", lat: 19.0760, lng: 72.8777, lastUpdate: "2025-01-12 09:40 AM" } },
  { id: "p5", trackingNumber: "UK-TRK-3001", lockerId: "LKR-3001", customerName: "John Smith", customerLanguage: "en", fromAddress: "Heathrow Airport", fromCountry: "United Kingdom", toAddress: "Manchester City Centre", toCountry: "United Kingdom", name: "Enterprise Fleet", price: "Custom", type: "Fleet", truckStatus: "offline", created: "2025-01-05", location: { city: "London", lat: 51.5074, lng: -0.1278, lastUpdate: "2025-01-10 02:15 PM" } },
  { id: "p6", trackingNumber: "BD-TRK-1004", lockerId: "LKR-1004", customerName: "Fatema Akter", customerLanguage: "bn", fromAddress: "Sylhet Ambarkhana", fromCountry: "Bangladesh", toAddress: "Chattogram GEC", toCountry: "Bangladesh", name: "Medicine Cooled", price: "$199", type: "Medium", truckStatus: "moving", created: "2025-01-07", location: { city: "Sylhet", lat: 24.8949, lng: 91.8687, lastUpdate: "2025-01-12 07:50 AM" } },
  { id: "p7", trackingNumber: "FR-TRK-4001", lockerId: "LKR-4001", customerName: "Marie Dubois", customerLanguage: "fr", fromAddress: "Paris CDG Airport", fromCountry: "France", toAddress: "Lyon Part-Dieu", toCountry: "France", name: "Luxury Goods", price: "$599", type: "Large", truckStatus: "stopped", created: "2025-01-06", location: { city: "Paris", lat: 48.8566, lng: 2.3522, lastUpdate: "2025-01-10 05:00 PM" } },
  { id: "p8", trackingNumber: "CN-TRK-5001", lockerId: "LKR-5001", customerName: "Li Wei", customerLanguage: "zh", fromAddress: "Shanghai Pudong", fromCountry: "China", toAddress: "Beijing CBD", toCountry: "China", name: "Mega Freight", price: "Custom", type: "Fleet", truckStatus: "moving", created: "2025-01-04", location: { city: "Shanghai", lat: 31.2304, lng: 121.4737, lastUpdate: "2025-01-12 01:00 PM" } },
  { id: "p9", trackingNumber: "RU-TRK-6001", lockerId: "LKR-6001", customerName: "Ivan Petrov", customerLanguage: "ru", fromAddress: "Moscow Red Square", fromCountry: "Russia", toAddress: "St. Petersburg Nevsky", toCountry: "Russia", name: "Industrial Parts", price: "$899", type: "Large", truckStatus: "offline", created: "2025-01-03", location: { city: "Moscow", lat: 55.7558, lng: 37.6173, lastUpdate: "2025-01-09 11:20 AM" } },
  { id: "p10", trackingNumber: "ES-TRK-7001", lockerId: "LKR-7001", customerName: "Maria Garcia", customerLanguage: "es", fromAddress: "Barcelona Port", fromCountry: "Spain", toAddress: "Madrid Atocha", toCountry: "Spain", name: "Fashion Cargo", price: "$399", type: "Medium", truckStatus: "moving", created: "2025-01-02", location: { city: "Barcelona", lat: 41.3851, lng: 2.1734, lastUpdate: "2025-01-12 03:30 PM" } },
  { id: "p11", trackingNumber: "BD-TRK-1005", lockerId: "LKR-1005", customerName: "Karim Hossain", customerLanguage: "bn", fromAddress: "Khulna Shipyard", fromCountry: "Bangladesh", toAddress: "Rajshahi Godagari", toCountry: "Bangladesh", name: "Rice Bulk", price: "$149", type: "Large", truckStatus: "moving", created: "2025-01-01", location: { city: "Khulna", lat: 22.8456, lng: 89.5403, lastUpdate: "2025-01-12 11:10 AM" } },
  { id: "p12", trackingNumber: "BD-TRK-1006", lockerId: "LKR-1006", customerName: "Salma Akter", customerLanguage: "bn", fromAddress: "Gazipur Factory", fromCountry: "Bangladesh", toAddress: "Narayanganj Port", toCountry: "Bangladesh", name: "Garments Export", price: "$299", type: "Large", truckStatus: "stopped", created: "2024-12-30", location: { city: "Gazipur", lat: 23.9999, lng: 90.4203, lastUpdate: "2025-01-11 06:45 PM" } },
  { id: "p13", trackingNumber: "US-TRK-8001", lockerId: "LKR-8001", customerName: "James Wilson", customerLanguage: "en", fromAddress: "Los Angeles Port", fromCountry: "USA", toAddress: "New York JFK", toCountry: "USA", name: "Electronics", price: "$799", type: "Large", truckStatus: "moving", created: "2024-12-28", location: { city: "Los Angeles", lat: 34.0522, lng: -118.2437, lastUpdate: "2025-01-12 02:00 AM" } },
  { id: "p14", trackingNumber: "BD-TRK-1007", lockerId: "LKR-1007", customerName: "Rashed Ahmed", customerLanguage: "bn", fromAddress: "Comilla Cantonment", fromCountry: "Bangladesh", toAddress: "Cox's Bazar Beach", toCountry: "Bangladesh", name: "Tourist Luggage", price: "$89", type: "Medium", truckStatus: "moving", created: "2024-12-27", location: { city: "Comilla", lat: 23.4607, lng: 91.1809, lastUpdate: "2025-01-12 10:30 AM" } },
  { id: "p15", trackingNumber: "AE-TRK-9001", lockerId: "LKR-9001", customerName: "Fatima Al-Mansoori", customerLanguage: "ar", fromAddress: "Dubai Marina", fromCountry: "UAE", toAddress: "Abu Dhabi Corniche", toCountry: "UAE", name: "Luxury Furniture", price: "$999", type: "Large", truckStatus: "offline", created: "2024-12-25", location: { city: "Dubai", lat: 25.2048, lng: 55.2708, lastUpdate: "2025-01-10 08:00 PM" } },
  // 15 more for full 30
  { id: "p16", trackingNumber: "BD-TRK-1008", lockerId: "LKR-1008", customerName: "Nurul Islam", customerLanguage: "bn", fromAddress: "Bogura City", fromCountry: "Bangladesh", toAddress: "Rangpur Medical", toCountry: "Bangladesh", name: "Hospital Supplies", price: "$249", type: "Medium", truckStatus: "moving", created: "2025-01-12", location: { city: "Bogura", lat: 24.8481, lng: 89.3720, lastUpdate: "2025-01-12 12:00 PM" } },
  { id: "p17", trackingNumber: "BD-TRK-1009", lockerId: "LKR-1009", customerName: "Shirin Akter", customerLanguage: "bn", fromAddress: "Savar EPZ", fromCountry: "Bangladesh", toAddress: "Mongla Port", toCountry: "Bangladesh", name: "Export Garments", price: "$399", type: "Large", truckStatus: "stopped", created: "2025-01-11", location: { city: "Savar", lat: 23.8285, lng: 90.2667, lastUpdate: "2025-01-11 11:05 AM" } },
  { id: "p18", trackingNumber: "BD-TRK-1010", lockerId: "LKR-1010", customerName: "Abdul Kader", customerLanguage: "bn", fromAddress: "Jessore Road", fromCountry: "Bangladesh", toAddress: "Barishal Launch Ghat", toCountry: "Bangladesh", name: "Fish Cargo", price: "$159", type: "Medium", truckStatus: "moving", created: "2025-01-10", location: { city: "Jessore", lat: 23.1778, lng: 89.1804, lastUpdate: "2025-01-12 09:00 AM" } },
  { id: "p19", trackingNumber: "IN-TRK-2002", lockerId: "LKR-2002", customerName: "Rajesh Kumar", customerLanguage: "hi", fromAddress: "Chennai Port", fromCountry: "India", toAddress: "Kolkata Howrah", toCountry: "India", name: "Spices Bulk", price: "$299", type: "Large", truckStatus: "moving", created: "2025-01-09", location: { city: "Chennai", lat: 13.0827, lng: 80.2707, lastUpdate: "2025-01-12 04:00 PM" } },
  { id: "p20", trackingNumber: "BD-TRK-1011", lockerId: "LKR-1011", customerName: "Mahmuda Begum", customerLanguage: "bn", fromAddress: "Mymensingh Medical", fromCountry: "Bangladesh", toAddress: "Dhaka Airport", toCountry: "Bangladesh", name: "Medical Equipment", price: "$499", type: "Large", truckStatus: "offline", created: "2025-01-08", location: { city: "Mymensingh", lat: 24.7471, lng: 90.4203, lastUpdate: "2025-01-11 07:50 AM" } },
  { id: "p21", trackingNumber: "BD-TRK-1012", lockerId: "LKR-1012", customerName: "Sohel Rana", customerLanguage: "bn", fromAddress: "Cumilla Victoria College", fromCountry: "Bangladesh", toAddress: "Dhaka University", toCountry: "Bangladesh", name: "Books & Stationery", price: "$79", type: "Medium", truckStatus: "moving", created: "2025-01-07", location: { city: "Comilla", lat: 23.4607, lng: 91.1809, lastUpdate: "2025-01-12 10:30 AM" } },
  { id: "p22", trackingNumber: "BD-TRK-1013", lockerId: "LKR-1013", customerName: "Nasrin Akter", customerLanguage: "bn", fromAddress: "Rajshahi University", fromCountry: "Bangladesh", toAddress: "Khulna University", toCountry: "Bangladesh", name: "Lab Equipment", price: "$599", type: "Large", truckStatus: "stopped", created: "2025-01-06", location: { city: "Rajshahi", lat: 24.3745, lng: 88.6042, lastUpdate: "2025-01-11 06:45 PM" } },
  { id: "p23", trackingNumber: "BD-TRK-1014", lockerId: "LKR-1014", customerName: "Firoz Ahmed", customerLanguage: "bn", fromAddress: "Chattogram Port", fromCountry: "Bangladesh", toAddress: "Sylhet Tea Garden", toCountry: "Bangladesh", name: "Machinery Parts", price: "$899", type: "Large", truckStatus: "moving", created: "2025-01-05", location: { city: "Chattogram", lat: 22.3569, lng: 91.7832, lastUpdate: "2025-01-12 09:40 AM" } },
  { id: "p24", trackingNumber: "BD-TRK-1015", lockerId: "LKR-1015", customerName: "Rumi Akter", customerLanguage: "bn", fromAddress: "Barishal River Port", fromCountry: "Bangladesh", toAddress: "Dhaka Sadarghat", toCountry: "Bangladesh", name: "Fresh Fruits", price: "$119", type: "Medium", truckStatus: "moving", created: "2025-01-04", location: { city: "Barishal", lat: 22.7010, lng: 90.3535, lastUpdate: "2025-01-12 08:15 AM" } },
  { id: "p25", trackingNumber: "BD-TRK-1016", lockerId: "LKR-1016", customerName: "Shahidul Islam", customerLanguage: "bn", fromAddress: "Rangpur City", fromCountry: "Bangladesh", toAddress: "Dinajpur Border", toCountry: "Bangladesh", name: "Potato Bulk", price: "$89", type: "Large", truckStatus: "moving", created: "2025-01-03", location: { city: "Rangpur", lat: 25.7439, lng: 89.2752, lastUpdate: "2025-01-12 12:30 PM" } },
  { id: "p26", trackingNumber: "BD-TRK-1017", lockerId: "LKR-1017", customerName: "Jamal Uddin", customerLanguage: "bn", fromAddress: "Noakhali Maijdee", fromCountry: "Bangladesh", toAddress: "Feni Trunk Road", toCountry: "Bangladesh", name: "Cement Bags", price: "$189", type: "Large", truckStatus: "stopped", created: "2025-01-02", location: { city: "Noakhali", lat: 22.8728, lng: 91.0973, lastUpdate: "2025-01-11 03:20 PM" } },
  { id: "p27", trackingNumber: "BD-TRK-1018", lockerId: "LKR-1018", customerName: "Farhana Yasmin", customerLanguage: "bn", fromAddress: "Tangail Sari House", fromCountry: "Bangladesh", toAddress: "Dhaka New Market", toCountry: "Bangladesh", name: "Tangail Sarees", price: "$299", type: "Medium", truckStatus: "moving", created: "2025-01-01", location: { city: "Tangail", lat: 24.2513, lng: 89.9167, lastUpdate: "2025-01-12 11:00 AM" } },
  { id: "p28", trackingNumber: "BD-TRK-1019", lockerId: "LKR-1019", customerName: "Monir Hossain", customerLanguage: "bn", fromAddress: "Kushtia Lalon Shah", fromCountry: "Bangladesh", toAddress: "Rajshahi Padma", toCountry: "Bangladesh", name: "Musical Instruments", price: "$399", type: "Medium", truckStatus: "offline", created: "2024-12-31", location: { city: "Kushtia", lat: 23.9103, lng: 89.1225, lastUpdate: "2025-01-10 10:00 AM" } },
  { id: "p29", trackingNumber: "BD-TRK-1020", lockerId: "LKR-1020", customerName: "Tanjila Akter", customerLanguage: "bn", fromAddress: "Pabna Mental Hospital", fromCountry: "Bangladesh", toAddress: "Dhaka PG Hospital", toCountry: "Bangladesh", name: "Medical Transfer", price: "$499", type: "Large", truckStatus: "moving", created: "2024-12-30", location: { city: "Pabna", lat: 24.0115, lng: 89.2575, lastUpdate: "2025-01-12 07:00 AM" } },
  { id: "p30", trackingNumber: "BD-TRK-1021", lockerId: "LKR-1021", customerName: "Global Traders Ltd", customerLanguage: "en", fromAddress: "Mongla International Port", fromCountry: "Bangladesh", toAddress: "Chattogram Export Zone", toCountry: "Bangladesh", name: "Full Container Fleet", price: "Custom", type: "Fleet", truckStatus: "moving", created: "2024-12-29", location: { city: "Mongla", lat: 22.4836, lng: 89.6008, lastUpdate: "2025-01-12 01:00 PM" } },
];

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function AdminPackages() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [selected, setSelected] = useState<Package | null>(null);
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return FAKE_PACKAGES.filter(p =>
      Object.values(p).join(" ").toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedMsg(`Copied: ${text}`);
    setTimeout(() => setCopiedMsg(null), 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white">
        <div className=" mx-auto p-6">

          {/* Header + Search */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Cargo Packages + Truck Tracking (30 Active)</h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything: name, country, tracking, locker..."
              className="w-full md:w-96 px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#166534]"
            />
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow border overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-[#166534] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Lang</th>
                  <th className="px-6 py-4 text-left">From → To</th>
                  <th className="px-6 py-4 text-left">Tracking</th>
                  <th className="px-6 py-4 text-left">Locker ID</th>
                  <th className="px-6 py-4 text-left">Package</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-[#f0fdf4] transition">
                    <td className="px-6 py-4 font-medium">{p.customerName}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold">{p.customerLanguage.toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>{p.fromAddress} ({p.fromCountry})</div>
                      <div>{p.toAddress} ({p.toCountry})</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold text-[#166534]">{p.trackingNumber}</code>
                        <button onClick={() => copyToClipboard(p.trackingNumber)} className="text-xs px-2 py-1 border border-[#166534] rounded hover:bg-[#166534] hover:text-white">Copy</button>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#166534] text-xl">{p.lockerId}</td>
                    <td className="px-6 py-4">{p.name}</td>
                    <td className="px-6 py-4 font-medium">{p.price}</td>
                    <td className="px-6 py-4">
                      {p.truckStatus === "moving" && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">Moving</span>}
                      {p.truckStatus === "stopped" && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Stopped</span>}
                      {p.truckStatus === "offline" && <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">Offline</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelected(p)} className="px-6 py-2 bg-[#166534] text-white rounded-lg hover:bg-[#114e2a] font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {paged.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow border p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{p.customerName}</h3>
                    <p className="text-sm text-gray-600">Lang: {p.customerLanguage.toUpperCase()} • {p.fromCountry} → {p.toCountry}</p>
                  </div>
                  <code className="px-3 py-1 bg-[#166534] text-white rounded font-mono">{p.trackingNumber}</code>
                </div>
                <div className="text-sm space-y-1 mb-4">
                  <div className="font-medium">{p.fromAddress} → {p.toAddress}</div>
                  <div className="font-bold text-[#166534]">Locker ID: {p.lockerId}</div>
                </div>
                <button onClick={() => setSelected(p)} className="w-full py-3 bg-[#166534] text-white rounded-lg hover:bg-[#114e2a] font-medium">
                  View Full Details
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-8 py-3 border-2 border-[#166534] rounded-xl disabled:opacity-50">Previous</button>
            <span className="py-3 px-6">Page {page} of {Math.ceil(total / perPage)}</span>
            <button onClick={() => setPage(p => Math.min(Math.ceil(total / perPage), p+1))} disabled={page === Math.ceil(total / perPage)} className="px-8 py-3 border-2 border-[#166534] rounded-xl disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-screen overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-3xl font-bold text-[#166534] mb-6">{selected.customerName}'s Package</h3>
            <div className="grid md:grid-cols-2 gap-8 text-lg">
              <div>
                <p><strong>Customer:</strong> {selected.customerName}</p>
                <p><strong>Language:</strong> {selected.customerLanguage.toUpperCase()}</p>
                <p><strong>Tracking:</strong> <code className="text-2xl font-bold text-[#166534]">{selected.trackingNumber}</code></p>
                <p><strong>Locker ID:</strong> <code className="text-3xl font-bold text-[#166534]">{selected.lockerId}</code></p>
              </div>
              <div>
                <p><strong>From:</strong> {selected.fromAddress}, {selected.fromCountry}</p>
                <p><strong>To:</strong> {selected.toAddress}, {selected.toCountry}</p>
                <p><strong>Package:</strong> {selected.name} ({selected.type})</p>
                <p><strong>Price:</strong> {selected.price}</p>
                <p><strong>Truck Status:</strong> 
                  {selected.truckStatus === "moving" && "Moving"}
                  {selected.truckStatus === "stopped" && "Stopped"}
                  {selected.truckStatus === "offline" && "Offline"}
                </p>
              </div>
            </div>
            <div className="mt-10 text-right">
              <button onClick={() => setSelected(null)} className="px-12 py-4 bg-[#166534] text-white text-xl rounded-xl hover:bg-[#114e2a]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {copiedMsg && (
        <div className="fixed bottom-6 right-6 bg-[#166534] text-white px-8 py-4 rounded-xl shadow-2xl z-50 text-lg font-medium">
          {copiedMsg}
        </div>
      )}
    </>
  );
}