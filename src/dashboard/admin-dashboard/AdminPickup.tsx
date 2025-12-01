import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  UserCheck,
  MapPin,
  Calendar,
  Package,
  X,
} from "lucide-react";

interface Pickup {
  id: string;
  customer: string;
  phone: string;
  origin: string;
  destination: string;
  date: string; // ISO date string like "2025-02-03"
  status: "Pending" | "Assigned" | "In Transit" | "Completed" | "Cancelled";
}

const initialData: Pickup[] = [
  { id: "PK-0047", customer: "María González", phone: "+34 612 345 678", origin: "Barcelona, Spain", destination: "Havana, Cuba", date: "2025-02-03", status: "Pending" },
  { id: "PK-0046", customer: "Carlos Pérez", phone: "+53 5 123 4567", origin: "Santiago de Cuba", destination: "Miami, USA", date: "2025-02-01", status: "Assigned" },
  { id: "PK-0045", customer: "Ana López", phone: "+34 678 901 234", origin: "Valencia, Spain", destination: "Camagüey, Cuba", date: "2025-01-30", status: "In Transit" },
  { id: "PK-0044", customer: "Luis Fernández", phone: "+1 305 555 0198", origin: "Miami, USA", destination: "Havana, Cuba", date: "2025-01-29", status: "Completed" },
  { id: "PK-0043", customer: "Elena Martínez", phone: "+34 654 321 987", origin: "Madrid, Spain", destination: "Holguín, Cuba", date: "2025-02-05", status: "Pending" },
  { id: "PK-0042", customer: "Roberto Díaz", phone: "+53 5 987 6543", origin: "Varadero, Cuba", destination: "Madrid, Spain", date: "2025-01-27", status: "Assigned" },
  { id: "PK-0041", customer: "Sofia Rivera", phone: "+34 699 112 233", origin: "Málaga, Spain", destination: "Cuba (Domestic)", date: "2025-02-02", status: "Pending" },
  { id: "PK-0040", customer: "Jorge Herrera", phone: "+1 786 444 5566", origin: "New York, USA", destination: "Havana, Cuba", date: "2025-01-31", status: "In Transit" },
  { id: "PK-0039", customer: "Isabel Torres", phone: "+34 622 334 455", origin: "Sevilla, Spain", destination: "Santa Clara, Cuba", date: "2025-02-04", status: "Pending" },
  { id: "PK-0038", customer: "Miguel Ruiz", phone: "+53 5 555 1234", origin: "Havana, Cuba", destination: "Panama City, Panama", date: "2025-01-28", status: "Cancelled" },
];

const AdminPickup: React.FC = () => {
  const [pickups, setPickups] = useState<Pickup[]>(initialData);
  const [selected, setSelected] = useState<Pickup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Filter state (controlled inputs)
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Helpers
  const getStatusColor = (status: Pickup["status"]) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Assigned": return "bg-blue-100 text-blue-800 border border-blue-300";
      case "In Transit": return "bg-purple-100 text-purple-800 border border-purple-300";
      case "Completed": return "bg-green-100 text-green-800 border border-green-300";
      case "Cancelled": return "bg-red-100 text-red-800 border border-red-300";
    }
  };

  const openModal = (pickup: Pickup) => {
    setSelected(pickup);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const handleAssign = (id: string) => {
    setPickups(prev => prev.map(p => (p.id === id ? { ...p, status: "Assigned" } : p)));
    setNotice(`Pickup ${id} assigned.`);
    setTimeout(() => setNotice(null), 2000);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB");

  // === Filtering logic (live) ===
  const filteredPickups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return pickups.filter(p => {
      // status filter
      if (statusFilter !== "All" && p.status !== statusFilter) return false;

      // date filter (exact date match)
      if (dateFilter) {
        // compare as YYYY-MM-DD strings
        if (p.date !== dateFilter) return false;
      }

      // search: check id, customer, phone, origin, destination
      if (term === "") return true;
      const hay = `${p.id} ${p.customer} ${p.phone} ${p.origin} ${p.destination}`.toLowerCase();
      return hay.includes(term);
    });
  }, [pickups, searchTerm, statusFilter, dateFilter]);

  // Quick reset
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setDateFilter("");
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Package className="text-green-700" />
            Pickup Requests
          </h1>
          <p className="text-gray-600 mt-1">Manage international & domestic Cuba pickups</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="text-sm px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            Reset Filters
          </button>
          <div className="text-sm px-3 py-2 rounded-lg bg-gray-100">
            Showing {filteredPickups.length} / {pickups.length}
          </div>
        </div>
      </div>

      {/* Notice */}
      {notice && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-green-50 text-green-800 border border-green-200 inline-block">
          {notice}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-5 rounded-2xl shadow-lg mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search by ID, customer, phone, origin..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Transit">In Transit</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <input
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            type="date"
            className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
          />

          <button
            onClick={() => { /* optional: kept for UX parity */ }}
            className="flex items-center justify-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition shadow-md hover:shadow-xl"
          >
            <Filter size={18} />
            Apply
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="text-green-700" />
            <h2 className="text-2xl font-bold text-gray-800">All Pickup Requests</h2>
            <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {pickups.length} total
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">ID</th>
                <th className="px-6 py-4 text-left font-semibold">Customer</th>
                <th className="px-6 py-4 text-left font-semibold">Route</th>
                <th className="px-6 py-4 text-left font-semibold hidden md:table-cell">Date</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPickups.map((pickup) => (
                <tr key={pickup.id} className="transition-all duration-200">
                  <td className="px-6 py-5 font-semibold text-green-700">{pickup.id}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {pickup.customer.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{pickup.customer}</p>
                        <p className="text-xs text-gray-500">{pickup.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-medium">{pickup.origin}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-green-700">{pickup.destination}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden md:table-cell text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDate(pickup.date)}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(pickup.status)}`}>
                      {pickup.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => openModal(pickup)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                        aria-label={`View ${pickup.id}`}
                      >
                        <Eye size={16} /> View
                      </button>

                      {pickup.status === "Pending" ? (
                        <button
                          onClick={() => handleAssign(pickup.id)}
                          className="text-green-700 hover:text-green-900 font-medium flex items-center gap-1 hover:bg-green-50 px-3 py-1.5 rounded-lg transition"
                          aria-label={`Assign ${pickup.id}`}
                        >
                          <UserCheck size={16} /> Assign
                        </button>
                      ) : (
                        <div className="text-sm text-gray-500 px-3 py-1.5 rounded-lg border border-gray-100">—</div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPickups.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No pickups match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{selected.id}</h3>
                  <p className="text-sm text-gray-500">{selected.customer} • {selected.phone}</p>
                </div>
                <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-medium">{selected.origin} → <span className="text-green-700">{selected.destination}</span></p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selected.date)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selected.status}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                {selected.status === "Pending" && (
                  <button
                    onClick={() => {
                      handleAssign(selected.id);
                      setSelected(prev => (prev ? { ...prev, status: "Assigned" } : prev));
                    }}
                    className="bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    <UserCheck size={14} className="inline-block mr-1" /> Assign
                  </button>
                )}
                <button onClick={closeModal} className="px-4 py-2 rounded-lg border">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPickup;
