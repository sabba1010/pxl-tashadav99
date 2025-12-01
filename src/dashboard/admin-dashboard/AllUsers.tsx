import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

/**
 * Interface for a single user record
 */
interface User {
  id: number;
  name: string;
  email: string;
  role: "Buyer" | "Seller";
  registrationDate: string;
  isActive: boolean;
  activationFeePaid: boolean; // Relevant only for Sellers
  walletBalanceUSD: number;
}

// --- MOCK DATA ---
const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Buyer",
    email: "alice@example.com",
    role: "Buyer",
    registrationDate: "2024-05-10",
    isActive: true,
    activationFeePaid: false,
    walletBalanceUSD: 150.0,
  },
  {
    id: 2,
    name: "Bob Seller",
    email: "bob@store.com",
    role: "Seller",
    registrationDate: "2024-05-15",
    isActive: true,
    activationFeePaid: true,
    walletBalanceUSD: 750.5,
  },
  {
    id: 3,
    name: "Charlie Buyer",
    email: "charlie@web.net",
    role: "Buyer",
    registrationDate: "2024-05-18",
    isActive: false,
    activationFeePaid: false,
    walletBalanceUSD: 0.0,
  },
  {
    id: 4,
    name: "Diana Seller",
    email: "diana@shop.org",
    role: "Seller",
    registrationDate: "2024-05-20",
    isActive: true,
    activationFeePaid: true,
    walletBalanceUSD: 1200.0,
  },
  {
    id: 5,
    name: "Eve Unpaid",
    email: "eve@test.co",
    role: "Seller",
    registrationDate: "2024-05-22",
    isActive: true,
    activationFeePaid: false,
    walletBalanceUSD: 0.0,
  },
  {
    id: 6,
    name: "Frank Buyer",
    email: "frank@mail.com",
    role: "Buyer",
    registrationDate: "2024-06-01",
    isActive: true,
    activationFeePaid: false,
    walletBalanceUSD: 25.0,
  },
  {
    id: 7,
    name: "Grace Seller",
    email: "grace@biz.com",
    role: "Seller",
    registrationDate: "2024-06-05",
    isActive: true,
    activationFeePaid: true,
    walletBalanceUSD: 310.25,
  },
  {
    id: 8,
    name: "Henry Newbie",
    email: "henry@test.com",
    role: "Buyer",
    registrationDate: "2024-06-10",
    isActive: true,
    activationFeePaid: false,
    walletBalanceUSD: 5.0,
  },
  {
    id: 9,
    name: "Ivy Merchant",
    email: "ivy@market.com",
    role: "Seller",
    registrationDate: "2024-06-12",
    isActive: true,
    activationFeePaid: true,
    walletBalanceUSD: 500.0,
  },
  {
    id: 10,
    name: "Jack Zero",
    email: "jack@zero.net",
    role: "Buyer",
    registrationDate: "2024-06-15",
    isActive: false,
    activationFeePaid: false,
    walletBalanceUSD: 0.0,
  },
  {
    id: 11,
    name: "Kelly Active",
    email: "kelly@active.com",
    role: "Seller",
    registrationDate: "2024-06-17",
    isActive: true,
    activationFeePaid: true,
    walletBalanceUSD: 999.99,
  },
  {
    id: 12,
    name: "Liam Test",
    email: "liam@test.co",
    role: "Buyer",
    registrationDate: "2024-06-20",
    isActive: true,
    activationFeePaid: false,
    walletBalanceUSD: 42.5,
  },
];

const ITEMS_PER_PAGE = 5;

// --- HELPER COMPONENT: USER MODAL ---

interface UserModalProps {
  user: User | null;
  mode: "view" | "edit";
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  user,
  mode,
  onClose,
  onSave,
}) => {
  // Initialize state with a full User object based on the input user
  const [formData, setFormData] = useState<User | null>(
    user
      ? {
          ...user,
          // Ensure boolean values are treated as booleans, not strings, if using uncontrolled inputs/selects
          isActive: user.isActive,
          activationFeePaid: user.activationFeePaid,
        }
      : null
  );

  if (!user || !formData) return null;

  const title =
    mode === "edit" ? `Edit User: ${user.name}` : `View User: ${user.name}`;
  const isEditMode = mode === "edit";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      if (!prev) return null;

      let finalValue: string | number | boolean = value;

      if (type === "checkbox") {
        finalValue = (e.target as HTMLInputElement).checked;
      } else if (name === "walletBalanceUSD") {
        // Parse as float, defaulting to 0 if invalid
        finalValue = parseFloat(value) || 0;
      } else if (name === "isActive") {
        // Convert string 'true'/'false' from select/input to boolean
        finalValue = value === "true";
      }

      return {
        ...prev,
        [name]: finalValue,
      } as User;
    });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  // Status Chip for clarity
  const StatusChip = ({
    label,
    isSuccess,
  }: {
    label: string;
    isSuccess: boolean;
  }) => (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        isSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {label}
    </span>
  );

  return (
    // Backdrop
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
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

        {/* Modal Body (Form/Details) */}
        <div className="p-6 space-y-4">
          {/* Email (Read-only) */}
          <div className="grid grid-cols-3 items-center">
            <label className="text-sm font-medium text-gray-600">Email:</label>
            <p className="col-span-2 text-sm text-gray-900 font-mono">
              {user.email}
            </p>
          </div>

          {/* Role (Read-only) */}
          <div className="grid grid-cols-3 items-center">
            <label className="text-sm font-medium text-gray-600">Role:</label>
            <p className="col-span-2">
              <span
                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === "Seller"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user.role}
              </span>
            </p>
          </div>

          {/* Wallet Balance (Editable) */}
          <div className="grid grid-cols-3 items-center">
            <label
              htmlFor="walletBalanceUSD"
              className="text-sm font-medium text-gray-600"
            >
              Wallet Balance (USD):
            </label>
            {isEditMode ? (
              <input
                id="walletBalanceUSD"
                type="number"
                name="walletBalanceUSD"
                value={formData.walletBalanceUSD}
                onChange={handleChange}
                step="0.01"
                className="col-span-2 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <p className="col-span-2 text-sm font-bold text-gray-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(user.walletBalanceUSD)}
              </p>
            )}
          </div>

          {/* Seller Activation Fee Status (Editable if Seller) */}
          {user.role === "Seller" && (
            <div className="grid grid-cols-3 items-center">
              <label
                htmlFor="activationFeePaid"
                className="text-sm font-medium text-gray-600"
              >
                Activation Fee Paid ($10):
              </label>
              {isEditMode ? (
                <input
                  id="activationFeePaid"
                  type="checkbox"
                  name="activationFeePaid"
                  checked={formData.activationFeePaid}
                  onChange={handleChange}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              ) : (
                <StatusChip
                  label={user.activationFeePaid ? "Paid" : "Pending"}
                  isSuccess={user.activationFeePaid}
                />
              )}
            </div>
          )}

          {/* Account Status (Active/Inactive) */}
          <div className="grid grid-cols-3 items-center">
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-600"
            >
              Account Status:
            </label>
            {isEditMode ? (
              <select
                id="isActive"
                name="isActive"
                // Ensure value matches expected type (string 'true' or 'false' for select)
                value={formData.isActive.toString()}
                onChange={handleChange}
                className="col-span-2 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="true">Active</option>
                <option value="false">Deactivated</option>
              </select>
            ) : (
              <StatusChip
                label={user.isActive ? "Active" : "Deactivated"}
                isSuccess={user.isActive}
              />
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

// --- MAIN COMPONENT: ALL USERS ---

const AllUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [sortBy, setSortBy] = useState<"id" | "name" | "role" | "balance">(
    "id"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  // Helper for currency formatting
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedUsers = useMemo(() => {
    let result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "role":
          comparison = a.role.localeCompare(b.role);
          break;
        case "balance":
          comparison = a.walletBalanceUSD - b.walletBalanceUSD;
          break;
        default: // 'id'
          comparison = a.id - b.id;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    // Recalculate total pages and ensure current page is valid after filter/sort
    const newTotalPages = Math.ceil(result.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1); // Stay on page 1 if no results
    }

    return result;
  }, [users, searchTerm, sortBy, sortOrder]); // Removed currentPage from dependency list as it causes a reset loop

  // --- Pagination Logic ---
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedUsers.slice(startIndex, endIndex);
  }, [filteredAndSortedUsers, currentPage]);

  // --- Handlers ---
  const handleSort = (column: "id" | "name" | "role" | "balance") => {
    setSortBy((prevCol) => {
      if (prevCol === column) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
      } else {
        setSortOrder("asc");
      }
      return column;
    });
  };

  const openModal = (user: User, mode: "view" | "edit") => {
    setSelectedUser(user);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSaveUser = useCallback((updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    closeModal();
  }, []);

  // Icon for sort direction
  const SortIndicator = ({
    column,
  }: {
    column: "id" | "name" | "role" | "balance";
  }) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? <span>&uarr;</span> : <span>&darr;</span>;
  };

  // Recalculate total pages for the footer display based on filtered results
  const currentTotalPages = Math.ceil(
    filteredAndSortedUsers.length / ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          User List ({filteredAndSortedUsers.length} of {mockUsers.length})
        </h3>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Define headers with explicit alignment for consistency */}
              {[
                { title: "ID", column: "id", align: "text-left" },
                { title: "Name / Email", column: "name", align: "text-left" },
                { title: "Role", column: "role", align: "text-center" }, // FIX: Header is now centered
                { title: "Fee Paid", column: "", align: "text-center" },
                {
                  title: "Wallet Balance (USD)",
                  column: "balance",
                  align: "text-right",
                }, // FIX: Header is now right-aligned
                { title: "Actions", column: "", align: "text-center" },
              ].map((header) => (
                <th
                  key={header.title}
                  // Use the explicit alignment defined above
                  className={`px-6 py-3 ${
                    header.align
                  } text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    header.column ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={() =>
                    header.column &&
                    handleSort(
                      header.column as "id" | "name" | "role" | "balance"
                    )
                  }
                >
                  {header.title}{" "}
                  {header.column && (
                    <SortIndicator
                      column={
                        header.column as "id" | "name" | "role" | "balance"
                      }
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-indigo-50/50 transition duration-75"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  {/* Role Data Cell - text-center */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "Seller"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  {/* Fee Paid Data Cell - text-center */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    {user.role === "Seller" ? (
                      <span
                        className={`font-bold ${
                          user.activationFeePaid
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {user.activationFeePaid ? "Yes" : "No"}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  {/* Wallet Balance Data Cell - text-right */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                    {formatCurrency(user.walletBalanceUSD)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() => openModal(user, "view")}
                      className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-xs font-medium transition duration-150 shadow-md"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openModal(user, "edit")}
                      className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg text-xs font-medium transition duration-150 shadow-md"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No users found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedUsers.length > ITEMS_PER_PAGE && (
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
                filteredAndSortedUsers.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium">{filteredAndSortedUsers.length}</span>{" "}
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

      {/* User Modal */}
      {isModalOpen && selectedUser && (
        <UserModal
          user={selectedUser}
          mode={modalMode}
          onClose={closeModal}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default AllUsers;
