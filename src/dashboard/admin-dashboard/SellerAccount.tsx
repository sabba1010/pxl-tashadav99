import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, InputBase, Pagination, IconButton,
  Tooltip, Modal, Chip, Stack, Divider
} from "@mui/material";
import { 
  Refresh, Close, TrendingUp, ShoppingBag, 
  MonetizationOn, HourglassEmpty, ErrorOutline 
} from "@mui/icons-material";
import { toast } from "sonner";

/* ====================== TYPES ====================== */
interface Seller {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  balance?: number;
  salesCredit?: number;
}

interface ProductRecord {
  _id: string;
  name: string;
  price: string | number;
  status: string; 
  createdAt: string;
  userEmail: string; // স্ক্রিনশট অনুযায়ী এই ফিল্ডটি ডাটাবেজে আছে
}

const SellerAccount: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [sellerProducts, setSellerProducts] = useState<ProductRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const API_BASE_URL = "http://localhost:3200";
  const ITEMS_PER_PAGE = 8;

  // --- Fetch All Sellers ---
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/user/getall`);
      const data: any = res.data;
      const allUsers = Array.isArray(data) ? data : (data.users || []);
      const onlySellers = allUsers.filter((u: any) => u.role?.toLowerCase() === "seller");
      setSellers(onlySellers);
    } catch (error) {
      toast.error("Failed to load sellers");
    } finally {
      setLoading(false);
    }
  };

  // --- View Performance Logic (Fixed Path & Filter) ---
  const handleViewPerformance = async (seller: Seller) => {
    setSelectedSeller(seller);
    setOpenModal(true);
    setHistoryLoading(true);
    setSellerProducts([]); 

    try {
      // আপনার স্ক্রিনশট অনুযায়ী সঠিক এন্ডপয়েন্ট পাথ
      const res = await axios.get<ProductRecord[]>(`${API_BASE_URL}/product/all-sells`);
      
      // ডাটা ফিল্টারিং: ডাটাবেজের userEmail এর সাথে সেলারের ইমেইল মিলানো হচ্ছে
      const filteredAds = res.data.filter(
        (ad) => ad.userEmail === seller.email
      );

      setSellerProducts(filteredAds);
    } catch (err) {
      console.error("Error fetching ads:", err);
      toast.error("Failed to load products");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/user/update-status/${id}`, {
        status: newStatus.toLowerCase(),
      });
      setSellers(prev => prev.map(s => s._id === id ? { ...s, status: newStatus.toLowerCase() } : s));
      toast.success("Status updated");
    } catch (err) { toast.error("Update failed"); }
  };

  useEffect(() => { fetchSellers(); }, []);

  // --- Stats Logic (Checking both 'approved' and 'active' as success) ---
  const stats = useMemo(() => {
    const approvedList = sellerProducts.filter(p => p.status === 'approved' || p.status === 'active');
    const rejectedList = sellerProducts.filter(p => p.status === 'reject' || p.status === 'denied');
    
    return {
      total: sellerProducts.length,
      approved: approvedList.length,
      pending: sellerProducts.filter(p => p.status === 'pending').length,
      rejected: rejectedList.length,
      totalValue: approvedList.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
    };
  }, [sellerProducts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sellers.filter(s => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
  }, [sellers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <Typography variant="h5" fontWeight={800} color="#1E293B">Sellers Performance Center</Typography>
        <Stack direction="row" spacing={2}>
          <IconButton onClick={fetchSellers} sx={{ bgcolor: "#F1F5F9" }}><Refresh /></IconButton>
          <InputBase
            placeholder="Search seller..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            sx={{ bgcolor: "#fff", border: "1px solid #CBD5E1", borderRadius: 2, px: 2, width: 300 }}
          />
        </Stack>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              {["Seller Info", "Status", "Credits", "Balance", "Performance", "Action"].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: "12px", color: "#64748B" }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow> :
              paginated.map((seller) => (
                <TableRow key={seller._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>{seller.name}</Typography>
                    <Typography variant="caption" color="textSecondary">{seller.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={(seller.status || "active").toUpperCase()} size="small" sx={{ fontWeight: 700, bgcolor: seller.status === "blocked" ? "#FEE2E2" : "#DCFCE7", color: seller.status === "blocked" ? "#991B1B" : "#166534" }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{seller.salesCredit || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>${(seller.balance || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewPerformance(seller)} color="primary" sx={{ bgcolor: "#EFF6FF" }}><TrendingUp /></IconButton>
                  </TableCell>
                  <TableCell>
                    <select
                      value={seller.status || "active"}
                      onChange={(e) => handleStatusChange(seller._id, e.target.value)}
                      style={{ padding: "4px", borderRadius: "6px", border: "1px solid #ccc" }}
                    >
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Performance Modal --- */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, bgcolor: "#fff", borderRadius: 4, p: 4, outline: 'none' }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Box>
                <Typography variant="h6" fontWeight={800}>Seller Report: {selectedSeller?.name}</Typography>
                <Typography variant="caption" color="textSecondary">{selectedSeller?.email}</Typography>
            </Box>
            <IconButton onClick={() => setOpenModal(false)}><Close /></IconButton>
          </Box>

          {historyLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> : (
            <>
              <Stack direction="row" spacing={2} mb={4}>
                <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: "center", borderRadius: 3 }}>
                  <ShoppingBag sx={{ color: "#3B82F6", mb: 0.5 }} />
                  <Typography variant="h5" fontWeight={800}>{stats.total}</Typography>
                  <Typography variant="caption" fontWeight={700} color="textSecondary">Total Added</Typography>
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: "center", borderRadius: 3, border: "2px solid #10B981" }}>
                  <MonetizationOn sx={{ color: "#10B981", mb: 0.5 }} />
                  <Typography variant="h5" fontWeight={800} color="#166534">{stats.approved}</Typography>
                  <Typography variant="caption" fontWeight={700} color="#166534">Sells (Approved)</Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: "center", borderRadius: 3 }}>
                  <HourglassEmpty sx={{ color: "#F59E0B", mb: 0.5 }} />
                  <Typography variant="h5" fontWeight={800}>{stats.pending}</Typography>
                  <Typography variant="caption" fontWeight={700} color="textSecondary">Pending Review</Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: "center", borderRadius: 3 }}>
                  <ErrorOutline sx={{ color: "#EF4444", mb: 0.5 }} />
                  <Typography variant="h5" fontWeight={800}>{stats.rejected}</Typography>
                  <Typography variant="caption" fontWeight={700} color="textSecondary">Total Rejected</Typography>
                </Paper>
              </Stack>

              <Divider sx={{ mb: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2" fontWeight={800}>Product History</Typography>
                <Typography variant="subtitle2" fontWeight={800} color="#10B981">Approved Value: ${stats.totalValue.toFixed(2)}</Typography>
              </Box>

              <TableContainer sx={{ maxHeight: 300, border: "1px solid #eee", borderRadius: 2 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 700 }}>Product Name</TableCell>
                      <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 700 }}>Price</TableCell>
                      <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ bgcolor: "#F8FAFC", fontWeight: 700 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sellerProducts.length === 0 ? (
                        <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No products found for this email in database</TableCell></TableRow>
                    ) : (
                        sellerProducts.map((p) => (
                        <TableRow key={p._id} hover>
                            <TableCell sx={{ fontSize: "13px" }}>{p.name}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>${p.price}</TableCell>
                            <TableCell>
                            <Chip 
                                label={p.status} 
                                size="small" 
                                color={p.status === 'approved' || p.status === 'active' ? 'success' : p.status === 'reject' ? 'error' : 'warning'} 
                                sx={{ fontSize: '10px', fontWeight: 700 }} 
                            />
                            </TableCell>
                            <TableCell sx={{ fontSize: "12px" }}>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Modal>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
      </Box>
    </Box>
  );
};

export default SellerAccount;