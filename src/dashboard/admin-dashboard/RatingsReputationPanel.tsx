import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { X, Trash2 } from "lucide-react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { CircularProgress } from "@mui/material";
import {
  Box, Paper, InputBase, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Pagination, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, IconButton, FormControl, Select, MenuItem
} from "@mui/material";

// --- Interfaces ---
interface BackendRating {
  _id: string;
  orderId: string;
  productId: string;
  buyerEmail: string;
  sellerEmail: string;
  rating: number;
  message: string;
  productName: string;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  id: string;
  buyer: string;
  rating: number;
  comment: string;
  date: string;
  productName: string;
}

interface Seller {
  id: string; // Seller Email will be used as ID
  name: string;
  email: string;
  rating: number;
  reviewsCount: number;
  reportsCount: number;
  disputesCount: number;
  cancelledOrders: number;
  completionRate: number;
  reputationScore: number;
  status: "verified" | "warning" | "normal" | "at_risk";
  recentReviews: Review[];
}

const ITEMS_PER_PAGE = 8;

const RatingsReputationPanel: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "disputed" | "top">("all");
  const [page, setPage] = useState(1);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ success: boolean, data: any[] }>("http://localhost:3200/reputation/summary");
      if (response.data.success) {
        const mappedSellers: Seller[] = response.data.data.map(item => ({
          id: item.sellerEmail,
          name: item.sellerName,
          email: item.sellerEmail,
          rating: item.avgRating,
          reviewsCount: item.totalReviews,
          reportsCount: item.reportsCount,
          disputesCount: item.disputesCount,
          cancelledOrders: item.cancelledOrders,
          completionRate: item.completionRate,
          reputationScore: item.reputationScore,
          status: item.status,
          recentReviews: item.recentReviews.map((r: any) => ({
            id: r._id,
            buyer: r.buyerEmail,
            rating: r.rating,
            comment: r.message,
            productName: r.productName,
            date: new Date(r.createdAt).toLocaleDateString(),
          }))
        }));
        setSellers(mappedSellers);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();

    // Set up auto-refresh polling if enabled (every 30 seconds)
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchAdminData();
      }, 30000); // Poll every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // রিভিউ ডিলিট করার ফাংশন (Admin Action)
  const handleDeleteReview = async (ratingId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`http://localhost:3200/rating/delete/${ratingId}`);
        fetchAdminData(); // লিস্ট রিফ্রেশ করা
        setSelectedSeller(null);
      } catch (err) {
        alert("Failed to delete review");
      }
    }
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return sellers.filter(s => {
      const matchesSearch = s.email.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (filter === "disputed") return s.reportsCount > 0 || s.disputesCount > 0;
      if (filter === "top") return s.reputationScore >= 90;
      return true;
    });
  }, [searchTerm, filter, sellers]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const renderStars = (rating: number) => (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        i <= Math.round(rating)
          ? <StarIcon key={i} sx={{ color: "#FBBF24", fontSize: 18 }} />
          : <StarBorderIcon key={i} sx={{ color: "#D1D5DB", fontSize: 18 }} />
      ))}
    </Box>
  );

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress sx={{ color: '#33ac6f' }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E2E8F0' }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1E293B">System Ratings Monitoring</Typography>
          <Typography variant="body2" color="#64748B">Admin: Reviewing all marketplace feedback</Typography>
          {lastUpdated && (
            <Typography variant="caption" color="#94A3B8">Last updated: {lastUpdated.toLocaleTimeString()}</Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="#64748B">Auto-refresh:</Typography>
            <Button
              variant={autoRefresh ? "contained" : "outlined"}
              size="small"
              onClick={() => setAutoRefresh(!autoRefresh)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                bgcolor: autoRefresh ? '#33ac6f' : 'transparent',
                borderColor: autoRefresh ? '#33ac6f' : '#E2E8F0'
              }}
            >
              {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </Box>
          <IconButton onClick={fetchAdminData} sx={{ bgcolor: '#F1F5F9' }}><RefreshIcon /></IconButton>
          <Box sx={{ position: 'relative' }}>
            <SearchIcon sx={{ position: 'absolute', left: 12, top: 10, color: '#94A3B8' }} />
            <InputBase
              placeholder="Search seller email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ pl: 5, pr: 2, py: 0.5, bgcolor: '#F1F5F9', borderRadius: 2, width: 250 }}
            />
          </Box>
          <FormControl size="small">
            <Select value={filter} onChange={(e: any) => setFilter(e.target.value)} sx={{ borderRadius: 2, bgcolor: '#F1F5F9' }}>
              <MenuItem value="all">All Sellers</MenuItem>
              <MenuItem value="disputed">At Risk (1-2 Stars)</MenuItem>
              <MenuItem value="top">Top Rated</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Sellers Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Seller Account</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Avg Rating</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Completion</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Reports / Disputes</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Unfinished</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Reputation Score</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Management</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{s.email}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {renderStars(s.rating)}
                    <Typography fontWeight={700}>{s.rating}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontWeight={700}>{s.completionRate}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography color="error.main" fontWeight={700} title="Reports">{s.reportsCount}</Typography>
                    <Typography color="text.secondary">/</Typography>
                    <Typography color="error.dark" fontStyle="italic" fontWeight={800} title="Disputes/Refunds">{s.disputesCount}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography color={s.cancelledOrders > 0 ? "error.main" : "text.secondary"}>
                    {s.cancelledOrders}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ flexGrow: 1, height: 8, bgcolor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                      <Box sx={{
                        width: `${s.reputationScore}%`,
                        height: '100%',
                        bgcolor: s.reputationScore > 80 ? '#10B981' : s.reputationScore > 50 ? '#3B82F6' : s.reputationScore > 30 ? '#F59E0B' : '#EF4444'
                      }} />
                    </Box>
                    <Typography fontWeight={900} color="#1E293B">{s.reputationScore}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{
                    px: 1.5, py: 0.5, borderRadius: 5, fontSize: 11, fontWeight: 800,
                    bgcolor: s.status === "verified" ? "#DCFCE7" : s.status === "warning" ? "#FEF3C7" : s.status === "at_risk" ? "#FEE2E2" : "#F1F5F9",
                    color: s.status === "verified" ? "#166534" : s.status === "warning" ? "#92400E" : s.status === "at_risk" ? "#991B1B" : "#475569"
                  }}>
                    {s.status.toUpperCase().replace('_', ' ')}
                  </Box>
                </TableCell>
                <TableCell>
                  <Button variant="contained" size="small" onClick={() => setSelectedSeller(s)} sx={{ bgcolor: '#33ac6f', textTransform: 'none', borderRadius: 2 }}>
                    Analyze Reviews
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={Math.ceil(filtered.length / ITEMS_PER_PAGE)} page={page} onChange={(_, v) => setPage(v)} color="primary" />
      </Box>

      {/* Reviews Analysis Dialog */}
      <Dialog open={!!selectedSeller} onClose={() => setSelectedSeller(null)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Feedback Analysis: {selectedSeller?.email}
          <IconButton onClick={() => setSelectedSeller(null)}><X /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedSeller?.recentReviews.map((r) => (
            <Paper key={r.id} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2, position: 'relative' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography fontWeight={700} color="#334155">{r.buyer}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography variant="caption" color="#94A3B8">{r.date}</Typography>
                  <IconButton size="small" color="error" onClick={() => handleDeleteReview(r.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </Box>
              {renderStars(r.rating)}
              <Typography variant="body2" sx={{ mt: 1, color: '#475569', bgcolor: '#F8FAFC', p: 1.5, borderRadius: 1 }}>
                {r.comment}
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#33ac6f', fontWeight: 600 }}>
                Product: {r.productName}
              </Typography>
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSeller(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default RatingsReputationPanel;