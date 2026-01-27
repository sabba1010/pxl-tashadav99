import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Box, Paper, InputBase, IconButton, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Avatar, Modal, Stack, TextField, Badge, Chip, Grid, LinearProgress
} from "@mui/material";
import { 
  Refresh, Close, Chat, TrendingUp, Send, CheckCircle, 
  AccountBalanceWallet, Stars, ShoppingBag 
} from "@mui/icons-material";
import { toast } from "sonner";

/* ====================== INTERFACES ====================== */
interface IMessage {
  senderEmail: string;
  receiverEmail: string;
  message: string;
}

interface Product {
  _id: string;
  name: string;
  price: string;
  userEmail: string; 
  status: string;    
  categoryIcon?: string;
}

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  salesCredit?: number; 
  subscribedPlan?: string;
  status?: string;
}

const BASE_URL = "http://localhost:3200";
const ADMIN_CHAT_API = `${BASE_URL}/api/adminchat`;

const SellerAccount: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [unreadSellers, setUnreadSellers] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* ====================== DATA FETCHING ====================== */
  
  const { data: sellers = [], isLoading: isSellersLoading } = useQuery<Seller[]>({
    queryKey: ["all-sellers"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/user/getall`);
      // API response handle with proper typing to avoid "users undefined" error
      const rawData = res.data as { users?: Seller[] } | Seller[];
      const sellerList = Array.isArray(rawData) ? rawData : (rawData.users || []);
      const filtered = sellerList.filter((u: any) => u.role?.toLowerCase() === "seller");
      return [...filtered].reverse(); 
    },
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["all-products-sells"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/product/all-sells`);
      return (res.data as Product[]) || [];
    }
  });

  /* ====================== ANALYTICS LOGIC ====================== */
  const performanceData = useMemo(() => {
    if (!selectedSeller) return { total: 0, approved: 0, rate: 0, products: [] as Product[] };
    const myProducts = (allProducts as Product[]).filter(p => p.userEmail === selectedSeller.email);
    const approved = myProducts.filter(p => p.status === "active").length;
    const total = myProducts.length;
    const rate = total > 0 ? (approved / total) * 100 : 0;
    return { total, approved, rate, products: myProducts.slice(0, 5) };
  }, [selectedSeller, allProducts]);

  /* ====================== CHAT LOGIC ====================== */
  const checkNotifications = async () => {
    if (sellers.length === 0) return;
    try {
      const newUnreadStatus: Record<string, boolean> = { ...unreadSellers };
      for (const seller of sellers) {
        const res = await axios.get<IMessage[]>(`${ADMIN_CHAT_API}/history/${seller.email}`);
        const history = res.data;
        const lastMsg = history[history.length - 1];
        if (lastMsg && lastMsg.senderEmail !== "admin@gmail.com") {
          newUnreadStatus[seller.email] = true;
        }
      }
      setUnreadSellers(newUnreadStatus);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const interval = setInterval(checkNotifications, 10000);
    return () => clearInterval(interval);
  }, [sellers]);

  const fetchChat = async () => {
    if (!selectedSeller) return;
    try {
      const res = await axios.get<IMessage[]>(`${ADMIN_CHAT_API}/history/${selectedSeller.email}`);
      setMessages(res.data);
      setUnreadSellers(prev => ({ ...prev, [selectedSeller.email]: false }));
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (chatOpen && selectedSeller) {
      fetchChat();
      const interval = setInterval(fetchChat, 3000);
      return () => clearInterval(interval);
    }
  }, [chatOpen, selectedSeller]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedSeller) return;
    const msgText = typedMessage;
    setTypedMessage("");
    try {
      await axios.post(`${ADMIN_CHAT_API}/send`, {
        senderEmail: "admin@gmail.com",
        receiverEmail: selectedSeller.email,
        message: msgText,
      });
      fetchChat();
    } catch (err) { toast.error("Failed to send"); }
  };

  const filteredSellers = useMemo(() => {
    return sellers.filter((s) => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sellers, searchTerm]);

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #E2E8F0" }}>
        <Typography variant="h5" fontWeight={800} color="#1E293B">Sellers Management</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <InputBase 
            placeholder="Search seller..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ border: "1px solid #CBD5E1", borderRadius: "10px", px: 2, width: 300, bgcolor: "white" }} 
          />
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ["all-sellers"] })}><Refresh /></IconButton>
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F1F5F9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>SELLER</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>WHATSAPP</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>PLAN</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>BALANCE</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="center">ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isSellersLoading ? (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress sx={{ m: 3 }} /></TableCell></TableRow>
            ) : filteredSellers.map((s) => (
              <TableRow key={s._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "#6366F1", fontWeight: 700 }}>{s.name[0].toUpperCase()}</Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{s.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{s.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{s.phone || "N/A"}</TableCell>
                <TableCell><Chip label={s.subscribedPlan || "free"} size="small" sx={{ fontWeight: 700, bgcolor: "#F1F5F9" }} /></TableCell>
                <TableCell><Typography variant="body2" fontWeight={800} color="#10B981">${s.balance?.toFixed(2)}</Typography></TableCell>
                <TableCell><Chip label={s.status?.toUpperCase() || "ACTIVE"} size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} /></TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton onClick={() => { setSelectedSeller(s); setChatOpen(true); }} sx={{ color: "#6366F1", bgcolor: "#EEF2FF" }}>
                      <Badge color="error" variant="dot" invisible={!unreadSellers[s.email]}><Chat fontSize="small" /></Badge>
                    </IconButton>
                    <IconButton onClick={() => { setSelectedSeller(s); setAnalyticsOpen(true); }} sx={{ color: "#3B82F6", bgcolor: "#EFF6FF" }}>
                      <TrendingUp fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- PREMIUM PERFORMANCE ANALYTICS MODAL --- */}
      <Modal open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: "white", width: 550, p: 0, borderRadius: 5, outline: 'none', overflow: 'hidden' }}>
          <Box sx={{ p: 3, bgcolor: "#1E293B", color: "white", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Stars sx={{ color: "#FBBF24" }} />
              <Typography variant="h6" fontWeight={800}>Seller Insights</Typography>
            </Stack>
            <IconButton onClick={() => setAnalyticsOpen(false)} sx={{ color: "white", opacity: 0.7 }}><Close /></IconButton>
          </Box>

          <Box sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ 
                  background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)", 
                  p: 3, borderRadius: 4, color: "white",
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700 }}>STORE WALLET</Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ mt: 0.5 }}>${selectedSeller?.salesCredit || "0.0"}</Typography>
                    <Chip label="Verified Balance" size="small" sx={{ bgcolor: "rgba(16, 185, 129, 0.2)", color: "#10B981", fontWeight: 700, mt: 1 }} />
                  </Box>
                  <AccountBalanceWallet sx={{ fontSize: 60, opacity: 0.1 }} />
                </Box>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={900} color="#3B82F6">{performanceData.total}</Typography>
                  <Typography variant="caption" fontWeight={800} color="textSecondary">TOTAL LISTINGS</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={900} color="#10B981">{performanceData.approved}</Typography>
                  <Typography variant="caption" fontWeight={800} color="textSecondary">APPROVED ADS</Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 2.5, bgcolor: "#F8FAFC", borderRadius: 4, border: '1px solid #E2E8F0' }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Typography variant="body2" fontWeight={800}>Conversion Success Rate</Typography>
                    <Typography variant="body2" fontWeight={900} color="#3B82F6">{performanceData.rate.toFixed(1)}%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={performanceData.rate} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
               <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <ShoppingBag fontSize="small" color="action" />
                  <Typography variant="caption" fontWeight={900} color="textSecondary">LATEST ACTIVITY</Typography>
               </Stack>
               <Stack spacing={1.5}>
                  {performanceData.products.length > 0 ? performanceData.products.map((p: Product) => (
                    <Box key={p._id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: "#F1F5F9", borderRadius: 3 }}>
                       <Typography variant="body2" fontWeight={700}>{p.name}</Typography>
                       <Typography variant="body2" fontWeight={800} color="#10B981">${p.price}</Typography>
                    </Box>
                  )) : <Typography variant="caption" align="center" color="textSecondary">No recent listings.</Typography>}
               </Stack>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* --- CHAT MODAL --- */}
      <Modal open={chatOpen} onClose={() => setChatOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <Box sx={{ bgcolor: "white", width: 450, height: 600, borderRadius: 4, display: 'flex', flexDirection: 'column', overflow: 'hidden', outline: 'none' }}>
          <Box sx={{ p: 2, bgcolor: "#1E293B", color: "white", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={700}>Chatting with {selectedSeller?.name}</Typography>
            <IconButton onClick={() => setChatOpen(false)} sx={{ color: "white" }}><Close /></IconButton>
          </Box>
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: "#F8FAFC", display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {messages.map((msg, i) => (
              <Box key={i} sx={{ alignSelf: msg.senderEmail === "admin@gmail.com" ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: msg.senderEmail === "admin@gmail.com" ? "#6366F1" : "white", color: msg.senderEmail === "admin@gmail.com" ? "white" : "#1E293B", border: '1px solid #E2E8F0' }}>
                  <Typography variant="body2">{msg.message}</Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
          <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" placeholder="Type reply..." value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} />
            <IconButton type="submit" sx={{ bgcolor: "#6366F1", color: "white" }}><Send fontSize="small" /></IconButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SellerAccount;