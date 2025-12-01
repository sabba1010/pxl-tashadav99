import React, { useState, useMemo, useCallback } from "react";

/**
 * Interface for a single withdrawal request record
 */
interface WithdrawalRequest {
  id: string;
  userId: number;
  amountUSD: number;
  method: "Bank Transfer" | "PayPal" | "Crypto Wallet";
  dateRequested: string;
  status: "Pending" | "Processed" | "Failed";
  accountDetails: string; // Destination account info (e.g., bank last 4 digits, PayPal email, crypto address)
}

// --- MOCK DATA ---
const mockRequests: WithdrawalRequest[] = [
  {
    id: "W001",
    userId: 12,
    amountUSD: 500.0,
    method: "Bank Transfer",
    dateRequested: "2024-07-20",
    status: "Pending",
    accountDetails: "Bank: ****1234 (John Doe)",
  },
  {
    id: "W002",
    userId: 25,
    amountUSD: 150.0,
    method: "PayPal",
    dateRequested: "2024-07-21",
    status: "Processed",
    accountDetails: "paypal@example.com",
  },
  {
    id: "W003",
    userId: 33,
    amountUSD: 1000.0,
    method: "Crypto Wallet",
    dateRequested: "2024-07-21",
    status: "Pending",
    accountDetails: "Crypto: 0xAbC...DeF",
  },
  {
    id: "W004",
    userId: 12,
    amountUSD: 25.5,
    method: "PayPal",
    dateRequested: "2024-07-22",
    status: "Failed",
    accountDetails: "paypal@example.com",
  },
  {
    id: "W005",
    userId: 40,
    amountUSD: 750.0,
    method: "Bank Transfer",
    dateRequested: "2024-07-22",
    status: "Pending",
    accountDetails: "Bank: ****5678 (Jane Smith)",
  },
  {
    id: "W006",
    userId: 18,
    amountUSD: 120.0,
    method: "PayPal",
    dateRequested: "2024-07-23",
    status: "Pending",
    accountDetails: "user18@email.com",
  },
];

const ITEMS_PER_PAGE = 5;

// --- HELPER COMPONENT: WITHDRAWAL MODAL ---

interface WithdrawalModalProps {
  request: WithdrawalRequest | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: "Processed" | "Failed") => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  request,
  onClose,
  onUpdateStatus,
}) => {
  if (!request) return null;

  // Helper for currency formatting
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getStatusColor = (status: WithdrawalRequest["status"]) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
    }
  };

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
    label,
    value,
  }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );

  return (
    // Backdrop
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center bg-purple-50 rounded-t-xl">
          <h3 className="text-xl font-bold text-purple-800">
            Review Withdrawal: {request.id}
          </h3>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-600"
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
            label="User ID"
            value={<span className="font-mono">User {request.userId}</span>}
          />

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

          <DetailRow
            label="Amount"
            value={
              <span className="text-lg font-extrabold text-gray-900">
                {formatCurrency(request.amountUSD)}
              </span>
            }
          />

          <DetailRow label="Method" value={request.method} />
          <DetailRow label="Date Requested" value={request.dateRequested} />

          <div className="pt-4">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Destination Account/Address:
            </p>
            <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono break-all">
              {request.accountDetails}
            </p>
            <p className="text-xs text-gray-500 mt-2 italic">
              (Verify funds availability and transfer this amount before setting
              status to 'Processed'.)
            </p>
          </div>
        </div>

        {/* Modal Footer (Actions) */}
        <div className="p-6 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            {request.status === "Pending" ? "Close Review" : "Close"}
          </button>

          {request.status === "Pending" && (
            <>
              <button
                onClick={() => onUpdateStatus(request.id, "Failed")}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
              >
                Mark as Failed
              </button>
              <button
                onClick={() => onUpdateStatus(request.id, "Processed")}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition duration-150 shadow-md"
              >
                Mark as Processed
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT: WITHDRAWAL REQUESTS ---

const WithdrawalRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [requests, setRequests] = useState<WithdrawalRequest[]>(mockRequests);
  const [sortBy, setSortBy] = useState<
    "dateRequested" | "amountUSD" | "status" | "userId"
  >("dateRequested");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawalRequest | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Helper for currency formatting
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  // --- Core Handlers ---
  const handleUpdateStatus = useCallback(
    (id: string, newStatus: "Processed" | "Failed") => {
      setRequests((prevRequests) =>
        prevRequests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      // Optionally update the selected request status in the modal
      setSelectedRequest((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
      setIsModalOpen(false); // Close modal on action
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

  const handleSort = (
    column: "dateRequested" | "amountUSD" | "status" | "userId"
  ) => {
    setSortBy((prevCol) => {
      if (prevCol === column) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
      } else {
        setSortOrder(column === "dateRequested" ? "desc" : "asc");
      }
      return column;
    });
  };

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedRequests = useMemo(() => {
    let result = requests.filter(
      (r) =>
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.accountDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "amountUSD":
          comparison = a.amountUSD - b.amountUSD;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "userId":
          comparison = a.userId - b.userId;
          break;
        default: // 'dateRequested'
          comparison = a.dateRequested.localeCompare(b.dateRequested);
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
  }, [requests, searchTerm, sortBy, sortOrder, currentPage]);

  // --- Pagination Logic ---
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedRequests.slice(startIndex, endIndex);
  }, [filteredAndSortedRequests, currentPage]);

  const SortIndicator = ({
    column,
  }: {
    column: "dateRequested" | "amountUSD" | "status" | "userId";
  }) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? <span>&uarr;</span> : <span>&darr;</span>;
  };

  const getStatusColor = (status: WithdrawalRequest["status"]) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
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
          Withdrawal Requests Queue ({filteredAndSortedRequests.length} total)
        </h3>
        <input
          type="text"
          placeholder="Search ID, method, or account details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
        />
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Define headers with explicit alignment for consistency */}
              {[
                { title: "Req ID", column: "", align: "text-left" },
                { title: "Date", column: "dateRequested", align: "text-left" },
                { title: "User ID", column: "userId", align: "text-left" },
                { title: "Method", column: "", align: "text-left" },
                {
                  title: "Amount (USD)",
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
                        | "dateRequested"
                        | "amountUSD"
                        | "status"
                        | "userId"
                    )
                  }
                >
                  {header.title}{" "}
                  {header.column && (
                    <SortIndicator
                      column={
                        header.column as
                          | "dateRequested"
                          | "amountUSD"
                          | "status"
                          | "userId"
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
                  key={r.id}
                  className="hover:bg-purple-50/50 transition duration-75"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">
                    {r.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {r.dateRequested}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    User {r.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {r.method}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                    {formatCurrency(r.amountUSD)}
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
                      className="text-white bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded-lg text-xs font-medium transition duration-150 shadow-md"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  No withdrawal requests found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedRequests.length > ITEMS_PER_PAGE && (
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
            {/* Show page numbers for better navigation experience */}
            {[...Array(currentTotalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition duration-150 
                        ${
                          currentPage === index + 1
                            ? "bg-purple-600 text-white"
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

      {/* Withdrawal Modal */}
      {isModalOpen && selectedRequest && (
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
