import React, { useMemo, useState } from "react";

/**
 * Interface for a single transaction record
 */
interface Transaction {
  id: string;
  type: "Purchase" | "Withdrawal" | "Deposit" | "Fee";
  amountUSD: number;
  date: string;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  buyerId?: number; // User who initiated the transaction (buyer for purchase, seller for withdrawal)
  sellerId?: number; // Target user (seller for purchase, admin for deposit/withdrawal)
  description: string;
}

// --- MOCK DATA ---
const mockTransactions: Transaction[] = [
  {
    id: "T0001",
    type: "Purchase",
    amountUSD: 150.0,
    date: "2024-06-25",
    status: "Completed",
    buyerId: 1,
    sellerId: 2,
    description: "Product purchase: High-end widget",
  },
  {
    id: "T0002",
    type: "Withdrawal",
    amountUSD: 50.5,
    date: "2024-06-26",
    status: "Pending",
    buyerId: 2,
    description: "Requested payout to bank account",
  },
  {
    id: "T0003",
    type: "Deposit",
    amountUSD: 500.0,
    date: "2024-06-27",
    status: "Completed",
    buyerId: 3,
    description: "Wallet top-up via credit card",
  },
  {
    id: "T0004",
    type: "Fee",
    amountUSD: 10.0,
    date: "2024-06-27",
    status: "Completed",
    sellerId: 5,
    description: "Seller activation fee deducted",
  },
  {
    id: "T0005",
    type: "Purchase",
    amountUSD: 75.0,
    date: "2024-06-28",
    status: "Refunded",
    buyerId: 4,
    sellerId: 7,
    description: "Service refund: Canceled consultation",
  },
  {
    id: "T0006",
    type: "Withdrawal",
    amountUSD: 1200.0,
    date: "2024-06-28",
    status: "Failed",
    buyerId: 4,
    description: "Large withdrawal failed due to limit",
  },
  {
    id: "T0007",
    type: "Purchase",
    amountUSD: 25.0,
    date: "2024-06-29",
    status: "Completed",
    buyerId: 6,
    sellerId: 9,
    description: "Digital download purchase",
  },
  {
    id: "T0008",
    type: "Deposit",
    amountUSD: 50.0,
    date: "2024-06-30",
    status: "Completed",
    buyerId: 8,
    description: "Small deposit via PayPal",
  },
  {
    id: "T0009",
    type: "Purchase",
    amountUSD: 50.0,
    date: "2024-07-01",
    status: "Pending",
    buyerId: 10,
    sellerId: 11,
    description: "Pending product delivery",
  },
  {
    id: "T0010",
    type: "Fee",
    amountUSD: 5.0,
    date: "2024-07-01",
    status: "Completed",
    sellerId: 1,
    description: "Monthly service fee",
  },
  {
    id: "T0011",
    type: "Purchase",
    amountUSD: 42.5,
    date: "2024-07-02",
    status: "Completed",
    buyerId: 12,
    sellerId: 2,
    description: "Accessory purchase",
  },
  {
    id: "T0012",
    type: "Withdrawal",
    amountUSD: 310.25,
    date: "2024-07-03",
    status: "Completed",
    buyerId: 7,
    description: "Seller payout",
  },
  {
    id: "T0013",
    type: "Deposit",
    amountUSD: 100.0,
    date: "2024-07-03",
    status: "Pending",
    buyerId: 1,
    description: "Pending wire transfer",
  },
  {
    id: "T0014",
    type: "Purchase",
    amountUSD: 300.0,
    date: "2024-07-04",
    status: "Completed",
    buyerId: 2,
    sellerId: 4,
    description: "Software license",
  },
  {
    id: "T0015",
    type: "Fee",
    amountUSD: 15.0,
    date: "2024-07-04",
    status: "Completed",
    sellerId: 11,
    description: "Transaction processing fee",
  },
];

const ITEMS_PER_PAGE = 10;

// --- HELPER COMPONENT: TRANSACTION MODAL ---

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  // Helper for currency formatting
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Refunded":
        return "bg-blue-100 text-blue-800";
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
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );

  return (
    // Backdrop
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center bg-indigo-50 rounded-t-xl">
          <h3 className="text-xl font-bold text-indigo-800">
            Transaction Details
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
            label="Transaction ID"
            value={<span className="font-mono">{transaction.id}</span>}
          />

          <DetailRow
            label="Type"
            value={
              <span
                className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${
                  transaction.type === "Purchase"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-pink-100 text-pink-800"
                }`}
              >
                {transaction.type}
              </span>
            }
          />

          <DetailRow label="Date" value={transaction.date} />

          <DetailRow
            label="Status"
            value={
              <span
                className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                  transaction.status
                )}`}
              >
                {transaction.status}
              </span>
            }
          />

          <DetailRow
            label="Amount"
            value={
              <span className="text-lg font-extrabold text-gray-900">
                {formatCurrency(transaction.amountUSD)}
              </span>
            }
          />

          {transaction.buyerId && (
            <DetailRow
              label="Buyer/Payer User ID"
              value={
                <span className="font-mono">User {transaction.buyerId}</span>
              }
            />
          )}
          {transaction.sellerId && (
            <DetailRow
              label="Seller/Recipient User ID"
              value={
                <span className="font-mono">User {transaction.sellerId}</span>
              }
            />
          )}

          <div className="pt-4">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Description:
            </p>
            <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {transaction.description}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT: ALL TRANSACTIONS ---

const AllTransactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "type" | "status">(
    "date"
  );
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Helper for currency formatting
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions.filter(
      (t) =>
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "amount":
          comparison = a.amountUSD - b.amountUSD;
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default: // 'date'
          // Simple string comparison works for YYYY-MM-DD
          comparison = a.date.localeCompare(b.date);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    // Recalculate total pages and ensure current page is valid after filter/sort
    const newTotalPages = Math.ceil(result.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }

    return result;
  }, [transactions, currentPage, searchTerm, sortBy, sortOrder]);

  // --- Pagination Logic ---
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(startIndex, endIndex);
  }, [filteredAndSortedTransactions, currentPage]);

  // --- Handlers ---
  const handleSort = (column: "date" | "amount" | "type" | "status") => {
    setSortBy((prevCol) => {
      if (prevCol === column) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
      } else {
        // Default sort order for date should be descending (most recent first)
        setSortOrder(column === "date" ? "desc" : "asc");
      }
      return column;
    });
  };

  const openModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  const SortIndicator = ({
    column,
  }: {
    column: "date" | "amount" | "type" | "status";
  }) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? <span>&uarr;</span> : <span>&darr;</span>;
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Refunded":
        return "bg-blue-100 text-blue-800";
    }
  };

  // Recalculate total pages for the footer display
  const currentTotalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center  p-4 ">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Transaction Log ({filteredAndSortedTransactions.length} of{" "}
          {mockTransactions.length})
        </h3>
        <input
          type="text"
          placeholder="Search ID, description, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Define headers with explicit alignment for consistency */}
              {[
                { title: "ID", column: "", align: "text-left" },
                { title: "Date", column: "date", align: "text-left" },
                { title: "Type", column: "type", align: "text-center" },
                { title: "Description", column: "", align: "text-left" },
                { title: "Status", column: "status", align: "text-center" },
                {
                  title: "Amount (USD)",
                  column: "amount",
                  align: "text-right",
                },
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
                      header.column as "date" | "amount" | "type" | "status"
                    )
                  }
                >
                  {header.title}{" "}
                  {header.column && (
                    <SortIndicator
                      column={
                        header.column as "date" | "amount" | "type" | "status"
                      }
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-indigo-50/50 transition duration-75"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">
                    {t.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {t.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        t.type === "Purchase"
                          ? "bg-indigo-100 text-indigo-800"
                          : t.type === "Withdrawal"
                          ? "bg-pink-100 text-pink-800"
                          : t.type === "Deposit"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {t.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        t.status
                      )}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                    {formatCurrency(t.amountUSD)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() => openModal(t)}
                      className="text-white bg-[#D1A148] hover:bg-[#00183C] px-3 py-1 rounded-lg text-xs font-medium transition duration-150 shadow-md"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  No transactions found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedTransactions.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center px-4 py-3">
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredAndSortedTransactions.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              {filteredAndSortedTransactions.length}
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

      {/* Transaction Modal */}
      {isModalOpen && selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AllTransactions;
