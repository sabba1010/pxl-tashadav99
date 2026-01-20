import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  Box, Paper, InputBase, IconButton, Tooltip, Pagination, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Avatar, Chip, Modal, Divider, Tabs, Tab
} from "@mui/material";
import { Search, Refresh, Visibility, Close } from "@mui/icons-material";

/* ====================== TYPES ====================== */
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
}

// ইন্টারফেস আপডেট করা হয়েছে আপনার স্ক্রিনশট অনুযায়ী
interface Purchase {
  _id: string;
  buyerId: string;    // স্ক্রিনশটে আছে
  buyerEmail: string; // স্ক্রিনশটে আছে
  productName: string;
  price: number;
  purchaseDate: string;
  status: string;
}

interface Payment {
  _id: string;
  tx_ref: string;
  customerEmail: string; // স্ক্রিনশটে আছে
  amount: number;
  status: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;
const BASE_URL = "http://localhost:3200";

/* ====================== API FUNCTIONS ====================== */
const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${BASE_URL}/api/user/getall`);
  return response.data as User[];
};

const fetchHistory = async (userId: string, email: string) => {
  const [purchaseRes, paymentRes] = await Promise.all([
    axios.get(`${BASE_URL}/purchase/getall`),
    axios.get(`${BASE_URL}/api/payments`)
  ]);
  
  // ফিল্টারিং লজিক এখন ইন্টারফেসের সাথে মিলবে
  return { 
    purchases: (purchaseRes.data as Purchase[]).filter(p => p.buyerId === userId || p.buyerEmail === email),
    payments: (paymentRes.data as Payment[]).filter(p => p.customerEmail === email)
  };
};

/* ====================== MAIN COMPONENT ====================== */
const AllUsers: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [historyData, setHistoryData] = useState<{purchases: Purchase[], payments: Payment[]}>({
    purchases: [], 
    payments: []
  });
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const { data: users = [], isLoading, isError } = useQuery<User[]>({
    queryKey: ["all-users"],
    queryFn: fetchUsers,
  });

  const filteredBuyers = useMemo(() => {
    return users.filter(u => 
      u.role === "buyer" && 
      (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBuyers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBuyers, currentPage]);

  const totalPages = Math.ceil(filteredBuyers.length / ITEMS_PER_PAGE);

  const handleOpenHistory = async (user: User) => {
    setSelectedUser(user);
    setOpen(true);
    setIsHistoryLoading(true);
    try {
      const data = await fetchHistory(user._id, user.email);
      setHistoryData(data);
    } catch (err) {
      console.error("History fetch failed", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  if (isError) return <Box p={10}>Error loading data...</Box>;

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" fontWeight={700}>Buyer Management ({filteredBuyers.length})</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ["all-users"] })} sx={{ bgcolor: "#33ac6f", color: "#fff" }}><Refresh /></IconButton>
          <InputBase
            placeholder="Search buyers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ border: "1px solid #E5E7EB", borderRadius: "12px", px: 2, width: 300 }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        {isLoading ? <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box> : (
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                <TableCell><b>Buyer Profile</b></TableCell>
                <TableCell><b>Wallet Balance</b></TableCell>
                <TableCell><b>Activity</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((u) => (
                <TableRow key={u._id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#33ac6f" }}>{u.name[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>{u.name}</Typography>
                        <Typography variant="caption">{u.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  {/* ফিক্সড: TableCell এ সরাসরি fontWeight ব্যবহার না করে sx ব্যবহার করা হয়েছে */}
                  <TableCell sx={{ fontWeight: 700 }}>${u.balance.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenHistory(u)} color="primary"><Visibility /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination count={totalPages} page={currentPage} onChange={(_, p) => setCurrentPage(p)} />
      </Box>

      {/* History Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, bgcolor: "white", p: 4, borderRadius: 4, maxHeight: "80vh", overflowY: "auto" }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight={800}>History: {selectedUser?.name}</Typography>
            <IconButton onClick={() => setOpen(false)}><Close /></IconButton>
          </Box>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
            <Tab label="Purchases" />
            <Tab label="Payments" />
          </Tabs>

          {isHistoryLoading ? <CircularProgress /> : (
            <Table size="small">
              <TableHead><TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell><b>{tabValue === 0 ? "Product" : "TX Ref"}</b></TableCell>
                <TableCell><b>Amount</b></TableCell>
                <TableCell><b>Date</b></TableCell>
              </TableRow></TableHead>
              <TableBody>
                {(tabValue === 0 ? historyData.purchases : historyData.payments).map((item: any, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.productName || item.tx_ref}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>${(item.price || item.amount || 0).toFixed(2)}</TableCell>
                    <TableCell>{new Date(item.purchaseDate || item.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AllUsers;