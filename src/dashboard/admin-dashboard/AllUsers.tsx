import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar, Box, CircularProgress, IconButton, InputBase, Pagination,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Tooltip, Typography, Chip, Modal, Divider, Tabs, Tab
} from "@mui/material";
import { Search, Visibility } from "@mui/icons-material";

/* ================= TYPES ================= */
interface User {
  _id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  balance: number;
}

interface Order {
  _id: string;
  productName: string;
  price: number;
  purchaseDate: string;
  status: string;
}

interface Payment {
  tx_ref: string;
  amount: number;
  status: string;
  createdAt: string;
}

const BASE_URL = "http://localhost:3200";

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modal States
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 for Orders, 1 for Payments
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/user/getall`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  /* Filter only Buyers */
  const buyers = useMemo(() => {
    return users.filter(u => 
      u.role === "buyer" && 
      (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    );
  }, [users, search]);

  /* Open History Modal */
  const openHistory = async (user: User) => {
    setSelectedUser(user);
    setOpen(true);
    setHistoryLoading(true);
    setTabValue(0);

    try {
      // ১. অর্ডারের ডাটা আনা
      const orderRes = await fetch(`${BASE_URL}/purchase/admin/by-user/${user._id}`);
      const orderData = await orderRes.json();
      setOrders(Array.isArray(orderData) ? orderData : []);

      // ২. পেমেন্টের ডাটা আনা (আপনার পেমেন্ট হিস্ট্রি রাউট অনুযায়ী)
      // নোট: আপনার ব্যাকএন্ডে পেমেন্ট সেভ করার একটি রাউট লাগবে যা ইমেইল দিয়ে ফিল্টার করবে
      const payRes = await fetch(`${BASE_URL}/api/payment/history?email=${user.email}`);
      const payData = await payRes.json();
      setPayments(Array.isArray(payData) ? payData : []);

    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#F4F6F8", minHeight: "100vh" }}>
      <Paper sx={{ p: 2, mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight={700}>Buyer Management</Typography>
        <InputBase
          placeholder="Search buyers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ border: "1px solid #ddd", px: 2, borderRadius: 1, width: 250 }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#eee" }}>
            <TableRow>
              <TableCell><b>Buyer</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell align="right"><b>Balance</b></TableCell>
              <TableCell align="center"><b>Details</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buyers.map((u) => (
              <TableRow key={u._id} hover>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell align="right">${u.balance.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => openHistory(u)} color="primary"><Visibility /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- HISTORY MODAL --- */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 800, bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 24, maxHeight: '90vh', overflowY: 'auto'
        }}>
          <Typography variant="h6">User Activity: {selectedUser?.name}</Typography>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mt: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Purchase History" />
            <Tab label="Payment History" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {historyLoading ? <CircularProgress /> : (
              tabValue === 0 ? (
                /* Purchase Table */
                <Table size="small">
                  <TableHead><TableRow>
                    <TableCell>Product</TableCell><TableCell>Price</TableCell><TableCell>Status</TableCell>
                  </TableRow></TableHead>
                  <TableBody>
                    {orders.map(o => (
                      <TableRow key={o._id}>
                        <TableCell>{o.productName}</TableCell><TableCell>${o.price}</TableCell>
                        <TableCell><Chip size="small" label={o.status} color="primary" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                /* Payment Table */
                <Table size="small">
                  <TableHead><TableRow>
                    <TableCell>TX Ref</TableCell><TableCell>Amount</TableCell><TableCell>Status</TableCell>
                  </TableRow></TableHead>
                  <TableBody>
                    {payments.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{p.tx_ref}</TableCell><TableCell>${p.amount}</TableCell>
                        <TableCell><Chip size="small" label={p.status || 'Success'} color="success" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AllUsers;