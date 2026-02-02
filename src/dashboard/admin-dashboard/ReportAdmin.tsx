import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  X,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Package,
} from "lucide-react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// API URL
const API_BASE = "http://localhost:3200/purchase";

// TypeScript Interfaces
interface IReport {
  _id: string;
  orderId: string;
  productName?: string; // ✅ Added Product Name
  reporterEmail: string;
  sellerEmail: string;
  reason: string;
  message: string;
  status: string;
  role?: string;
  createdAt: string;
  sellerPhone?: string;
}

interface IUpdateResponse {
  success: boolean;
  message?: string;
}

const ReportAdmin: React.FC = () => {
  /* 
   * Note: reports and loading are handled by useQuery now. 
   */
  const [filteredReports, setFilteredReports] = useState<IReport[]>([]);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;

  const fetchReportsData = async (): Promise<IReport[]> => {
    const res = await axios.get<IReport[]>(`${API_BASE}/report/getall`);
    const usersRes = await axios.get<any>(`${API_BASE.replace('/purchase', '')}/api/user/getall`);
    const users: any[] = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.users || [];

    const phoneMap = new Map<string, string>();
    users.forEach((u) => {
      if (u.email) {
        const phone = `${u.countryCode || ''} ${u.phone || ''}`.trim();
        phoneMap.set(u.email.toLowerCase(), phone);
      }
    });

    if (Array.isArray(res.data)) {
      const withPhones = res.data.map((r) => ({
        ...r,
        sellerPhone: phoneMap.get(r.sellerEmail?.toLowerCase() || '') || undefined,
      } as IReport));

      const sorted = [...withPhones].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return sorted;
    }
    return [];
  };

  const { data: reports = [], isLoading: loading, refetch } = useQuery({
    queryKey: ["adminReports"],
    queryFn: fetchReportsData,
    refetchInterval: 5000,
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!newStatus || newStatus === "Pending") return;

    const confirmResult = await Swal.fire({
      title: `Confirm ${newStatus}?`,
      text: `Are you sure you want to change status to ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F172A",
      confirmButtonText: "Yes, Confirm",
    });

    if (!confirmResult.isConfirmed) {
      refetch();
      return;
    }

    try {
      let endpoint = "";
      if (newStatus === "Sold") {
        endpoint = `${API_BASE}/report/mark-sold/${id}`;
      } else if (newStatus === "Refunded") {
        endpoint = `${API_BASE}/report/refund/${id}`;
      } else {
        return;
      }

      const res = await axios.patch<IUpdateResponse>(endpoint);

      if (res.data.success) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Report marked as ${newStatus}`,
          showConfirmButton: false,
          timer: 2000
        });
        refetch();
      }
    } catch (error: any) {
      console.error("Update Error:", error);
      Swal.fire("Error", error.response?.data?.message || "Operation failed", "error");
      refetch();
    }
  };

  useEffect(() => {
    const result = reports.filter(
      (r) =>
        r.orderId.toLowerCase().includes(search.toLowerCase()) ||
        (r.productName || '').toLowerCase().includes(search.toLowerCase()) || // ✅ Search by Product Name
        r.reporterEmail.toLowerCase().includes(search.toLowerCase()) ||
        r.sellerEmail.toLowerCase().includes(search.toLowerCase()) ||
        (r.sellerPhone || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredReports(result);
    setCurrentPage(1);
  }, [search, reports]);

  const indexOfLast = currentPage * reportsPerPage;
  const currentReports = filteredReports.slice(indexOfLast - reportsPerPage, indexOfLast);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-bold text-slate-500 italic animate-pulse">
      Loading Admin Reports...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans">
      <div className=" mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight italic uppercase">
            Report <span className="text-amber-500">Management</span>
          </h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all bg-white shadow-sm"
              placeholder="Search Order, Email or Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Product & Order</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Reporter</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Reported </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Status Action</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentReports.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                          <Package size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 uppercase italic">
                            {r.productName || "N/A"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {r.orderId} | {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <a href={`mailto:${r.reporterEmail}`} className="text-sm font-semibold text-slate-700 hover:underline">{r.reporterEmail}</a>
                        <span className={`w-fit text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${r.role === 'buyer' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                          {r.role || "seller"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <a href={`mailto:${r.sellerEmail}`} className="text-sm font-semibold text-slate-700 hover:underline">{r.sellerEmail}</a>
                        {r.sellerPhone && (
                          <a href={`https://wa.me/${r.sellerPhone.replace(/\s+/g, '')}`} className="text-xs text-emerald-600 font-bold mt-1 hover:underline">
                            {r.sellerPhone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="relative inline-block w-32">
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r._id, e.target.value)}
                          className={`w-full appearance-none px-3 py-2 rounded-lg text-xs font-black border outline-none cursor-pointer transition-all uppercase ${r.status === "Refunded" ? "bg-red-50 text-red-600 border-red-200" :
                            r.status === "Sold" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                              "bg-amber-50 text-amber-600 border-amber-200"
                            }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Sold">Sold</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedReport(r)}
                        className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition active:scale-95 shadow-sm uppercase italic"
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

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button className="p-2 border rounded-lg bg-white disabled:opacity-50" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={18} /></button>
            <span className="text-sm font-bold text-slate-600">Page {currentPage} of {totalPages}</span>
            <button className="p-2 border rounded-lg bg-white disabled:opacity-50" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={18} /></button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[1.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert size={22} className="text-amber-400" />
                <span className="font-black text-lg uppercase italic tracking-tighter">Case Review</span>
              </div>
              <button onClick={() => setSelectedReport(null)} className="hover:bg-white/10 p-1 rounded-full"><X size={24} /></button>
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <Package className="text-amber-600" />
                <div>
                  <label className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">Product Name</label>
                  <p className="font-black text-slate-800 uppercase italic">{selectedReport.productName || "Unknown"}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Report Reason</label>
                <p className="font-bold text-slate-800 text-lg italic">{selectedReport.reason}</p>
              </div>

              <div className="mb-6">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">User Message</label>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed italic mt-2 shadow-inner">
                  "{selectedReport.message}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Reporter</label>
                  <a href={`mailto:${selectedReport.reporterEmail}`} className="text-[11px] font-semibold text-slate-700 truncate block hover:underline">{selectedReport.reporterEmail}</a>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Reported Email</label>
                  <a href={`mailto:${selectedReport.sellerEmail}`} className="text-[11px] font-semibold text-slate-700 truncate block hover:underline">{selectedReport.sellerEmail}</a>
                </div>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition shadow-lg uppercase tracking-widest"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAdmin;