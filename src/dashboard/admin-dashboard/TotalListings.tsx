import React, { useState, useMemo, useCallback } from "react";

/**
 * Interface for a single listing record
 */
interface Listing {
  id: string;
  title: string;
  sellerId: number;
  category: "Electronics" | "Services" | "Home Goods" | "Digital";
  priceUSD: number;
  dateCreated: string;
  status: "Active" | "Draft" | "Suspended" | "Sold";
}

// --- MOCK DATA ---
const mockListings: Listing[] = [
  {
    id: "L1001",
    title: "Vintage Vinyl Player",
    sellerId: 2,
    category: "Home Goods",
    priceUSD: 150.0,
    dateCreated: "2024-05-15",
    status: "Active",
  },
  {
    id: "L1002",
    title: "Premium Logo Design Service",
    sellerId: 7,
    category: "Services",
    priceUSD: 75.0,
    dateCreated: "2024-05-20",
    status: "Active",
  },
  {
    id: "L1003",
    title: "High-speed USB-C Cable (5-pack)",
    sellerId: 9,
    category: "Electronics",
    priceUSD: 19.99,
    dateCreated: "2024-05-22",
    status: "Draft",
  },
  {
    id: "L1004",
    title: "Advanced Data Analysis E-book",
    sellerId: 4,
    category: "Digital",
    priceUSD: 49.99,
    dateCreated: "2024-05-25",
    status: "Sold",
  },
  {
    id: "L1005",
    title: "Custom WordPress Theme Installation",
    sellerId: 2,
    category: "Services",
    priceUSD: 350.0,
    dateCreated: "2024-06-01",
    status: "Suspended",
  },
  {
    id: "L1006",
    title: '4K Monitor 27"',
    sellerId: 11,
    category: "Electronics",
    priceUSD: 599.0,
    dateCreated: "2024-06-05",
    status: "Active",
  },
  {
    id: "L1007",
    title: "Handmade Ceramic Mug Set",
    sellerId: 7,
    category: "Home Goods",
    priceUSD: 25.5,
    dateCreated: "2024-06-10",
    status: "Active",
  },
  {
    id: "L1008",
    title: "Beginner Coding Course Access",
    sellerId: 4,
    category: "Digital",
    priceUSD: 99.0,
    dateCreated: "2024-06-12",
    status: "Active",
  },
  {
    id: "L1009",
    title: "Rare Comic Book Collection",
    sellerId: 9,
    category: "Digital",
    priceUSD: 1200.0,
    dateCreated: "2024-06-15",
    status: "Sold",
  },
  {
    id: "L1010",
    title: "One Hour Fitness Coaching",
    sellerId: 11,
    category: "Services",
    priceUSD: 50.0,
    dateCreated: "2024-06-18",
    status: "Active",
  },
];

const ITEMS_PER_PAGE = 6;

// --- HELPER COMPONENT: LISTING MODAL ---

interface ListingModalProps {
  listing: Listing | null;
  mode: "view" | "edit";
  onClose: () => void;
  onSave: (updatedListing: Listing) => void;
}

const ListingModal: React.FC<ListingModalProps> = ({
  listing,
  mode,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Listing | null>(
    listing ? { ...listing } : null
  );

  if (!listing || !formData) return null;

  const title =
    mode === "edit"
      ? `Edit Listing: ${listing.title}`
      : `View Listing: ${listing.title}`;
  const isEditMode = mode === "edit";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (!prev) return null;

      let finalValue: string | number = value;

      if (name === "priceUSD") {
        finalValue = parseFloat(value) || 0;
      }

      return {
        ...prev,
        [name]: finalValue,
      } as Listing;
    });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  // Helper for currency formatting
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getStatusColor = (status: Listing["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Sold":
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center bg-indigo-50 rounded-t-xl">
          <h3 className="text-xl font-bold text-indigo-800">{title}</h3>
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

        {/* Modal Body (Details/Form) */}
        <div className="p-6 space-y-4">
          <DetailRow
            label="Listing ID"
            value={<span className="font-mono">{listing.id}</span>}
          />
          <DetailRow label="Seller ID" value={`User ${listing.sellerId}`} />
          <DetailRow label="Category" value={listing.category} />
          <DetailRow label="Date Created" value={listing.dateCreated} />

          {/* Price (Editable) */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <label
              htmlFor="priceUSD"
              className="text-sm font-medium text-gray-600"
            >
              Price (USD):
            </label>
            {isEditMode ? (
              <input
                id="priceUSD"
                type="number"
                name="priceUSD"
                value={formData.priceUSD}
                onChange={handleChange}
                step="0.01"
                className="w-1/3 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-right"
              />
            ) : (
              <span className="text-lg font-extrabold text-gray-900">
                {formatCurrency(listing.priceUSD)}
              </span>
            )}
          </div>

          {/* Status (Editable) */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-600"
            >
              Listing Status:
            </label>
            {isEditMode ? (
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-1/3 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {["Active", "Draft", "Suspended", "Sold"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <span
                className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                  listing.status
                )}`}
              >
                {listing.status}
              </span>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            {isEditMode ? "Cancel" : "Close"}
          </button>
          {isEditMode && (
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT: TOTAL LISTINGS ---

const TotalListings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [sortBy, setSortBy] = useState<
    "dateCreated" | "priceUSD" | "category" | "status"
  >("dateCreated");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Helper for currency formatting
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedListings = useMemo(() => {
    let result = listings.filter(
      (l) =>
        l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "priceUSD":
          comparison = a.priceUSD - b.priceUSD;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default: // 'dateCreated'
          comparison = a.dateCreated.localeCompare(b.dateCreated);
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
  }, [listings, searchTerm, sortBy, sortOrder]);

  // --- Pagination Logic ---
  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedListings.slice(startIndex, endIndex);
  }, [filteredAndSortedListings, currentPage]);

  // --- Handlers ---
  const handleSort = (
    column: "dateCreated" | "priceUSD" | "category" | "status"
  ) => {
    setSortBy((prevCol) => {
      if (prevCol === column) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
      } else {
        // Default sort order for date should be descending (most recent first)
        setSortOrder(column === "dateCreated" ? "desc" : "asc");
      }
      return column;
    });
  };

  const openModal = (listing: Listing, mode: "view" | "edit") => {
    setSelectedListing(listing);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedListing(null);
    setIsModalOpen(false);
  };

  const handleSaveListing = useCallback((updatedListing: Listing) => {
    setListings((prevListings) =>
      prevListings.map((l) => (l.id === updatedListing.id ? updatedListing : l))
    );
    closeModal();
  }, []);

  const SortIndicator = ({
    column,
  }: {
    column: "dateCreated" | "priceUSD" | "category" | "status";
  }) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? <span>&uarr;</span> : <span>&darr;</span>;
  };

  const getStatusColor = (status: Listing["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Sold":
        return "bg-blue-100 text-blue-800";
    }
  };

  // Recalculate total pages for the footer display
  const currentTotalPages = Math.ceil(
    filteredAndSortedListings.length / ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Product/Service Listings ({filteredAndSortedListings.length} of{" "}
          {mockListings.length})
        </h3>
        <input
          type="text"
          placeholder="Search title, ID, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />
      </div>

      {/* Listings Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Define headers with explicit alignment for consistency */}
              {[
                { title: "ID", column: "", align: "text-left" },
                { title: "Title", column: "", align: "text-left" },
                { title: "Seller ID", column: "", align: "text-left" },
                { title: "Category", column: "category", align: "text-center" },
                {
                  title: "Price (USD)",
                  column: "priceUSD",
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
                        | "dateCreated"
                        | "priceUSD"
                        | "category"
                        | "status"
                    )
                  }
                >
                  {header.title}{" "}
                  {header.column && (
                    <SortIndicator
                      column={
                        header.column as
                          | "dateCreated"
                          | "priceUSD"
                          | "category"
                          | "status"
                      }
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedListings.length > 0 ? (
              paginatedListings.map((l) => (
                <tr
                  key={l.id}
                  className="hover:bg-indigo-50/50 transition duration-75"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">
                    {l.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700 max-w-xs truncate">
                    {l.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    User {l.sellerId}
                  </td>

                  {/* Category Data Cell - text-center */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        l.category === "Electronics"
                          ? "bg-blue-100 text-blue-800"
                          : l.category === "Services"
                          ? "bg-purple-100 text-purple-800"
                          : l.category === "Digital"
                          ? "bg-teal-100 text-teal-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {l.category}
                    </span>
                  </td>

                  {/* Price Data Cell - text-right */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                    {formatCurrency(l.priceUSD)}
                  </td>

                  {/* Status Data Cell - text-center */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        l.status
                      )}`}
                    >
                      {l.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() => openModal(l, "view")}
                      className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-xs font-medium transition duration-150 shadow-md"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openModal(l, "edit")}
                      className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg text-xs font-medium transition duration-150 shadow-md"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  No listings found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedListings.length > ITEMS_PER_PAGE && (
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
                filteredAndSortedListings.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              {filteredAndSortedListings.length}
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
                            ? "bg-indigo-600 text-white"
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

      {/* Listing Modal */}
      {isModalOpen && selectedListing && (
        <ListingModal
          listing={selectedListing}
          mode={modalMode}
          onClose={closeModal}
          onSave={handleSaveListing}
        />
      )}
    </div>
  );
};

export default TotalListings;
