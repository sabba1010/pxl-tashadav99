import React, { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/* ====================== TYPES ====================== */
interface Payment {
  _id: string;
  transactionId: number | string;
  amount: number;
  currency: string;
  status: string; // e.g., "successful"
  customerEmail: string;
  createdAt: string;
  credited: boolean;
}

const ITEMS_PER_PAGE = 5;

/* ====================== API FUNCTIONS ====================== */
const fetchPayments = async (): Promise<Payment[]> => {
  const response = await axios.get("http://localhost:3200/api/payments");
  return response.data as Payment[]; // assuming the endpoint returns an array directly
};

/* ====================== LOADING COMPONENT ====================== */
const Loading: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="">
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

/* ====================== MAIN COMPONENT ====================== */
const DepositRequests: React.FC = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "amount" | "status" | "customerEmail">("createdAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data
  const {
    data: payments = [],
    isLoading,
    isError,
    error,
  } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  const handleSort = (column: typeof sortBy) => {
    setSortBy((prev) => {
      if (prev === column) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortOrder(column === "createdAt" ? "desc" : "asc");
      }
      return column;
    });
  };

  // Client-side filtering & sorting
  const filteredAndSorted = useMemo(() => {
    let filtered = payments.filter(
      (p) =>
        p._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.transactionId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comp = 0;
      switch (sortBy) {
        case "amount":
          comp = a.amount - b.amount;
          break;
        case "status":
          comp = a.status.localeCompare(b.status);
          break;
        case "customerEmail":
          comp = a.customerEmail.localeCompare(b.customerEmail);
          break;
        default:
          comp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return sortOrder === "asc" ? comp : -comp;
    });

    return filtered;
  }, [payments, searchTerm, sortBy, sortOrder]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, currentPage]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);

  const formatCurrency = (amount: number, currency: string = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);

  const getStatusColor = (status: string) => {
    if (status.toLowerCase() === "successful") {
      return "bg-green-100 text-green-800";
    }
    return "bg-gray-100 text-gray-800";
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
      <div className="p-10  text-red-600">
        Error: {(error as Error)?.message}
      </div>
    );
  }

  if (isLoading && payments.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Payments ({filteredAndSorted.length})
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => queryClient.refetchQueries({ queryKey: ["payments"] })}
            className="bg-white border p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            disabled={isLoading}
          >
            ↻ Refresh
          </button>
          <input
            type="text"
            placeholder="Search ID, Trx ID, email..."
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
                { title: "Customer Email", col: "customerEmail" },
                { title: "Submitted", col: "createdAt" },
                { title: "Trx ID", col: "" },
                { title: "Amount", col: "amount" },
                { title: "Status", col: "status" },
                { title: "Credited", col: "" },
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
              paginated.map((p) => (
                <tr key={p._id} className="hover:bg-indigo-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {p.customerEmail}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                    {String(p.transactionId)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-left">
                    {formatCurrency(p.amount, p.currency)}
                  </td>
                  <td className="px-6 py-4 ">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4  text-sm">
                    {p.credited ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className=" py-10 text-gray-500">
                  No payments found.
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
    </div>
  );
};

export default DepositRequests;