import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, InputBase, Pagination, IconButton,
  Modal, Chip, Stack, Divider, List, ListItem, ListItemText, Avatar, LinearProgress, Rating
} from "@mui/material";
import { 
  Refresh, Close, TrendingUp, ShoppingBag, 
  MonetizationOn, HourglassEmpty, ErrorOutline, Info, Phone, Email, Event, 
  WorkspacePremium, Speed, Star, Person
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
  balance?: number;
  countryCode?: string;
  accountCreationDate?: string;
  subscribedPlan?: string; 
}

interface ProductRecord {
  _id: string;
  name: string;
  price: string | number;
  status: string; 
  createdAt: string;
  userEmail: string;
}

// নতুন রিভিউ টাইপ
interface ReviewRecord {
  _id: string;
  userEmail: string; 
  comment: string;
  rating: number;
  createdAt: string;
}

const SellerAccount: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [sellerProducts, setSellerProducts] = useState<ProductRecord[]>([]);
  const [sellerReviews, setSellerReviews] = useState<ReviewRecord[]>([]); // রিভিউ স্টেট
  const [historyLoading, setHistoryLoading] = useState(false);
  
  const [openPerformanceModal, setOpenPerformanceModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const API_BASE_URL = "http://localhost:3200";
  const ITEMS_PER_PAGE = 8;

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/user/getall`);
      const data = res.data as any; 
      const allUsers = Array.isArray(data) ? data : (data.users || []);
      const onlySellers = allUsers.filter((u: any) => u.role?.toLowerCase() === "seller");
      setSellers(onlySellers);
    } catch (error) {
      toast.error("Failed to load sellers");
    } finally {
      setLoading(false);
    }
  };

  // রিভিউ ফেচ করার জন্য হ্যান্ডলার
  const handleOpenDetails = async (seller: Seller) => {
    setSelectedSeller(seller);
    setOpenDetailsModal(true);
    setHistoryLoading(true);
    setSellerReviews([]);

    try {
      // আপনার দেওয়া রিভিউ এন্ডপয়েন্ট
      const res = await axios.get(`${API_BASE_URL}/rating/seller/${seller.email}`);
      setSellerReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading reviews", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleViewPerformance = async (seller: Seller) => {
    setSelectedSeller(seller);
    setOpenPerformanceModal(true);
    setHistoryLoading(true);
    setSellerProducts([]); 

    try {
      const res = await axios.get<ProductRecord[]>(`${API_BASE_URL}/product/all-sells`);
      const filteredAds = res.data.filter((ad) => ad.userEmail === seller.email);
      setSellerProducts(filteredAds);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => { fetchSellers(); }, []);

  const stats = useMemo(() => {
    const approvedList = sellerProducts.filter(p => p.status === 'approved' || p.status === 'active');
    const total = sellerProducts.length;
    
    // এভারেজ রেটিং ক্যালকুলেশন
    const avgRating = sellerReviews.length > 0 
      ? sellerReviews.reduce((acc, curr) => acc + curr.rating, 0) / sellerReviews.length 
      : 0;

    return {
      total,
      approved: approvedList.length,
      successRate: total > 0 ? (approvedList.length / total) * 100 : 0,
      avgRating
    };
  }, [sellerProducts, sellerReviews]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sellers.filter(s => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
  }, [sellers, search]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <Typography variant="h5" fontWeight={800}>Sellers Management</Typography>
        <Stack direction="row" spacing={2}>
          <IconButton onClick={fetchSellers}><Refresh /></IconButton>
          <InputBase
            placeholder="Search seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ bgcolor: "#fff", border: "1px solid #CBD5E1", borderRadius: 2, px: 2, width: 300 }}
          />
        </Stack>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              {["Seller Info", "Active Plan", "Balance", "Performance", "Details"].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: "12px", color: "#64748B" }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow> :
              paginated.map((seller) => (
                <TableRow key={seller._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: '#6366F1' }}>{seller.name[0]}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{seller.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{seller.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={seller.subscribedPlan || "BASIC"} size="small" sx={{ fontWeight: 800, bgcolor: '#F1F5F9', fontSize: '10px' }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>${(seller.balance || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewPerformance(seller)} color="primary"><TrendingUp /></IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDetails(seller)} sx={{ bgcolor: "#F1F5F9" }}><Info color="action" /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Seller Details & Real Rating Modal --- */}
      <Modal open={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, bgcolor: "#fff", borderRadius: 4, p: 4, outline: 'none', boxShadow: 24 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight={800}>Seller Insights</Typography>
            <IconButton onClick={() => setOpenDetailsModal(false)}><Close /></IconButton>
          </Box>
          
          <Stack alignItems="center" mb={3}>
            <Avatar sx={{ width: 70, height: 70, mb: 1, bgcolor: '#6366F1' }}>{selectedSeller?.name?.[0]}</Avatar>
            <Typography variant="h6" fontWeight={800}>{selectedSeller?.name}</Typography>
            {/* গড় রেটিং প্রদর্শন */}
            <Stack direction="row" alignItems="center" spacing={1}>
                <Rating value={stats.avgRating} precision={0.5} readOnly size="small" />
                <Typography variant="caption" fontWeight={700}>({stats.avgRating.toFixed(1)})</Typography>
            </Stack>
            <Typography variant="caption" color="textSecondary">{sellerReviews.length} total reviews</Typography>
          </Stack>

          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="subtitle2" fontWeight={800} color="primary" mb={1}>Recent Reviews</Typography>
          
          <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
            {historyLoading ? <Box sx={{ textAlign: 'center', py: 2 }}><CircularProgress size={24} /></Box> : (
              sellerReviews.length === 0 ? (
                <Typography variant="caption" align="center" display="block" color="textSecondary" sx={{ py: 2 }}>No reviews yet for this seller.</Typography>
              ) : (
                sellerReviews.map((rev) => (
                  <Paper key={rev._id} variant="outlined" sx={{ p: 2, mb: 1.5, borderRadius: 2, bgcolor: '#F8FAFC' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Person sx={{ fontSize: 16, color: '#64748B' }} />
                            <Typography variant="caption" fontWeight={800}>{rev.userEmail.split('@')[0]}</Typography>
                        </Stack>
                        <Rating value={rev.rating} size="small" readOnly sx={{ fontSize: 12 }} />
                    </Stack>
                    <Typography variant="body2" sx={{ color: '#334155', fontStyle: 'italic', fontSize: '13px' }}>
                        "{rev.comment}"
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1, textAlign: 'right' }}>
                        {new Date(rev.createdAt).toLocaleDateString()}
                    </Typography>
                  </Paper>
                ))
              )
            )}
          </Box>
        </Box>
      </Modal>

      {/* --- Performance Modal --- */}
      <Modal open={openPerformanceModal} onClose={() => setOpenPerformanceModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, bgcolor: "#fff", borderRadius: 4, p: 4, outline: 'none' }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={800}>Live Performance Center</Typography>
            <IconButton onClick={() => setOpenPerformanceModal(false)}><Close /></IconButton>
          </Box>

          {historyLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> : (
            <>
              <Box sx={{ mb: 4, p: 3, bgcolor: '#EEF2FF', borderRadius: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Speed color="primary" /> Store Health (Success Rate)
                    </Typography>
                    <Typography variant="h6" fontWeight={800} color="primary">{stats.successRate.toFixed(1)}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={stats.successRate} sx={{ height: 10, borderRadius: 5 }} />
              </Box>

              <Stack direction="row" spacing={2} mb={4}>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center', bgcolor: '#F1F5F9', borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight={800}>{stats.total}</Typography>
                  <Typography variant="caption" fontWeight={700}>Total Ads</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center', bgcolor: '#DCFCE7', borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight={800} color="#166534">{stats.approved}</Typography>
                  <Typography variant="caption" fontWeight={700} color="#166534">Approved</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center', bgcolor: '#E0E7FF', borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight={800} color="#3730A3">{sellerReviews.length}</Typography>
                  <Typography variant="caption" fontWeight={700} color="#3730A3">Reviews</Typography>
                </Paper>
              </Stack>
            </>
          )}
        </Box>
      </Modal>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination count={Math.ceil(filtered.length / ITEMS_PER_PAGE)} page={page} onChange={(_, p) => setPage(p)} color="primary" />
      </Box>
    </Box>
  );
};

export default SellerAccount;