import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // --- State Management ---
  const [reports, setReports] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'solved' | 'refunded'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Fetch Data from Backend ---
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3200/purchase/report/getall');
        if (!response.ok) throw new Error('Failed to fetch reports');
        
        const data = await response.json();
        let reportsData = Array.isArray(data) ? data : (data.reports || []);

        console.log("All reports from backend:", reportsData);
        console.log("Current user:", user);

        // --- ROLE-BASED FILTERING ---
        if (user?.role === 'seller') {
          // Show reports: 1) filed by seller, 2) filed against seller (as sellerEmail)
          reportsData = reportsData.filter((report: any) => 
            report.reporterEmail?.toLowerCase() === user.email?.toLowerCase() ||
            report.sellerEmail?.toLowerCase() === user.email?.toLowerCase()
          );
          console.log("Filtered reports for seller:", reportsData);
        } else if (user?.role === 'buyer') {
          // Show reports: 1) filed by buyer, 2) filed against buyer (as sellerEmail - when seller reports buyer)
          reportsData = reportsData.filter((report: any) => 
            report.reporterEmail?.toLowerCase() === user.email?.toLowerCase() ||
            report.sellerEmail?.toLowerCase() === user.email?.toLowerCase()
          );
          console.log("Filtered reports for buyer:", reportsData);
        }
        // Admin can see all reports (no filter applied)

        // --- SORTING: Newest First ---
        reportsData.sort((a: any, b: any) => {
          const dateA = new Date(a.date || a.createdAt || 0).getTime();
          const dateB = new Date(b.date || b.createdAt || 0).getTime();
          return dateB - dateA; // Highest timestamp first
        });

        setReports(reportsData);
      } catch (err: any) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchReports();
    }
  }, [user]);

  // --- Filter Logic ---
  const filteredReports = reports.filter(report => {
    // 1. Search Logic
    const matchesSearch = 
      (report.reporterEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (report.reason?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (report.orderId?.toString().toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    // 2. Status Logic (Mapping 'resolved' to 'solved' for UI consistency, case-insensitive)
    const reportStatus = report.status?.toLowerCase();
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'solved' && (reportStatus === 'solved' || reportStatus === 'resolved')) ||
      reportStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: <Clock size={14} /> };
      case 'solved':
      case 'resolved':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 size={14} /> };
      case 'refunded':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <CheckCircle2 size={14} /> };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: <AlertTriangle size={14} /> };
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] pb-20 font-sans">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                {user?.role === 'seller' ? 'Seller' : user?.role === 'buyer' ? 'Buyer' : 'All'} <span className="text-[#d4a643]">Reports</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {isLoading ? 'Syncing...' : `Showing ${filteredReports.length} newest reports first`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 pt-10">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative col-span-1 md:col-span-2">
              <Search size={16} className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, order ID, or reason..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to page 1
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#d4a643] transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {['all', 'pending', 'solved', 'refunded'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status as any);
                    setCurrentPage(1); // Reset to page 1
                  }}
                  className={`flex-1 px-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                    filterStatus === status
                      ? 'bg-[#d4a643] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-[#d4a643] mb-4" size={48} />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">
              Loading Live Reports...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-[2.5rem] border-2 border-red-100">
            <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
            <h2 className="text-lg font-black text-red-700 uppercase italic">Database Connection Error</h2>
            <p className="text-sm text-red-500 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase"
            >
              Retry Connection
            </button>
          </div>
        ) : paginatedReports.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {paginatedReports.map((report) => {
                const badge = getStatusBadge(report.status);
                const displayStatus = report.status?.toLowerCase() === 'resolved' ? 'Solved' : report.status?.charAt(0).toUpperCase() + report.status?.slice(1).toLowerCase();
                
                return (
                  <div 
                    key={report._id || report.id} 
                    className={`p-6 rounded-[2rem] border-2 ${badge.border} bg-white hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
                  >
                    {/* Visual accent bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${badge.bg.replace('bg-', 'bg-').split(' ')[0]} opacity-50`}></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-black bg-gray-900 text-white px-3 py-1 rounded-full uppercase tracking-tighter">
                            Order #{report.orderId}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">
                            📅 {new Date(report.date || report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-gray-800 uppercase italic mb-1">
                          {report.reason}
                        </h3>
                        <p className="text-xs text-[#d4a643] font-bold mb-3">{report.reporterEmail}</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                          "{report.message}"
                        </p>
                      </div>

                      <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest ${badge.text} ${badge.bg} border-2 ${badge.border} shadow-sm self-end md:self-center`}>
                        {badge.icon} {displayStatus}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-gray-100">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => p - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border bg-white disabled:opacity-30 hover:bg-gray-50 transition shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-xl text-sm font-black border transition-all duration-300 shadow-sm ${
                      currentPage === page
                        ? 'bg-[#d4a643] border-[#d4a643] text-white scale-110 shadow-lg'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border bg-white disabled:opacity-30 hover:bg-gray-50 transition shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
            <AlertTriangle className="mx-auto text-gray-100 mb-4" size={80} />
            <h3 className="text-xl font-black text-gray-300 uppercase italic">No Reports Found</h3>
            <p className="text-sm text-gray-400 mt-1">Try changing your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;