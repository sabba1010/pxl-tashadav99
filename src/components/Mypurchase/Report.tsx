import React, { useEffect, useState } from "react";

// MongoDB logic theke asha interface
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

export default function UnifiedReportDashboard() {
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Eita apnar system er logged-in user er email (Context ba Auth theke asbe)
  const currentUserEmail = "admin@gmail.com"; 

  useEffect(() => {
    const getReports = async () => {
      try {
        // Mock data apnar image er structure onujayi
        const data: IReport[] = [
          {
            _id: "695cd29455ef6760d6769b82",
            orderId: "695cd18e55ef6760d6769b7e",
            reporterEmail: "admin@gmail.com", // User nije report dise
            sellerEmail: "admin1@gmail.com",
            reason: "Scam or Fraud",
            message: "He didn't give me the account.",
            status: "Refunded",
            createdAt: "2026-01-06T09:15:00.469+00:00"
          },
          {
            _id: "777xd88855ef6760d6769z99",
            orderId: "999cd18e55ef6760d6769m00",
            reporterEmail: "buyer_someone@gmail.com",
            sellerEmail: "admin@gmail.com", // User report khaise (Logic: sellerEmail match)
            reason: "Wrong Credentials",
            message: "Password is not working.",
            status: "Pending",
            createdAt: "2026-01-20T10:00:00.000+00:00"
          }
        ];
        setReports(data);
      } finally {
        setLoading(false);
      }
    };
    getReports();
  }, []);

  // --- Core Logic (Role jai hok, email matching e main) ---
  
  // 1. Report Ami Khaisi: sellerEmail == current user email
  const reportsReceived = reports.filter(r => r.sellerEmail === currentUserEmail);
  
  // 2. Report Ami Disi: reporterEmail == current user email
  const reportsSent = reports.filter(r => r.reporterEmail === currentUserEmail);

  if (loading) return <div className="p-10 text-center font-bold">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-[#fafafa] min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">REPORT DASHBOARD</h1>
        <p className="text-gray-500 mt-2 italic text-sm">Tracking all disputes related to your email</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* SECTION: REPORT KHAISI (Matches sellerEmail) */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b-4 border-red-500 pb-2">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">RECEIVED</span>
            <h2 className="text-xl font-bold text-gray-800">Reports Against You</h2>
          </div>
          
          <div className="space-y-4">
            {reportsReceived.length > 0 ? (
              reportsReceived.map(r => <ReportCard key={r._id} report={r} mode="received" />)
            ) : (
              <div className="bg-white p-10 rounded-xl border border-dashed text-center text-gray-400">
                Safe! Kono report khan ni ekhono.
              </div>
            )}
          </div>
        </div>

        {/* SECTION: REPORT DISI (Matches reporterEmail) */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b-4 border-blue-500 pb-2">
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">SUBMITTED</span>
            <h2 className="text-xl font-bold text-gray-800">Reports You Filed</h2>
          </div>

          <div className="space-y-4">
            {reportsSent.length > 0 ? (
              reportsSent.map(r => <ReportCard key={r._id} report={r} mode="sent" />)
            ) : (
              <div className="bg-white p-10 rounded-xl border border-dashed text-center text-gray-400">
                Apni ekhono kono report koren ni.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Custom Card for each Report
function ReportCard({ report, mode }: { report: IReport, mode: 'sent' | 'received' }) {
  return (
    <div className={`bg-white p-5 rounded-2xl border-l-8 shadow-sm transition-transform hover:scale-[1.01] ${mode === 'received' ? 'border-red-500' : 'border-blue-500'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="font-mono text-[10px] text-gray-400">ORDER: #{report.orderId.slice(-8)}</div>
        <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${report.status === 'Refunded' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
          {report.status}
        </div>
      </div>
      
      <h3 className="font-extrabold text-gray-800 text-lg mb-1">{report.reason}</h3>
      <p className="text-sm text-gray-600 italic mb-4">"{report.message}"</p>
      
      <div className="flex flex-col gap-1 text-[11px] border-t pt-3 border-gray-50">
        <div className="flex justify-between">
          <span className="text-gray-400 uppercase font-bold tracking-tighter">
            {mode === 'received' ? 'Reporter:' : 'Target Seller:'}
          </span>
          <span className="text-gray-700 font-medium">
            {mode === 'received' ? report.reporterEmail : report.sellerEmail}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 uppercase font-bold tracking-tighter">Date:</span>
          <span className="text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}