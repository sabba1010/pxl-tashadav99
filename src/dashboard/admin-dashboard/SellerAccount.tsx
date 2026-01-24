import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  Box, Paper, InputBase, IconButton, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Avatar, Modal, Select, MenuItem, FormControl, Chip, Stack, LinearProgress, Divider
} from "@mui/material";
import { 
  Refresh, Close, FiberManualRecord, WhatsApp, TrendingUp, 
  AccountBalanceWallet, Stars
} from "@mui/icons-material";
import { toast } from "sonner";

/* ====================== INTERFACES ====================== */
interface Product {
  userEmail?: string;
  sellerEmail?: string; // Onek somoy backend e sellerEmail thake
  status: string;
  title: string;
  price: number;
}

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  balance: number;
  status?: string;
  subscribedPlan?: string;
}

const BASE_URL = "http://localhost:3200";

const SellerAccount: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  /* ====================== DATA FETCHING ====================== */
  const { data: sellers = [], isLoading: isSellersLoading } = useQuery<Seller[]>({
    queryKey: ["all-sellers"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/user/getall`);
      const data = res.data as any;
      const allData: Seller[] = Array.isArray(data) ? data : (data.users || []);
      return allData.filter((u) => u.role?.toLowerCase() === "seller");
    },
  });

  const { data: allProducts = [], isLoading: isProductsLoading } = useQuery<Product[]>({
    queryKey: ["all-products-global"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/product/getall`);
      return res.data as Product[];
    },
  });

  /* ====================== ACTIONS ====================== */
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await axios.patch(`${BASE_URL}/api/user/update-status/${userId}`, { status: newStatus.toLowerCase() });
      toast.success("Status updated!");
      queryClient.invalidateQueries({ queryKey: ["all-sellers"] });
    } catch (err) { toast.error("Update failed"); }
  };

  /* ====================== STATS LOGIC ====================== */
  const getSellerStats = (email: string | undefined) => {
    if (!email || !allProducts.length) {
      return { total: 0, approved: 0, successRate: 0, ads: [] };
    }

    // Checking both userEmail and sellerEmail for safety
    const sellerAds = allProducts.filter(
      (p) => (p.userEmail?.toLowerCase() === email.toLowerCase()) || 
             (p.sellerEmail?.toLowerCase() === email.toLowerCase())
    );

    const approved = sellerAds.filter(
      (p) => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'approved'
    ).length;

    const successRate = sellerAds.length > 0 ? (approved / sellerAds.length) * 100 : 0;

    return { total: sellerAds.length, approved, successRate, ads: sellerAds };
  };

  const filteredSellers = useMemo(() => {
    return sellers.filter((s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.phone?.includes(searchTerm)
    );
  }, [sellers, searchTerm]);

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #E2E8F0" }}>
        <Typography variant="h5" fontWeight={800} color="#1E293B">Sellers Management</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <InputBase
            placeholder="Search seller name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ border: "1px solid #CBD5E1", borderRadius: "10px", px: 2, width: 300, bgcolor: "white", height: 40 }}
          />
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ["all-sellers"] })} sx={{ bgcolor: "#F1F5F9" }}><Refresh /></IconButton>
        </Box>
      </Paper>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }}>SELLER</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }}>WHATSAPP</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }}>PLAN</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }}>BALANCE</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }} align="center">PERFORMANCE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(isSellersLoading || isProductsLoading) ? (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress sx={{ m: 3 }} /></TableCell></TableRow>
            ) : filteredSellers.map((s) => (
              <TableRow key={s._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 36, height: 36, bgcolor: "#6366F1", fontWeight: 700 }}>{s.name[0]}</Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight={700} color="#1E293B">{s.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{s.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                   <Stack direction="row" spacing={1} alignItems="center">
                    <WhatsApp sx={{ color: "#25D366", fontSize: 16 }} />
                    <Typography variant="body2" fontWeight={600}>{s.phone || "N/A"}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip label={s.subscribedPlan || "FREE"} size="small" sx={{ fontWeight: 800, fontSize: "10px", bgcolor: "#F1F5F9" }} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={800} color="#10B981">${s.balance?.toFixed(2)}</Typography>
                </TableCell>
                <TableCell>
                   <FormControl size="small">
                    <Select
                      value={s.status?.toUpperCase() || "ACTIVE"}
                      onChange={(e) => handleStatusChange(s._id, e.target.value)}
                      sx={{ borderRadius: "8px", fontWeight: 800, fontSize: "10px", height: 28, minWidth: 100, bgcolor: s.status === 'blocked' ? '#FEF2F2' : '#ECFDF5', color: s.status === 'blocked' ? '#EF4444' : '#10B981', "& fieldset": { border: 'none' } }}
                    >
                      <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                      <MenuItem value="BLOCKED">BLOCKED</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => { setSelectedSeller(s); setOpen(true); }} sx={{ color: "#3B82F6", bgcolor: "#EFF6FF", "&:hover": { bgcolor: "#DBEAFE" } }}>
                    <TrendingUp sx={{ fontSize: 20 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Analytics Modal */}
      <Modal open={open} onClose={() => setOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: "white", width: 550, borderRadius: 4, boxShadow: 24, outline: 'none', overflow: 'hidden' }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
            <Typography variant="h6" fontWeight={800}>Performance Analytics</Typography>
            <IconButton onClick={() => setOpen(false)}><Close /></IconButton>
          </Box>
          
          <Box sx={{ p: 4 }}>
            {selectedSeller && (() => {
              const stats = getSellerStats(selectedSeller.email);
              return (
                <>
                  <Stack direction="row" spacing={3} mb={4}>
                    {/* Dark Wallet Card */}
                    <Box sx={{ 
                      bgcolor: "#1E293B", color: "white", p: 3, borderRadius: 4, flex: 1.2,
                      backgroundImage: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                      position: 'relative', overflow: 'hidden'
                    }}>
                      <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700 }}>STORE WALLET</Typography>
                      <Typography variant="h3" fontWeight={900} sx={{ my: 1 }}>${selectedSeller.balance?.toFixed(1) || "0.0"}</Typography>
                      <Chip label="Withdrawable" size="small" sx={{ bgcolor: "#10B981", color: "white", fontWeight: 800, fontSize: "10px", height: 20 }} />
                      <AccountBalanceWallet sx={{ position: 'absolute', right: -10, bottom: -10, fontSize: 80, opacity: 0.1 }} />
                    </Box>

                    {/* Stats Boxes */}
                    <Stack spacing={2} sx={{ flex: 1 }}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 3, border: '1px solid #E2E8F0' }}>
                        <Typography variant="h5" fontWeight={900} color="#3B82F6">{stats.total}</Typography>
                        <Typography variant="caption" fontWeight={800} color="#64748B">TOTAL ADS</Typography>
                      </Paper>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 3, border: '1px solid #E2E8F0' }}>
                        <Typography variant="h5" fontWeight={900} color="#10B981">{stats.approved}</Typography>
                        <Typography variant="caption" fontWeight={800} color="#64748B">APPROVED</Typography>
                      </Paper>
                    </Stack>
                  </Stack>

                  {/* Success Rate Bar */}
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4, mb: 4, bgcolor: "#FBFDFF", border: '1px solid #F1F5F9' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                         <Stars sx={{ fontSize: 18, color: "#3B82F6" }} />
                         <Typography variant="body2" fontWeight={800}>Store Success Rate</Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={900} color="#3B82F6">{stats.successRate.toFixed(1)}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.successRate} 
                      sx={{ height: 8, borderRadius: 5, bgcolor: "#E2E8F0", "& .MuiLinearProgress-bar": { borderRadius: 5 } }} 
                    />
                  </Paper>

                  <Divider sx={{ mb: 2 }} />

                  {/* List of Products Preview */}
                  <Typography variant="caption" fontWeight={800} color="#64748B" sx={{ mb: 1, display: 'block' }}>RECENT LISTINGS</Typography>
                  <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                    {stats.ads.length > 0 ? stats.ads.slice(0, 5).map((ad, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderBottom: '1px solid #F8FAFC' }}>
                        <Typography variant="body2" fontWeight={600} fontSize="13px">{ad.title}</Typography>
                        <Typography variant="body2" fontWeight={800} color="#10B981" fontSize="13px">${ad.price}</Typography>
                      </Box>
                    )) : (
                      <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>No products found</Typography>
                    )}
                  </Box>
                </>
              );
            })()}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SellerAccount;