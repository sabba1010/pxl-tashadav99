import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Search, X, ShieldAlert, MessageSquare, 
    ChevronLeft, ChevronRight, User 
} from 'lucide-react';
import Swal from 'sweetalert2';

// API Base URL
const API_URL = 'http://localhost:3200/purchase/report';
const USER_API = 'http://localhost:3200/user'; // User role পাওয়ার জন্য

interface IReport {
    _id: string;
    orderId: string;
    reporterEmail: string;
    sellerEmail: string;
    buyerEmail?: string; // Optional – seller report করলে থাকবে
    reason: string;
    message: string;
    status: string;
    createdAt: string;
}

interface IUser {
    email: string;
    role?: string; // "buyer" | "seller"
}

const ReportAdmin: React.FC = () => {
    const [reports, setReports] = useState<IReport[]>([]);
    const [filteredReports, setFilteredReports] = useState<IReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState('');
    const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
    
    // User roles cache
    const [userRoles, setUserRoles] = useState<Record<string, string>>({});

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 5;

    // Fetch all reports
    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get<IReport[]>(`${API_URL}/getall`);
            const data = response.data;

            // Sort by newest first
            const sortedData = [...data].sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            
            setReports(sortedData);
            setFilteredReports(sortedData);

            // Fetch roles for all unique emails
            const uniqueEmails = new Set<string>();
            sortedData.forEach(r => {
                uniqueEmails.add(r.reporterEmail);
                if (r.buyerEmail) uniqueEmails.add(r.buyerEmail);
                uniqueEmails.add(r.sellerEmail);
            });

            fetchUserRoles(Array.from(uniqueEmails));
        } catch (error) {
            console.error("Fetch Error:", error);
            Swal.fire('Error', 'Failed to load reports', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user roles
    const fetchUserRoles = async (emails: string[]) => {
        const newRoles: Record<string, string> = {};
        await Promise.all(
            emails.map(async (email) => {
                try {
                    const res = await axios.get<IUser>(`${USER_API}/${email}`);
                    newRoles[email] = res.data.role || 'Unknown';
                } catch {
                    newRoles[email] = 'Unknown';
                }
            })
        );
        setUserRoles(prev => ({ ...prev, ...newRoles }));
    };

    const handleStatusUpdate = async (id: string) => {
        try {
            const response = await axios.patch<{ success: boolean }>(`${API_URL}/update/${id}`, { status: 'Solved' });
            
            if (response.data.success) {
                Swal.fire({
                    title: 'Solved!',
                    text: 'Report marked as resolved.',
                    icon: 'success',
                    confirmButtonColor: '#22C55E'
                });
                setSelectedReport(null);
                fetchReports(); // Refresh list
            }
        } catch (err) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    // Search
    useEffect(() => {
        const result = reports.filter(r =>
            r.orderId.toLowerCase().includes(search.toLowerCase()) ||
            r.reporterEmail.toLowerCase().includes(search.toLowerCase()) ||
            (r.buyerEmail && r.buyerEmail.toLowerCase().includes(search.toLowerCase())) ||
            r.sellerEmail.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredReports(result);
        setCurrentPage(1);
    }, [search, reports]);

    // Pagination
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

    // Helper: Get role display
    const getRoleBadge = (email: string) => {
        const role = userRoles[email] || 'Loading...';
        const isBuyer = email !== selectedReport?.sellerEmail && role === 'buyer';
        const isSeller = role === 'seller';

        if (role === 'Loading...') return <span className="text-xs text-gray-400">...</span>;

        return (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase
                ${isBuyer ? 'bg-blue-100 text-blue-700' : 
                  isSeller ? 'bg-purple-100 text-purple-700' : 
                  'bg-gray-100 text-gray-600'}`}>
                {isBuyer ? 'Buyer' : isSeller ? 'Seller' : role}
            </span>
        );
    };

    // Determine reported user
    const getReportedUser = (report: IReport) => {
        // যদি buyerEmail থাকে → Seller reported Buyer
        // না থাকলে → Buyer reported Seller
        return report.buyerEmail || report.sellerEmail;
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-slate-400 font-medium">Loading reports...</div>;

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-4 lg:p-10 font-sans">
            <div className=" mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-slate-800">Report Management</h1>
                    
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by Order ID, Email..." 
                            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 outline-none text-sm shadow-sm focus:border-green-500 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[11px] font-bold text-[#8898AA] uppercase tracking-widest bg-slate-50 border-b">
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Reporter</th>
                                    <th className="px-6 py-4">Reported User</th>
                                    <th className="px-6 py-4">Reason</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentReports.map((report) => (
                                    <tr key={report._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5 text-sm text-slate-500">
                                            {new Date(report.createdAt).toLocaleDateString('en-US', { 
                                                month: 'short', day: 'numeric', year: 'numeric' 
                                            })}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-slate-400" />
                                                <span className="text-sm font-medium text-slate-700">
                                                    {report.reporterEmail}
                                                </span>
                                                {getRoleBadge(report.reporterEmail)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-600">
                                                    {getReportedUser(report)}
                                                </span>
                                                {getRoleBadge(getReportedUser(report))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {report.reason}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase
                                                ${report.status === 'Solved' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-orange-100 text-orange-700'}`}>
                                                {report.status === 'Solved' ? 'Solved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button 
                                                onClick={() => setSelectedReport(report)}
                                                className="px-5 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200 transition-all"
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
                    <div className="p-6 border-t flex flex-col items-center gap-4">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold">
                                {currentPage}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                        <p className="text-xs text-slate-500">
                            Page {currentPage} of {totalPages} • {filteredReports.length} reports
                        </p>
                    </div>
                </div>

                {/* Review Modal */}
                {selectedReport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-5 flex justify-between items-center">
                                <h2 className="text-lg font-bold flex items-center gap-3">
                                    <ShieldAlert size={20} />
                                    Report Review
                                </h2>
                                <button onClick={() => setSelectedReport(null)} className="hover:bg-white/20 p-2 rounded-full transition">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Reporter</p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-slate-700">{selectedReport.reporterEmail}</p>
                                            {getRoleBadge(selectedReport.reporterEmail)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Reported User</p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-slate-700">{getReportedUser(selectedReport)}</p>
                                            {getRoleBadge(getReportedUser(selectedReport))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Order ID</p>
                                    <p className="font-mono text-sm bg-slate-100 px-3 py-2 rounded-lg">{selectedReport.orderId}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Reason</p>
                                    <p className="text-sm font-medium text-slate-700">{selectedReport.reason}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                        <MessageSquare size={14} /> Message
                                    </p>
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                                        <p className="text-sm text-slate-600 italic leading-relaxed">
                                            "{selectedReport.message}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        onClick={() => handleStatusUpdate(selectedReport._id)}
                                        className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition shadow-lg"
                                    >
                                        Mark as Solved
                                    </button>
                                    <button 
                                        onClick={() => setSelectedReport(null)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportAdmin;