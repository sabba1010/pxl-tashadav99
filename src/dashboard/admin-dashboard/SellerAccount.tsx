import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Box, Paper, InputBase, IconButton, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Avatar, Modal, Select, MenuItem, Stack, TextField, Badge
} from "@mui/material";
import { 
  Refresh, Close, WhatsApp, TrendingUp, 
  AccountBalanceWallet, Chat, Send
} from "@mui/icons-material";
import { toast } from "sonner";

/* ====================== INTERFACES ====================== */
interface IMessage {
  _id?: string;
  senderEmail: string;
  receiverEmail: string;
  message: string;
  createdAt?: string;
}

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  balance: number;
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
  
  // Notification State: কোন কোন সেলারের মেসেজ আনরিড আছে তা সেভ করবে
  const [unreadSellers, setUnreadSellers] = useState<Record<string, boolean>>({});
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  /* ====================== NOTIFICATION LOGIC ====================== */
  const checkNotifications = async () => {
    if (sellers.length === 0) return;
    try {
      const newUnreadStatus: Record<string, boolean> = { ...unreadSellers };
      
      for (const seller of sellers) {
        const res = await axios.get<IMessage[]>(`${ADMIN_CHAT_API}/history/${seller.email}`);
        const lastMsg = res.data[res.data.length - 1];

        // যদি শেষ মেসেজটি এডমিনের না হয়ে সেলারের হয়, তবে নোটিফিকেশন দেখাবে
        if (lastMsg && lastMsg.senderEmail !== "admin@gmail.com") {
          newUnreadStatus[seller.email] = true;
        }
      }
      setUnreadSellers(newUnreadStatus);
    } catch (err) {
      console.error("Notification check error:", err);
    }
  };

  // ৫ সেকেন্ড পর পর নোটিফিকেশন চেক করবে
  useEffect(() => {
    const interval = setInterval(checkNotifications, 5000);
    return () => clearInterval(interval);
  }, [sellers, unreadSellers]);

  /* ====================== CHAT LOGIC ====================== */
  const fetchChat = async () => {
    if (!selectedSeller) return;
    try {
      const res = await axios.get<IMessage[]>(`${ADMIN_CHAT_API}/history/${selectedSeller.email}`);
      setMessages(res.data);
      
      // চ্যাট বক্স ওপেন করলে নোটিফিকেশন রিমুভ করে দিবে
      setUnreadSellers(prev => ({ ...prev, [selectedSeller.email]: false }));
    } catch (err) {
      console.error("Admin fetch chat error:", err);
    }
  };

  useEffect(() => {
    if (!chatOpen || !selectedSeller) return;
    fetchChat();
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
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
    } catch (err) {
      setTypedMessage(msgText);
      toast.error("Failed to send message");
    }
  };

  /* ====================== UI HELPERS ====================== */
  const filteredSellers = useMemo(() => {
    return sellers.filter((s) => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sellers, searchTerm]);

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Search Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #E2E8F0" }}>
        <Typography variant="h5" fontWeight={800}>Sellers Management</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <InputBase
            placeholder="Search seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ border: "1px solid #CBD5E1", borderRadius: "10px", px: 2, width: 250, bgcolor: "white" }}
          />
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ["all-sellers"] })}><Refresh /></IconButton>
        </Box>
      </Paper>

      {/* Sellers Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>SELLER</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>BALANCE</TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="center">ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isSellersLoading ? (
              <TableRow><TableCell colSpan={3} align="center"><CircularProgress sx={{ m: 3 }} /></TableCell></TableRow>
            ) : filteredSellers.map((s) => (
              <TableRow key={s._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "#6366F1" }}>{s.name[0]}</Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{s.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{s.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell><Typography variant="body2" fontWeight={800} color="#10B981">${s.balance?.toFixed(2)}</Typography></TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    
                    {/* CHAT BUTTON WITH NOTIFICATION BADGE */}
                    <IconButton 
                      onClick={() => { setSelectedSeller(s); setChatOpen(true); }} 
                      sx={{ color: "#6366F1", bgcolor: "#EEF2FF" }}
                    >
                      <Badge color="error" variant="dot" invisible={!unreadSellers[s.email]}>
                        <Chat sx={{ fontSize: 20 }} />
                      </Badge>
                    </IconButton>

                    <IconButton onClick={() => { setSelectedSeller(s); setAnalyticsOpen(true); }} sx={{ color: "#3B82F6", bgcolor: "#EFF6FF" }}>
                      <TrendingUp sx={{ fontSize: 20 }} />
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
        <Box sx={{ bgcolor: "white", width: 450, height: 600, borderRadius: 4, display: 'flex', flexDirection: 'column', overflow: 'hidden', outline: 'none' }}>
          <Box sx={{ p: 2, bgcolor: "#1E293B", color: "white", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={700}>Chatting with {selectedSeller?.name}</Typography>
            <IconButton onClick={() => setChatOpen(false)} sx={{ color: "white" }}><Close /></IconButton>
          </Box>
          
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: "#F8FAFC", display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {messages.map((msg, i) => {
              const isAdmin = msg.senderEmail === "admin@gmail.com";
              return (
                <Box key={i} sx={{ alignSelf: isAdmin ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                  <Box sx={{ 
                    p: 1.5, borderRadius: 3, 
                    bgcolor: isAdmin ? "#6366F1" : "white", 
                    color: isAdmin ? "white" : "#1E293B",
                    border: isAdmin ? 'none' : '1px solid #E2E8F0',
                  }}>
                    <Typography variant="body2">{msg.message}</Typography>
                  </Box>
                </Box>
              );
            })}
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