import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  InputBase,
  Pagination,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Search, Refresh } from "@mui/icons-material";
import { toast } from "sonner"; // আপনার প্রোজেক্টে sonner আছে তাই এটি ব্যবহার করলাম

interface Seller {
  _id: string;
  name: string;
  email: string;
  role: string;
  accountCreationDate: string;
  phone?: string;
  status?: string;
  balance?: number;
  accountsSold?: number;
}

const SellerAccount: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const API_BASE_URL = "http://localhost:3200";

  // --- Fetch Data ---
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/user/getall`);
      const data = await response.json();
      let allUsers: Seller[] = [];

      if (Array.isArray(data)) {
        allUsers = data;
      } else if (data.users && Array.isArray(data.users)) {
        allUsers = data.users;
      }

      const onlySellers = allUsers.filter(
        (user) => user.role && user.role.toLowerCase() === "seller"
      );

      setSellers(onlySellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      toast.error("Failed to load sellers");
    } finally {
      setLoading(false);
    }
  };

  // --- Update Status Function ---
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/update-status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setSellers((prev) =>
          prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
        );
        toast.success(`Seller status updated to ${newStatus}`);
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // --- Search & Pagination ---
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sellers;
    return sellers.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s._id?.toLowerCase().includes(q)
    );
  }, [sellers, search]);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

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
          Seller Management ({filtered.length})
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Tooltip title="Refresh list">
            <IconButton
              onClick={() => {
                setPage(1);
                fetchSellers();
              }}
              sx={{
                width: 44, height: 44,
                background: "linear-gradient(135deg,#33ac6f,#2a8e5b)",
                color: "#fff",
                borderRadius: "12px",
                "&:hover": { transform: "translateY(-3px)", background: "#2a8e5b" },
              }}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ position: "relative", width: 320 }}>
            <Search sx={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#6B7280" }} />
            <InputBase
              placeholder="Search sellers..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              sx={{
                bgcolor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px",
                pl: 6, pr: 2, py: 1.2, width: "100%", transition: "all 0.2s",
                "&:focus-within": { borderColor: "#33ac6f", boxShadow: "0 0 0 3px rgba(51,172,111,0.1)" },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}><CircularProgress sx={{ color: "#33ac6f" }} /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                {["ID", "Name", "Email & Phone", "Joined", "Status", "Balance", "Action"].map((head) => (
                  <TableCell key={head} sx={{ fontWeight: 600, color: "#6B7280", fontSize: "12px", textTransform: "uppercase" }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((seller) => (
                <TableRow key={seller._id} hover>
                  <TableCell sx={{ fontSize: "12px", color: "#9CA3AF" }}>#{seller._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{seller.name}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{seller.email}</Typography>
                    <Typography variant="caption" color="green" sx={{ fontWeight: 700 }}>{seller.phone}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{new Date(seller.accountCreationDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block", px: 1.5, py: 0.5, borderRadius: "20px",
                        bgcolor: seller.status === "blocked" ? "#FEE2E2" : "#E8F9EE",
                        color: seller.status === "blocked" ? "#EF4444" : "#10B981",
                        fontSize: "11px", fontWeight: 800, textTransform: "uppercase"
                      }}
                    >
                      {seller.status || "active"}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: "#1F2A44" }}>${(seller.balance || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <select
                      value={seller.status || "active"}
                      onChange={(e) => handleStatusChange(seller._id, e.target.value)}
                      style={{
                        padding: "6px 10px", borderRadius: "8px", border: "1px solid #E5E7EB",
                        fontSize: "12px", fontWeight: "bold", cursor: "pointer", outline: "none"
                      }}
                    >
                      <option value="active">🟢 ACTIVE</option>
                      <option value="blocked">🔴 BLOCKED</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <Box sx={{ mt: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, p) => setPage(p)}
          sx={{
            "& .MuiPaginationItem-page.Mui-selected": {
              background: "linear-gradient(135deg, #33ac6f, #2a8e5b)", color: "#fff",
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default SellerAccount;