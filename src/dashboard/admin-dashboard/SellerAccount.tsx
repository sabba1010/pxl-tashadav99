import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  Box, Paper, InputBase, IconButton, Pagination, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Avatar, Modal, Chip, Stack, Select, MenuItem, FormControl, Divider, List, ListItem, ListItemText, LinearProgress, Tooltip
} from "@mui/material";
import { 
  Refresh, Close, FiberManualRecord, Visibility, TrendingUp, Phone, 
  Email, CalendarMonth, ShoppingCartCheckout
} from "@mui/icons-material";
import { toast } from "sonner";

/* ====================== TYPES ====================== */
interface Seller {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status?: string; 
  balance: number;
  accountCreationDate?: string;
}

const ITEMS_PER_PAGE = 10;
const BASE_URL = "http://localhost:3200";

const SellerAccount: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openPerformance, setOpenPerformance] = useState(false);

  /* ====================== DATA FETCHING ====================== */
  const { data: users = [], isLoading } = useQuery<Seller[]>({
    queryKey: ["all-sellers"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/user/getall`);
      const data = res.data as any;
      const allUsers = Array.isArray(data) ? data : (data.users || []);
      return allUsers.filter((u: any) => u.role?.toLowerCase() === "seller");
    },
  });

  const { data: allProducts = [] } = useQuery<any[]>({
    queryKey: ["all-products-stats"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/product/all-sells`);
      return res.data as any[];
    },
  });

  /* ====================== ACTIONS ====================== */
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await axios.patch(`${BASE_URL}/api/user/update-status/${userId}`, { status: newStatus.toLowerCase() });
      toast.success(`Status updated to ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ["all-sellers"] });
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  /* ====================== LOGIC: TOTAL SOLD ====================== */
  const getSellerStats = (email: string) => {
    const sellerAds = allProducts.filter(p => p.userEmail === email);
    // Counting products that are actually 'approved' or 'sold'
    const soldCount = sellerAds.filter(p => p.status === 'approved' || p.status === 'active').length; 
    const totalAds = sellerAds.length;
    const successRate = totalAds > 0 ? (soldCount / totalAds) * 100 : 0;
    
    return { soldCount, totalAds, successRate };
  };

  /* ====================== FILTER & PAGINATION ====================== */
  const filteredSellers = useMemo(() => {
    return users.filter(s => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const paginated = filteredSellers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #E2E8F0" }}>
        <Typography variant="h5" fontWeight={700}>Sellers Management</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ["all-sellers"] })}><Refresh /></IconButton>
          <InputBase
            placeholder="Search seller..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            sx={{ border: "1px solid #CBD5E1", borderRadius: "8px", px: 2, width: 300, bgcolor: "white" }}
          />
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>SELLER INFO</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">ACCOUNTS SOLD</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>BALANCE</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} align="center"><CircularProgress sx={{ my: 4 }} /></TableCell></TableRow>
            ) : (
              paginated.map((u: Seller) => {
                const { soldCount } = getSellerStats(u.email);
                const displayStatus = u.status?.toLowerCase() === "blocked" ? "BLOCKED" : "ACTIVE";
                
                return (
                  <TableRow key={u._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: displayStatus === "ACTIVE" ? "#6366F1" : "#EF4444" }}>{u.name[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                          <Typography variant="caption" color="textSecondary">{u.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={displayStatus}
                          onChange={(e) => handleStatusChange(u._id, e.target.value)}
                          sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "12px", height: 32 }}
                        >
                          <MenuItem value="ACTIVE"><FiberManualRecord sx={{ color: "#10B981", fontSize: 12, mr: 1 }} /> ACTIVE</MenuItem>
                          <MenuItem value="BLOCKED"><FiberManualRecord sx={{ color: "#EF4444", fontSize: 12, mr: 1 }} /> BLOCKED</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>

                    {/* NEW TOTAL SOLD COLUMN */}
                    <TableCell align="center">
                      <Chip 
                        label={`${soldCount} Sold`} 
                        size="small" 
                        icon={<ShoppingCartCheckout sx={{ fontSize: '14px !important' }} />}
                        sx={{ fontWeight: 700, bgcolor: "#EEF2FF", color: "#4F46E5", border: "1px solid #C7D2FE" }} 
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 700, color: "#10B981" }}>${u.balance.toFixed(2)}</TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Stats"><IconButton onClick={() => { setSelectedSeller(u); setOpenPerformance(true); }} size="small" color="primary"><TrendingUp /></IconButton></Tooltip>
                        <Tooltip title="Profile"><IconButton onClick={() => { setSelectedSeller(u); setOpenDetails(true); }} size="small"><Visibility sx={{ color: "#64748B" }} /></IconButton></Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Performance Modal */}
      <Modal open={openPerformance} onClose={() => setOpenPerformance(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 450, bgcolor: "white", p: 4, borderRadius: 3, outline: 'none' }}>
            <Typography variant="h6" fontWeight={700} mb={3}>Store Analysis: {selectedSeller?.name}</Typography>
            {selectedSeller && (() => {
                const { soldCount, totalAds, successRate } = getSellerStats(selectedSeller.email);
                return (
                    <Stack spacing={3}>
                        <Stack direction="row" spacing={2}>
                            <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: 'center', bgcolor: '#F8FAFC' }}>
                                <Typography variant="h4" fontWeight={800} color="primary">{soldCount}</Typography>
                                <Typography variant="caption" fontWeight={700}>TOTAL SOLD</Typography>
                            </Paper>
                            <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: 'center', bgcolor: '#F8FAFC' }}>
                                <Typography variant="h4" fontWeight={800} color="#64748B">{totalAds}</Typography>
                                <Typography variant="caption" fontWeight={700}>TOTAL LISTED</Typography>
                            </Paper>
                        </Stack>
                        <Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight={700}>Sales Completion Rate</Typography>
                                <Typography variant="body2" fontWeight={800}>{successRate.toFixed(1)}%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={successRate} sx={{ height: 10, borderRadius: 5 }} />
                        </Box>
                    </Stack>
                );
            })()}
        </Box>
      </Modal>
    </Box>
  );
};

export default SellerAccount;