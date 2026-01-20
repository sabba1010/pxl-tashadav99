import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle2, Search } from 'lucide-react';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'refunded'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - Replace with actual backend data later
  const mockReports = [
    {
      id: 1,
      reporterEmail: 'john_buyer@gmail.com',
      orderId: '#45892731',
      reason: 'Item not received',
      message: 'Paid for Twitter account but didn\'t receive login details after 24 hours.',
      status: 'pending',
      date: '01/18/2026',
      role: 'buyer'
    },
    {
      id: 2,
      reporterEmail: 'sarah_m@yahoo.com',
      orderId: '#45892098',
      reason: 'Account compromised',
      message: 'Received account but password doesn\'t work anymore. Seller must have changed it.',
      status: 'resolved',
      date: '01/17/2026',
      role: 'buyer'
    },
    {
      id: 3,
      reporterEmail: 'mike_deal@outlook.com',
      orderId: '#45891654',
      reason: 'Wrong item delivered',
      message: 'Received different email account than what was advertised in the listing.',
      status: 'refunded',
      date: '01/16/2026',
      role: 'buyer'
    },
    {
      id: 4,
      reporterEmail: 'emma_shop@gmail.com',
      orderId: '#45890123',
      reason: 'Scam or Fraud',
      message: 'The account details provided are completely fake. Do not recommend this seller.',
      status: 'pending',
      date: '01/15/2026',
      role: 'buyer'
    },
    {
      id: 5,
      reporterEmail: 'alex_trader@gmail.com',
      orderId: '#45889456',
      reason: 'Abusive behavior',
      message: 'Seller was rude and threatened me when I questioned the account validity.',
      status: 'resolved',
      date: '01/14/2026',
      role: 'buyer'
    },
    {
      id: 6,
      reporterEmail: 'david_k@hotmail.com',
      orderId: '#45888789',
      reason: 'Item not as described',
      message: 'The account in the listing showed 10K followers but only has 2K followers.',
      status: 'refunded',
      date: '01/13/2026',
      role: 'buyer'
    },
    {
      id: 7,
      reporterEmail: 'jessica_lee@gmail.com',
      orderId: '#45887654',
      reason: 'Item not received',
      message: 'Still waiting for the account details. It\'s been 3 days with no response.',
      status: 'pending',
      date: '01/12/2026',
      role: 'buyer'
    },
    {
      id: 8,
      reporterEmail: 'ryan_p@yahoo.com',
      orderId: '#45886321',
      reason: 'Account inactive',
      message: 'The Facebook account provided is no longer active or has been suspended.',
      status: 'resolved',
      date: '01/11/2026',
      role: 'buyer'
    }
  ];

  // Filter reports
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = 
      report.reporterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: <Clock size={14} /> };
      case 'resolved':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 size={14} /> };
      case 'refunded':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <CheckCircle2 size={14} /> };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: <AlertTriangle size={14} /> };
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] pb-20">
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
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">All Buyer<span className="text-[#d4a643]">Reports</span></h1>
              <p className="text-xs text-gray-500 mt-1">{filteredReports.length} total reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 pt-10">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative col-span-1 md:col-span-2">
              <Search size={16} className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, reason, or order ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#d4a643] transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'resolved', 'refunded'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status as any);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                    filterStatus === status
                      ? 'bg-[#d4a643] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {paginatedReports.length > 0 ? (
            paginatedReports.map((report) => {
              const badge = getStatusBadge(report.status);
              return (
                <div
                  key={report.id}
                  className={`p-6 rounded-xl border-2 ${badge.border} ${badge.bg} hover:shadow-lg transition-all group cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-black text-gray-900 uppercase">Report from {report.reporterEmail.split('@')[0]}</p>
                        <span className="text-[10px] text-gray-500">({report.reporterEmail})</span>
                      </div>
                      <p className="text-sm font-bold text-gray-700 mb-2">{report.reason}</p>
                      <p className="text-sm text-gray-600">{report.message}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${badge.text} ${badge.bg} border-2 ${badge.border} whitespace-nowrap`}>
                      {badge.icon}
                      <span className="capitalize">{report.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-500 pt-4 border-t border-gray-200/50">
                    <span className="flex items-center gap-1">📋 Order: {report.orderId}</span>
                    <span className="flex items-center gap-1">👤 Role: {report.role}</span>
                    <span className="flex items-center gap-1">📅 {report.date}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-[2.5rem] border border-gray-100">
              <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-bold text-gray-600 mb-2">No reports found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10 p-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg border bg-white disabled:opacity-30 hover:bg-gray-50 transition"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
                  currentPage === page
                    ? 'bg-[#d4a643] text-white'
                    : 'bg-white border hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg border bg-white disabled:opacity-30 hover:bg-gray-50 transition"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
