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

// 🔥 IMPORTANT: base শুধু /purchase
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

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  // ================= FETCH =================
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get<IReport[]>(
        `${API_BASE}/report/getall`
      );

      const sorted = [...res.data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setReports(sorted);
      setFilteredReports(sorted);

      const emails = new Set<string>();
      sorted.forEach((r) => {
        emails.add(r.reporterEmail);
        emails.add(r.sellerEmail);
        if (r.buyerEmail) emails.add(r.buyerEmail);
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
          roles[email] = res.data.role || "Unknown";
        } catch {
          roles[email] = "Unknown";
        }
      })
    );
    setUserRoles((prev) => ({ ...prev, ...roles }));
  };

  // ================= ACTIONS =================

  // ✅ SOLVE
  const handleSolve = async (id: string) => {
    try {
      await axios.patch(`${API_BASE}/report/update/${id}`, {
        status: "Solved",
      });
      Swal.fire("Solved", "Report marked as solved", "success");
      setSelectedReport(null);
      fetchReports();
    } catch {
      Swal.fire("Error", "Failed to solve report", "error");
    }
  };

  // ✅ MARK AS SOLD
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

  // ✅ REFUND
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

  // ================= SEARCH =================
  useEffect(() => {
    const result = reports.filter(
      (r) =>
        r.orderId.toLowerCase().includes(search.toLowerCase()) ||
        r.reporterEmail.toLowerCase().includes(search.toLowerCase()) ||
        r.sellerEmail.toLowerCase().includes(search.toLowerCase()) ||
        (r.buyerEmail &&
          r.buyerEmail.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredReports(result);
    setCurrentPage(1);
  }, [search, reports]);

  // ================= PAGINATION =================
  const indexOfLast = currentPage * reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfLast - reportsPerPage,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const getReportedUser = (r: IReport) =>
    r.buyerEmail || r.sellerEmail;

  const getRoleBadge = (email: string) => {
    const role = userRoles[email];
    if (!role) return null;

    return (
      <span
        className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase
        ${
          role === "buyer"
            ? "bg-blue-100 text-blue-700"
            : role === "seller"
            ? "bg-purple-100 text-purple-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Report Management</h1>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          className="w-full pl-10 py-3 rounded-xl border"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 text-xs uppercase">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Reporter</th>
              <th className="p-4">Reported</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-4 text-sm">
                  {new Date(r.createdAt).toDateString()}
                </td>
                <td className="p-4">
                  <User size={14} className="inline mr-1" />
                  {r.reporterEmail}
                  {getRoleBadge(r.reporterEmail)}
                </td>
                <td className="p-4">
                  {getReportedUser(r)}
                  {getRoleBadge(getReportedUser(r))}
                </td>
                <td className="p-4">{r.reason}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold
                    ${
                      r.status === "Solved"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedReport(r)}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold"
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
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          <ChevronLeft />
        </button>
        <span className="font-bold">{currentPage}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg flex gap-2">
                <ShieldAlert /> Report Review
              </h2>
              <X
                onClick={() => setSelectedReport(null)}
                className="cursor-pointer"
              />
            </div>

            <p className="mb-2">
              <b>Order:</b> {selectedReport.orderId}
            </p>
            <p className="mb-2">
              <b>Reason:</b> {selectedReport.reason}
            </p>
            <p className="mb-6 italic">
              "{selectedReport.message}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleMarkAsSold(selectedReport._id)}
                className="bg-blue-500 text-white py-3 rounded-xl font-bold"
              >
                Mark as Sold
              </button>

              <button
                onClick={() => handleRefund(selectedReport._id)}
                className="bg-red-500 text-white py-3 rounded-xl font-bold"
              >
                Refund
              </button>

              <button
                onClick={() => handleSolve(selectedReport._id)}
                className="bg-green-500 text-white py-3 rounded-xl font-bold"
              >
                Solve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAdmin;
