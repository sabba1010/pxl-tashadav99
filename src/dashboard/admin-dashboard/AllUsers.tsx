import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, Tooltip, CircularProgress } from "@mui/material";
import {
  Edit,
  Visibility,
  Search,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

// User Interface based on your API Response
interface User {
  _id: string; // Changed from id: number
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  role: string; // "seller" or "buyer"
  accountCreationDate: string; // ISO Date string
  referralCode?: string;
  // UI Specific fields (Optional or Defaults applied in UI)
  isActive?: boolean;
  activationFeePaid?: boolean;
  walletBalanceUSD?: number;
}

const ITEMS_PER_PAGE = 10;

// User Modal (Upgraded with Glassmorphism)
const UserModal: React.FC<{
  user: User | null;
  mode: "view" | "edit";
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}> = ({ user, mode, onClose, onSave }) => {
  const [formData, setFormData] = useState<User | null>(
    user ? { ...user } : null
  );

  if (!user || !formData) return null;

  const isEditMode = mode === "edit";

  // Helper to handle role case sensitivity
  const isSeller = user.role.toLowerCase() === "seller";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let finalValue: string | number | boolean = value;

    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (name === "walletBalanceUSD") {
      finalValue = parseFloat(value) || 0;
    } else if (name === "isActive") {
      finalValue = value === "true";
    }

    setFormData((prev) =>
      prev ? ({ ...prev, [name]: finalValue } as User) : null
    );
  };

  const handleSave = () => {
    if (formData) onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-white/20 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-2xl font-bold text-gray-800">
            {mode === "edit" ? `Edit ${user.name}` : `View ${user.name}`}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <svg
              className="h-6 w-6 text-gray-600"
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

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: isSeller ? "#D1A148" : "#33ac6f",
              }}
            >
              {user.name[0]?.toUpperCase()}
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400">
                {user.countryCode} {user.phone}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Role
              </label>
              <p
                className={`px-3 py-1 rounded-full text-xs font-semibold inline-block capitalize ${
                  isSeller
                    ? "bg-[#D1A148]/20 text-[#D1A148]"
                    : "bg-[#33ac6f]/20 text-[#33ac6f]"
                }`}
              >
                {user.role}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Status
              </label>
              <p
                className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                  user.isActive !== false
                    ? "bg-[#33ac6f]/20 text-[#33ac6f]"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.isActive !== false ? "Active" : "Inactive"}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Wallet Balance (USD)
            </label>
            {isEditMode ? (
              <input
                type="number"
                name="walletBalanceUSD"
                value={formData.walletBalanceUSD || 0}
                onChange={handleChange}
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-[#33ac6f] focus:border-[#33ac6f] transition"
              />
            ) : (
              <p className="text-xl font-bold text-gray-800">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(user.walletBalanceUSD || 0)}
              </p>
            )}
          </div>

          {isSeller && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Activation Fee Paid
              </label>
              {isEditMode ? (
                <input
                  type="checkbox"
                  name="activationFeePaid"
                  checked={formData.activationFeePaid || false}
                  onChange={handleChange}
                  className="h-5 w-5 text-[#33ac6f] border-gray-300 rounded focus:ring-[#33ac6f]"
                />
              ) : (
                <p
                  className={`font-semibold ${
                    user.activationFeePaid ? "text-[#33ac6f]" : "text-red-600"
                  }`}
                >
                  {user.activationFeePaid ? "Paid" : "Pending"}
                </p>
              )}
            </div>
          )}

          <div className="pt-2 text-xs text-gray-400">
            Account Created:{" "}
            {new Date(user.accountCreationDate).toLocaleDateString()} <br />
            User ID: <span className="font-mono">{user._id}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50/80 flex justify-end space-x-4 border-t border-gray-200/50">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
          >
            {isEditMode ? "Cancel" : "Close"}
          </button>
          {isEditMode && (
            <button
              onClick={handleSave}
              className="px-6 py-3 text-white bg-gradient-to-r from-[#33ac6f] to-[#2d8f5a] rounded-xl hover:opacity-90 transition shadow-md"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main AllUsers Component
const AllUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<
    "_id" | "name" | "role" | "walletBalanceUSD"
  >("_id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [currentPage, setCurrentPage] = useState(1);

  // --- FETCH DATA ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://vps-backend-server-beta.vercel.app/api/user/getall");
      const data = await response.json();

      // Ensure data is array, if your API wraps it in { users: [...] } adjust accordingly
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error("Unexpected API response format", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.phone.includes(searchTerm)
      ),
    [users, searchTerm]
  );

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let comp = 0;
      switch (sortBy) {
        case "name":
          comp = a.name.localeCompare(b.name);
          break;
        case "role":
          comp = a.role.localeCompare(b.role);
          break;
        case "walletBalanceUSD":
          comp = (a.walletBalanceUSD || 0) - (b.walletBalanceUSD || 0);
          break;
        default: // _id
          comp = a._id.localeCompare(b._id);
      }
      return sortOrder === "asc" ? comp : -comp;
    });
  }, [filteredUsers, sortBy, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedUsers, currentPage]);

  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const openModal = (user: User, mode: "view" | "edit") => {
    setSelectedUser(user);
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleSave = useCallback((updated: User) => {
    // In real app, call API update here (e.g., PUT /api/user/update)
    // For now, update local state
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
    setModalOpen(false);
  }, []);

  // Helper for role color logic
  const getRoleColor = (role: string) =>
    role.toLowerCase() === "seller" ? "#D1A148" : "#33ac6f";
  const isSeller = (role: string) => role.toLowerCase() === "seller";

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-md border border-white/20">
        <h2 className="text-xl font-bold text-gray-800">
          All Users ({sortedUsers.length})
        </h2>

        <div className="flex gap-2">
          <button
            onClick={fetchUsers}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            title="Refresh Data"
          >
            ↻
          </button>
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fontSize="small"
            />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-[#33ac6f] focus:border-[#33ac6f] transition"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress style={{ color: "#33ac6f" }} />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-white">
              <tr>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("_id")}
                >
                  ID{" "}
                  {sortBy === "_id" &&
                    (sortOrder === "asc" ? (
                      <ArrowUpward fontSize="small" />
                    ) : (
                      <ArrowDownward fontSize="small" />
                    ))}
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  User Info{" "}
                  {sortBy === "name" &&
                    (sortOrder === "asc" ? (
                      <ArrowUpward fontSize="small" />
                    ) : (
                      <ArrowDownward fontSize="small" />
                    ))}
                </th>
                <th
                  className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Role{" "}
                  {sortBy === "role" &&
                    (sortOrder === "asc" ? (
                      <ArrowUpward fontSize="small" />
                    ) : (
                      <ArrowDownward fontSize="small" />
                    ))}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">
                  Fee Paid
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("walletBalanceUSD")}
                >
                  Balance{" "}
                  {sortBy === "walletBalanceUSD" &&
                    (sortOrder === "asc" ? (
                      <ArrowUpward fontSize="small" />
                    ) : (
                      <ArrowDownward fontSize="small" />
                    ))}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono text-xs">
                    {user._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: getRoleColor(user.role),
                        }}
                      >
                        {user.name[0]?.toUpperCase()}
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        isSeller(user.role)
                          ? "bg-[#D1A148]/20 text-[#D1A148]"
                          : "bg-[#33ac6f]/20 text-[#33ac6f]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isSeller(user.role) ? (
                      <Tooltip
                        title={user.activationFeePaid ? "Paid" : "Pending"}
                      >
                        <span
                          className={`font-semibold ${
                            user.activationFeePaid
                              ? "text-[#33ac6f]"
                              : "text-red-500"
                          }`}
                        >
                          {user.activationFeePaid ? "Yes" : "No"}
                        </span>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(user.walletBalanceUSD || 0)}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <Tooltip title="View">
                      <button
                        onClick={() => openModal(user, "view")}
                        className="p-2 rounded-lg bg-[#33ac6f]/10 hover:bg-[#33ac6f]/20 transition"
                      >
                        <Visibility
                          fontSize="small"
                          className="text-[#33ac6f]"
                        />
                      </button>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <button
                        onClick={() => openModal(user, "edit")}
                        className="p-2 rounded-lg bg-[#D1A148]/10 hover:bg-[#D1A148]/20 transition"
                      >
                        <Edit fontSize="small" className="text-[#D1A148]" />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-md border border-white/20">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, sortedUsers.length)} of{" "}
            {sortedUsers.length}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-xl ${
                  currentPage === i + 1
                    ? "bg-[#33ac6f] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedUser && (
        <UserModal
          user={selectedUser}
          mode={modalMode}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AllUsers;
