import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box, Paper, InputBase, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Pagination, Typography, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  FormControl, Select, MenuItem, TextField, IconButton, Tooltip, Stack
} from "@mui/material";
import { Search, Close, Refresh, Visibility } from "@mui/icons-material";

/* ================= TYPES ================= */
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
  bankName?: string;
  sellerReportsCount: number;
  unfinishedOrdersCount: number;
  hasBlockingIssues: boolean;
  sellerReports?: any[];
  unfinishedOrders?: any[];
}

const ITEMS_PER_PAGE = 10;

/* ================= MODAL ================= */
interface WithdrawalModalProps {
  request: WithdrawalRequest | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string, reason?: string) => void;
  updating: boolean;
  sellerBalance: number;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  request,
  onClose,
  onUpdateStatus,
  updating,
  sellerBalance,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    if (request) {
      setSelectedStatus(request.status === "success" ? "approved" : request.status);
      setDeclineReason(request.adminNote || "");
    }
  }, [request]);

  if (!request) return null;

  return (
    <Dialog open={!!request} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#F8FAFC", fontWeight: 800 }}>
        Review Withdrawal Request
        <IconButton size="small" onClick={onClose}><Close /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack direction="row" spacing={2} mb={3}>
          <Box sx={{ flex: 1, p: 2, bgcolor: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" fontWeight={700} color="#4338CA">REQUESTED AMOUNT</Typography>
            <Typography variant="h5" fontWeight={800} color="#3730A3">{request.amount} {request.currency}</Typography>
          </Box>
          <Box sx={{ flex: 1, p: 2, bgcolor: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" fontWeight={700} color="#047857">SELLER BALANCE</Typography>
            <Typography variant="h5" fontWeight={800} color="#065F46">${sellerBalance.toFixed(2)}</Typography>
          </Box>
        </Stack>

        {request.hasBlockingIssues && (
          <Box sx={{ mb: 3, p: 2.5, bgcolor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 2 }}>
            <Typography fontWeight={800} color="#991B1B" mb={1.5}>WITHDRAWAL BLOCKED</Typography>
            {request.unfinishedOrdersCount > 0 && <Typography fontSize={14}>• <strong>{request.unfinishedOrdersCount}</strong> unfinished orders</Typography>}
            {request.sellerReportsCount > 0 && <Typography fontSize={14}>• <strong>{request.sellerReportsCount}</strong> open reports</Typography>}
          </Box>
        )}

        <FormControl fullWidth>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            sx={{
              borderRadius: 2,
              bgcolor: selectedStatus === "pending" ? "#FEF9C3" : selectedStatus === "approved" ? "#DCFCE7" : selectedStatus === "declined" ? "#FEE2E2" : "#fff",
            }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approve & Pay</MenuItem>
            <MenuItem value="declined">Decline</MenuItem>
          </Select>
        </FormControl>

        {selectedStatus === "declined" && (
          <TextField
            fullWidth multiline rows={3} label="Decline Reason" sx={{ mt: 2 }}
            value={declineReason} onChange={(e) => setDeclineReason(e.target.value)}
            error={!declineReason.trim()}
            helperText={!declineReason.trim() && "Reason is required"}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={updating || (selectedStatus === "declined" && !declineReason.trim())}
          onClick={() => onUpdateStatus(request._id, selectedStatus, declineReason)}
          sx={{ bgcolor: selectedStatus === "declined" ? "#DC2626" : "#0F172A", fontWeight: 700, px: 3 }}
        >
          {updating ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ================= DETAILS MODAL ================= */
const DetailsModal: React.FC<{ request: WithdrawalRequest | null; onClose: () => void }> = ({ request, onClose }) => {
  if (!request) return null;
  return (
    <Dialog open={!!request} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#F8FAFC", fontWeight: 800 }}>
        Withdrawal Details
        <IconButton size="small" onClick={onClose}><Close /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", mb: 0.5 }}>SELLER</Typography>
            <Typography sx={{ fontSize: 14, color: "#1F2937", fontWeight: 600 }}>{request.fullName}</Typography>
            <Typography sx={{ fontSize: 13, color: "#64748B" }}>{request.email}</Typography>
          </Box>
          <Box sx={{ bgcolor: "#F8FAFC", p: 2, borderRadius: 2 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", mb: 1.5 }}>BANK ACCOUNT DETAILS</Typography>
            <Typography sx={{ fontSize: 13 }}><strong>Method:</strong> {request.paymentMethod}</Typography>
            <Typography sx={{ fontSize: 13 }}><strong>Account:</strong> {request.accountNumber}</Typography>
            <Typography sx={{ fontSize: 13 }}><strong>Bank Code:</strong> {request.bankCode}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button variant="contained" onClick={onClose} sx={{ bgcolor: "#0F172A" }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

/* ================= MAIN ================= */
const WithdrawalRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  /* ─────────────────────────────────────────────────────────────
   * REAL-TIME DATA FETCHING (POLLING STRATEGY)
   * ─────────────────────────────────────────────────────────────
   * - Uses React Query with 5s polling.
   */
  const fetchWithdrawalsData = async (): Promise<WithdrawalRequest[]> => {
    const [wRes, pRes, rRes] = await Promise.all([
      fetch("https://tasha-vps-backend-2.onrender.com/withdraw/getall"),
      fetch("https://tasha-vps-backend-2.onrender.com/purchase/getall"),
      fetch("https://tasha-vps-backend-2.onrender.com/purchase/report/getall")
    ]);
    const withdrawData = await wRes.json();
    const purchases = await pRes.json();
    const reports = await rRes.json();

    const enriched = withdrawData.map((req: any) => {
      const email = (req.email || "").toLowerCase().trim();
      const unfinished = purchases.filter((p: any) => (p.sellerEmail || "").toLowerCase().trim() === email && !["completed", "delivered", "success"].includes((p.status || "").toLowerCase())).length;
      const reportsCount = reports.filter((r: any) => (r.sellerEmail || "").toLowerCase().trim() === email).length;
      return { ...req, sellerReportsCount: reportsCount, unfinishedOrdersCount: unfinished, hasBlockingIssues: unfinished > 0 || reportsCount > 0 };
    });
    return enriched;
  };

  const { data: requests = [], isLoading: loading, refetch } = useQuery({
    queryKey: ["adminWithdrawalRequests"],
    queryFn: fetchWithdrawalsData,
    refetchInterval: 5000,
  });

  const fetchDetailsForEmail = useCallback(async (email: string) => {
    try {
      const [pRes, rRes] = await Promise.all([
        fetch("https://tasha-vps-backend-2.onrender.com/purchase/getall"),
        fetch("https://tasha-vps-backend-2.onrender.com/purchase/report/getall")
      ]);
      const purchases = pRes.ok ? await pRes.json() : [];
      const reports = rRes.ok ? await rRes.json() : [];
      const seller = (email || "").toLowerCase().trim();
      const unfinished = purchases.filter((p: any) => (p.sellerEmail || "").toLowerCase().trim() === seller && !["completed", "delivered", "success"].includes((p.status || "").toLowerCase()));
      const sellerReports = reports.filter((r: any) => (r.sellerEmail || "").toLowerCase().trim() === seller);
      return { unfinished, sellerReports };
    } catch { return { unfinished: [], sellerReports: [] }; }
  }, []);

  // const [requests, setRequests] = useState<WithdrawalRequest[]>([]); // Replaced by useQuery data
  // const [loading, setLoading] = useState(true); // Replaced by useQuery loading
  const [actionLoading, setActionLoading] = useState(false);
  const [sellerBalance, setSellerBalance] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [detailsRequest, setDetailsRequest] = useState<WithdrawalRequest | null>(null);

  const handleReview = async (req: WithdrawalRequest) => {
    setActionLoading(true);
    try {
      const userRes = await fetch("https://tasha-vps-backend-2.onrender.com/api/user/getall");
      const userData = await userRes.json();
      const users = Array.isArray(userData) ? userData : (userData.users || []);
      const seller = users.find((u: any) => u.email.toLowerCase() === req.email.toLowerCase());
      setSellerBalance(seller ? seller.balance : 0);

      const details = await fetchDetailsForEmail(req.email);
      setSelectedRequest({ ...req, sellerReports: details.sellerReports, unfinishedOrders: details.unfinished });
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(r => r.email.toLowerCase().includes(searchTerm.toLowerCase()) || r.status.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [requests, searchTerm]);

  const paginatedRequests = filteredRequests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={800}>Withdrawal Requests ({filteredRequests.length})</Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title="Refresh requests">
              <IconButton onClick={() => { setCurrentPage(1); refetch(); }} sx={{ width: 44, height: 44, background: "linear-gradient(135deg,#33ac6f,#2a8e5b)", color: "#fff", borderRadius: "12px" }}>
                {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <Refresh fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Box sx={{ position: "relative", width: 360 }}>
              <Search sx={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
              <InputBase placeholder="Search..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} sx={{ width: "100%", bgcolor: "#fff", border: "1px solid #E2E8F0", borderRadius: 3, pl: 6, pr: 2, py: 1.1 }} />
            </Box>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {loading ? <Box py={10} textAlign="center"><CircularProgress /></Box> : (
          <Table>
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                {["DATE", "SELLER", "METHOD", "AMOUNT", "STATUS", "REPORTS", "UNFINISHED", "ACTION"].map(h => (
                  <TableCell
                    key={h}
                    align={h === "ACTION" ? "center" : "left"} // ACTION কে সেন্টারে আনা হয়েছে
                    sx={{
                      fontWeight: 700,
                      fontSize: 12,
                      color: "#64748B",
                      width: h === "ACTION" ? "180px" : "auto" // কলামের জায়গা ফিক্সড করা হয়েছে
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.map((req) => (
                <TableRow key={req._id} hover>
                  <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{req.email}</TableCell>
                  <TableCell>{req.paymentMethod}</TableCell>
                  <TableCell>{req.amount} {req.currency}</TableCell>
                  <TableCell>
                    <Box sx={{ px: 2, py: 0.6, borderRadius: 2, fontSize: 13, fontWeight: 600, display: 'inline-block', bgcolor: req.status === "pending" ? "#FEF9C3" : req.status === "success" ? "#DCFCE7" : "#FEE2E2", color: req.status === "pending" ? "#92400E" : "#166534" }}>{req.status}</Box>
                  </TableCell>
                  <TableCell>{req.sellerReportsCount}</TableCell>
                  <TableCell>{req.unfinishedOrdersCount}</TableCell>
                  {/* বাটনগুলোকে হেডারের ঠিক নিচে সেন্টারে আনা হয়েছে */}
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                      <IconButton
                        size="small"
                        onClick={() => setDetailsRequest(req)}
                        sx={{ color: "#4F46E5" }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleReview(req)}
                        disabled={actionLoading}
                        sx={{
                          bgcolor: "#0F172A",
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          minWidth: "80px"
                        }}
                      >
                        Review
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {!loading && filteredRequests.length > 0 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination count={Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)} page={currentPage} onChange={(_, p) => setCurrentPage(p)} />
        </Box>
      )}

      {selectedRequest && <WithdrawalModal request={selectedRequest} sellerBalance={sellerBalance} onClose={() => setSelectedRequest(null)} updating={actionLoading} onUpdateStatus={async (id, status, reason) => {
        setActionLoading(true);
        try {
          const endpoint = status === "approved" ? "approve" : "decline";
          const res = await fetch(`https://tasha-vps-backend-2.onrender.com/withdraw/${endpoint}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: status === "declined" ? JSON.stringify({ reason }) : null
          });
          if (res.ok) { refetch(); setSelectedRequest(null); }
        } finally { setActionLoading(false); }
      }} />}

      {detailsRequest && <DetailsModal request={detailsRequest} onClose={() => setDetailsRequest(null)} />}
    </Box>
  );
};

export default WithdrawalRequests;