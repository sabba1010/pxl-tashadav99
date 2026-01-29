import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Box, Paper, InputBase, IconButton, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Avatar, Modal, Stack, TextField, Badge, Chip, Grid,
  Select, MenuItem, FormControl
} from "@mui/material";
import { 
  Refresh, Close, Chat, TrendingUp, Send
} from "@mui/icons-material";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";

/* ====================== INTERFACES ====================== */
interface IMessage {
  _id?: string;
  senderEmail: string;
  receiverEmail: string;
  message: string;
  createdAt?: string;
}

interface Product {
  _id: string;
  name: string;
  price: string;
  userEmail: string; 
  status: string;    
}

interface IPurchase {
  _id: string;
  productName: string;
  sellerEmail: string;
  amount: number;
  status: string;
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
  createdAt?: string; // sorting এর জন্য
}

const BASE_URL = "http://localhost:3200";
const ADMIN_CHAT_API = `${BASE_URL}/api/adminchat`;
const USER_API = `${BASE_URL}/api/user`;

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

  /* ====================== DATA FETCHING (LATEST FIRST) ====================== */
  const { data: sellers = [], isLoading: isSellersLoading } = useQuery<Seller[]>({
    queryKey: ["all-sellers"],
    queryFn: async () => {
      const res = await axios.get<any>(`${USER_API}/getall`);
      const rawData = res.data;
      const sellerList: any[] = Array.isArray(rawData) ? rawData : (rawData?.users || []);
      
      // Seller ফিল্টার করা এবং নতুন ইউজারদের সবার আগে আনা (Descending Order)
      const filtered = sellerList
        .filter((u: any) => u.role?.toLowerCase() === "seller")
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA; // Latest date top এ থাকবে
        });

      return filtered; 
    },
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["all-products-sells"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/product/all-sells`);
      return (res.data as Product[]) || [];
    }
  });

  const { data: allPurchases = [] } = useQuery<IPurchase[]>({
    queryKey: ["all-purchases-history"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/purchase/getall`);
      const data = res.data as any;
      return Array.isArray(data) ? data : (data.purchases || []);
    }
  });

  /* ====================== STATUS UPDATE ====================== */
  const handleStatusChange = async (sellerId: string, newStatus: string) => {
    try {
      const res = await axios.patch<any>(`${USER_API}/update-status/${sellerId}`, { 
        status: newStatus 
      });

      if (res.data?.success) {
        toast.success(`Seller status: ${newStatus.toUpperCase()}`);
        queryClient.invalidateQueries({ queryKey: ["all-sellers"] });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  /* ====================== PERFORMANCE LOGIC ====================== */
  const performanceData = useMemo(() => {
    if (!selectedSeller) return { total: 0, soldCount: 0 };
    const myProducts = allProducts.filter(p => p.userEmail === selectedSeller.email);
    const soldCount = allPurchases.filter(pur => pur.sellerEmail === selectedSeller.email).length;
    return { total: myProducts.length, soldCount };
  }, [selectedSeller, allProducts, allPurchases]);

  /* ====================== CHAT LOGIC ====================== */
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
      const interval = setInterval(fetchChat, 4000);
      return () => clearInterval(interval);
    }
  }, [chatOpen, selectedSeller?.email]);

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
            placeholder="Search by name or email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ border: "1px solid #CBD5E1", borderRadius: "10px", px: 2, width: 300, bgcolor: "white" }} 
          />
          <IconButton onClick={() => queryClient.invalidateQueries()}><Refresh /></IconButton>
        </Box>
      </Paper>

      {/* Sellers Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F1F5F9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>SELLER</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>WHATSAPP</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>BALANCE</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="center">ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isSellersLoading ? (
              <TableRow><TableCell colSpan={5} align="center"><CircularProgress sx={{ m: 3 }} /></TableCell></TableRow>
            ) : filteredSellers.map((s) => (
              <TableRow key={s._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "#6366F1", fontWeight: 700 }}>{s.name?.[0]?.toUpperCase()}</Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{s.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{s.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{s.phone || "N/A"}</TableCell>
                <TableCell><Typography fontWeight={800} color="#10B981">${s.balance?.toFixed(2)}</Typography></TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={s.status === "block" ? "block" : "active"}
                      onChange={(e) => handleStatusChange(s._id, e.target.value)}
                      sx={{ 
                        fontSize: "0.75rem", fontWeight: 900, height: 30, borderRadius: 2,
                        bgcolor: s.status === "block" ? "#FEF2F2" : "#F0FDF4",
                        color: s.status === "block" ? "#EF4444" : "#10B981",
                        "& fieldset": { border: 'none' }
                      }}
                    >
                      <MenuItem value="active">ACTIVE</MenuItem>
                      <MenuItem value="block">BLOCK</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
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

      {/* --- CHAT MODAL --- */}
      <Modal open={chatOpen} onClose={() => setChatOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: "white", width: 450, height: 600, borderRadius: "24px", display: 'flex', flexDirection: 'column', overflow: 'hidden', outline: 'none' }}>
          <Box sx={{ p: 2.5, background: "linear-gradient(to right, #059669, #0891b2)", color: "white", display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>{selectedSeller?.name?.[0]?.toUpperCase()}</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700}>{selectedSeller?.name}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Seller Support</Typography>
            </Box>
            <IconButton onClick={() => setChatOpen(false)} sx={{ color: "white" }}><Close /></IconButton>
          </Box>
          <Box sx={{ flex: 1, p: 2.5, overflowY: 'auto', background: "#f3f4f6", display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((msg, i) => (
              <Box key={i} sx={{ 
                alignSelf: msg.senderEmail === "admin@gmail.com" ? 'flex-end' : 'flex-start',
                maxWidth: '80%', p: 1.5, borderRadius: 2,
                bgcolor: msg.senderEmail === "admin@gmail.com" ? "#0d9488" : "white",
                color: msg.senderEmail === "admin@gmail.com" ? "white" : "black",
              }}>
                <Typography variant="body2">{msg.message}</Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
          <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, display: 'flex', gap: 1, borderTop: '1px solid #ddd' }}>
            <TextField fullWidth size="small" value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} placeholder="Type message..." />
            <IconButton type="submit" sx={{ color: "#0d9488" }}><Send /></IconButton>
          </Box>
        </Box>
      </Modal>

      {/* --- ANALYTICS MODAL --- */}
      <Modal open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: "white", p: 4, borderRadius: 4, width: 400, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={800} mb={2}>Performance</Typography>
          <Typography>Total Products: {performanceData.total}</Typography>
          <Typography>Total Sold: {performanceData.soldCount}</Typography>
          <IconButton sx={{ mt: 2 }} onClick={() => setAnalyticsOpen(false)}><Close /></IconButton>
        </Box>
      </Modal>
    </Box>
  );
};

export default SellerAccount;