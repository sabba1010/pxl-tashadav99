import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Tooltip,
  Pagination,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { Search, Refresh } from "@mui/icons-material";

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

const ITEMS_PER_PAGE = 15;

/* ====================== API FUNCTIONS ====================== */
const fetchPayments = async (): Promise<Payment[]> => {
  const response = await axios.get("http://localhost:3200/api/payments");
  return response.data as Payment[]; // assuming the endpoint returns an array directly
};

/* ====================== MAIN COMPONENT ====================== */
const DepositRequests: React.FC = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "amount" | "status" | "customerEmail"
  >("createdAt");
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
        String(p.transactionId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
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
          comp =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress sx={{ color: "#33ac6f" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      {/* Header */}
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
          Payments ({filteredAndSorted.length})
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Tooltip title="Refresh payments">
            <IconButton
              onClick={() => queryClient.refetchQueries({ queryKey: ["payments"] })}
              sx={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg,#33ac6f,#2a8e5b)",
                color: "#fff",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(51,172,111,0.18)",
                "&:hover": { transform: "translateY(-3px)" },
              }}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ position: "relative", width: 360 }}>
            <Search sx={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#6B7280" }} />
            <InputBase
              placeholder="Search ID, Trx ID, email..."
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

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: 2,
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress sx={{ color: "#33ac6f" }} />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                {[
                  "Customer Email",
                  "Submitted",
                  "Trx ID",
                  "Amount",
                  "Status",
                  "Credited",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: "600",
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
              {paginated.length > 0 ? (
                paginated.map((p) => (
                  <TableRow
                    key={p._id}
                    hover
                    sx={{
                      "&:hover": { background: "rgba(51,172,111,0.03)" },
                    }}
                  >
                    <TableCell sx={{ fontSize: "13px", color: "#6B7280", fontWeight: 600 }}>
                      {p.customerEmail}
                    </TableCell>
                    <TableCell sx={{ color: "#4B5563" }}>{new Date(p.createdAt).toLocaleString()}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", color: "#6B7280" }}>{String(p.transactionId)}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(p.amount, p.currency)}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "20px",
                          bgcolor: p.status.toLowerCase() === "successful" ? "#E8F9EE" : "#F3F4F6",
                          color: p.status.toLowerCase() === "successful" ? "#16A34A" : "#374151",
                          fontSize: "12px",
                          fontWeight: "700",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        {p.status}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: p.credited ? "#16A34A" : "#DC2626", fontWeight: 700 }}>{p.credited ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 6, textAlign: "center", color: "#9CA3AF" }}>
                    No payments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ mt: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
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

          <Typography variant="body2" color="#6B7280" sx={{ mt: 2.5, fontSize: "0.925rem", letterSpacing: "0.2px" }}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> • {filteredAndSorted.length} total payments
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DepositRequests;
