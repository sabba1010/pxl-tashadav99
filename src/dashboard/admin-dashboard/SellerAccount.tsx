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
  Chip,
  CircularProgress,
  InputBase,
  Pagination,
} from "@mui/material";
import { Search } from "@mui/icons-material";

// Interface matching your API response + UI specific fields
interface Seller {
  _id: string;
  name: string;
  email: string;
  role: string;
  accountCreationDate: string; // From API
  phone?: string;
  // Fields below are not in your API sample yet, added defaults for UI
  accountsSold?: number;
  status?: string;
  balance?: number;
}

const SellerAccount: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // --- Fetch and Filter Data ---
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3200/api/user/getall");
        const data = await response.json();
        console.log(data);
        let allUsers: Seller[] = [];

        // Handle different API response structures (array vs object)
        if (Array.isArray(data)) {
          allUsers = data;
        } else if (data.users && Array.isArray(data.users)) {
          allUsers = data.users;
        }

        // FILTER: Only keep users where role is "seller" (case-insensitive)
        const onlySellers = allUsers.filter(
          (user) => user.role && user.role.toLowerCase() === "seller"
        );

        setSellers(onlySellers);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

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
          Sellers ({filtered.length})
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ position: "relative", width: 320 }}>
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
              placeholder="Search sellers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
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

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress sx={{ color: "#33ac6f" }} />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            borderRadius: 2,
            background: "linear-gradient(145deg, #ffffff, #f8fafc)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                {[
                  "ID",
                  "Name",
                  "Email",
                  "Role",
                  "Joined",
                  "Accounts Sold",
                  "Status",
                  "Earnings",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: 600,
                      color: "#6B7280",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      py: 2.5,
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((seller) => (
                <TableRow key={seller._id} hover>
                  <TableCell sx={{ fontSize: "13px", color: "#6B7280" }}>
                    #{seller._id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{seller.name}</TableCell>
                  <TableCell sx={{ color: "#6B7280", fontSize: "14px" }}>{seller.email}</TableCell>
                  <TableCell>
                    <Box sx={{ px: 1.5, py: 0.5, borderRadius: "20px", bgcolor: "#E8F9EE", color: "#33ac6f", fontSize: "12px", fontWeight: 700 }}>
                      {seller.role}
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(seller.accountCreationDate).toLocaleDateString()}</TableCell>
                  <TableCell>{seller.accountsSold || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={seller.status || "Active"}
                      color={seller.status === "Active" || !seller.status ? "success" : "error"}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>${(seller.balance || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 6, color: "#9CA3AF" }}>
                    No sellers found.
                  </TableCell>
                </TableRow>
              )}
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

        <Typography variant="body2" color="#6B7280" sx={{ mt: 2.5, fontSize: "0.925rem", letterSpacing: "0.2px" }}>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong> • {filtered.length} total sellers
        </Typography>
      </Box>
    </Box>
  );
};

export default SellerAccount;
