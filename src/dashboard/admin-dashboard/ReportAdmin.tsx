import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Search, X, ShieldAlert, MessageSquare, 
    ChevronLeft, ChevronRight 
} from 'lucide-react';
import Swal from 'sweetalert2';

// API Base URL
const API_URL = 'http://localhost:3200/purchase/report';

interface IReport {
    _id: string;
    orderId: string;
    reporterEmail: string;
    sellerEmail: string;
    reason: string;
    message: string;
    status: string;
    createdAt: string;
}

const ReportAdmin: React.FC = () => {
    const [reports, setReports] = useState<IReport[]>([]);
    const [filteredReports, setFilteredReports] = useState<IReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState('');
    const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
    
    // Pagination (স্ক্রিনশটের মতো ৫টি করে ডাটা দেখাবে)
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 5;

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/getall`);
            // TypeScript Fix: Casting as IReport array
            const data = response.data as IReport[];
            
            // সর্টিং: নতুন রিপোর্ট সবার আগে
            const sortedData = [...data].sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            
            setReports(sortedData);
            setFilteredReports(sortedData);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
        // এখানে <any> বা একটি ইন্টারফেস দিয়ে টাইপ ডিফাইন করে দিন
        const response = await axios.patch<{ success: boolean }>(`${API_URL}/update/${id}`, { status: newStatus });
        
        // এখন TypeScript আর এরর দিবে না
        if (response.data.success) {
            Swal.fire({
                title: 'Solved!',
                text: 'The report is resolved and the user has been notified.',
                icon: 'success',
                confirmButtonColor: '#22C55E'
            });
            setSelectedReport(null);
            fetchReports();
        }
    } catch (err) {
        Swal.fire('Error', 'Update failed!', 'error');
    }
};

    // Search Logic (Order ID বা Email দিয়ে)
    useEffect(() => {
        const result = reports.filter(r =>
            r.orderId.toLowerCase().includes(search.toLowerCase()) ||
            r.reporterEmail.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredReports(result);
        setCurrentPage(1);
    }, [search, reports]);

    // Pagination Calculation
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

    if (loading) return <div className="flex justify-center items-center h-screen text-slate-400 font-medium">Loading reports...</div>;

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-4 lg:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Header & Search Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Report Management</h1>
                    
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by ID or Email..." 
                            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-slate-200 outline-none text-sm shadow-sm focus:border-green-400 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table - Same as Image 1 & 2 */}
                <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[11px] font-bold text-[#8898AA] uppercase tracking-widest border-b border-slate-50">
                                    <th className="px-6 py-5">Date</th>
                                    <th className="px-6 py-5">User</th>
                                    <th className="px-6 py-5">Reason</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentReports.map((report) => (
                                    <tr key={report._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5 text-[13px] text-slate-500">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 text-[13px] text-slate-600 font-medium">
                                            {report.reporterEmail}
                                        </td>
                                        <td className="px-6 py-5 text-[13px] text-slate-500">
                                            {report.reason}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                                                ${report.status === 'Solved' 
                                                    ? 'bg-[#E6F7ED] text-[#1DB954]' // SOLVED গ্রিন ব্যাজ
                                                    : 'bg-orange-50 text-orange-600'}`}>
                                                {report.status === 'Solved' ? 'SOLVED' : 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button 
                                                onClick={() => setSelectedReport(report)}
                                                className="px-5 py-1.5 border border-[#F3E8FF] text-[#A855F7] rounded-md text-[12px] font-semibold hover:bg-[#A855F7] hover:text-white transition-all"
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination - Matching Image 1 & 2 */}
                    <div className="p-6 border-t border-slate-50 flex flex-col items-center justify-center gap-3">
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-300 border border-slate-100 disabled:opacity-50"
                            >
                                <ChevronLeft size={14}/>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#22C55E] text-white text-xs font-bold shadow-[0_4px_10px_rgba(34,197,94,0.3)]">
                                {currentPage}
                            </button>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-300 border border-slate-100 disabled:opacity-50"
                            >
                                <ChevronRight size={14}/>
                            </button>
                        </div>
                        <span className="text-[12px] text-slate-400 font-medium">
                            Page {currentPage} of {totalPages || 1} • {filteredReports.length} total reports
                        </span>
                    </div>
                </div>

                {/* Case Review Modal */}
                {selectedReport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-[2px]">
                        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
                                    <ShieldAlert size={16} className="text-red-500" /> Review Report
                                </h2>
                                <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-600">
                                    <X size={18}/>
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                        <MessageSquare size={12}/> Message from {selectedReport.reporterEmail}:
                                    </p>
                                    <p className="text-sm text-slate-600 italic leading-relaxed">"{selectedReport.message}"</p>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={() => handleStatusUpdate(selectedReport._id, 'Solved')}
                                        className="flex-1 py-2.5 bg-[#22C55E] text-white rounded-lg text-xs font-bold hover:bg-[#1faa53] shadow-md shadow-green-100 transition-all"
                                    >
                                        Mark as Solved
                                    </button>
                                    <button 
                                        onClick={() => setSelectedReport(null)}
                                        className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"
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