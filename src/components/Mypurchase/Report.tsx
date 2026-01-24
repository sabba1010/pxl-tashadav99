import React, { useEffect, useState } from "react";

// --- Types ---
interface ReportData {
  _id: string;
  orderId: string;
  reporterEmail: string;
  sellerEmail: string;
  reason: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// --- Main Component ---
export default function ReportDashboard() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Current user email (Real app-e eita Auth state/Context theke asbe)
  const currentUserEmail = "admin@gmail.com"; 

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // Real API call example:
        // const res = await fetch('/api/reports');
        // const data = await res.json();
        
        // Mock data based on your image provided
        const mockData: ReportData[] = [
          {
            _id: "695cd29455ef6760d6769b82",
            orderId: "695cd18e55ef6760d6769b7e",
            reporterEmail: "admin@gmail.com",
            sellerEmail: "admin1@gmail.com",
            reason: "Scam or Fraud",
            message: "fdgdfgdfgfdg",
            status: "Refunded",
            createdAt: "2026-01-06T09:15:00.469+00:00",
            updatedAt: "2026-01-06T09:56:22.756+00:00"
          },
          // Example of a report received by this user
          {
            _id: "695cd29455ef6760d6769b99",
            orderId: "777cd18e55ef6760d6769x22",
            reporterEmail: "buyer22@gmail.com",
            sellerEmail: "admin@gmail.com", 
            reason: "Item not as described",
            message: "The account doesn't work.",
            status: "Pending",
            createdAt: "2026-01-10T10:00:00.000+00:00",
            updatedAt: "2026-01-10T10:00:00.000+00:00"
          }
        ];
        setReports(mockData);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filter logic based on user's role in the report
  const mySentReports = reports.filter(r => r.reporterEmail === currentUserEmail);
  const myReceivedReports = reports.filter(r => r.sellerEmail === currentUserEmail);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <header className="border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Report Center</h1>
          <p className="text-gray-500">Manage your filed reports and disputes against you.</p>
        </header>

        {/* SECTION: Reports Against Me (Seller Email Match) */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Reports Against You (Ami Ja Khaisi)</h2>
          </div>
          
          {myReceivedReports.length > 0 ? (
            <ReportTable data={myReceivedReports} type="received" />
          ) : (
            <EmptyState message="No reports have been filed against you." />
          )}
        </section>

        {/* SECTION: Reports Filed By Me (Reporter Email Match) */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Reports You Filed (Ami Ja Korsi)</h2>
          </div>
          
          {mySentReports.length > 0 ? (
            <ReportTable data={mySentReports} type="sent" />
          ) : (
            <EmptyState message="You haven't submitted any reports yet." />
          )}
        </section>

      </div>
    </div>
  );
}

// --- Sub-Components ---

function ReportTable({ data, type }: { data: ReportData[], type: 'sent' | 'received' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-6 py-4">Order Info</th>
              <th className="px-6 py-4">{type === 'sent' ? 'Seller' : 'Reporter'}</th>
              <th className="px-6 py-4">Reason & Message</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((report) => (
              <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="block text-sm font-mono text-blue-600 font-medium">#{report.orderId.slice(-8)}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-tight">Full ID: {report.orderId}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {type === 'sent' ? report.sellerEmail : report.reporterEmail}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{type === 'sent' ? 'Target' : 'Complainant'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="block text-sm font-semibold text-gray-800">{report.reason}</span>
                  <p className="text-sm text-gray-500 truncate max-w-xs">{report.message}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    report.status === 'Refunded' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
      <p className="text-gray-500 text-sm italic">{message}</p>
    </div>
  );
}