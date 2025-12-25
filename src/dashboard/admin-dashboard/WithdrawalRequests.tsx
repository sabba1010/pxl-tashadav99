import React, { useState, useMemo, useCallback, useEffect } from "react";

/**
 * Interface matching your MongoDB Document Structure
 */
interface WithdrawalRequest {
  _id: string;
  paymentMethod: string;
  amount: string;
  currency: string;
  accountNumber: string;
  bankCode: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  note: string; // User's original note
  status: string; // "pending", "success", "declined"
  createdAt: string;
  adminNote?: string; // If previously declined/commented
}

const ITEMS_PER_PAGE = 10;

// --- COMPONENT: WITHDRAWAL MODAL ---

interface WithdrawalModalProps {
  request: WithdrawalRequest | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string, reason?: string) => void;
  updating: boolean;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  request,
  onClose,
  onUpdateStatus,
  updating
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [declineReason, setDeclineReason] = useState<string>("");

  // Initialize state when modal opens
  useEffect(() => {
    if (request) {
      // If status is 'success', show 'approved' in dropdown so user understands
      setSelectedStatus(request.status === 'success' ? 'approved' : request.status);
      setDeclineReason(request.adminNote || ""); 
    }
  }, [request]);

  if (!request) return null;

  const handleSave = () => {
    onUpdateStatus(request._id, selectedStatus, declineReason);
  };

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
    label,
    value,
  }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500 w-1/3">{label}</span>
      <span className="text-sm font-semibold text-gray-800 w-2/3 text-right break-words">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-800">
            Review Request
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          <div className="bg-purple-50 p-4 rounded-xl mb-6 text-center border border-purple-100">
             <p className="text-xs text-purple-600 uppercase tracking-wider font-bold">Requested Amount</p>
             <p className="text-3xl font-extrabold text-purple-900 mt-1">
                {request.amount} <span className="text-lg font-medium">{request.currency}</span>
             </p>
          </div>

          <div className="space-y-1">
            <DetailRow label="Transaction ID" value={<span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{request._id}</span>} />
            <DetailRow label="User Email" value={request.email} />
            <DetailRow label="Full Name" value={request.fullName || "N/A"} />
            
            <div className="py-3 border-b border-gray-100">
               <p className="text-sm font-medium text-gray-500 mb-2">Banking Details</p>
               <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-900 border border-blue-100">
                  <p><span className="font-bold">Method:</span> {request.paymentMethod}</p>
                  <p><span className="font-bold">Acc Num:</span> {request.accountNumber}</p>
                  <p><span className="font-bold">Bank Code:</span> {request.bankCode}</p>
               </div>
            </div>

            <DetailRow label="Submitted At" value={new Date(request.createdAt).toLocaleString()} />
          </div>

          {/* --- ACTION SECTION --- */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Update Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-shadow"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option> {/* User selects Approved */}
              <option value="declined">Declined</option>
            </select>
            <p className="text-xs text-gray-400 mt-1 ml-1">
               Select "Approved" to mark as Success.
            </p>
          </div>

          {/* --- DECLINE REASON BOX --- */}
          {(selectedStatus === "declined" || selectedStatus === "Declined") && (
            <div className="mt-4 animate-fadeIn">
                <label className="block text-sm font-bold text-red-600 mb-2">
                    Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                    required
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Explain why..."
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm h-24 resize-none bg-red-50"
                />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-2xl border-t border-gray-200">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updating || (selectedStatus === "declined" && !declineReason.trim())}
            className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-all flex items-center
                ${(selectedStatus === "declined" && !declineReason.trim()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const WithdrawalRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://vps-backend-server-beta.vercel.app/withdraw/getall");
      const data = await response.json();
      if(Array.isArray(data)) setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // --- CORE LOGIC: SEND 'success' TO BACKEND ---
  const handleUpdateStatus = useCallback(
    async (id: string, newStatus: string, reason?: string) => {
      setActionLoading(true);
      
      // LOGIC FIX: If user selected "approved", we change payload to "success"
      const statusPayload = newStatus === "approved" ? "success" : newStatus;

      try {
        console.log(`Sending to Backend -> ID: ${id}, Status: ${statusPayload}`);
        
        const response = await fetch(`https://vps-backend-server-beta.vercel.app/withdraw/approve/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: statusPayload, // Sending "success" directly to backend
                note: reason 
            })
        });

        const result = await response.json();

        if (response.ok) {
            // Update Local State with 'success'
            setRequests((prevRequests) =>
                prevRequests.map((r) =>
                    r._id === id ? { ...r, status: statusPayload, adminNote: reason } : r
                )
            );
            setIsModalOpen(false);
        } else {
            alert(`Failed: ${result.message}`);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Network error.");
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  const openModal = (request: WithdrawalRequest) => { setSelectedRequest(request); setIsModalOpen(true); };
  const closeModal = () => { setSelectedRequest(null); setIsModalOpen(false); };

  const filteredRequests = useMemo(() => {
    return requests.filter(r => 
        (r._id && r._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.status && r.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [requests, searchTerm]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "approved" || s === "success") return "bg-green-100 text-green-700 border-green-200";
    if (s === "declined" || s === "failed") return "bg-red-100 text-red-700 border-red-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div><h1 className="text-2xl font-bold text-gray-800">Withdrawals</h1></div>
            <div className="relative mt-4 md:mt-0 w-full md:w-96">
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? <div className="p-10 text-center">Loading...</div> : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    {["Date", "User", "Method", "Amount", "Status", "Action"].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedRequests.map((r) => (
                        <tr key={r._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{r.paymentMethod}</td>
                        <td className="px-6 py-4 text-sm font-bold">{r.amount} {r.currency}</td>
                        <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(r.status)}`}>
                            {r.status.toUpperCase()}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <button onClick={() => openModal(r)} className="text-purple-600 hover:bg-purple-50 px-3 py-1 rounded border border-purple-200 text-xs font-medium">Review</button>
                        </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>
        
        {/* Pagination */}
        {filteredRequests.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between p-4 bg-white rounded-xl shadow-sm border">
                <span>Page {currentPage} of {totalPages}</span>
                <div className="space-x-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                </div>
            </div>
        )}

        {isModalOpen && <WithdrawalModal request={selectedRequest} onClose={closeModal} onUpdateStatus={handleUpdateStatus} updating={actionLoading} />}
      </div>
    </div>
  );
};

export default WithdrawalRequests;