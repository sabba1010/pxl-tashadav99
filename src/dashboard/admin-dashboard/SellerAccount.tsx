import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, InputBase, Pagination, IconButton,
  Modal, Chip, Stack, Divider, List, ListItem, ListItemText, Avatar
} from "@mui/material";
import { 
  Refresh, Close, TrendingUp, ShoppingBag, 
  MonetizationOn, HourglassEmpty, ErrorOutline, Info, Phone, Email, Event, CreditCard, WorkspacePremium 
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
  salesCredit?: number;
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

const SellerAccount: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [sellerProducts, setSellerProducts] = useState<ProductRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  const [openPerformanceModal, setOpenPerformanceModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const API_BASE_URL = "http://localhost:3200";
  const ITEMS_PER_PAGE = 8;

  // --- Fetch All Sellers (FIXED TS ERROR) ---
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/user/getall`);
      
      // এখানে explicitly 'any' কাস্ট করা হয়েছে যাতে unknown এরর না আসে
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

  const handleOpenDetails = (seller: Seller) => {
    setSelectedSeller(seller);
    setOpenDetailsModal(true);
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/user/update-status/${id}`, { status: newStatus.toLowerCase() });
      setSellers(prev => prev.map(s => s._id === id ? { ...s, status: newStatus.toLowerCase() } : s));
      toast.success("Status updated");
    } catch (err) { toast.error("Update failed"); }
  };

  useEffect(() => { fetchSellers(); }, []);

  const stats = useMemo(() => {
    const approvedList = sellerProducts.filter(p => p.status === 'approved' || p.status === 'active');
    return {
      total: sellerProducts.length,
      approved: approvedList.length,
      pending: sellerProducts.filter(p => p.status === 'pending').length,
      rejected: sellerProducts.filter(p => p.status === 'reject' || p.status === 'denied').length,
      totalValue: approvedList.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
    };
  }, [sellerProducts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sellers.filter(s => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
  }, [sellers, search]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <Typography variant="h5" fontWeight={800}>Sellers Performance Center</Typography>
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

      {/* Main Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              {["Seller Info", "Status", "Balance", "Details", "Performance", "Action"].map(h => (
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
                    <Chip label={(seller.status || "active").toUpperCase()} size="small" color={seller.status === "blocked" ? "error" : "success"} sx={{ fontWeight: 700 }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>${(seller.balance || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDetails(seller)} sx={{ bgcolor: "#F1F5F9" }}><Info color="action" /></IconButton>
                  </TableCell>
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

      {/* --- Seller Details Modal --- */}
      <Modal open={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 450, bgcolor: "#fff", borderRadius: 4, p: 4, outline: 'none', boxShadow: 24 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={800}>Seller Information</Typography>
            <IconButton onClick={() => setOpenDetailsModal(false)}><Close /></IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64, margin: '0 auto', mb: 1, bgcolor: '#3B82F6', fontSize: 24 }}>{selectedSeller?.name?.[0].toUpperCase()}</Avatar>
            <Typography variant="h6" fontWeight={700}>{selectedSeller?.name}</Typography>
            <Chip label={selectedSeller?.subscribedPlan || "Basic"} color="primary" variant="outlined" size="small" icon={<WorkspacePremium />} sx={{ mt: 1 }} />
          </Box>

          <List>
            <ListItem sx={{ px: 0 }}>
              <Email sx={{ mr: 2, color: '#64748B' }} />
              <ListItemText primary="Email Address" secondary={selectedSeller?.email} />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <Phone sx={{ mr: 2, color: '#64748B' }} />
              <ListItemText primary="Phone Number" secondary={`${selectedSeller?.countryCode || ''} ${selectedSeller?.phone || 'N/A'}`} />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <CreditCard sx={{ mr: 2, color: '#64748B' }} />
              <ListItemText primary="Available Balance" secondary={`$${selectedSeller?.balance?.toFixed(2) || '0.00'}`} />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <Event sx={{ mr: 2, color: '#64748B' }} />
              <ListItemText 
                primary="Account Created" 
                secondary={selectedSeller?.accountCreationDate ? new Date(selectedSeller.accountCreationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'} 
              />
            </ListItem>
          </List>
        </Box>
      </Modal>

      {/* --- Performance Modal --- */}
      <Modal open={openPerformanceModal} onClose={() => setOpenPerformanceModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, bgcolor: "#fff", borderRadius: 4, p: 4, outline: 'none', boxShadow: 24 }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={800}>Performance: {selectedSeller?.name}</Typography>
            <IconButton onClick={() => setOpenPerformanceModal(false)}><Close /></IconButton>
          </Box>

          {historyLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> : (
            <>
              <Stack direction="row" spacing={2} mb={4}>
                <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: "center", borderRadius: 3 }}>
                  <ShoppingBag sx={{ color: "#3B82F6", mb: 0.5 }} />
                  <Typography variant="h5" fontWeight={800}>{stats.total}</Typography>
                  <Typography variant="caption" fontWeight={700} color="textSecondary">Total Ads</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: "center", borderRadius: 3, border: "2px solid #10B981" }}>
                  <MonetizationOn sx={{ color: "#10B981", mb: 0.5 }} />
                  <Typography variant="h5" fontWeight={800} color="#166534">{stats.approved}</Typography>
                  <Typography variant="caption" fontWeight={700} color="#166534">Approved Sells</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: "center", borderRadius: 3 }}>
                  <HourglassEmpty sx={{ color: "#F59E0B", mb: 0.5 }} />
                  <Typography variant="h5" fontWeight={800}>{stats.pending}</Typography>
                  <Typography variant="caption" fontWeight={700} color="textSecondary">Pending</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: "center", borderRadius: 3 }}>
                  <ErrorOutline sx={{ color: "#EF4444", mb: 0.5 }} />
                  <Typography variant="h5" fontWeight={800}>{stats.rejected}</Typography>
                  <Typography variant="caption" fontWeight={700} color="textSecondary">Rejected</Typography>
                </Paper>
              </Stack>

              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" fontWeight={800} mb={1} color="#10B981">
                Approved Sales Value: ${stats.totalValue.toFixed(2)}
              </Typography>

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
                        <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No products found</TableCell></TableRow>
                    ) : (
                        sellerProducts.map((p) => (
                        <TableRow key={p._id} hover>
                            <TableCell sx={{ fontSize: "13px" }}>{p.name}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>${p.price}</TableCell>
                            <TableCell>
                            <Chip 
                              label={p.status} 
                              size="small" 
                              color={p.status === 'approved' || p.status === 'active' ? 'success' : 'warning'} 
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
        <Pagination count={Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))} page={page} onChange={(_, p) => setPage(p)} color="primary" />
      </Box>
    </Box>
  );
};

export default SellerAccount;