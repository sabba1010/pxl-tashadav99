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
  WorkspacePremium, Speed, Star, Person, AccountBalanceWallet
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
  balance?: number; // সেলারের ব্যালেন্স
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
  const [sellerReviews, setSellerReviews] = useState<ReviewRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  const [openPerformanceModal, setOpenPerformanceModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const API_BASE_URL = "https://vps-backend-server-beta.vercel.app";
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

  const handleOpenDetails = async (seller: Seller) => {
    setSelectedSeller(seller);
    setOpenDetailsModal(true);
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/rating/seller/${seller.email}`);
      setSellerReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
    finally { setHistoryLoading(false); }
  };

  const handleViewPerformance = async (seller: Seller) => {
    setSelectedSeller(seller);
    setOpenPerformanceModal(true);
    setHistoryLoading(true);
    try {
      const res = await axios.get<ProductRecord[]>(`${API_BASE_URL}/product/all-sells`);
      const filteredAds = res.data.filter((ad) => ad.userEmail === seller.email);
      setSellerProducts(filteredAds);
    } catch (err) { toast.error("Failed to load products"); }
    finally { setHistoryLoading(false); }
  };

  useEffect(() => { fetchSellers(); }, []);

  const stats = useMemo(() => {
    const approvedList = sellerProducts.filter(p => p.status === 'approved' || p.status === 'active');
    const total = sellerProducts.length;
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
              <TableCell sx={{ fontWeight: 700, fontSize: "12px", color: "#64748B" }}>Seller Info</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "12px", color: "#64748B" }}>Active Plan</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "12px", color: "#64748B" }}>Available Balance</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "12px", color: "#64748B" }}>Performance</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "12px", color: "#64748B" }}>Details</TableCell>
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
                  {/* Table Balance Highlighting */}
                  <TableCell>
                    <Typography variant="body2" fontWeight={900} color="#10B981">
                      ${(seller.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography>
                  </TableCell>
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

      {/* --- Details Modal with Balance Section --- */}
      <Modal open={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, bgcolor: "#fff", borderRadius: 4, p: 4, outline: 'none' }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight={800}>Seller Profile</Typography>
            <IconButton onClick={() => setOpenDetailsModal(false)}><Close /></IconButton>
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: '#6366F1' }}>{selectedSeller?.name?.[0]}</Avatar>
            <Box>
                <Typography variant="h6" fontWeight={800}>{selectedSeller?.name}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={stats.avgRating} precision={0.5} readOnly size="small" />
                    <Typography variant="caption" fontWeight={700}>({stats.avgRating.toFixed(1)})</Typography>
                </Stack>
            </Box>
          </Stack>

          {/* Wallet Balance Card */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#ECFDF5', borderColor: '#10B981' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AccountBalanceWallet sx={{ color: '#10B981' }} />
                <Typography variant="subtitle2" fontWeight={800} color="#065F46">Current Balance</Typography>
            </Box>
            <Typography variant="h6" fontWeight={900} color="#059669">
                ${(selectedSeller?.balance || 0).toFixed(2)}
            </Typography>
          </Paper>

          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" fontWeight={800} color="primary" mb={1}>Contact Info</Typography>
          <List dense>
            <ListItem><Email sx={{ fontSize: 18, mr: 1, color: '#64748B' }} /><ListItemText secondary={selectedSeller?.email} /></ListItem>
            <ListItem><Phone sx={{ fontSize: 18, mr: 1, color: '#64748B' }} /><ListItemText secondary={selectedSeller?.phone} /></ListItem>
          </List>
        </Box>
      </Modal>

      {/* --- Performance Modal with Balance Stats --- */}
      <Modal open={openPerformanceModal} onClose={() => setOpenPerformanceModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, bgcolor: "#fff", borderRadius: 4, p: 4, outline: 'none' }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={800}>Financial & Store Performance</Typography>
            <IconButton onClick={() => setOpenPerformanceModal(false)}><Close /></IconButton>
          </Box>

          <Stack direction="row" spacing={2} mb={4}>
            {/* Balance Card */}
            <Paper sx={{ p: 2, flex: 1.5, textAlign: 'left', bgcolor: '#065F46', color: '#fff', borderRadius: 3 }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Current Wallet Balance</Typography>
                <Typography variant="h4" fontWeight={900}>
                    ${(selectedSeller?.balance || 0).toLocaleString()}
                </Typography>
                <Chip label="Withdrawable" size="small" sx={{ mt: 1, bgcolor: '#10B981', color: '#fff', fontWeight: 700, fontSize: '10px' }} />
            </Paper>

            <Paper sx={{ p: 2, flex: 1, textAlign: 'center', bgcolor: '#F1F5F9', borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={800}>{stats.total}</Typography>
                <Typography variant="caption" fontWeight={700}>Total Ads</Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, textAlign: 'center', bgcolor: '#F1F5F9', borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={800}>{stats.approved}</Typography>
                <Typography variant="caption" fontWeight={700}>Approved</Typography>
            </Paper>
          </Stack>

          <Box sx={{ p: 3, bgcolor: '#EEF2FF', borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Speed color="primary" /> Store Success Rate
                </Typography>
                <Typography variant="h6" fontWeight={800} color="primary">{stats.successRate.toFixed(1)}%</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={stats.successRate} sx={{ height: 10, borderRadius: 5 }} />
          </Box>
        </Box>
      </Modal>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination count={Math.ceil(filtered.length / ITEMS_PER_PAGE)} page={page} onChange={(_, p) => setPage(p)} color="primary" />
      </Box>
    </Box>
  );
};

export default SellerAccount;