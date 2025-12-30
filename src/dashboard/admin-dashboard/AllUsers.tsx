import {
  ArrowDownward,
  ArrowUpward,
  Edit,
  Search,
  Visibility,
} from "@mui/icons-material";
import { Tooltip, CircularProgress, Avatar } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  role: string;
  accountCreationDate: string;
  referralCode?: string;
  isActive?: boolean;
  activationFeePaid?: boolean;
  balance?: number;
}

const ITEMS_PER_PAGE = 10;

const UserModal: React.FC<{
  user: User;
  mode: "view" | "edit";
  onClose: () => void;
  onSave: (user: User) => void;
}> = ({ user, mode, onClose, onSave }) => {
  const [formData, setFormData] = useState(user);
  const isEdit = mode === "edit";
  const isSeller = user.role.toLowerCase() === "seller";
  const roleColor = isSeller ? "#D1A148" : "#33ac6f";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : name === "balance" ? +value : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-lg w-full border border-white/20">
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-2xl font-bold">
            {isEdit ? "Edit" : "View"} {user.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar sx={{ width: 56, height: 56, bgcolor: roleColor }}>
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
              <label className="text-sm font-medium text-gray-600">Role</label>
              <p
                className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold inline-block capitalize bg-${
                  isSeller ? "[#D1A148]" : "[#33ac6f]"
                }/20 text-${isSeller ? "[#D1A148]" : "[#33ac6f]"}`}
              >
                {user.role}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Status
              </label>
              <p
                className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
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
            <label className="text-sm font-medium text-gray-600">
              Wallet Balance (USD)
            </label>
            {isEdit ? (
              <input
                type="number"
                name="balance"
                value={formData.balance || 0}
                onChange={handleChange}
                step="0.01"
                className="w-full mt-1 p-3 border rounded-xl focus:ring-[#33ac6f] focus:border-[#33ac6f]"
              />
            ) : (
              <p className="text-xl font-bold mt-1">
                ${(user.balance || 0).toFixed(2)}
              </p>
            )}
          </div>

          {isSeller && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Activation Fee Paid
              </label>
              {isEdit ? (
                <input
                  type="checkbox"
                  name="activationFeePaid"
                  checked={formData.activationFeePaid || false}
                  onChange={handleChange}
                  className="ml-3 h-5 w-5 text-[#33ac6f] rounded"
                />
              ) : (
                <p
                  className={`font-semibold mt-1 ${
                    user.activationFeePaid ? "text-[#33ac6f]" : "text-red-600"
                  }`}
                >
                  {user.activationFeePaid ? "Paid" : "Pending"}
                </p>
              )}
            </div>
          )}

          <div className="text-xs text-gray-400 pt-2">
            Created: {new Date(user.accountCreationDate).toLocaleDateString()}
            <br />
            ID: <span className="font-mono">{user._id}</span>
          </div>
        </div>

        <div className="p-6 bg-gray-50/80 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border rounded-xl hover:bg-gray-100"
          >
            {isEdit ? "Cancel" : "Close"}
          </button>
          {isEdit && (
            <button
              onClick={() => onSave(formData)}
              className="px-6 py-3 bg-[#33ac6f] text-white rounded-xl hover:opacity-90"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof User | "balance">("_id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<{
    user: User;
    mode: "view" | "edit";
  } | null>(null);

  useEffect(() => {
    fetch("https://vps-backend-server-beta.vercel.app/api/user/getall")
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : data.users || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm)
    );

    result.sort((a, b) => {
      let av = a[sortBy as keyof User] ?? 0;
      let bv = b[sortBy as keyof User] ?? 0;
      if (sortBy === "balance") {
        av = a.balance || 0;
        bv = b.balance || 0;
      }
      if (typeof av === "string")
        return sortOrder === "asc"
          ? av.localeCompare(bv as string)
          : (bv as string).localeCompare(av);
      return sortOrder === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });

    return result;
  }, [users, searchTerm, sortBy, sortOrder]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, currentPage]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);

  const toggleSort = (key: typeof sortBy) => {
    if (sortBy === key) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const refresh = () => {
    setLoading(true);
    fetch("https://vps-backend-server-beta.vercel.app/api/user/getall")
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : data.users || []))
      .finally(() => setLoading(false));
  };

  const handleSave = (updated: User) => {
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
    setModal(null);
  };

  const roleColor = (role: string) =>
    role.toLowerCase() === "seller" ? "#D1A148" : "#33ac6f";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-4 rounded-2xl">
        <h2 className="text-xl font-bold">
          All Users ({filteredAndSorted.length})
        </h2>
        <div className="flex gap-3">
          <button
            onClick={refresh}
            className="p-2 rounded-lg hover:bg-gray-200"
          >
            ↻
          </button>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fontSize="small"
            />
            <input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-xl focus:ring-[#33ac6f] focus:border-[#33ac6f] w-64"
            />
          </div>
        </div>
      </div>

      <div className="">
        {loading ? (
          <div className="flex justify-center py-20">
            <CircularProgress style={{ color: "#33ac6f" }} />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID",
                  "User Info",
                  "Role",
                  "Fee Paid",
                  "Balance",
                  "Actions",
                ].map((header, i) => {
                  const key = ["_id", "name", "role", null, "balance", null][
                    i
                  ] as typeof sortBy;
                  return (
                    <th
                      key={header}
                      className={`px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase ${
                        key ? "cursor-pointer" : ""
                      }`}
                      onClick={() => key && toggleSort(key)}
                    >
                      {header}
                      {key &&
                        sortBy === key &&
                        (sortOrder === "asc" ? (
                          <ArrowUpward fontSize="small" />
                        ) : (
                          <ArrowDownward fontSize="small" />
                        ))}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => {
                const isSeller = user.role.toLowerCase() === "seller";
                return (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono">
                      {user._id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: roleColor(user.role),
                          }}
                        >
                          {user.name[0]?.toUpperCase()}
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize bg-${roleColor(
                          user.role
                        )}/20 text-[${roleColor(user.role)}]`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isSeller ? (
                        <span
                          className={
                            user.activationFeePaid
                              ? "text-[#33ac6f]"
                              : "text-red-500"
                          }
                        >
                          ●
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      ${(user.balance || 0).toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Tooltip title="View">
                        <button
                          onClick={() => setModal({ user, mode: "view" })}
                          className="p-2 rounded hover:bg-[#33ac6f]/20"
                        >
                          <Visibility
                            fontSize="small"
                            className="text-[#33ac6f]"
                          />
                        </button>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <button
                          onClick={() => setModal({ user, mode: "edit" })}
                          className="p-2 rounded hover:bg-[#D1A148]/20"
                        >
                          <Edit fontSize="small" className="text-[#D1A148]" />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 bg-white/80 backdrop-blur p-4 rounded-2xl">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-xl ${
                currentPage === i + 1
                  ? "bg-[#33ac6f] text-white"
                  : "bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {modal && (
        <UserModal
          user={modal.user}
          mode={modal.mode}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AllUsers;
