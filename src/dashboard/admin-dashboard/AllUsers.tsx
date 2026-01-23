import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  Box, Paper, InputBase, IconButton, Pagination, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Avatar, Modal, Tabs, Tab, Select, MenuItem, FormControl, Chip
} from "@mui/material";
import { Refresh, Visibility, Close, FiberManualRecord, CheckCircle, Cancel, ShoppingBag, CalendarMonth } from "@mui/icons-material";

/* ====================== TYPES ====================== */
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
  status?: string;
  accountCreationDate?: string; // ডাটাবেজ থেকে আসা তারিখের জন্য
}

const ITEMS_PER_PAGE = 10;
const BASE_URL = "https://vps-backend-server-beta.vercel.app";

const AllUsers: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [historyData, setHistoryData] = useState<{ purchases: any[], payments: any[] }>({ purchases: [], payments: [] });
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // 1. Fetch All Users
  const { data: users = [], isLoading: isUsersLoading } = useQuery<User[]>({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/user/getall`);
      return res.data as User[];
    },
  });

  // 2. Fetch All Purchases
  const { data: allPurchases = [] } = useQuery<any[]>({
    queryKey: ["all-purchases"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/purchase/getall`);
      return res.data as any[];
    },
  });

  /* ====================== ACTIONS ====================== */
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const statusToSend = newStatus.toLowerCase();
      await axios.patch(`${BASE_URL}/api/user/update-status/${userId}`, { status: statusToSend });
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const handlePurchaseAction = async (purchaseId: string, action: string) => {
    if (window.confirm(`Are you sure you want to mark this as ${action}?`)) {
      try {
        await axios.patch(`${BASE_URL}/purchase/update-status/${purchaseId}`, { status: action });
        queryClient.invalidateQueries({ queryKey: ["all-purchases"] });
        if (selectedUser) handleOpenHistory(selectedUser);
      } catch (err) {
        alert("Action failed!");
      }
    }
  };

  /* ====================== FILTER & PAGINATION ====================== */
  const filteredBuyers = useMemo(() => {
    return users.filter((u: User) =>
      u.role === "buyer" &&
      (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  const paginated = filteredBuyers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleOpenHistory = async (user: User) => {
    setSelectedUser(user);
    setOpen(true);
    setIsHistoryLoading(true);
    try {
      const [pur, pay] = await Promise.all([
        axios.get(`${BASE_URL}/purchase/getall`),
        axios.get(`${BASE_URL}/api/payments`)
      ]);
      setHistoryData({
        purchases: (pur.data as any[]).filter(p => p.buyerId === user._id || p.buyerEmail === user.email),
        payments: (pay.data as any[]).filter(p => p.customerEmail === user.email)
      });
    } catch (err) { console.error(err); } finally { setIsHistoryLoading(false); }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #E2E8F0" }}>
        <Typography variant="h5" fontWeight={700}>Buyers Management</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["all-users"] });
            queryClient.invalidateQueries({ queryKey: ["all-purchases"] });
          }} sx={{ bgcolor: "#F1F5F9" }}><Refresh /></IconButton>
          <InputBase
            placeholder="Search buyers..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            sx={{ border: "1px solid #CBD5E1", borderRadius: "8px", px: 2, width: 300, bgcolor: "white" }}
          />
        </Box>
      </Paper>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>BUYER</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>JOINED AT</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>BALANCE</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>PURCHASES</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>ACCOUNT STATUS</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>HISTORY</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isUsersLoading ? (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress sx={{ my: 4 }} /></TableCell></TableRow>
            ) : (
              paginated.map((u: User) => {
                const displayStatus = u.status?.toLowerCase() === "blocked" ? "BLOCKED" : "ACTIVE";
                const userPurchaseCount = (allPurchases as any[]).filter(
                  (p: any) => p.buyerId === u._id || p.buyerEmail === u.email
                ).length;

                return (
                  <TableRow key={u._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: "14px", bgcolor: displayStatus === "ACTIVE" ? "#10B981" : "#EF4444" }}>{u.name[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                          <Typography variant="caption" color="textSecondary">{u.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* JOINING DATE COLUMN */}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>
                          {u.accountCreationDate 
                            ? new Date(u.accountCreationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                            : "N/A"}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {u.accountCreationDate 
                            ? new Date(u.accountCreationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ""}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ fontWeight: 700 }}>${u.balance.toFixed(2)}</TableCell>
                    
                    <TableCell>
                      <Chip 
                        icon={<ShoppingBag style={{ fontSize: '14px' }} />}
                        label={`${userPurchaseCount} Items`} 
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 700, borderColor: "#6366F1", color: "#6366F1" }}
                      />
                    </TableCell>

                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={displayStatus}
                          onChange={(e) => handleStatusChange(u._id, e.target.value)}
                          sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "12px", height: 35, minWidth: 110 }}
                        >
                          <MenuItem value="ACTIVE"><FiberManualRecord sx={{ color: "#10B981", fontSize: 14, mr: 1 }} /> ACTIVE</MenuItem>
                          <MenuItem value="BLOCKED"><FiberManualRecord sx={{ color: "#EF4444", fontSize: 14, mr: 1 }} /> BLOCKED</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenHistory(u)} color="primary"><Visibility /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Pagination 
            count={Math.ceil(filteredBuyers.length / ITEMS_PER_PAGE)} 
            page={currentPage} 
            onChange={(_, v) => setCurrentPage(v)} 
            color="primary" 
          />
        </Box>
      </TableContainer>

      {/* History Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 850, bgcolor: "white", p: 4, borderRadius: 3, boxShadow: 24, outline: 'none' }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box>
                <Typography variant="h6" fontWeight={700}>Activity: {selectedUser?.name}</Typography>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                   <CalendarMonth sx={{ fontSize: 14 }} /> Joined: {selectedUser?.accountCreationDate ? new Date(selectedUser.accountCreationDate).toLocaleDateString() : 'N/A'}
                </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)}><Close /></IconButton>
          </Box>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2, borderBottom: 1, borderColor: "#E2E8F0" }}>
            <Tab label="Purchase History" sx={{ fontWeight: 700 }} />
            <Tab label="Deposit History" sx={{ fontWeight: 700 }} />
          </Tabs>
          {isHistoryLoading ? (
            <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
          ) : (
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell><b>{tabValue === 0 ? "Product" : "TX Ref"}</b></TableCell>
                    <TableCell><b>Amount</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    {tabValue === 0 && <TableCell align="center"><b>Actions</b></TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(tabValue === 0 ? historyData.purchases : historyData.payments).map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.productName || item.tx_ref || "N/A"}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>${(item.price || item.amount || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.status} 
                          size="small" 
                          color={item.status === 'completed' || item.status === 'successful' ? 'success' : item.status === 'canceled' ? 'error' : 'warning'} 
                        />
                      </TableCell>
                      {tabValue === 0 && (
                        <TableCell align="center">
                          {item.status === "pending" ? (
                            <Box display="flex" gap={1} justifyContent="center">
                              <IconButton size="small" color="success" onClick={() => handlePurchaseAction(item._id, "completed")}><CheckCircle /></IconButton>
                              <IconButton size="small" color="error" onClick={() => handlePurchaseAction(item._id, "canceled")}><Cancel /></IconButton>
                            </Box>
                          ) : <Typography variant="caption" color="textSecondary">No Actions</Typography>}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {(tabValue === 0 ? historyData.purchases.length : historyData.payments.length) === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>No records found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AllUsers;