import React, { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ====================== TYPES ====================== */
interface DepositRequest {
  _id: string;
  name: string;
  amount?: number;
  paymentMethod: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  transactionId: string;
  message?: string;
}

const ITEMS_PER_PAGE = 5;

/* ====================== API FUNCTIONS ====================== */
const fetchPayments = async (): Promise<DepositRequest[]> => {
  const response = await axios.get<DepositRequest[]>(
    "http://localhost:3200/payments"
  );
  return response.data;
};

const updatePaymentStatus = async ({
  id,
  status,
}: {
  id: string;
  status: "Approved" | "Rejected";
}) => {
  const response = await axios.patch(`http://localhost:3200/payments/${id}`, {
    status,
  });
  return response.data;
};

/* ====================== LOADING COMPONENT ====================== */
const Loading: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative mx-auto mb-8 h-24 w-24">
          <div className="absolute inset-0 rounded-full border-8 border-green-200"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-8 border-transparent border-t-green-500"></div>
          <div className="absolute inset-4 animate-pulse rounded-full bg-green-400 opacity-20"></div>
          <div className="absolute inset-8 animate-ping rounded-full bg-green-600 opacity-30"></div>
        </div>

        <h2 className="mb-2 text-3xl font-semibold text-green-800">
          Loading
          <span className="inline-block animate-bounce">.</span>
          <span className="inline-block animate-bounce delay-150">.</span>
          <span className="inline-block animate-bounce delay-300">.</span>
        </h2>
        <p className="text-lg text-green-600">
          Please wait while we prepare everything for you
        </p>

        <style>{`
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          .delay-150 {
            animation-delay: 150ms;
          }
          .delay-300 {
            animation-delay: 300ms;
          }
          .animate-bounce {
            animation: bounce 1.5s infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

/* ====================== MODAL COMPONENT ====================== */
const DepositModal: React.FC<{
  request: DepositRequest | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: "Approved" | "Rejected") => void;
}> = ({ request, onClose, onUpdateStatus }) => {
  if (!request) return null;

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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
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
                className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
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
                {formatCurrency(request.amount || 0)}
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

        <div className="p-6 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            {request.status === "Pending" ? "Cancel" : "Close"}
          </button>

          {request.status === "Pending" && (
            <>
              <button
                onClick={() => onUpdateStatus(request._id, "Rejected")}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md"
              >
                Reject
              </button>
              <button
                onClick={() => onUpdateStatus(request._id, "Approved")}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md"
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

/* ====================== MAIN COMPONENT ====================== */
const DepositRequests: React.FC = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "submittedAt" | "amount" | "status" | "name"
  >("submittedAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DepositRequest | null>(
    null
  );

  // Fetch data
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery<DepositRequest[]>({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  // Mutation
  const mutation = useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success(`Payment ${variables.status.toLowerCase()} successfully`);
      closeModal();
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const handleUpdateStatus = useCallback(
    (id: string, status: "Approved" | "Rejected") => {
      mutation.mutate({ id, status });
    },
    [mutation]
  );

  const openModal = (request: DepositRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const handleSort = (column: typeof sortBy) => {
    setSortBy((prev) => {
      if (prev === column) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortOrder(column === "submittedAt" ? "desc" : "asc");
      }
      return column;
    });
  };

  // Client-side filtering & sorting
  const filteredAndSorted = useMemo(() => {
    let filtered = requests.filter(
      (r) =>
        r._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comp = 0;
      switch (sortBy) {
        case "amount":
          comp = (a.amount || 0) - (b.amount || 0);
          break;
        case "status":
          comp = a.status.localeCompare(b.status);
          break;
        case "name":
          comp = a.name.localeCompare(b.name);
          break;
        default:
          comp =
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime();
      }
      return sortOrder === "asc" ? comp : -comp;
    });

    return filtered;
  }, [requests, searchTerm, sortBy, sortOrder]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, currentPage]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);

  const formatCurrency = (amount = 0) =>
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

  const SortIndicator = ({ column }: { column: typeof sortBy }) =>
    sortBy === column ? (
      sortOrder === "asc" ? (
        <span>↑</span>
      ) : (
        <span>↓</span>
      )
    ) : null;

  if (isError) {
    return (
      <div className="p-10 text-center text-red-600">
        Error: {(error as Error)?.message}
      </div>
    );
  }

  if (isLoading && requests.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Payment Requests ({filteredAndSorted.length})
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() =>
              queryClient.refetchQueries({ queryKey: ["payments"] })
            }
            className="bg-white border p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            disabled={isLoading}
          >
            ↻
          </button>
          <input
            type="text"
            placeholder="Search ID, method, name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { title: "User Name", col: "name" },
                { title: "Submitted", col: "submittedAt" },
                { title: "Method", col: "" },
                { title: "Trx ID", col: "" },
                { title: "Amount", col: "amount" },
                { title: "Status", col: "status" },
                { title: "Actions", col: "" },
              ].map((h) => (
                <th
                  key={h.title}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    h.col ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={() => h.col && handleSort(h.col as typeof sortBy)}
                >
                  {h.title}{" "}
                  {h.col && <SortIndicator column={h.col as typeof sortBy} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.length > 0 ? (
              paginated.map((r) => (
                <tr key={r._id} className="hover:bg-indigo-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {r.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(r.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {r.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                    {r.transactionId.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-right">
                    {formatCurrency(r.amount || 0)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openModal(r)}
                      className="text-white bg-[#D1A148] hover:bg-[#00183C] px-3 py-1 rounded-lg text-xs font-medium shadow-md"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-[#D1A148] text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
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
