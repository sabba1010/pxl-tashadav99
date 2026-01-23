// import React, { useState, useMemo, useCallback, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   InputBase,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Pagination,
//   Typography,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   FormControl,
//   Select,
//   MenuItem,
//   TextField,
//   IconButton,
// } from "@mui/material";
// import { Search, Close } from "@mui/icons-material";

// /* ================= TYPES ================= */
// interface WithdrawalRequest {
//   _id: string;
//   paymentMethod: string;
//   amount: string;
//   currency: string;
//   accountNumber: string;
//   bankCode: string;
//   fullName: string;
//   phoneNumber: string;
//   email: string;
//   note: string;
//   status: string;
//   createdAt: string;
//   adminNote?: string;
//   sellerReportsCount: number;
//   unfinishedOrdersCount: number;
//   hasBlockingIssues: boolean;
// }

// const ITEMS_PER_PAGE = 10;

// /* ================= MODAL ================= */
// interface WithdrawalModalProps {
//   request: WithdrawalRequest | null;
//   onClose: () => void;
//   onUpdateStatus: (id: string, status: string, reason?: string) => void;
//   updating: boolean;
// }

// const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
//   request,
//   onClose,
//   onUpdateStatus,
//   updating,
// }) => {
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [declineReason, setDeclineReason] = useState("");

//   useEffect(() => {
//     if (request) {
//       setSelectedStatus(
//         request.status === "success" ? "approved" : request.status
//       );
//       setDeclineReason(request.adminNote || "");
//     }
//   }, [request]);

//   if (!request) return null;
//   const canApprove = !request.hasBlockingIssues;

//   return (
//     <Dialog
//       open={!!request}
//       onClose={onClose}
//       fullWidth
//       maxWidth="sm"
//       PaperProps={{ sx: { borderRadius: 3 } }}
//     >
//       <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           bgcolor: "#F8FAFC",
//           fontWeight: 800,
//         }}
//       >
//         Review Withdrawal Request
//         <IconButton size="small" onClick={onClose}>
//           <Close />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent dividers>
//         {request.hasBlockingIssues && (
//           <Box
//             sx={{
//               mb: 3,
//               p: 2.5,
//               bgcolor: "#FEF2F2",
//               border: "1px solid #FECACA",
//               borderRadius: 2,
//             }}
//           >
//             <Typography fontWeight={800} color="#991B1B" mb={1.5}>
//               WITHDRAWAL BLOCKED
//             </Typography>
//             {request.unfinishedOrdersCount > 0 && (
//               <Typography fontSize={14}>
//                 • <strong>{request.unfinishedOrdersCount}</strong> unfinished
//                 orders
//               </Typography>
//             )}
//             {request.sellerReportsCount > 0 && (
//               <Typography fontSize={14}>
//                 • <strong>{request.sellerReportsCount}</strong> open reports
//               </Typography>
//             )}
//           </Box>
//         )}

//         <Box textAlign="center" mb={3}>
//           <Typography
//             variant="caption"
//             fontWeight={700}
//             color="#6366F1"
//             textTransform="uppercase"
//           >
//             Requested Amount
//           </Typography>
//           <Typography variant="h4" fontWeight={800} color="#4F46E5">
//             {request.amount}{" "}
//             <Typography component="span" fontSize="1.1rem">
//               {request.currency}
//             </Typography>
//           </Typography>
//         </Box>

//         <FormControl fullWidth>
//           <Select
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//             sx={{
//               borderRadius: 2,
//               bgcolor:
//                 selectedStatus === "pending"
//                   ? "#FEF9C3"
//                   : selectedStatus === "approved"
//                   ? "#DCFCE7"
//                   : selectedStatus === "declined"
//                   ? "#FEE2E2"
//                   : "#fff",
//             }}
//           >
//             <MenuItem value="pending">Pending</MenuItem>
//             <MenuItem value="approved" disabled={!canApprove}>
//               Approve & Pay
//             </MenuItem>
//             <MenuItem value="declined">Decline</MenuItem>
//           </Select>
//         </FormControl>

//         {selectedStatus === "declined" && (
//           <TextField
//             fullWidth
//             multiline
//             rows={3}
//             label="Decline Reason"
//             sx={{ mt: 2 }}
//             value={declineReason}
//             onChange={(e) => setDeclineReason(e.target.value)}
//             error={!declineReason.trim()}
//             helperText={!declineReason.trim() && "Reason is required"}
//           />
//         )}
//       </DialogContent>

//       <DialogActions sx={{ p: 3 }}>
//         <Button variant="outlined" onClick={onClose}>
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           disabled={
//             updating ||
//             (selectedStatus === "declined" && !declineReason.trim()) ||
//             (selectedStatus === "approved" && !canApprove)
//           }
//           onClick={() =>
//             onUpdateStatus(request._id, selectedStatus, declineReason)
//           }
//           sx={{
//             bgcolor:
//               selectedStatus === "declined"
//                 ? "#DC2626"
//                 : "#0F172A",
//             "&:hover": {
//               bgcolor:
//                 selectedStatus === "declined"
//                   ? "#B91C1C"
//                   : "#020617",
//             },
//             fontWeight: 700,
//             px: 3,
//           }}
//         >
//           {updating ? "Saving..." : "Save"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// /* ================= MAIN ================= */
// const WithdrawalRequests: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRequest, setSelectedRequest] =
//     useState<WithdrawalRequest | null>(null);

//   /* 🔴 ORIGINAL LOGIC – UNCHANGED */
//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const withdrawRes = await fetch(
//         "https://vps-backend-server-beta.vercel.app/withdraw/getall"
//       );
//       const withdrawData = await withdrawRes.json();

//       const purchasesRes = await fetch(
//         "https://vps-backend-server-beta.vercel.app/purchase/getall"
//       );
//       const purchases = purchasesRes.ok ? await purchasesRes.json() : [];

//       const reportsRes = await fetch(
//         "https://vps-backend-server-beta.vercel.app/purchase/report/getall"
//       );
//       const reports = reportsRes.ok ? await reportsRes.json() : [];

//       const unfinishedMap = new Map<string, number>();
//       purchases.forEach((p: any) => {
//         const seller = (p.sellerEmail || p.seller || "").toLowerCase().trim();
//         const status = (p.status || "").toLowerCase();
//         if (seller && !["completed", "delivered", "success"].includes(status)) {
//           unfinishedMap.set(seller, (unfinishedMap.get(seller) || 0) + 1);
//         }
//       });

//       const reportsMap = new Map<string, number>();
//       reports.forEach((r: any) => {
//         const seller = (r.sellerEmail || "").toLowerCase().trim();
//         if (seller) reportsMap.set(seller, (reportsMap.get(seller) || 0) + 1);
//       });

//       const enriched = withdrawData.map((req: any) => {
//         const email = (req.email || "").toLowerCase().trim();
//         const unfinished = unfinishedMap.get(email) || 0;
//         const reportsCount = reportsMap.get(email) || 0;

//         return {
//           ...req,
//           sellerReportsCount: reportsCount,
//           unfinishedOrdersCount: unfinished,
//           hasBlockingIssues: unfinished > 0 || reportsCount > 0,
//         };
//       });

//       setRequests(enriched);
//     } catch {
//       setRequests([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const filteredRequests = useMemo(() => {
//     const term = searchTerm.toLowerCase();
//     return requests.filter(
//       (r) =>
//         r._id.toLowerCase().includes(term) ||
//         r.email.toLowerCase().includes(term) ||
//         r.status.toLowerCase().includes(term)
//     );
//   }, [requests, searchTerm]);

//   const paginatedRequests = filteredRequests.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   return (
//     <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
//       <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography fontWeight={800}>
//             Withdrawal Requests ({filteredRequests.length})
//           </Typography>

//           <Box sx={{ position: "relative", width: 360 }}>
//             <Search
//               sx={{
//                 position: "absolute",
//                 left: 14,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "#64748B",
//               }}
//             />
//             <InputBase
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               sx={{
//                 width: "100%",
//                 bgcolor: "#fff",
//                 border: "1px solid #E2E8F0",
//                 borderRadius: 3,
//                 pl: 6,
//                 pr: 2,
//                 py: 1.1,
//               }}
//             />
//           </Box>
//         </Box>
//       </Paper>

//       <TableContainer
//         component={Paper}
//         sx={{ borderRadius: 3, overflow: "hidden" }}
//       >
//         {loading ? (
//           <Box py={10} textAlign="center">
//             <CircularProgress />
//           </Box>
//         ) : (
//           <Table>
//             <TableHead>
//               <TableRow sx={{ bgcolor: "#F8FAFC" }}>
//                 {[
//                   "DATE",
//                   "SELLER",
//                   "METHOD",
//                   "AMOUNT",
//                   "STATUS",
//                   "REPORTS",
//                   "UNFINISHED",
//                   "DETAILS",
//                 ].map((h) => (
//                   <TableCell
//                     key={h}
//                     sx={{ fontWeight: 700, fontSize: 12, color: "#64748B" }}
//                   >
//                     {h}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedRequests.map((req) => (
//                 <TableRow
//                   key={req._id}
//                   hover
//                   sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}
//                 >
//                   <TableCell>
//                     {new Date(req.createdAt).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>{req.email}</TableCell>
//                   <TableCell>{req.paymentMethod}</TableCell>
//                   <TableCell>
//                     {req.amount} {req.currency}
//                   </TableCell>
//                   <TableCell>
//                     <Box
//                       sx={{
//                         display: "inline-flex",
//                         px: 2,
//                         py: 0.6,
//                         borderRadius: 2,
//                         fontSize: 13,
//                         fontWeight: 600,
//                         bgcolor:
//                           req.status === "pending"
//                             ? "#FEF9C3"
//                             : req.status === "success"
//                             ? "#DCFCE7"
//                             : "#FEE2E2",
//                         color:
//                           req.status === "pending"
//                             ? "#92400E"
//                             : req.status === "success"
//                             ? "#166534"
//                             : "#991B1B",
//                       }}
//                     >
//                       {req.status}
//                     </Box>
//                   </TableCell>
//                   <TableCell>{req.sellerReportsCount}</TableCell>
//                   <TableCell>{req.unfinishedOrdersCount}</TableCell>
//                   <TableCell align="right">
//                     <Button
//                       variant="contained"
//                       size="small"
//                       disabled={req.hasBlockingIssues || actionLoading}
//                       onClick={() => setSelectedRequest(req)}
//                       sx={{
//                         bgcolor: "#0F172A",
//                         "&:hover": { bgcolor: "#020617" },
//                         textTransform: "none",
//                         fontWeight: 600,
//                         borderRadius: 2,
//                         px: 2.5,
//                       }}
//                     >
//                       Review
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </TableContainer>

//       {!loading && filteredRequests.length > 0 && (
//         <Box mt={4} display="flex" justifyContent="center">
//           <Pagination
//             count={Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)}
//             page={currentPage}
//             onChange={(_, p) => setCurrentPage(p)}
//           />
//         </Box>
//       )}

//       {selectedRequest && (
//         <WithdrawalModal
//           request={selectedRequest}
//           onClose={() => setSelectedRequest(null)}
//           onUpdateStatus={() => {}}
//           updating={actionLoading}
//         />
//       )}
//     </Box>
//   );
// };

// export default WithdrawalRequests;








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
import { Search, Close, Refresh, Visibility } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

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
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  request,
  onClose,
  onUpdateStatus,
  updating,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    if (request) {
      setSelectedStatus(
        request.status === "success" ? "approved" : request.status
      );
      setDeclineReason(request.adminNote || "");
    }
  }, [request]);

  if (!request) return null;
  const canApprove = !request.hasBlockingIssues;

  return (
    <Dialog
      open={!!request}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#F8FAFC",
          fontWeight: 800,
        }}
      >
        Review Withdrawal Request
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {request.hasBlockingIssues && (
          <Box
            sx={{
              mb: 3,
              p: 2.5,
              bgcolor: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 2,
            }}
          >
            <Typography fontWeight={800} color="#991B1B" mb={1.5}>
              WITHDRAWAL BLOCKED
            </Typography>
            {request.unfinishedOrdersCount > 0 && (
              <Typography fontSize={14}>
                • <strong>{request.unfinishedOrdersCount}</strong> unfinished
                orders
              </Typography>
            )}
            {request.sellerReportsCount > 0 && (
              <Typography fontSize={14}>
                • <strong>{request.sellerReportsCount}</strong> open reports
              </Typography>
            )}
          </Box>
        )}

        <Box textAlign="center" mb={3}>
          <Typography
            variant="caption"
            fontWeight={700}
            color="#6366F1"
            textTransform="uppercase"
          >
            Requested Amount
          </Typography>
          <Typography variant="h4" fontWeight={800} color="#4F46E5">
            {request.amount}{" "}
            <Typography component="span" fontSize="1.1rem">
              {request.currency}
            </Typography>
          </Typography>
        </Box>

          <FormControl fullWidth>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{
                borderRadius: 2,
                bgcolor:
                  selectedStatus === "pending"
                    ? "#FEF9C3"
                    : selectedStatus === "approved"
                    ? "#DCFCE7"
                    : selectedStatus === "declined"
                    ? "#FEE2E2"
                    : "#fff",
              }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approve & Pay</MenuItem>
              <MenuItem value="declined">Decline</MenuItem>
            </Select>
          </FormControl>

        {selectedStatus === "declined" && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Decline Reason"
            sx={{ mt: 2 }}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            error={!declineReason.trim()}
            helperText={!declineReason.trim() && "Reason is required"}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={
            updating ||
            (selectedStatus === "declined" && !declineReason.trim())
          }
          onClick={() =>
            onUpdateStatus(request._id, selectedStatus, declineReason)
          }
          sx={{
            bgcolor:
              selectedStatus === "declined"
                ? "#DC2626"
                : "#0F172A",
            "&:hover": {
              bgcolor:
                selectedStatus === "declined"
                  ? "#B91C1C"
                  : "#020617",
            },
            fontWeight: 700,
            px: 3,
          }}
        >
          {updating ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ================= DETAILS MODAL ================= */
interface DetailsModalProps {
  request: WithdrawalRequest | null;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <Dialog
      open={!!request}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#F8FAFC",
          fontWeight: 800,
          fontSize: 18,
        }}
      >
        Withdrawal Details
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Seller */}
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", mb: 0.5 }}>
              SELLER
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#1F2937", fontWeight: 600 }}>
              {request.fullName}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#64748B" }}>
              {request.email}
            </Typography>
          </Box>

          {/* Method */}
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", mb: 0.5 }}>
              PAYMENT METHOD
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#1F2937", fontWeight: 600, textTransform: "capitalize" }}>
              {request.paymentMethod}
            </Typography>
          </Box>

          {/* Amount */}
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", mb: 0.5 }}>
              AMOUNT
            </Typography>
            <Typography sx={{ fontSize: 18, color: "#4F46E5", fontWeight: 800 }}>
              {request.amount} {request.currency}
            </Typography>
          </Box>

          {/* Bank Account Details */}
          <Box sx={{ bgcolor: "#F8FAFC", p: 2, borderRadius: 2 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", mb: 1.5 }}>
              BANK ACCOUNT DETAILS
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box>
                <Typography sx={{ fontSize: 11, color: "#64748B" }}>Account Holder Name</Typography>
                <Typography sx={{ fontSize: 13, color: "#1F2937", fontWeight: 600 }}>
                  {request.fullName}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: "#64748B" }}>Account Number</Typography>
                <Typography sx={{ fontSize: 13, color: "#1F2937", fontWeight: 600 }}>
                  {request.accountNumber}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: "#64748B" }}>Bank Code</Typography>
                <Typography sx={{ fontSize: 13, color: "#1F2937", fontWeight: 600 }}>
                  {request.bankCode}
                </Typography>
              </Box>
              {request.bankName && (
                <Box>
                  <Typography sx={{ fontSize: 11, color: "#64748B" }}>Bank Name</Typography>
                  <Typography sx={{ fontSize: 13, color: "#1F2937", fontWeight: 600 }}>
                    {request.bankName}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Email & Phone */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", mb: 0.5 }}>
                EMAIL
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#1F2937", fontWeight: 500, wordBreak: "break-all" }}>
                {request.email}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", mb: 0.5 }}>
                PHONE
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#1F2937", fontWeight: 500 }}>
                {request.phoneNumber || "N/A"}
              </Typography>
            </Box>
          </Box>

          {/* Note */}
          {request.note && (
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", mb: 0.5 }}>
                NOTE
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#1F2937", fontWeight: 500 }}>
                {request.note}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: "#0F172A",
            "&:hover": { bgcolor: "#020617" },
            fontWeight: 600,
            px: 3,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ================= MAIN ================= */
const WithdrawalRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawalRequest | null>(null);
  const [detailsRequest, setDetailsRequest] = useState<WithdrawalRequest | null>(null);

  const fetchDetailsForEmail = useCallback(async (email: string) => {
    try {
      const purchasesRes = await fetch("https://vps-backend-server-beta.vercel.app/purchase/getall");
      const purchases = purchasesRes.ok ? await purchasesRes.json() : [];

      const reportsRes = await fetch("https://vps-backend-server-beta.vercel.app/purchase/report/getall");
      const reports = reportsRes.ok ? await reportsRes.json() : [];

      const seller = (email || "").toLowerCase().trim();
      const unfinished = purchases.filter((p: any) => {
        const s = (p.sellerEmail || p.seller || "").toLowerCase().trim();
        const status = (p.status || "").toLowerCase();
        return s === seller && !["completed", "delivered", "success"].includes(status);
      });

      const sellerReports = reports.filter((r: any) => (r.sellerEmail || "").toLowerCase().trim() === seller);

      return { unfinished, sellerReports };
    } catch (err) {
      return { unfinished: [], sellerReports: [] };
    }
  }, []);

  /* 🔴 ORIGINAL LOGIC – UNCHANGED */
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const withdrawRes = await fetch(
        "https://vps-backend-server-beta.vercel.app/withdraw/getall"
      );
      const withdrawData = await withdrawRes.json();

      const purchasesRes = await fetch(
        "https://vps-backend-server-beta.vercel.app/purchase/getall"
      );
      const purchases = purchasesRes.ok ? await purchasesRes.json() : [];

      const reportsRes = await fetch(
        "https://vps-backend-server-beta.vercel.app/purchase/report/getall"
      );
      const reports = reportsRes.ok ? await reportsRes.json() : [];

      const unfinishedMap = new Map<string, number>();
      purchases.forEach((p: any) => {
        const seller = (p.sellerEmail || p.seller || "").toLowerCase().trim();
        const status = (p.status || "").toLowerCase();
        if (seller && !["completed", "delivered", "success"].includes(status)) {
          unfinishedMap.set(seller, (unfinishedMap.get(seller) || 0) + 1);
        }
      });

      const reportsMap = new Map<string, number>();
      reports.forEach((r: any) => {
        const seller = (r.sellerEmail || "").toLowerCase().trim();
        if (seller) reportsMap.set(seller, (reportsMap.get(seller) || 0) + 1);
      });

      const enriched = withdrawData.map((req: any) => {
        const email = (req.email || "").toLowerCase().trim();
        const unfinished = unfinishedMap.get(email) || 0;
        const reportsCount = reportsMap.get(email) || 0;

        return {
          ...req,
          sellerReportsCount: reportsCount,
          unfinishedOrdersCount: unfinished,
          hasBlockingIssues: unfinished > 0 || reportsCount > 0,
        };
      });

      setRequests(enriched);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return requests.filter(
      (r) =>
        r._id.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.status.toLowerCase().includes(term)
    );
  }, [requests, searchTerm]);

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={800}>
            Withdrawal Requests ({filteredRequests.length})
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title="Refresh requests">
              <IconButton
                onClick={() => {
                  setCurrentPage(1);
                  fetchRequests();
                }}
                sx={{
                  width: 44,
                  height: 44,
                  background: "linear-gradient(135deg,#33ac6f,#2a8e5b)",
                  color: "#fff",
                  borderRadius: "12px",
                  "&:hover": { transform: "translateY(-3px)", background: "#2a8e5b" },
                }}
                size="small"
                aria-label="Reload requests"
              >
                {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <Refresh fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Box sx={{ position: "relative", width: 360 }}>
              <Search sx={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
              <InputBase
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                sx={{
                  width: "100%",
                  bgcolor: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 3,
                  pl: 6,
                  pr: 2,
                  py: 1.1,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, overflow: "hidden" }}
      >
        {loading ? (
          <Box py={10} textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                {[
                  "DATE",
                  "SELLER",
                  "METHOD",
                  "AMOUNT",
                  "STATUS",
                  "REPORTS",
                  "UNFINISHED",
                  "DETAILS",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ fontWeight: 700, fontSize: 12, color: "#64748B" }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.map((req) => (
                <TableRow
                  key={req._id}
                  hover
                  sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}
                >
                  <TableCell>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{req.email}</TableCell>
                  <TableCell>{req.paymentMethod}</TableCell>
                  <TableCell>
                    {req.amount} {req.currency}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-flex",
                        px: 2,
                        py: 0.6,
                        borderRadius: 2,
                        fontSize: 13,
                        fontWeight: 600,
                        bgcolor:
                          req.status === "pending"
                            ? "#FEF9C3"
                            : req.status === "success"
                            ? "#DCFCE7"
                            : "#FEE2E2",
                        color:
                          req.status === "pending"
                            ? "#92400E"
                            : req.status === "success"
                            ? "#166534"
                            : "#991B1B",
                      }}
                    >
                      {req.status}
                    </Box>
                  </TableCell>
                  <TableCell>{req.sellerReportsCount}</TableCell>
                  <TableCell>{req.unfinishedOrdersCount}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => setDetailsRequest(req)}
                          sx={{
                            color: "#4F46E5",
                            "&:hover": { bgcolor: "#E0E7FF" },
                            borderRadius: "8px",
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={actionLoading}
                        onClick={async () => {
                          setActionLoading(true);
                          const details = await fetchDetailsForEmail(req.email);
                          setSelectedRequest({ ...req, sellerReports: details.sellerReports, unfinishedOrders: details.unfinished });
                          setActionLoading(false);
                        }}
                        sx={{
                          bgcolor: "#0F172A",
                          "&:hover": { bgcolor: "#020617" },
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          px: 2.5,
                        }}
                      >
                        Review
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {!loading && filteredRequests.length > 0 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={(_, p) => setCurrentPage(p)}
          />
        </Box>
      )}

      {selectedRequest && (
        <WithdrawalModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={async (id, status, reason) => {
            setActionLoading(true);
            try {
              if (status === "approved") {
                const res = await fetch(`https://vps-backend-server-beta.vercel.app/withdraw/approve/${id}`, { method: "PUT" });
                if (res.ok) {
                  setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: "approved", adminNote: "" } : r)));
                }
              } else if (status === "declined") {
                const res = await fetch(`https://vps-backend-server-beta.vercel.app/withdraw/decline/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ reason }),
                });
                if (res.ok) {
                  setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: "declined", adminNote: reason } : r)));
                }
              }
            } catch (err) {
              console.error(err);
            } finally {
              setActionLoading(false);
              setSelectedRequest(null);
            }
          }}
          updating={actionLoading}
        />
      )}

      {detailsRequest && (
        <DetailsModal
          request={detailsRequest}
          onClose={() => setDetailsRequest(null)}
        />
      )}
    </Box>
  );
};

export default WithdrawalRequests;
