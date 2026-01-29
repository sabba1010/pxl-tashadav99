import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Avatar,
  Modal,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Refresh,
  Close,
  Chat,
  TrendingUp,
  Send,
  ShoppingBag,
  BarChart,
  AccountBalanceWallet,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  ChevronLeft,
  ChevronRight,
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
  createdAt?: string;
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
  accountCreationDate?: string;
  role?: string;
  countryCode?: string;
}

const BASE_URL = "http://localhost:3200";
const ADMIN_CHAT_API = `${BASE_URL}/api/adminchat`;
const USER_API = `${BASE_URL}/api/user`;

const ITEMS_PER_PAGE = 10;

const SellerAccount: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollRef = useRef(true);

  /* ====================== DATA FETCHING ====================== */
  const { data: sellers = [], isLoading: isSellersLoading } = useQuery<Seller[]>({
    queryKey: ["all-sellers"],
    queryFn: async () => {
      const res = await axios.get<any>(`${USER_API}/getall`);
      const rawData = res.data;
      const sellerList: any[] = Array.isArray(rawData) ? rawData : (rawData?.users || []);
      return sellerList
        .filter((u: any) => u.role?.toLowerCase() === "seller")
        .sort((a, b) => {
          const dateA = new Date(a.accountCreationDate || 0).getTime();
          const dateB = new Date(b.accountCreationDate || 0).getTime();
          return dateB - dateA;
        });
    },
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["all-products-sells"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/product/all-sells`);
      return (res.data as Product[]) || [];
    },
  });

  const { data: allPurchases = [] } = useQuery<IPurchase[]>({
    queryKey: ["all-purchases-history"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/purchase/getall`);
      const data = res.data as any;
      return Array.isArray(data) ? data : (data.purchases || []);
    },
  });

  /* ====================== PAGINATION & FILTERING ====================== */
  const filteredSellers = useMemo(() => {
    return sellers.filter(
      (s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sellers, searchTerm]);

  const totalPages = Math.ceil(filteredSellers.length / ITEMS_PER_PAGE);

  const paginatedSellers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSellers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSellers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /* ====================== OTHER LOGIC ====================== */
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      shouldScrollRef.current = isAtBottom;
    }
  };

  useEffect(() => {
    if (shouldScrollRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const performanceData = useMemo(() => {
    if (!selectedSeller) return { total: 0, soldCount: 0 };
    const myProducts = allProducts.filter((p) => p.userEmail === selectedSeller.email);
    const mySales = allPurchases.filter((pur) => pur.sellerEmail === selectedSeller.email);

    return {
      total: myProducts.length,
      soldCount: mySales.length,
    };
  }, [selectedSeller, allProducts, allPurchases]);

  const handleStatusChange = async (sellerId: string, newStatus: string) => {
    try {
      const res = await axios.patch<any>(`${USER_API}/update-status/${sellerId}`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Seller status: ${newStatus.toUpperCase()}`);
        queryClient.invalidateQueries({ queryKey: ["all-sellers"] });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const fetchChat = async () => {
    if (!selectedSeller) return;
    try {
      const res = await axios.get<IMessage[]>(`${ADMIN_CHAT_API}/history/${selectedSeller.email}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (chatOpen && selectedSeller) {
      fetchChat();
      const interval = setInterval(fetchChat, 4000);
      return () => clearInterval(interval);
    }
  }, [chatOpen, selectedSeller?.email]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedSeller) return;
    const msgText = typedMessage;
    setTypedMessage("");
    shouldScrollRef.current = true;
    try {
      await axios.post(`${ADMIN_CHAT_API}/send`, {
        senderEmail: "admin@gmail.com",
        receiverEmail: selectedSeller.email,
        message: msgText,
      });
      fetchChat();
    } catch (err) {
      toast.error("Failed to send");
    }
  };

  const getGmailLink = (email: string) => {
    const subject = encodeURIComponent("Regarding your seller account");
    const body = encodeURIComponent("Hello,\n\nI wanted to discuss...");
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;
  };

  const getWhatsAppLink = (phone?: string) => {
    if (!phone || phone.trim() === "") return null;
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.length > 12 && cleaned.startsWith("00")) cleaned = cleaned.substring(2);
    if ((cleaned.length === 10 || cleaned.length === 11) && (cleaned.startsWith("0") || cleaned.startsWith("1"))) {
      cleaned = "880" + (cleaned.startsWith("0") ? cleaned.substring(1) : cleaned);
    } else if (cleaned.length === 10 && !cleaned.startsWith("0") && !cleaned.startsWith("8")) {
      cleaned = "1" + cleaned;
    } else if (cleaned.startsWith("800") || cleaned.startsWith("888") || cleaned.startsWith("877")) {
      if (cleaned.length === 10) cleaned = "1" + cleaned;
    }
    if (cleaned.length < 10 || cleaned.length > 15) return null;
    return `https://wa.me/${cleaned}`;
  };

  const formatPhoneDisplay = (phone?: string) => {
    if (!phone) return "No phone";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("880") && cleaned.length === 13) {
      return `+880 ${cleaned.slice(3,6)} ${cleaned.slice(6,9)} ${cleaned.slice(9)}`;
    }
    if (cleaned.startsWith("1") && cleaned.length === 11) {
      return `+1 (${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const formatJoinDate = (dateStr?: string) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid #E2E8F0",
        }}
      >
        <Typography variant="h5" fontWeight={800} color="#1E293B">
          Sellers Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <InputBase
            placeholder="Search seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              border: "1px solid #CBD5E1",
              borderRadius: "10px",
              px: 2,
              width: 300,
              bgcolor: "white",
            }}
          />
          <IconButton onClick={() => queryClient.invalidateQueries()}>
            <Refresh />
          </IconButton>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F1F5F9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>SELLER</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>JOINED AT</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>PHONE</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>BALANCE</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="center">
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isSellersLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress sx={{ m: 3 }} />
                </TableCell>
              </TableRow>
            ) : paginatedSellers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No sellers found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedSellers.map((s, index) => {
                const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                const waLink = getWhatsAppLink(s.phone);
                return (
                  <TableRow key={s._id} hover>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {globalIndex}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "#6366F1", fontWeight: 700 }}>
                          {s.name?.[0]?.toUpperCase() || "?"}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>
                            {s.name || "No Name"}
                          </Typography>
                          <Typography
                            variant="caption"
                            component="a"
                            href={getGmailLink(s.email)}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: "#1E88E5",
                              textDecoration: "none",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {s.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {formatJoinDate(s.accountCreationDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {s.phone ? (
                          <>
                            <Typography variant="body2" color="textSecondary">
                              {formatPhoneDisplay(s.phone)}
                            </Typography>
                            {waLink && (
                              <Tooltip title="Chat on WhatsApp">
                                <IconButton
                                  size="small"
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ color: "#25D366" }}
                                >
                                  <WhatsAppIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No phone
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={800} color="#10B981">
                        ${Number(s.balance || 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={s.status === "block" ? "block" : "active"}
                          onChange={(e) => handleStatusChange(s._id, e.target.value)}
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 900,
                            height: 30,
                            borderRadius: 2,
                            bgcolor: s.status === "block" ? "#FEF2F2" : "#F0FDF4",
                            color: s.status === "block" ? "#EF4444" : "#10B981",
                          }}
                        >
                          <MenuItem value="active">ACTIVE</MenuItem>
                          <MenuItem value="block">BLOCK</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          onClick={() => {
                            setSelectedSeller(s);
                            setChatOpen(true);
                            shouldScrollRef.current = true;
                          }}
                          sx={{ color: "#6366F1", bgcolor: "#EEF2FF" }}
                        >
                          <Chat fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setSelectedSeller(s);
                            setAnalyticsOpen(true);
                          }}
                          sx={{ color: "#3B82F6", bgcolor: "#EFF6FF" }}
                        >
                          <TrendingUp fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modern Pagination */}
      {!isSellersLoading && filteredSellers.length > 0 && (
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="center">
            <IconButton
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              sx={{
                border: "1px solid",
                borderColor: currentPage === 1 ? "grey.300" : "primary.main",
              }}
            >
              <ChevronLeft fontSize="small" />
            </IconButton>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "contained" : "outlined"}
                  size="small"
                  color={pageNum === currentPage ? "primary" : "inherit"}
                  onClick={() => setCurrentPage(pageNum)}
                  sx={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: "50%",
                    fontWeight: pageNum === currentPage ? 700 : 400,
                  }}
                >
                  {pageNum}
                </Button>
              );
            })}

            {totalPages > 7 && currentPage < totalPages - 3 && (
              <Typography color="text.secondary">…</Typography>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setCurrentPage(totalPages)}
                sx={{ minWidth: 32, height: 32, borderRadius: "50%" }}
              >
                {totalPages}
              </Button>
            )}

            <IconButton
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              sx={{
                border: "1px solid",
                borderColor: currentPage === totalPages ? "grey.300" : "primary.main",
              }}
            >
              <ChevronRight fontSize="small" />
            </IconButton>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {totalPages} • {filteredSellers.length} listings
          </Typography>
        </Box>
      )}

      {/* Chat Modal */}
      <Modal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            bgcolor: "white",
            width: 450,
            height: 600,
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            outline: "none",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              background: "linear-gradient(to right, #059669, #0891b2)",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
              {selectedSeller?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>
              {selectedSeller?.name || "Seller"}
            </Typography>
            <IconButton onClick={() => setChatOpen(false)} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>
          <Box
            ref={scrollRef}
            onScroll={handleScroll}
            sx={{
              flex: 1,
              p: 2.5,
              overflowY: "auto",
              background: "#f3f4f6",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.senderEmail === "admin@gmail.com" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: msg.senderEmail === "admin@gmail.com" ? "#0d9488" : "white",
                  color: msg.senderEmail === "admin@gmail.com" ? "white" : "black",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="body2">{msg.message}</Typography>
              </Box>
            ))}
          </Box>
          <Box
            component="form"
            onSubmit={handleSendMessage}
            sx={{ p: 2, display: "flex", gap: 1, borderTop: "1px solid #ddd" }}
          >
            <TextField
              fullWidth
              size="small"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <IconButton type="submit" sx={{ color: "#0d9488" }}>
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Modal>

      {/* Analytics Modal */}
      <Modal
        open={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            bgcolor: "white",
            p: 0,
            borderRadius: 6,
            width: 500,
            maxHeight: "90vh",
            overflowY: "auto",
            outline: "none",
            boxShadow: 24,
          }}
        >
          <Box
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              color: "white",
              textAlign: "center",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <Avatar
              sx={{
                width: 60,
                height: 60,
                mx: "auto",
                mb: 1,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "2px solid white",
              }}
            >
              <BarChart />
            </Avatar>
            <Typography variant="h6" fontWeight={800}>
              Seller Performance
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {selectedSeller?.email}
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Stack spacing={4}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    flex: 1,
                    p: 2,
                    textAlign: "center",
                    borderRadius: 4,
                    bgcolor: "#F8FAFC",
                  }}
                >
                  <ShoppingBag sx={{ color: "#6366F1", mb: 0.5 }} />
                  <Typography variant="h6" fontWeight={800}>
                    {performanceData.total}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Total Products
                  </Typography>
                </Paper>
                <Paper
                  variant="outlined"
                  sx={{
                    flex: 1,
                    p: 2,
                    textAlign: "center",
                    borderRadius: 4,
                    bgcolor: "#F8FAFC",
                  }}
                >
                  <TrendingUp sx={{ color: "#10B981", mb: 0.5 }} />
                  <Typography variant="h6" fontWeight={800}>
                    {performanceData.soldCount}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Sold Items
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Sold Products
                </Typography>

                {performanceData.soldCount === 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderRadius: 3,
                      bgcolor: "#F8FAFC",
                      borderColor: "#E2E8F0",
                    }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      No products sold yet
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1.5 }} color="text.secondary">
                      When any order is completed, the list will appear here
                    </Typography>
                  </Paper>
                ) : (
                  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#F1F5F9" }}>
                        <TableRow>
                          <TableCell>Product Name</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allPurchases
                          .filter((pur) => pur.sellerEmail === selectedSeller?.email)
                          .map((pur) => (
                            <TableRow key={pur._id}>
                              <TableCell>
                                <Typography variant="body2" fontWeight={500}>
                                  {pur.productName || "Unnamed Product"}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" color="#10B981" fontWeight={600}>
                                  ${Number(pur.amount || 0).toFixed(2)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="caption" color="text.secondary">
                                  {pur.createdAt
                                    ? new Date(pur.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                    : "No date"}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Paper>
                )}
              </Box>

              <Box sx={{ px: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccountBalanceWallet sx={{ fontSize: 18, color: "#6366F1" }} />
                    <Typography variant="body2" fontWeight={600}>
                      Current Balance
                    </Typography>
                  </Stack>
                  <Typography variant="h6" fontWeight={900} color="#4F46E5">
                    ${Number(selectedSeller?.balance || 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Button
              fullWidth
              onClick={() => setAnalyticsOpen(false)}
              sx={{
                mt: 4,
                bgcolor: "#F1F5F9",
                borderRadius: 3,
                py: 1.5,
                color: "#475569",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { bgcolor: "#E2E8F0" },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SellerAccount;