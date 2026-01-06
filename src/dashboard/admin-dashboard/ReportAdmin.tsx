import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  X,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Settings2,
  ChevronDown,
} from "lucide-react";
import Swal from "sweetalert2";

const API_BASE = "https://vps-backend-server-beta.vercel.app/purchase";
const USER_API = "https://vps-backend-server-beta.vercel.app/user";

interface IReport {
  _id: string;
  orderId: string;
  reporterEmail: string;
  sellerEmail: string;
  reason: string;
  message: string;
  status: string;
  role?: string; 
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

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;

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
          roles[email] = res.data.role || "seller";
        } catch {
          roles[email] = "seller";
        }
      })
    );
    setUserRoles((prev) => ({ ...prev, ...roles }));
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!newStatus) return;

    if (newStatus === "Refunded") {
      const confirm = await Swal.fire({
        title: "Confirm Refund?",
        text: "This will process the refund for the buyer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Yes, Refund",
      });
      if (!confirm.isConfirmed) return;
    }

    try {
      let endpoint = `${API_BASE}/report/update/${id}`;
      if (newStatus === "Sold") endpoint = `${API_BASE}/report/mark-sold/${id}`;
      if (newStatus === "Refunded") endpoint = `${API_BASE}/report/refund/${id}`;

      await axios.patch(endpoint, { status: newStatus });
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Status set to ${newStatus}`,
        showConfirmButton: false,
        timer: 2000
      });
      fetchReports();
    } catch (error) {
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

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

  const getRoleBadge = (email: string, reportData?: IReport) => {
    const role = (reportData?.role || userRoles[email] || "seller").toLowerCase();
    return (
      <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          role === "buyer" ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-purple-100 text-purple-700 border border-purple-200"
      }`}>
        {role}
      </span>
    );
  };

  const indexOfLast = currentPage * reportsPerPage;
  const currentReports = filteredReports.slice(indexOfLast - reportsPerPage, indexOfLast);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-500">Loading Reports...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans">
      <div className=" mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Report Management</h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all bg-white"
              placeholder="Search Email or Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Reporter</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Reported User</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Status Action</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentReports.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-sm text-slate-600 font-medium whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700 flex items-center">
                          {r.reporterEmail} {getRoleBadge(r.reporterEmail, r)}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 font-mono bg-slate-100 w-fit px-1.5 py-0.5 rounded">ID: {r.orderId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-600 flex items-center">
                        {r.sellerEmail} {getRoleBadge(r.sellerEmail)}
                      </span>
                    </td>
                    
                    {/* ENHANCED DROPDOWN */}
                    <td className="p-4">
                      <div className="relative group max-w-[140px] mx-auto">
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r._id, e.target.value)}
                          className={`w-full appearance-none pl-4 pr-8 py-2 rounded-xl text-xs font-bold tracking-wide border transition-all cursor-pointer outline-none ${
                            r.status === "Refunded" ? "bg-rose-50 text-rose-600 border-rose-200" :
                            r.status === "Sold" ? "bg-blue-50 text-blue-600 border-blue-200" : 
                            "bg-amber-50 text-amber-600 border-amber-200"
                          }`}
                        >
                          <option value="Pending" className="bg-white text-slate-700">Pending</option>
                          <option value="Sold" className="bg-white text-slate-700">Sold</option>
                          <option value="Refunded" className="bg-white text-slate-700">Refunded</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <ChevronDown size={14} className="text-slate-400" />
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedReport(r)} 
                        className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition active:scale-95 shadow-sm"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 pb-8">
            <button className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}><ChevronLeft size={20} /></button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${currentPage === i + 1 ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"}`}>{i + 1}</button>
            ))}
            <button className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}><ChevronRight size={20} /></button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-amber-400/20 p-2 rounded-xl">
                  <ShieldAlert className="text-amber-400" size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight">Review Case</h2>
                  <p className="text-[10px] text-slate-400 font-mono">Order: {selectedReport.orderId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-white/10 rounded-full transition text-white"><X size={24} /></button>
            </div>
            
            <div className="p-8">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Reason for reporting</p>
                <p className="text-base font-bold text-slate-800">{selectedReport.reason}</p>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Detailed Message</p>
                <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-slate-900 italic text-slate-700 text-sm leading-relaxed shadow-inner">
                  "{selectedReport.message}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="py-3.5 bg-slate-100 text-slate-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition shadow-lg"
                >
                  Confirm Review
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