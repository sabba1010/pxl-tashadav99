import React, { useMemo, useState, useEffect } from "react";

interface PaymentTransaction {
  id: string; // _id from MongoDB
  transactionId: number;
  amountUSD: number;
  currency: string;
  status: string;
  credited: boolean;
  customerEmail: string;
  date: string; // YYYY-MM-DD format
  description: string;
}

const ITEMS_PER_PAGE = 10;

const AllTransactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch payments from real API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3200/api/payments");

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();

        // Assuming API returns an array of payments
        const payments: PaymentTransaction[] = (Array.isArray(data) ? data : data.data || []).map(
          (item: any) => ({
            id: item._id,
            transactionId: item.transactionId,
            amountUSD: parseFloat(item.amount),
            currency: item.currency || "USD",
            status: item.status,
            credited: item.credited,
            customerEmail: item.customerEmail || "N/A",
            date: new Date(item.createdAt).toISOString().split("T")[0],
            description: item.credited
              ? "Wallet credited successfully"
              : "Payment processed (not credited yet)",
          })
        );

        setTransactions(payments);
      } catch (err: any) {
        console.error("Error fetching payments:", err);
        setError(err.message || "Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusColor = (status: string, credited: boolean) => {
    if (status === "successful" && credited) {
      return "bg-green-100 text-green-800";
    }
    if (status === "successful") {
      return "bg-blue-100 text-blue-800";
    }
    if (status === "failed" || status === "cancelled") {
      return "bg-red-100 text-red-800";
    }
    return "bg-yellow-100 text-yellow-800";
  };

  // Filtering & Sorting
  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions.filter(
      (t) =>
        t.transactionId.toString().includes(searchTerm) ||
        t.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "amount":
          comparison = a.amountUSD - b.amountUSD;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = a.date.localeCompare(b.date);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    const totalPages = Math.ceil(result.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }

    return result;
  }, [transactions, searchTerm, sortBy, sortOrder, currentPage]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (column: "date" | "amount" | "status") => {
    setSortBy((prev) => {
      if (prev === column) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortOrder(column === "date" ? "desc" : "asc");
      }
      return column;
    });
  };

  const SortIndicator = ({ column }: { column: "date" | "amount" | "status" }) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? <span>↑</span> : <span>↓</span>;
  };

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);

  // Loading State
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading payments...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-medium mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-2xl font-bold text-gray-800">
          Payment History ({filteredAndSortedTransactions.length} records)
        </h3>
        <input
          type="text"
          placeholder="Search by Transaction ID, Email, Status..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="p-3 border border-gray-300 rounded-lg w-full sm:w-96 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { title: "Transaction ID", align: "text-left" },
                { title: "Date", column: "date", align: "text-left" },
                { title: "Customer Email", align: "text-left" },
                { title: "Amount", column: "amount", align: "text-right" },
                { title: "Status", column: "status", align: "text-center" },
                { title: "Credited", align: "text-center" },
              ].map((header) => (
                <th
                  key={header.title}
                  className={`px-6 py-4 ${header.align} text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    header.column ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={() => header.column && handleSort(header.column as any)}
                >
                  {header.title}
                  {header.column && <SortIndicator column={header.column as any} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-gray-900">
                    #{t.transactionId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {t.customerEmail}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                    {formatCurrency(t.amountUSD)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-4 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        t.status,
                        t.credited
                      )}`}
                    >
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        t.credited
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {t.credited ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  No payments found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredAndSortedTransactions.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center py-4">
          <p className="text-sm text-gray-700">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedTransactions.length)} of{" "}
            {filteredAndSortedTransactions.length} payments
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 text-sm rounded-lg ${
                  currentPage === i + 1
                    ? "bg-[#D1A148] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTransactions;