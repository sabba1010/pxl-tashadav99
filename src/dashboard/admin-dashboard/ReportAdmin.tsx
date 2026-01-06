import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  X,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import Swal from "sweetalert2";

// API Base URLs
const API_BASE = "http://localhost:3200/purchase";
const USER_API = "http://localhost:3200/user";

interface IReport {
  _id: string;
  orderId: string;
  reporterEmail: string;
  sellerEmail: string;
  buyerEmail?: string;
  reason: string;
  message: string;
  status: string;
  role?: string; // ব্যাকএন্ড থেকে আসা রোল
  createdAt: string;
}

interface IUser {
  email: string;
  role?: string;
}

const ReportAdmin: React.FC = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get<IReport[]>(`${API_BASE}/report/getall`);

      const sorted = [...res.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setReports(sorted);
      setFilteredReports(sorted);

      // সব ইউনিক ইমেইলগুলো কালেক্ট করা রোল চেক করার জন্য
      const emails = new Set<string>();
      sorted.forEach((r) => {
        emails.add(r.reporterEmail);
        emails.add(r.sellerEmail);
      });

      fetchUserRoles(Array.from(emails));
    } catch {
      Swal.fire("Error", "Failed to load reports", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRoles = async (emails: string[]) => {
    const roles: Record<string, string> = {};
    await Promise.all(
      emails.map(async (email) => {
        try {
          const res = await axios.get<IUser>(`${USER_API}/${email}`);
          roles[email] = res.data.role || "seller"; // রোল না থাকলে সেলার
        } catch {
          roles[email] = "seller"; // এরর হলেও সেলার
        }
      })
    );
    setUserRoles((prev) => ({ ...prev, ...roles }));
  };

  // ================= ACTIONS =================
  const handleSolve = async (id: string) => {
    try {
      await axios.patch(`${API_BASE}/report/update/${id}`, { status: "Solved" });
      Swal.fire("Solved", "Report marked as solved", "success");
      setSelectedReport(null);
      fetchReports();
    } catch {
      Swal.fire("Error", "Failed to solve report", "error");
    }
  };

  const handleMarkAsSold = async (id: string) => {
    try {
      await axios.patch(`${API_BASE}/report/mark-sold/${id}`);
      Swal.fire("Success", "Order marked as sold", "success");
      setSelectedReport(null);
      fetchReports();
    } catch {
      Swal.fire("Error", "Failed to mark as sold", "error");
    }
  };

  const handleRefund = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Confirm Refund",
      text: "This will refund the buyer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Refund",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(`${API_BASE}/report/refund/${id}`);
      Swal.fire("Refunded", "Payment refunded successfully", "success");
      setSelectedReport(null);
      fetchReports();
    } catch {
      Swal.fire("Error", "Refund failed", "error");
    }
  };

  // ================= SEARCH & FILTER =================
  useEffect(() => {
    const result = reports.filter(
      (r) =>
        r.orderId.toLowerCase().includes(search.toLowerCase()) ||
        r.reporterEmail.toLowerCase().includes(search.toLowerCase()) ||
        r.sellerEmail.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredReports(result);
    setCurrentPage(1);
  }, [search, reports]);

  // ================= ROLE BADGE LOGIC =================
  const getRoleBadge = (email: string, reportData?: IReport) => {
    // ১. রিপোর্টের অবজেক্টে রোল থাকলে সেটা নিবে
    // ২. না থাকলে ইউজার ডাটা থেকে নিবে
    // ৩. কোনোটাই না থাকলে ডিফল্ট "seller"
    const role = (reportData?.role || userRoles[email] || "seller").toLowerCase();

    return (
      <span
        className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
        ${
          role === "buyer"
            ? "bg-blue-100 text-blue-700 border border-blue-200"
            : "bg-purple-100 text-purple-700 border border-purple-200"
        }`}
      >
        {role}
      </span>
    );
  };

  // ================= PAGINATION =================
  const indexOfLast = currentPage * reportsPerPage;
  const currentReports = filteredReports.slice(indexOfLast - reportsPerPage, indexOfLast);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-500">Loading Reports...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-extrabold text-slate-800">Report Management</h1>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-white"
              placeholder="Search by Email or Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Reporter</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Reported User</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Reason</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentReports.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-sm text-slate-600 font-medium">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700 flex items-center">
                        {r.reporterEmail}
                        {getRoleBadge(r.reporterEmail, r)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-600 flex items-center">
                      {r.sellerEmail}
                      {getRoleBadge(r.sellerEmail)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">{r.reason}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      r.status === "Solved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedReport(r)}
                      className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition shadow-sm"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-30"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                    currentPage === i + 1 ? "bg-purple-600 text-white shadow-md shadow-purple-200" : "bg-white border border-slate-200 text-slate-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-30"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <h2 className="font-bold text-xl flex items-center gap-3 text-white">
                <ShieldAlert className="text-amber-400" /> Report Details
              </h2>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-white/10 rounded-full transition text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Order ID</p>
                  <p className="font-mono text-sm bg-slate-50 p-2 rounded border border-slate-100">{selectedReport.orderId}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status</p>
                  <p className="text-sm font-bold text-amber-600">{selectedReport.status}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Message from Reporter</p>
                <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-purple-500 italic text-slate-700">
                  "{selectedReport.message}"
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleMarkAsSold(selectedReport._id)}
                  className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 text-sm"
                >
                  Mark as Sold
                </button>

                <button
                  onClick={() => handleRefund(selectedReport._id)}
                  className="bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition shadow-lg shadow-rose-100 text-sm"
                >
                  Confirm Refund
                </button>

                <button
                  onClick={() => handleSolve(selectedReport._id)}
                  className="bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 text-sm"
                >
                  Mark Solved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAdmin;