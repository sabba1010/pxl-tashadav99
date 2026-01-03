import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Box,
  Paper,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
interface WithdrawalRequest {
  _id: string;
  paymentMethod: string;
  amount: string;
  currency: string;
  accountNumber: string;
  bankCode: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  note: string; // User's original note
  status: string; // "pending", "success", "declined"
  createdAt: string;
  adminNote?: string; // If previously declined/commented
}

const ITEMS_PER_PAGE = 10;

// --- COMPONENT: WITHDRAWAL MODAL ---

interface WithdrawalModalProps {
  request: WithdrawalRequest | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string, reason?: string) => void;
  updating: boolean;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  request,
  onClose,
  onUpdateStatus,
  updating,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [declineReason, setDeclineReason] = useState<string>("");

  useEffect(() => {
    if (request) {
      setSelectedStatus(request.status === "success" ? "approved" : request.status);
      setDeclineReason(request.adminNote || "");
    }
  }, [request]);

  if (!request) return null;

  return (
    <Dialog open={!!request} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#F9FAFB", color: "#1F2A44", fontWeight: 700 }}>
        Review Request
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "#6B46C1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
            Requested Amount
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: "#5B21B6" }}>
            {request.amount} <Typography component="span" sx={{ fontSize: "1rem", fontWeight: 500 }}>{request.currency}</Typography>
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid #F3F4F6" }}>
            <Typography variant="body2" color="#6B7280">Transaction ID</Typography>
            <Typography variant="body2" color="#1F2A44" sx={{ fontFamily: "monospace" }}>{request._id}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid #F3F4F6" }}>
            <Typography variant="body2" color="#6B7280">User Email</Typography>
            <Typography variant="body2" color="#1F2A44">{request.email}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid #F3F4F6" }}>
            <Typography variant="body2" color="#6B7280">Full Name</Typography>
            <Typography variant="body2" color="#1F2A44">{request.fullName || "N/A"}</Typography>
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: "#F8FAFF", borderRadius: 1, border: "1px solid #EEF2FF" }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Banking Details</Typography>
            <Typography variant="body2">Method: {request.paymentMethod}</Typography>
            <Typography variant="body2">Acc Num: {request.accountNumber}</Typography>
            <Typography variant="body2">Bank Code: {request.bankCode}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, mt: 2 }}>
            <Typography variant="body2" color="#6B7280">Submitted At</Typography>
            <Typography variant="body2" color="#1F2A44">{new Date(request.createdAt).toLocaleString()}</Typography>
          </Box>
        </Box>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} displayEmpty>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="declined">Declined</MenuItem>
          </Select>
        </FormControl>

        {selectedStatus === "declined" && (
          <TextField fullWidth multiline rows={3} sx={{ mt: 2 }} placeholder="Reason for rejection" value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} />
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button
          variant="contained"
          disabled={updating || (selectedStatus === "declined" && !declineReason.trim())}
          onClick={() => onUpdateStatus(request._id, selectedStatus, declineReason)}
          sx={{ backgroundColor: "#6B21B6", '&:hover': { backgroundColor: '#581C87' } }}
        >
          {updating ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// --- MAIN PAGE COMPONENT ---

const WithdrawalRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawalRequest | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://vps-backend-server-beta.vercel.app/withdraw/getall");
      const data = await response.json();
      if (Array.isArray(data)) setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // --- CORE LOGIC: SEND 'success' TO BACKEND ---
  const handleUpdateStatus = useCallback(
    async (id: string, newStatus: string, reason?: string) => {
      setActionLoading(true);

      // LOGIC FIX: If user selected "approved", we change payload to "success"
      const statusPayload = newStatus === "approved" ? "success" : newStatus;

      try {
        console.log(
          `Sending to Backend -> ID: ${id}, Status: ${statusPayload}`
        );

        const response = await fetch(
          `https://vps-backend-server-beta.vercel.app/withdraw/approve/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: statusPayload, // Sending "success" directly to backend
              note: reason,
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          // Update Local State with 'success'
          setRequests((prevRequests) =>
            prevRequests.map((r) =>
              r._id === id
                ? { ...r, status: statusPayload, adminNote: reason }
                : r
            )
          );
          setIsModalOpen(false);
        } else {
          alert(`Failed: ${result.message}`);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Network error.");
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  const openModal = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(
      (r) =>
        (r._id && r._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.status && r.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [requests, searchTerm]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE));

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "approved" || s === "success")
      return "bg-green-100 text-green-700 border-green-200";
    if (s === "declined" || s === "failed")
      return "bg-red-100 text-red-700 border-red-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

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
          Withdrawals ({filteredRequests.length})
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ position: "relative", width: 360 }}>
            <Search sx={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#6B7280" }} />
            <InputBase
              placeholder="Search..."
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

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, background: "linear-gradient(145deg, #ffffff, #f8fafc)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress sx={{ color: "#33ac6f" }} />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                {["Date", "User", "Method", "Amount", "Status", "Action"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: "#6B7280", fontSize: "12px", textTransform: "uppercase", py: 2.5 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.map((r) => (
                <TableRow key={r._id} hover sx={{ "&:hover": { background: "rgba(51,172,111,0.03)" } }}>
                  <TableCell sx={{ fontSize: "13px", color: "#6B7280" }}>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "#1F2A44" }}>{r.email}</TableCell>
                  <TableCell sx={{ color: "#6B7280" }}>{r.paymentMethod}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1F2A44" }}>{r.amount} {r.currency}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: "20px", bgcolor: r.status.toLowerCase() === "success" || r.status.toLowerCase() === "approved" ? "#E8F9EE" : r.status.toLowerCase() === "declined" ? "#FFEBEB" : "#FFF7ED", color: r.status.toLowerCase() === "success" || r.status.toLowerCase() === "approved" ? "#16A34A" : r.status.toLowerCase() === "declined" ? "#DC2626" : "#92400E", fontSize: "12px", fontWeight: 700, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>{r.status.toUpperCase()}</Box>
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openModal(r)} sx={{ textTransform: "none", bgcolor: "transparent", color: "#6B21B6", borderRadius: 1, border: "1px solid rgba(107,33,182,0.08)", px: 2, py: 0.5 }}>Review</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      (
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

          <Typography
            variant="body2"
            color="#6B7280"
            sx={{ mt: 2.5, fontSize: "0.925rem", letterSpacing: "0.2px" }}
          >
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> • {filteredRequests.length} total withdrawals
          </Typography>
        </Box>

        {isModalOpen && (
          <WithdrawalModal
            request={selectedRequest}
            onClose={closeModal}
            onUpdateStatus={handleUpdateStatus}
            updating={actionLoading}
          />
        )}
    </Box>
  );
};

export default WithdrawalRequests;
