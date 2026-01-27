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

const BASE_URL = "https://tasha-vps-backend-2.onrender.com";
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

  /* ====================== DATA FETCHING (NO CHANGES) ====================== */
  const { data: sellers = [], isLoading: isSellersLoading } = useQuery<Seller[]>({
    queryKey: ["all-sellers"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/user/getall`);
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

  /* ====================== ANALYTICS LOGIC (NO CHANGES) ====================== */
  const performanceData = useMemo(() => {
    if (!selectedSeller) return { total: 0, approved: 0, rate: 0, products: [] as Product[] };
    const myProducts = (allProducts as Product[]).filter(p => p.userEmail === selectedSeller.email);
    const approved = myProducts.filter(p => p.status === "active").length;
    const total = myProducts.length;
    const rate = total > 0 ? (approved / total) * 100 : 0;
    return { total, approved, rate, products: myProducts.slice(0, 5) };
  }, [selectedSeller, allProducts]);

  /* ====================== CHAT LOGIC (NO CHANGES) ====================== */
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

  const formatMessageTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Table & Management UI (Same as before) */}
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

      {/* Analytics Modal (Code omitted for brevity, keep your original) */}

      {/* --- SAME-TO-SAME PREMIUM CHAT UI MODAL --- */}
      <Modal open={chatOpen} onClose={() => setChatOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ 
          bgcolor: "white", width: 450, height: 600, borderRadius: "24px", 
          display: 'flex', flexDirection: 'column', overflow: 'hidden', 
          outline: 'none', boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
        }}>
          
          {/* Header (Matching Seller Side) */}
          <Box sx={{ 
            p: 2.5, 
            background: "linear-gradient(to right, #059669, #0d9488, #0891b2)", // emerald-600 via teal-600 to cyan-600
            color: "white", 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2 
          }}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.15)", width: 44, height: 44, borderRadius: "16px", fontWeight: 700 }}>
              {selectedSeller?.name[0].toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>{selectedSeller?.name}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 300 }}>Seller Support Channel • Active</Typography>
            </Box>
            <IconButton onClick={() => setChatOpen(false)} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>

          {/* Messages Area (Matching Seller Side) */}
          <Box sx={{ 
            flex: 1, p: 2.5, overflowY: 'auto', 
            background: "linear-gradient(to bottom, #f9fafb, #f3f4f6)", 
            display: 'flex', flexDirection: 'column', gap: 2.5 
          }}>
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const isAdmin = msg.senderEmail === "admin@gmail.com";
                return (
                  <motion.div
                    key={msg._id || i}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    style={{ 
                      display: 'flex', 
                      justifyContent: isAdmin ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}
                  >
                    {!isAdmin && (
                      <Avatar sx={{ width: 32, height: 32, fontSize: '12px', bgcolor: "#0d9488", borderRadius: '10px' }}>S</Avatar>
                    )}
                    
                    <Box sx={{ 
                      maxWidth: '75%', 
                      p: "12px 16px", 
                      borderRadius: "18px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      background: isAdmin 
                        ? "linear-gradient(to bottom right, #059669, #0d9488)" 
                        : "rgba(255, 255, 255, 0.9)",
                      color: isAdmin ? "white" : "#111827",
                      border: isAdmin ? "none" : "1px solid #e5e7eb",
                      borderBottomRightRadius: isAdmin ? "2px" : "18px",
                      borderBottomLeftRadius: isAdmin ? "18px" : "2px",
                    }}>
                      <Typography sx={{ fontSize: "14.5px", lineHeight: 1.5, wordBreak: "break-word" }}>
                        {msg.message}
                      </Typography>
                      <Typography sx={{ 
                        fontSize: "10px", 
                        mt: 0.8, 
                        opacity: 0.7, 
                        textAlign: 'right',
                        fontWeight: 300
                      }}>
                        {formatMessageTime(msg.createdAt)}
                      </Typography>
                    </Box>

                    {isAdmin && (
                      <Avatar sx={{ width: 32, height: 32, fontSize: '12px', bgcolor: "#ecfdf5", color: "#065f46", borderRadius: '10px', fontWeight: 700 }}>You</Avatar>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area (Matching Seller Side) */}
          <Box 
            component="form" 
            onSubmit={handleSendMessage} 
            sx={{ 
              p: 2.5, 
              bgcolor: "white", 
              borderTop: '1px solid rgba(0,0,0,0.05)', 
              display: 'flex', 
              gap: 1.5, 
              alignItems: 'center' 
            }}
          >
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Type your reply..." 
              value={typedMessage} 
              onChange={(e) => setTypedMessage(e.target.value)}
              variant="standard"
              InputProps={{ 
                disableUnderline: true,
                sx: { 
                  bgcolor: "#f3f4f6", 
                  p: "10px 20px", 
                  borderRadius: "30px",
                  fontSize: "14.5px"
                } 
              }}
            />
            <motion.button
              type="submit"
              disabled={!typedMessage.trim()}
              whileTap={{ scale: 0.92 }}
              style={{
                border: 'none',
                background: typedMessage.trim() ? "linear-gradient(to right, #059669, #0d9488)" : "#e5e7eb",
                color: 'white',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: typedMessage.trim() ? 'pointer' : 'default',
                boxShadow: typedMessage.trim() ? "0 4px 10px rgba(13, 148, 136, 0.3)" : "none"
              }}
            >
              <Send sx={{ fontSize: 20 }} />
            </motion.button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SellerAccount;