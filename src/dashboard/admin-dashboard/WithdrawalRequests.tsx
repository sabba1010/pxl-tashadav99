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
  note: string;
  status: string;
  createdAt: string;
  adminNote?: string;

  sellerReportsCount: number;
  unfinishedOrdersCount: number;
  hasBlockingIssues: boolean;
}

const ITEMS_PER_PAGE = 10;

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

  const canApprove = !request.hasBlockingIssues;

  return (
    <Dialog open={!!request} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#F9FAFB",
          color: "#1F2A44",
          fontWeight: 700,
        }}
      >
        Review Withdrawal Request
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {request.hasBlockingIssues && (
          <Box sx={{ mb: 3, p: 2.5, bgcolor: "#fef2f2", border: "2px solid #fecaca", borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#991b1b", mb: 1.5 }}>
              WITHDRAWAL BLOCKED
            </Typography>
            {request.unfinishedOrdersCount > 0 && (
              <Typography sx={{ mb: 1, color: "#444" }}>
                • <strong>{request.unfinishedOrdersCount}</strong> unfinished order
                {request.unfinishedOrdersCount !== 1 ? "s" : ""}
              </Typography>
            )}
            {request.sellerReportsCount > 0 && (
              <Typography sx={{ mb: 1, color: "#444" }}>
                • <strong>{request.sellerReportsCount}</strong> open dispute
                {request.sellerReportsCount !== 1 ? "s" : ""}/report
                {request.sellerReportsCount !== 1 ? "s" : ""}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="caption" color="#6B46C1" fontWeight={700} textTransform="uppercase">
            Requested Amount
          </Typography>
          <Typography variant="h4" fontWeight={800} mt={1} color="#5B21B6">
            {request.amount} <Typography component="span" fontSize="1.1rem">{request.currency}</Typography>
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as string)}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved" disabled={!canApprove}>
              Approve & Pay
            </MenuItem>
            <MenuItem value="declined">Decline</MenuItem>
          </Select>
        </FormControl>

        {selectedStatus === "declined" && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Decline Reason (required)"
            placeholder="Please provide reason for declining..."
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            sx={{ mt: 2 }}
            error={selectedStatus === "declined" && !declineReason.trim()}
            helperText={
              selectedStatus === "declined" && !declineReason.trim()
                ? "Reason is required"
                : ""
            }
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          color={selectedStatus === "declined" ? "error" : "primary"}
          disabled={
            updating ||
            (selectedStatus === "declined" && !declineReason.trim()) ||
            (selectedStatus === "approved" && !canApprove)
          }
          onClick={() => onUpdateStatus(request._id, selectedStatus, declineReason)}
        >
          {updating ? "Saving..." : selectedStatus === "declined" ? "Decline" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const WithdrawalRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Main withdrawals
      const withdrawRes = await fetch("https://vps-backend-server-beta.vercel.app/withdraw/getall");
      if (!withdrawRes.ok) throw new Error("Withdrawals fetch failed");
      const withdrawData = await withdrawRes.json();

      if (!Array.isArray(withdrawData)) throw new Error("Invalid withdrawal data");

      // Purchases
      const purchasesRes = await fetch("https://vps-backend-server-beta.vercel.app/purchase/getall");
      const purchases = purchasesRes.ok ? await purchasesRes.json() : [];

      // Reports
      const reportsRes = await fetch("https://vps-backend-server-beta.vercel.app/purchase/report/getall");
      const reports = reportsRes.ok ? await reportsRes.json() : [];

      const unfinishedMap = new Map<string, number>();
      (purchases as any[]).forEach((p: any) => {
        const seller = (p.sellerEmail || p.seller || "").toLowerCase().trim();
        const status = (p.status || "").toLowerCase();
        if (seller && !["completed", "delivered", "success"].includes(status)) {
          unfinishedMap.set(seller, (unfinishedMap.get(seller) || 0) + 1);
        }
      });

      const reportsMap = new Map<string, number>();
      (reports as any[]).forEach((r: any) => {
        const seller = (r.sellerEmail || "").toLowerCase().trim();
        if (seller) {
          reportsMap.set(seller, (reportsMap.get(seller) || 0) + 1);
        }
      });

      const enriched = (withdrawData as any[]).map((req: any) => {
        const email = (req.email || "").toLowerCase().trim();
        const unfinished = unfinishedMap.get(email) || 0;
        const reportsCount = reportsMap.get(email) || 0;

        return {
          ...req,
          sellerReportsCount: reportsCount,
          unfinishedOrdersCount: unfinished,
          hasBlockingIssues: unfinished > 0 || reportsCount > 0,
        } as WithdrawalRequest;
      });

      setRequests(enriched);
    } catch (error) {
      console.error("Error loading withdrawal requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = useCallback(
    async (id: string, newStatus: string, reason?: string) => {
      setActionLoading(true);
      const payloadStatus = newStatus === "approved" ? "success" : newStatus;

      try {
        const res = await fetch(`https://vps-backend-server-beta.vercel.app/withdraw/approve/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: payloadStatus,
            note: reason || "",
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to update status");
        }

        const updated = await res.json();

        setRequests((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, status: payloadStatus, adminNote: reason || "" } : r
          )
        );

        setSelectedRequest(null);
      } catch (err) {
        console.error("Status update failed:", err);
        alert("Failed to update withdrawal status");
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  const filteredRequests = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return requests.filter(
      (r) =>
        r._id?.toLowerCase().includes(term) ||
        r.email?.toLowerCase().includes(term) ||
        r.status?.toLowerCase().includes(term)
    );
  }, [requests, searchTerm]);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE) || 1;

  return (
    <Box sx={{ p: 4, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={700}>
            Withdrawal Requests ({filteredRequests.length})
          </Typography>

          <Box sx={{ position: "relative", width: 360 }}>
            <Search
              sx={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "text.secondary" }}
            />
            <InputBase
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              sx={{
                width: "100%",
                bgcolor: "white",
                border: "1px solid #ddd",
                borderRadius: 2,
                pl: 6,
                pr: 2,
                py: 1,
              }}
            />
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Seller</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reports</TableCell>
                <TableCell>Unfinished</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{req.email}</TableCell>
                  <TableCell>{req.paymentMethod}</TableCell>
                  <TableCell>{req.amount} {req.currency}</TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell>{req.sellerReportsCount || 0}</TableCell>
                  <TableCell>{req.unfinishedOrdersCount || 0}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={req.hasBlockingIssues || actionLoading}
                      onClick={() => setSelectedRequest(req)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {!loading && filteredRequests.length > 0 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}

      {selectedRequest && (
        <WithdrawalModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateStatus}
          updating={actionLoading}
        />
      )}
    </Box>
  );
};

export default WithdrawalRequests;