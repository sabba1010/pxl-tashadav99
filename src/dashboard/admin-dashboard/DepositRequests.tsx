import React, { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Updated Interface based on your API response
 */
interface DepositRequest {
  _id: string; // Was 'id'
  name: string; // Was 'userId'
  amountUSD?: number; // Not present in your sample data, made optional
  paymentMethod: string; // Was 'method'
  submittedAt: string; // Was 'dateRequested'
  status: "Pending" | "Approved" | "Rejected";
  transactionId: string; // Was 'proofId'
  message?: string; // New field from your data
}

const ITEMS_PER_PAGE = 5;

// --- HELPER COMPONENT: DEPOSIT MODAL ---

interface DepositModalProps {
  request: DepositRequest | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: "Approved" | "Rejected") => void;
}

const DepositModal: React.FC<DepositModalProps> = ({
  request,
  onClose,
  onUpdateStatus,
}) => {
  if (!request) return null;

  // Helper for currency formatting
  const formatCurrency = (amount: number = 0) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
    label,
    value,
  }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-800 text-right max-w-[60%] break-words">
        {value}
      </span>
    </div>
  );

  return (
    // Backdrop
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center bg-indigo-50 rounded-t-xl">
          <h3 className="text-xl font-bold text-indigo-800 truncate pr-4">
            Review: {request.name}
          </h3>
          <button
            onClick={onClose}
            className="text-indigo-400 hover:text-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body (Details) */}
        <div className="p-6 space-y-2">
          <DetailRow
            label="Request ID"
            value={<span className="font-mono text-xs">{request._id}</span>}
          />
          <DetailRow label="User Name" value={request.name} />

          <DetailRow
            label="Status"
            value={
              <span
                className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                  request.status
                )}`}
              >
                {request.status}
              </span>
            }
          />

          {/* Amount is likely 0 or undefined based on your sample, but handled here */}
          <DetailRow
            label="Amount"
            value={
              <span className="text-lg font-extrabold text-gray-900">
                {formatCurrency(request.amountUSD || 0)}
              </span>
            }
          />

          <DetailRow label="Payment Method" value={request.paymentMethod} />
          <DetailRow
            label="Date Submitted"
            value={new Date(request.submittedAt).toLocaleDateString()}
          />

          {request.message && (
             <div className="pt-2">
                <p className="text-sm font-medium text-gray-600 mb-1">Message:</p>
                <p className="text-sm text-gray-800 bg-yellow-50 p-2 rounded border border-yellow-100 italic">
                    "{request.message}"
                </p>
             </div>
          )}

          <div className="pt-4">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Transaction ID:
            </p>
            <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono break-all">
              {request.transactionId}
            </p>
          </div>
        </div>

        {/* Modal Footer (Actions) */}
        <div className="p-6 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            {request.status === "Pending" ? "Cancel" : "Close"}
          </button>

          {request.status === "Pending" && (
            <>
              <button
                onClick={() => onUpdateStatus(request._id, "Rejected")}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
              >
                Reject
              </button>
              <button
                onClick={() => onUpdateStatus(request._id, "Approved")}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
              >
                Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT: DEPOSIT REQUESTS ---

const DepositRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<
    "submittedAt" | "amountUSD" | "status" | "name"
  >("submittedAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DepositRequest | null>(
    null
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // --- DATA FETCHING ---
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3200/payments");
      const data = await response.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        console.error("API did not return an array", data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Helper for currency formatting
  const formatCurrency = (amount: number = 0) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  // --- Core Handlers ---
  const handleUpdateStatus = useCallback(
    async (id: string, newStatus: "Approved" | "Rejected") => {
      // NOTE: Here you should usually call an API endpoint to update the status in the database.
      // Example: await fetch(`http://localhost:3200/payments/${id}`, { method: 'PATCH', body: ... })
      
      // For now, updating local state optimistically:
      setRequests((prevRequests) =>
        prevRequests.map((r) =>
          r._id === id ? { ...r, status: newStatus } : r
        )
      );
      setSelectedRequest((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
      setIsModalOpen(false);
    },
    []
  );

  const openModal = (request: DepositRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const handleSort = (
    column: "submittedAt" | "amountUSD" | "status" | "name"
  ) => {
    setSortBy((prevCol) => {
      if (prevCol === column) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
      } else {
        setSortOrder(column === "submittedAt" ? "desc" : "asc");
      }
      return column;
    });
  };

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedRequests = useMemo(() => {
    let result = requests.filter(
      (r) =>
        r._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "amountUSD":
          comparison = (a.amountUSD || 0) - (b.amountUSD || 0);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        default: // 'submittedAt'
          comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    const newTotalPages = Math.ceil(result.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }

    return result;
  }, [currentPage, requests, searchTerm, sortBy, sortOrder]);

  // --- Pagination Logic ---
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedRequests.slice(startIndex, endIndex);
  }, [filteredAndSortedRequests, currentPage]);

  const SortIndicator = ({
    column,
  }: {
    column: "submittedAt" | "amountUSD" | "status" | "name";
  }) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? <span>&uarr;</span> : <span>&darr;</span>;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const currentTotalPages = Math.ceil(
    filteredAndSortedRequests.length / ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Payment Requests ({filteredAndSortedRequests.length})
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">
            <button 
                onClick={fetchPayments} 
                className="bg-white border p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                title="Refresh Data"
            >
                ↻
            </button>
            <input
            type="text"
            placeholder="Search ID, method, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border">
        {loading ? (
            <div className="p-10 text-center text-gray-500">Loading payments...</div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { title: "User Name", column: "name", align: "text-left" },
                { title: "Submitted", column: "submittedAt", align: "text-left" },
                { title: "Method", column: "", align: "text-left" },
                { title: "Trx ID", column: "", align: "text-left" },
                {
                  title: "Amount",
                  column: "amountUSD",
                  align: "text-right",
                },
                { title: "Status", column: "status", align: "text-center" },
                { title: "Actions", column: "", align: "text-center" },
              ].map((header) => (
                <th
                  key={header.title}
                  className={`px-6 py-3 ${
                    header.align
                  } text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    header.column ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={() =>
                    header.column &&
                    handleSort(
                      header.column as
                        | "submittedAt"
                        | "amountUSD"
                        | "status"
                        | "name"
                    )
                  }
                >
                  {header.title}{" "}
                  {header.column && (
                    <SortIndicator
                      column={
                        header.column as
                          | "submittedAt"
                          | "amountUSD"
                          | "status"
                          | "name"
                      }
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRequests.length > 0 ? (
              paginatedRequests.map((r) => (
                <tr
                  key={r._id}
                  className="hover:bg-indigo-50/50 transition duration-75"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {r.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(r.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {r.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                    {r.transactionId.substring(0, 8)}...
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                    {formatCurrency(r.amountUSD || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() => openModal(r)}
                      className="text-white bg-[#D1A148] hover:bg-[#00183C] px-3 py-1 rounded-lg text-xs font-medium transition duration-150 shadow-md"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  No requests found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && filteredAndSortedRequests.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl shadow-md border border-gray-100">
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredAndSortedRequests.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              {filteredAndSortedRequests.length}
            </span>{" "}
            results
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition duration-150"
            >
              Previous
            </button>
            {/* Show page numbers */}
            {[...Array(currentTotalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition duration-150 
                        ${
                          currentPage === index + 1
                            ? "bg-[#D1A148] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(currentTotalPages, prev + 1))
              }
              disabled={currentPage === currentTotalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition duration-150"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {isModalOpen && selectedRequest && (
        <DepositModal
          request={selectedRequest}
          onClose={closeModal}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default DepositRequests;