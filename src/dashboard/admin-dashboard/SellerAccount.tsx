import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  Box, Paper, InputBase, IconButton, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Avatar, Modal, Select, MenuItem, FormControl, Chip, Stack, LinearProgress, Divider, Tooltip, Link
} from "@mui/material";
import { 
  Refresh, Close, WhatsApp, TrendingUp, 
  AccountBalanceWallet, Stars, Chat as ChatIcon, Send, Email
} from "@mui/icons-material";
import { toast } from "sonner";

/* ====================== INTERFACES ====================== */
interface Product {
  userEmail?: string;
  sellerEmail?: string;
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
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSeller, setChatSeller] = useState<Seller | null>(null);

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

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["all-products-global"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/product/getall`);
      return res.data as Product[];
    },
  });

  /* ====================== CHAT & MAIL ACTIONS ====================== */

  // 1. WhatsApp Action
  const openWhatsApp = (phone?: string) => {
    if (!phone) {
      toast.error("Phone number missing");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  // 2. Direct Mail Action
  const sendEmail = (email: string) => {
    window.location.href = `mailto:${email}?subject=Support from Admin&body=Hello ${email},`;
  };

  const filteredSellers = useMemo(() => {
    return sellers.filter((s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.phone?.includes(searchTerm) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sellers, searchTerm]);

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Search Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #E2E8F0" }}>
        <Typography variant="h5" fontWeight={800} color="#1E293B">Sellers Management</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <InputBase
            placeholder="Search name, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ border: "1px solid #CBD5E1", borderRadius: "10px", px: 2, width: 300, bgcolor: "white", height: 40 }}
          />
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ["all-sellers"] })} sx={{ bgcolor: "#F1F5F9" }}>
            <Refresh />
          </IconButton>
        </Box>
      </Paper>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }}>SELLER / EMAIL</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }}>PHONE (WHATSAPP)</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }}>PLATFORM CHAT</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }}>BALANCE</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748B", fontSize: "12px" }} align="center">STATS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isSellersLoading ? (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress sx={{ m: 3 }} /></TableCell></TableRow>
            ) : filteredSellers.map((s) => (
              <TableRow key={s._id} hover>
                {/* Email and Name Section */}
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 36, height: 36, bgcolor: "#6366F1", fontWeight: 700 }}>{s.name?.[0]}</Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight={700} color="#1E293B">{s.name}</Typography>
                        <Tooltip title="Click to Send Mail">
                          <Link 
                            component="button" 
                            variant="caption" 
                            onClick={() => sendEmail(s.email)}
                            sx={{ color: "text.secondary", textDecoration: 'none', "&:hover": { color: "#3B82F6" } }}
                          >
                            {s.email}
                          </Link>
                        </Tooltip>
                    </Box>
                  </Stack>
                </TableCell>
                
                {/* Phone Number Section */}
                <TableCell>
                  <Tooltip title="Open WhatsApp Chat">
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      alignItems="center" 
                      onClick={() => openWhatsApp(s.phone)}
                      sx={{ cursor: 'pointer', "&:hover": { color: "#25D366" } }}
                    >
                      <WhatsApp sx={{ color: "#25D366", fontSize: 18 }} />
                      <Typography variant="body2" fontWeight={600} sx={{ borderBottom: '1px dashed #25D366' }}>
                        {s.phone || "N/A"}
                      </Typography>
                    </Stack>
                  </Tooltip>
                </TableCell>

                {/* Inside Chat Section */}
                <TableCell>
                    <IconButton onClick={() => { setChatSeller(s); setChatOpen(true); }} sx={{ color: "#3B82F6", bgcolor: "#EFF6FF" }}>
                      <ChatIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" fontWeight={800} color="#10B981">${s.balance?.toFixed(2)}</Typography>
                </TableCell>

                <TableCell>
                   <Chip 
                    label={s.status?.toUpperCase() || "ACTIVE"} 
                    size="small" 
                    sx={{ 
                      fontWeight: 900, fontSize: "10px", 
                      bgcolor: s.status === 'blocked' ? '#FEF2F2' : '#ECFDF5', 
                      color: s.status === 'blocked' ? '#EF4444' : '#10B981' 
                    }} 
                   />
                </TableCell>

                <TableCell align="center">
                  <IconButton onClick={() => { setSelectedSeller(s); setOpen(true); }} sx={{ color: "#64748B" }}>
                    <TrendingUp sx={{ fontSize: 20 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Inside Chat Modal (Existing logic) */}
      <Modal open={chatOpen} onClose={() => setChatOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: "white", width: 450, borderRadius: 4, display: 'flex', flexDirection: 'column', height: 550, outline: 'none', overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: "#3B82F6", color: "white", display: 'flex', justifyContent: 'space-between' }}>
            <Typography fontWeight={700}>Chat with {chatSeller?.name}</Typography>
            <IconButton onClick={() => setChatOpen(false)} size="small" sx={{ color: "white" }}><Close /></IconButton>
          </Box>
          <Box sx={{ flex: 1, bgcolor: "#F8FAFC", p: 2, overflowY: 'auto' }}>
            <Typography variant="caption" color="textSecondary" display="block" textAlign="center">Platform messaging enabled.</Typography>
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1 }}>
            <InputBase fullWidth placeholder="Type message..." sx={{ bgcolor: "#F1F5F9", px: 2, py: 1, borderRadius: 2 }} />
            <IconButton color="primary"><Send /></IconButton>
          </Box>
        </Box>
      </Modal>

      {/* Stats Modal (Simplified) */}
      <Modal open={open} onClose={() => setOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: "white", width: 400, p: 4, borderRadius: 4 }}>
          <Typography variant="h6" fontWeight={800} mb={2}>Quick Stats</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2">Seller: <b>{selectedSeller?.name}</b></Typography>
          <Typography variant="body2">Plan: <b>{selectedSeller?.subscribedPlan || "FREE"}</b></Typography>
          <Typography variant="body2" mt={1}>Balance: <b style={{ color: '#10B981' }}>${selectedSeller?.balance}</b></Typography>
        </Box>
      </Modal>

    </Box>
  );
};

export default SellerAccount;