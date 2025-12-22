import React, { useState, useMemo, useCallback, useEffect } from "react";

/**
 * Interface matching your API JSON structure exactly
 */
interface WithdrawalRequest {
  _id: string;
  paymentMethod: string;
  amount: string; // JSON shows string "23"
  currency: string;
  accountNumber: string;
  bankCode: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  note: string;
  status: string; // "succes", "success", "pending", etc.
  createdAt: string;
  updatedAt?: string;
}

const ITEMS_PER_PAGE = 5;

// --- HELPER COMPONENT: WITHDRAWAL MODAL ---

interface WithdrawalModalProps {
  request: WithdrawalRequest | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string, reason?: string) => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  request,
  onClose,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [declineReason, setDeclineReason] = useState<string>("");

  // Initialize state when modal opens
  useEffect(() => {
    if (request) {
      // API status might be "succes", normalize it for display if needed
      setSelectedStatus(request.status === "succes" ? "success" : request.status);
      setDeclineReason(""); // Reset reason
    }
  }, [request]);

  if (!request) return null;

  const handleSave = () => {
    // If declined, send the reason, otherwise just status
    onUpdateStatus(request._id, selectedStatus, declineReason);
  };

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
    label,
    value,
  }) => (
    <div className="flex justify-between items-start py-2 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-600 w-1/3">{label}</span>
      <span className="text-sm font-semibold text-gray-800 w-2/3 text-right break-words">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center bg-purple-50 rounded-t-xl sticky top-0 z-10">
          <h3 className="text-xl font-bold text-purple-800">
            Review Request
          </h3>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-2">
          {/* Main Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-center">
             <p className="text-sm text-gray-500 uppercase tracking-wide">Amount Requested</p>
             <p className="text-3xl font-extrabold text-purple-700 mt-1">
                {request.amount} <span className="text-lg text-gray-600">{request.currency}</span>
             </p>
          </div>

          <DetailRow label="Transaction ID" value={<span className="font-mono text-xs">{request._id}</span>} />
          <DetailRow label="Full Name" value={request.fullName || "N/A"} />
          <DetailRow label="Email" value={request.email} />
          <DetailRow label="Phone" value={request.phoneNumber} />
          
          <div className="py-2 border-b border-gray-100">
             <p className="text-sm font-medium text-gray-600 mb-1">Payment Details</p>
             <div className="bg-blue-50 p-3 rounded text-sm text-blue-900">
                <p><strong>Method:</strong> {request.paymentMethod}</p>
                <p><strong>Acc Number:</strong> {request.accountNumber}</p>
                <p><strong>Bank Code:</strong> {request.bankCode}</p>
             </div>
          </div>

          <DetailRow label="User Note" value={<span className="italic text-gray-500">"{request.note}"</span>} />
          <DetailRow label="Requested At" value={new Date(request.createdAt).toLocaleString()} />

          {/* --- Dropdown for Status Change --- */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            >
              <option value="pending">Pending</option>
              <option value="success">Success / Approved</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          {/* --- DECLINE REASON BOX (Conditional) --- */}
          {selectedStatus === "Declined" && (
            <div className="mt-4 animate-fadeIn">
                <label className="block text-sm font-medium text-red-700 mb-2">
                    Reason for Decline <span className="text-red-500">*</span>
                </label>
                <textarea
                    required
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Please explain why this request is declined..."
                    className="w-full p-3 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm h-24"
                />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50 flex justify-end space-x-3 rounded-b-xl sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            // Disable save if declined but no reason provided
            disabled={selectedStatus === "Declined" && !declineReason.trim()}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md transition duration-150 
                ${selectedStatus === "Declined" && !declineReason.trim() 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {selectedStatus === "Declined" ? "Decline Request" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const WithdrawalRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Sorting state
  const [sortBy, setSortBy] = useState<keyof WithdrawalRequest>("createdAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);

  // --- 1. FETCH DATA FROM API ---
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3200/withdraw/getall");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // --- 2. UPDATE STATUS HANDLER ---
  const handleUpdateStatus = useCallback(
    async (id: string, newStatus: string, reason?: string) => {
      try {
        console.log(`Updating ID: ${id}`);
        console.log(`Status: ${newStatus}`);
        if(reason) console.log(`Decline Reason: ${reason}`);

        // TODO: Backend API Call goes here
        // const body = { status: newStatus, note: reason }; // example
        // await fetch(`http://localhost:3200/withdraw/update/${id}`, ...)
        
        // Optimistic UI Update
        setRequests((prevRequests) =>
          prevRequests.map((r) =>
            r._id === id ? { ...r, status: newStatus } : r
          )
        );
        
        setIsModalOpen(false);
        // alert("Status updated successfully!");
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status");
      }
    },
    []
  );

  const openModal = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const handleSort = (column: keyof WithdrawalRequest) => {
     setSortBy((prev) => prev === column ? prev : column);
     setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // --- Filtering & Sorting ---
  const filteredAndSortedRequests = useMemo(() => {
    let result = requests.filter(
      (r) =>
        (r._id && r._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.paymentMethod && r.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.status && r.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    result.sort((a, b) => {
        // Handle undefined values safely
        const valA = a[sortBy] || "";
        const valB = b[sortBy] || "";

        let comparison = 0;
        if (typeof valA === "string" && typeof valB === "string") {
            comparison = valA.localeCompare(valB);
        } else if (typeof valA === "number" && typeof valB === "number") {
             comparison = valA - valB;
        }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [requests, searchTerm, sortBy, sortOrder]);

  // --- Pagination ---
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedRequests, currentPage]);

  const currentTotalPages = Math.ceil(filteredAndSortedRequests.length / ITEMS_PER_PAGE);

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("succes")) return "bg-green-100 text-green-800";
    if (s.includes("decline")) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">
          Withdrawals ({filteredAndSortedRequests.length})
        </h3>
        <input
          type="text"
          placeholder="Search Email, Method, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2 sm:mt-0 p-2 border border-gray-300 rounded-lg w-full sm:w-1/3 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border">
        {loading ? (
            <div className="p-10 text-center text-gray-500 animate-pulse">Loading data...</div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email / User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRequests.length > 0 ? (
              paginatedRequests.map((r) => (
                <tr key={r._id} className="hover:bg-purple-50/50 transition duration-75">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{r.fullName || "Unknown"}</div>
                    <div className="text-gray-500 text-xs">{r.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {r.paymentMethod}
                    <div className="text-xs text-gray-400 font-mono">{r.bankCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                    {r.amount} <span className="text-xs font-normal text-gray-500">{r.currency}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => openModal(r)}
                      className="text-white bg-[#D1A148] hover:bg-[#B8862D] px-4 py-1.5 rounded-md text-xs font-medium shadow"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedRequests.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl shadow border border-gray-100">
           <span className="text-sm text-gray-700">
             Page {currentPage} of {currentTotalPages}
           </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(currentTotalPages, p + 1))}
              disabled={currentPage === currentTotalPages}
              className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Logic for Modal */}
      {isModalOpen && (
        <WithdrawalModal
          request={selectedRequest}
          onClose={closeModal}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default WithdrawalRequests;