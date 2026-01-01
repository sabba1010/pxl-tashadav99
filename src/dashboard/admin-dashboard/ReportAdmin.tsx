import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    ShieldAlert, Search, Copy, ArrowUpRight, Hash, 
    MessageSquare, CheckCircle, AlertTriangle, Calendar, X, User, Mail, Info
} from 'lucide-react';
import Swal from 'sweetalert2';

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
    const [selectedReport, setSelectedReport] = useState<IReport | null>(null); // ডিটেইলস মডালের জন্য

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:3200/purchase/report/getall');
            const data = response.data as IReport[]; 
            setReports(data);
            setFilteredReports(data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch Error:", error);
            setLoading(false);
        }
    };

    // স্ট্যাটাস আপডেট ফাংশন
    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await axios.patch(`http://localhost:3200/purchase/report/update/${id}`, { status: newStatus });
            Swal.fire('Success!', `Status updated to ${newStatus}`, 'success');
            setSelectedReport(null); // মডাল বন্ধ করুন
            fetchReports(); // লিস্ট রিফ্রেশ করুন
        } catch (err) {
            Swal.fire('Error', 'Update failed!', 'error');
        }
    };

    // সার্চ ফিল্টার
    useEffect(() => {
        const result = reports.filter(r => 
            r.orderId.toLowerCase().includes(search.toLowerCase()) ||
            r.reporterEmail.toLowerCase().includes(search.toLowerCase()) ||
            r.reason.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredReports(result);
    }, [search, reports]);

    if (loading) return <div className="flex justify-center items-center h-screen font-bold">Initializing Dashboard...</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Report <span className="text-red-600">Center</span></h1>
                    <p className="text-slate-500 font-medium">Review and take action on user complaints.</p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by ID, Email or Reason..." 
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-red-50 outline-none transition-all"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="px-6 py-5">Order ID</th>
                                <th className="px-6 py-5">Reporter</th>
                                <th className="px-6 py-5">Reason</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredReports.map((report) => (
                                <tr key={report._id} className="hover:bg-slate-50/50 transition-all">
                                    <td className="px-6 py-5 font-mono text-xs font-bold text-slate-700">#{report.orderId.slice(-10)}</td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-600">{report.reporterEmail}</td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-black bg-red-50 text-red-600 px-2 py-1 rounded-md border border-red-100 uppercase">
                                            {report.reason}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`text-[10px] font-bold ${report.status === 'Pending' ? 'text-orange-500' : 'text-green-500'}`}>
                                            ● {report.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button 
                                            onClick={() => setSelectedReport(report)}
                                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all flex items-center gap-2 ml-auto"
                                        >
                                            View Details <ArrowUpRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- DETAILS MODAL --- */}
                {selectedReport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <ShieldAlert className="text-red-600" /> Case Details
                                </h2>
                                <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-white rounded-full transition-colors"><X size={20}/></button>
                            </div>

                            <div className="p-8 space-y-6">
                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailBox icon={<Hash size={14}/>} label="Order ID" value={selectedReport.orderId} />
                                    <DetailBox icon={<Info size={14}/>} label="Report Reason" value={selectedReport.reason} isRed />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600"><User size={20}/></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Reporter Email</p>
                                            <p className="text-sm font-bold text-slate-700">{selectedReport.reporterEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-500"><Mail size={20}/></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Accused Seller</p>
                                            <p className="text-sm font-bold text-slate-700">{selectedReport.sellerEmail}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Box */}
                                <div className="p-6 bg-red-50/50 border border-red-100 rounded-3xl">
                                    <p className="text-[10px] font-black text-red-600 uppercase mb-2 flex items-center gap-1">
                                        <MessageSquare size={12}/> User Message
                                    </p>
                                    <p className="text-slate-700 text-sm leading-relaxed font-medium italic">
                                        "{selectedReport.message}"
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3 pt-4">
                                    <button 
                                        onClick={() => handleStatusUpdate(selectedReport._id, 'Resolved')}
                                        className="py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-100"
                                    >
                                        Mark Resolved
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(selectedReport._id, 'Pending')}
                                        className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                                    >
                                        Keep Pending
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

// ছোট হেল্পার কম্পোনেন্ট
const DetailBox = ({ icon, label, value, isRed }: any) => (
    <div className="p-4 bg-slate-50 rounded-2xl">
        <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
            {icon} {label}
        </p>
        <p className={`text-xs font-bold truncate ${isRed ? 'text-red-600' : 'text-slate-700'}`}>{value}</p>
    </div>
);

export default ReportAdmin;