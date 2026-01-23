import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle, ThumbsUp, Clock, X, Trash2 } from "lucide-react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Tooltip, CircularProgress } from "@mui/material";
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
  disputedCount: number;
  status: "verified" | "warning" | "normal";
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

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // TypeScript error সমাধান করতে generic type <{ ratings: BackendRating[] }> যোগ করা হয়েছে
      const response = await axios.get<{ ratings: BackendRating[] }>("https://vps-backend-server-beta.vercel.app/rating/all/all");
      const allRatings = response.data.ratings || [];

      const groupedSellers: { [key: string]: Seller } = {};

      allRatings.forEach((r) => {
        const email = r.sellerEmail;
        if (!groupedSellers[email]) {
          groupedSellers[email] = {
            id: email,
            name: email.split("@")[0], 
            email: email,
            rating: 0,
            reviewsCount: 0,
            disputedCount: 0,
            status: "normal",
            recentReviews: [],
          };
        }

        const s = groupedSellers[email];
        s.reviewsCount += 1;
        s.rating += r.rating;
        
        // ১ বা ২ স্টার রেটিংকে ডিসপিউট/অ্যাট রিস্ক হিসেবে গণ্য করা হচ্ছে
        if (r.rating <= 2) {
          s.disputedCount += 1;
        }
        
        s.recentReviews.push({
          id: r._id,
          buyer: r.buyerEmail,
          rating: r.rating,
          comment: r.message,
          productName: r.productName,
          date: new Date(r.createdAt).toLocaleDateString(),
        });
      });

      const finalSellers = Object.values(groupedSellers).map(s => {
        const avg = s.rating / s.reviewsCount;
        return {
          ...s,
          rating: Number(avg.toFixed(1)),
          status: avg >= 4.5 ? "verified" : (avg < 3 || s.disputedCount > 2) ? "warning" : "normal"
        };
      });

      setSellers(finalSellers as Seller[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // রিভিউ ডিলিট করার ফাংশন (Admin Action)
  const handleDeleteReview = async (ratingId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`https://vps-backend-server-beta.vercel.app/rating/delete/${ratingId}`);
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
      if (filter === "disputed") return s.disputedCount > 0;
      if (filter === "top") return s.rating >= 4.5;
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
    <Box sx={{ p: 4, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E2E8F0' }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1E293B">System Ratings Monitoring</Typography>
          <Typography variant="body2" color="#64748B">Admin: Reviewing all marketplace feedback</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
            <Select value={filter} onChange={(e:any) => setFilter(e.target.value)} sx={{ borderRadius: 2, bgcolor: '#F1F5F9' }}>
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
              <TableCell sx={{ fontWeight: 700 }}>Total Reviews</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Poor Reviews</TableCell>
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
                <TableCell>{s.reviewsCount}</TableCell>
                <TableCell>
                  <Typography color={s.disputedCount > 0 ? "error.main" : "success.main"} fontWeight={700}>
                    {s.disputedCount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ 
                    px: 1.5, py: 0.5, borderRadius: 5, fontSize: 11, fontWeight: 800,
                    bgcolor: s.status === "verified" ? "#DCFCE7" : s.status === "warning" ? "#FEE2E2" : "#F1F5F9",
                    color: s.status === "verified" ? "#166534" : s.status === "warning" ? "#991B1B" : "#475569"
                  }}>
                    {s.status.toUpperCase()}
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
    </Box>
  );
};

export default RatingsReputationPanel;