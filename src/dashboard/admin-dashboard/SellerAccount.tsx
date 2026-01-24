import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, InputBase, Pagination, IconButton,
  Modal, Chip, Stack, Divider, List, ListItem, ListItemText, Avatar, LinearProgress, Rating
} from "@mui/material";
import { 
  Refresh, Close, TrendingUp, Info, Phone, Email, 
  AccountBalanceWallet, Speed, CalendarMonth
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

interface ReviewRecord {
  _id: string;
  userEmail: string; 
  comment: string;
  rating: number;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;
const API_BASE_URL = "http://localhost:3200";

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
    return sellers.filter(s => 
      s.name?.toLowerCase().includes(q) || 
      s.email?.toLowerCase().includes(q) ||
      s.phone?.includes(q)
    );
  }, [sellers, search]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #E2E8F0" }}>
        <Typography variant="h5" fontWeight={700}>Sellers Management</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton onClick={fetchSellers} sx={{ bgcolor: "#F1F5F9" }}><Refresh /></IconButton>
          <InputBase
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            sx={{ border: "1px solid #CBD5E1", borderRadius: "8px", px: 2, width: 320, bgcolor: "white" }}
          />
        </Box>
      </Paper>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>SELLER INFO</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>WHATSAPP</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>ACTIVE PLAN</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>BALANCE</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>PERFORMANCE</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>DETAILS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress sx={{ my: 4 }} /></TableCell></TableRow>
            ) : (
              paginated.map((seller) => (
                <TableRow key={seller._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, fontSize: "14px", bgcolor: "#6366F1" }}>{seller.name[0]}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{seller.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{seller.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#475569", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Phone sx={{ fontSize: 14, color: "#94A3B8" }} /> {seller.phone || "N/A"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip 
                      label={seller.subscribedPlan?.toUpperCase() || "BASIC"} 
                      size="small" 
                      sx={{ fontWeight: 700, bgcolor: '#F1F5F9', color: '#475569', borderRadius: '6px' }} 
                    />
                  </TableCell>

                  <TableCell sx={{ fontWeight: 700, color: "#10B981" }}>
                    ${(seller.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleViewPerformance(seller)} color="primary">
                      <TrendingUp sx={{ fontSize: 20 }} />
                    </IconButton>
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleOpenDetails(seller)} sx={{ bgcolor: "#F1F5F9" }}>
                      <Info sx={{ fontSize: 20, color: "#64748B" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Pagination 
            count={Math.ceil(filtered.length / ITEMS_PER_PAGE)} 
            page={page} 
            onChange={(_, v) => setPage(v)} 
            color="primary" 
          />
        </Box>
      </TableContainer>

      {/* Profile Details Modal */}
      <Modal open={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 480, bgcolor: "white", p: 4, borderRadius: 3, boxShadow: 24, outline: 'none' }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={700}>Seller Profile</Typography>
            <IconButton onClick={() => setOpenDetailsModal(false)}><Close /></IconButton>
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: '#6366F1', fontSize: 24 }}>{selectedSeller?.name?.[0]}</Avatar>
            <Box>
                <Typography variant="subtitle1" fontWeight={700}>{selectedSeller?.name}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={stats.avgRating} precision={0.5} readOnly size="small" />
                    <Typography variant="caption" fontWeight={700} color="textSecondary">({stats.avgRating.toFixed(1)})</Typography>
                </Stack>
            </Box>
          </Stack>

          <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F0FDF4', borderColor: '#BBF7D0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AccountBalanceWallet sx={{ color: '#16A34A' }} />
                <Typography variant="body2" fontWeight={700} color="#166534">Available Balance</Typography>
            </Box>
            <Typography variant="h6" fontWeight={800} color="#15803D">
                ${(selectedSeller?.balance || 0).toFixed(2)}
            </Typography>
          </Paper>

          <Typography variant="caption" fontWeight={700} color="textSecondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>Contact Details</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List dense disablePadding>
            <ListItem sx={{ px: 0 }}>
                <Email sx={{ fontSize: 18, mr: 2, color: '#94A3B8' }} />
                <ListItemText primary={<Typography variant="body2" fontWeight={600}>{selectedSeller?.email}</Typography>} />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
                <Phone sx={{ fontSize: 18, mr: 2, color: '#94A3B8' }} />
                <ListItemText primary={<Typography variant="body2" fontWeight={600}>{selectedSeller?.phone || "N/A"}</Typography>} />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
                <CalendarMonth sx={{ fontSize: 18, mr: 2, color: '#94A3B8' }} />
                <ListItemText 
                    primary={<Typography variant="body2" fontWeight={600}>Joined: {selectedSeller?.accountCreationDate ? new Date(selectedSeller.accountCreationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</Typography>} 
                />
            </ListItem>
          </List>
        </Box>
      </Modal>

      {/* Performance Modal */}
      <Modal open={openPerformanceModal} onClose={() => setOpenPerformanceModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, bgcolor: "white", p: 4, borderRadius: 3, boxShadow: 24, outline: 'none' }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={700}>Performance Analytics</Typography>
            <IconButton onClick={() => setOpenPerformanceModal(false)}><Close /></IconButton>
          </Box>

          <Stack direction="row" spacing={2} mb={4}>
            <Paper elevation={0} sx={{ p: 2, flex: 1.5, bgcolor: '#1E293B', color: '#fff', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600 }}>STORE WALLET</Typography>
                <Typography variant="h4" fontWeight={800} sx={{ my: 0.5 }}>
                    ${(selectedSeller?.balance || 0).toLocaleString()}
                </Typography>
                <Chip label="Withdrawable" size="small" sx={{ bgcolor: '#10B981', color: '#fff', fontWeight: 700, height: 20, fontSize: '10px' }} />
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: 'center', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                <Typography variant="h5" fontWeight={800} color="primary">{stats.total}</Typography>
                <Typography variant="caption" fontWeight={700} color="textSecondary">TOTAL ADS</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: 'center', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                <Typography variant="h5" fontWeight={800} color="#10B981">{stats.approved}</Typography>
                <Typography variant="caption" fontWeight={700} color="textSecondary">APPROVED</Typography>
            </Paper>
          </Stack>

          <Box sx={{ p: 3, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
            <Stack direction="row" justifyContent="space-between" mb={1.5}>
                <Typography variant="body2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Speed sx={{ color: '#6366F1' }} /> Store Success Rate
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} color="primary">{stats.successRate.toFixed(1)}%</Typography>
            </Stack>
            <LinearProgress 
                variant="determinate" 
                value={stats.successRate} 
                sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { borderRadius: 4 } }} 
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SellerAccount;