import { Edit, Search, Visibility } from "@mui/icons-material";
import { Refresh } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputBase,
  Paper,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
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
    fetch("http://localhost:3200/api/user/getall")
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
    fetch("http://localhost:3200/api/user/getall")
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
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h5" fontWeight={700} color="#1F2A44">
          All Users ({filteredAndSorted.length})
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title="Refresh list">
              <IconButton
                onClick={refresh}
                aria-label="refresh"
                sx={{
                  width: 44,
                  height: 44,
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "linear-gradient(135deg,#33ac6f,#2a8e5b)",
                  color: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 8px 20px rgba(51,172,111,0.18)",
                  transition: "all 0.18s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 28px rgba(51,172,111,0.26)",
                  },
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          <Box sx={{ position: "relative", width: 300 }}>
            <Search
              sx={{
                position: "absolute",
                left: 15,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6B7280",
              }}
            />
            <InputBase
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              sx={{
                bgcolor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                pl: 6,
                pr: 2,
                py: 1.2,
                width: "100%",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)",
                transition: "all 0.2s",
                "&:focus-within": {
                  borderColor: "#33ac6f",
                  boxShadow: "0 0 0 3px rgba(51,172,111,0.1)",
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: 2,
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress sx={{ color: "#33ac6f" }} />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                {["ID", "User Info", "Role", "Fee Paid", "Balance", "Actions"].map(
                  (header, i) => {
                    const key = ["_id", "name", "role", null, "balance", null][i] as typeof sortBy;
                    return (
                      <TableCell
                        key={header}
                        sx={{
                          fontWeight: 600,
                          color: "#6B7280",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          py: 2.5,
                          cursor: key ? "pointer" : "default",
                        }}
                        onClick={() => key && toggleSort(key)}
                      >
                        {header}
                      </TableCell>
                    );
                  }
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((user) => {
                const isSeller = user.role.toLowerCase() === "seller";
                return (
                  <TableRow key={user._id} hover>
                    <TableCell sx={{ fontSize: "13px", color: "#6B7280" }}>
                      {user._id.slice(0, 8)}...
                    </TableCell>
                    <TableCell sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: roleColor(user.role) }}>
                        {user.name[0]?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>{user.name}</Typography>
                        <Typography sx={{ fontSize: "12px", color: "#6B7280" }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "20px",
                          bgcolor: isSeller ? "#FFF8E6" : "#E8F9EE",
                          color: isSeller ? "#D1A148" : "#33ac6f",
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                      >
                        {user.role}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {isSeller ? (
                        <Typography sx={{ color: user.activationFeePaid ? "#33ac6f" : "#ef4444" }}>
                          {user.activationFeePaid ? "●" : "●"}
                        </Typography>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>
                      ${(user.balance || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton
                          onClick={() => setModal({ user, mode: "view" })}
                          sx={{ "&:hover": { bgcolor: "rgba(51,172,111,0.1)" } }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => setModal({ user, mode: "edit" })}
                          sx={{ "&:hover": { bgcolor: "rgba(209,161,72,0.1)" } }}
                        >
                          <Edit fontSize="small" sx={{ color: "#D1A148" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 6, color: "#9CA3AF" }}>
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination section */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, p) => setCurrentPage(p)}
            boundaryCount={15}
            siblingCount={1}
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "1rem",
                fontWeight: 500,
                minWidth: 44,
                height: 44,
                borderRadius: "12px",
                margin: "0 6px",
                color: "#4B5563",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "#E6F4EA",
                  color: "#33ac6f",
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 16px rgba(51, 172, 111, 0.2)",
                },
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                background: "linear-gradient(135deg, #33ac6f, #2a8e5b)",
                color: "#ffffff",
                fontWeight: 700,
                boxShadow: "0 8px 24px rgba(51, 172, 111, 0.35)",
                transform: "translateY(-3px)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2d9962, #257a50)",
                  boxShadow: "0 12px 28px rgba(51, 172, 111, 0.4)",
                },
              },
              "& .MuiPaginationItem-previousNext": {
                backgroundColor: "#ffffff",
                border: "1px solid #E5E7EB",
                color: "#6B7280",
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                  borderColor: "#33ac6f",
                  color: "#33ac6f",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#f9fafb",
                  color: "#9CA3AF",
                  borderColor: "#E5E7EB",
                },
              },
              "& .MuiPaginationItem-ellipsis": {
                color: "#9CA3AF",
                fontSize: "1.4rem",
                margin: "0 8px",
              },
            }}
          />
        )}

        <Typography variant="body2" color="#6B7280" sx={{ mt: 2.5, fontSize: "0.925rem", letterSpacing: "0.2px" }}>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> • {filteredAndSorted.length} total users
        </Typography>
      </Box>

      {modal && (
        <UserModal
          user={modal.user}
          mode={modal.mode}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </Box>
  );
};

export default AllUsers;