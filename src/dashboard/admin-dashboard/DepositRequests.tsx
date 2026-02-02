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
  tx_ref?: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string;
  createdAt: string;
  credited: boolean;
}

const ITEMS_PER_PAGE = 15;

/* ====================== API FUNCTIONS ====================== */
const fetchPayments = async (): Promise<Payment[]> => {
  const response = await axios.get("http://localhost:3200/api/payments");
  return response.data as Payment[];
};

/* ====================== MAIN COMPONENT ====================== */
const DepositRequests: React.FC = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy] = useState<"createdAt">("createdAt");
  const [sortOrder] = useState<"desc" | "asc">("desc"); // Default set to desc (Latest first)
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
    refetchInterval: 5000,
  });

  // Client-side filtering & sorting
  const filteredAndSorted = useMemo(() => {
    // Search logic with safe checks to prevent errors
    let filtered = payments.filter((p) => {
      const search = searchTerm.toLowerCase();
      return (
        p._id?.toLowerCase().includes(search) ||
        String(p.transactionId || "").toLowerCase().includes(search) ||
        p.customerEmail?.toLowerCase().includes(search) ||
        p.status?.toLowerCase().includes(search) ||
        (p.tx_ref && p.tx_ref.toLowerCase().includes(search))
      );
    });

    // Sorting logic (Latest First by default)
    filtered.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });

    return filtered;
  }, [payments, searchTerm, sortOrder]);

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

  if (isError) {
    return <div className="p-10 text-red-600">Error: {(error as Error)?.message}</div>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3, mb: 4, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "linear-gradient(145deg, #ffffff, #f8fafc)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h5" fontWeight={700} color="#1F2A44">
          Payments ({filteredAndSorted.length})
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Tooltip title="Refresh payments">
            <IconButton
              onClick={() => queryClient.invalidateQueries({ queryKey: ["payments"] })}
              sx={{
                width: 44, height: 44, background: "linear-gradient(135deg,#33ac6f,#2a8e5b)",
                color: "#fff", borderRadius: "12px", boxShadow: "0 8px 20px rgba(51,172,111,0.18)",
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
                bgcolor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", pl: 6, pr: 2, py: 1.2, width: "100%",
                "&:focus-within": { borderColor: "#33ac6f", boxShadow: "0 0 0 3px rgba(51,172,111,0.1)" },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress sx={{ color: "#33ac6f" }} /></Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                {["Customer Email", "Platform", "Submitted", "Trx ID", "Amount", "Status", "Credited"].map((head) => (
                  <TableCell key={head} sx={{ fontWeight: "600", color: "#6B7280", fontSize: "12px", textTransform: "uppercase", py: 2.5 }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length > 0 ? (
                paginated.map((p) => {
                  const isFlutterwave = p.tx_ref?.toLowerCase().startsWith("flw");
                  const platformName = isFlutterwave ? "Flutterwave" : "Korta Pay";

                  return (
                    <TableRow key={p._id} hover sx={{ "&:hover": { background: "rgba(51,172,111,0.03)" } }}>
                      <TableCell sx={{ fontSize: "13px", color: "#6B7280", fontWeight: 600 }}>{p.customerEmail}</TableCell>

                      <TableCell>
                        <Box sx={{
                          display: "inline-block", px: 1.5, py: 0.5, borderRadius: "6px", fontSize: "11px", fontWeight: "bold",
                          bgcolor: isFlutterwave ? "#eff6ff" : "#f5f3ff", color: isFlutterwave ? "#2563eb" : "#7c3aed"
                        }}>
                          {platformName}
                        </Box>
                      </TableCell>

                      <TableCell sx={{ color: "#4B5563" }}>{new Date(p.createdAt).toLocaleString()}</TableCell>
                      <TableCell sx={{ fontFamily: "monospace", color: "#6B7280" }}>{String(p.transactionId)}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(p.amount, p.currency)}</TableCell>
                      <TableCell>
                        <Box sx={{
                          display: "inline-block", px: 1.5, py: 0.5, borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                          bgcolor: p.status.toLowerCase() === "successful" ? "#E8F9EE" : "#F3F4F6",
                          color: p.status.toLowerCase() === "successful" ? "#16A34A" : "#374151"
                        }}>
                          {p.status}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: p.credited ? "#16A34A" : "#DC2626", fontWeight: 700 }}>{p.credited ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow><TableCell colSpan={7} sx={{ py: 6, textAlign: "center", color: "#9CA3AF" }}>No payments found.</TableCell></TableRow>
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
            size="large"
            sx={{
              "& .MuiPaginationItem-page.Mui-selected": {
                background: "linear-gradient(135deg, #33ac6f, #2a8e5b)", color: "#ffffff",
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default DepositRequests;