import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle, ThumbsUp, Clock, X } from "lucide-react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Tooltip } from "@mui/material";
import {
  Box,
  Paper,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

interface Review {
  id: string;
  buyer: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  disputed?: boolean;
}

interface Seller {
  id: string;
  name: string;
  username: string;
  totalSales: number;
  rating: number;
  reviews: number;
  disputed: number;
  status: "verified" | "warning" | "normal";
  joinDate: string;
  bio: string;
  recentReviews: Review[];
}

const mockSellers: Seller[] = [
  {
    id: "1",
    name: "Afsar Khan",
    username: "@afsarpro",
    totalSales: 2847,
    rating: 4.98,
    reviews: 1823,
    disputed: 0,
    status: "verified",
    joinDate: "Jan 2023",
    bio: "Premium gaming & streaming accounts • Fast delivery • 24/7 support",
    recentReviews: [
      { id: "r1", buyer: "GamerX", rating: 5, comment: "Instant delivery! Best seller", date: "2 days ago", helpful: 42 },
      { id: "r2", buyer: "ProPlayer99", rating: 5, comment: "Perfect account, thanks!", date: "1 week ago", helpful: 28 },
      { id: "r3", buyer: "NinjaStream", rating: 4, comment: "Good but took 20 mins", date: "2 weeks ago", helpful: 12 },
    ],
  },
  {
    id: "2",
    name: "Sara Johnson",
    username: "@saraj",
    totalSales: 1562,
    rating: 4.85,
    reviews: 912,
    disputed: 3,
    status: "warning",
    joinDate: "May 2024",
    bio: "High-quality digital art • Custom commissions",
    recentReviews: [
      { id: "r6", buyer: "ArtLover22", rating: 5, comment: "Stunning work!", date: "1 day ago", helpful: 15 },
      { id: "r7", buyer: "CreativeSoul", rating: 2, comment: "Colors were off", date: "5 days ago", helpful: 8, disputed: true },
    ],
  },
  {
    id: "3",
    name: "Rahman Seller",
    username: "@rahman_x",
    totalSales: 875,
    rating: 4.67,
    reviews: 543,
    disputed: 12,
    status: "warning",
    joinDate: "Jul 2024",
    bio: "Budget accounts • High volume seller",
    recentReviews: [
      { id: "r4", buyer: "User123", rating: 1, comment: "Account banned in 2 days!", date: "3 days ago", helpful: 67, disputed: true },
      { id: "r5", buyer: "AnonBuyer", rating: 3, comment: "Got locked soon", date: "1 week ago", helpful: 31, disputed: true },
    ],
  },
  {
    id: "4",
    name: "EliteTech",
    username: "@elite_tech",
    totalSales: 3205,
    rating: 4.92,
    reviews: 2104,
    disputed: 1,
    status: "verified",
    joinDate: "Mar 2022",
    bio: "Tech gadgets • Authentic • Free shipping",
    recentReviews: [
      { id: "r8", buyer: "TechFanatic", rating: 5, comment: "Fast shipping", date: "4 days ago", helpful: 35 },
      { id: "r9", buyer: "GadgetGuy", rating: 5, comment: "Excellent quality", date: "10 days ago", helpful: 22 },
    ],
  },
];

const ITEMS_PER_PAGE = 8;

const RatingsReputationPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "disputed" | "top">("all");
  const [page, setPage] = useState(1);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return mockSellers.filter((s) => {
      const matches = !q || s.name.toLowerCase().includes(q) || s.username.toLowerCase().includes(q);
      if (!matches) return false;
      if (filter === "disputed") return s.disputed > 0;
      if (filter === "top") return s.rating >= 4.9 && s.reviews >= 500;
      return true;
    });
  }, [searchTerm, filter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const renderStars = (rating: number) => (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= rating ? (
          <StarIcon key={i} sx={{ color: "#FBBF24", width: 18, height: 18 }} />
        ) : (
          <StarBorderIcon key={i} sx={{ color: "#E5E7EB", width: 18, height: 18 }} />
        )
      )}
    </Box>
  );

  const refresh = () => {
    setSearchTerm("");
    setFilter("all");
    setPage(1);
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1F2A44">
            Ratings & Reputation ({filtered.length})
          </Typography>
          <Typography color="#6B7280" sx={{ mt: 0.5 }}>
            Monitor • Review • Resolve Disputes • Boost Top Sellers
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Tooltip title="Refresh">
            <IconButton
              onClick={refresh}
              aria-label="refresh"
              sx={{
                width: 44,
                height: 44,
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg,#33ac6f,#2a8e5b)",
                color: "#fff",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(51,172,111,0.18)",
                transition: "all 0.18s ease-in-out",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 28px rgba(51,172,111,0.26)",
                },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ position: "relative", width: 300 }}>
            <SearchIcon
              sx={{
                position: "absolute",
                left: 15,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6B7280",
              }}
            />
            <InputBase
              placeholder="Search sellers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              sx={{
                bgcolor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                pl: 6,
                pr: 2,
                py: 1.2,
                width: "100%",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)",
                transition: "all 0.2s",
                "&:focus-within": {
                  borderColor: "#33ac6f",
                  boxShadow: "0 0 0 3px rgba(51,172,111,0.1)",
                },
              }}
            />
          </Box>

          <FormControl sx={{ minWidth: 160 }}>
            <Select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as any);
                setPage(1);
              }}
              displayEmpty
              startAdornment={<FilterListIcon />}
              sx={{
                borderRadius: "12px",
                height: 44,
                bgcolor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <MenuItem value="all">All Sellers</MenuItem>
              <MenuItem value="disputed">Disputed Only</MenuItem>
              <MenuItem value="top">Top Rated</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: 2,
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#F9FAFB" }}>
            <TableRow>
              {[
                "Seller",
                "Rating",
                "Sales",
                "Disputed",
                "Status",
                "Actions",
              ].map((h) => (
                <TableCell
                  key={h}
                  sx={{ fontWeight: 600, color: "#6B7280", fontSize: "12px", textTransform: "uppercase", py: 2.5 }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((s) => (
              <TableRow key={s.id} hover sx={{ "&:hover": { background: "rgba(51,172,111,0.03)" } }}>
                <TableCell>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{s.name}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#6B7280" }}>{s.username} • {s.joinDate}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {renderStars(Math.round(s.rating))}
                    <Typography sx={{ fontWeight: 700 }}>{s.rating}</Typography>
                    <Typography sx={{ color: "#6B7280", fontSize: 12 }}>({s.reviews})</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{s.totalSales.toLocaleString()}</TableCell>
                <TableCell>
                  {s.disputed > 0 ? (
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 0.5, borderRadius: 2, bgcolor: "#FFF7ED", color: "#C2410C", fontSize: 12, fontWeight: 700 }}>
                      <AlertCircle size={14} />
                      {s.disputed}
                    </Box>
                  ) : (
                    <Box sx={{ color: "#16A34A", fontSize: 13, display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckCircle size={16} /> Clean
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: "20px", bgcolor: s.status === "verified" ? "#E8F9EE" : s.status === "warning" ? "#FFF7ED" : "#F2F2F7", color: s.status === "verified" ? "#16A34A" : s.status === "warning" ? "#D97706" : "#6B7280", fontWeight: 700, fontSize: 12 }}>
                    {s.status === "verified" ? "Verified" : s.status === "warning" ? "Warning" : "Standard"}
                  </Box>
                </TableCell>
                <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setSelectedSeller(s)}
                      sx={{
                        background: "linear-gradient(135deg,#33ac6f,#2a8e5b)",
                        color: "#fff",
                        textTransform: "none",
                        borderRadius: 2,
                        boxShadow: "0 8px 20px rgba(51,172,111,0.18)",
                        '&:hover': { background: 'linear-gradient(135deg,#2d9962,#257a50)' },
                      }}
                    >
                      View Reviews
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, p) => setPage(p)}
          boundaryCount={15}
          siblingCount={1}
          size="large"
          sx={{
            "& .MuiPaginationItem-root": {
              fontSize: "1rem",
              fontWeight: 500,
              minWidth: 44,
              height: 44,
              borderRadius: "12px",
              margin: "0 6px",
              color: "#4B5563",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "#E6F4EA",
                color: "#33ac6f",
                transform: "translateY(-3px)",
                boxShadow: "0 6px 16px rgba(51, 172, 111, 0.2)",
              },
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              background: "linear-gradient(135deg, #33ac6f, #2a8e5b)",
              color: "#ffffff",
              fontWeight: 700,
              boxShadow: "0 8px 24px rgba(51, 172, 111, 0.35)",
              transform: "translateY(-3px)",
              "&:hover": {
                background: "linear-gradient(135deg, #2d9962, #257a50)",
                boxShadow: "0 12px 28px rgba(51, 172, 111, 0.4)",
              },
            },
            "& .MuiPaginationItem-previousNext": {
              backgroundColor: "#ffffff",
              border: "1px solid #E5E7EB",
              color: "#6B7280",
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: "#f3f4f6",
                borderColor: "#33ac6f",
                color: "#33ac6f",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
              "&.Mui-disabled": {
                backgroundColor: "#f9fafb",
                color: "#9CA3AF",
                borderColor: "#E5E7EB",
              },
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "#9CA3AF",
              fontSize: "1.4rem",
              margin: "0 8px",
            },
          }}
        />

        <Typography variant="body2" color="#6B7280" sx={{ mt: 2.5, fontSize: "0.925rem", letterSpacing: "0.2px" }}>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong> • {filtered.length} sellers
        </Typography>
      </Box>

      <Dialog
        open={!!selectedSeller}
        onClose={() => setSelectedSeller(null)}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 3, background: "linear-gradient(145deg, #ffffff, #f8fafc)" } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#F9FAFB", color: "#1F2A44" }}>
          {selectedSeller?.name}
          <IconButton onClick={() => setSelectedSeller(null)} size="small"><X /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSeller && (
            <Box>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "#F8F9FA", borderRadius: 2 }}>
                  <Typography variant="caption">Overall Rating</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 1 }}>
                    {renderStars(Math.round(selectedSeller.rating))}
                    <Typography sx={{ fontWeight: 700 }}>{selectedSeller.rating}</Typography>
                  </Box>
                  <Typography variant="caption" color="#6B7280">{selectedSeller.reviews} reviews</Typography>
                </Box>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "#F8F9FA", borderRadius: 2 }}>
                  <Typography variant="caption">Total Sales</Typography>
                  <Typography sx={{ fontWeight: 700, color: "#6D28D9", mt: 1 }}>{selectedSeller.totalSales.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "#F8F9FA", borderRadius: 2 }}>
                  <Typography variant="caption">Disputed</Typography>
                  <Typography sx={{ fontWeight: 700, color: "#C2410C", mt: 1 }}>{selectedSeller.disputed}</Typography>
                </Box>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "#F8F9FA", borderRadius: 2 }}>
                  <Typography variant="caption">Member Since</Typography>
                  <Typography sx={{ fontWeight: 700, mt: 1 }}>{selectedSeller.joinDate}</Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mb: 2 }}>Recent Reviews</Typography>
              <Box sx={{ display: "grid", gap: 2 }}>
                {selectedSeller.recentReviews.map((r) => (
                  <Paper key={r.id} variant="outlined" sx={{ p: 2, bgcolor: r.disputed ? "#FFFBF0" : "#FBFDFF" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <Box>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
                          <Typography sx={{ fontWeight: 700 }}>{r.buyer}</Typography>
                          {renderStars(r.rating)}
                          <Typography sx={{ color: "#6B7280", fontSize: 12, display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Clock size={14} /> {r.date}
                          </Typography>
                        </Box>
                        <Typography>{r.comment}</Typography>
                        <Box sx={{ mt: 1 }}>
                          <Button size="small" startIcon={<ThumbsUp size={14} />}>
                            Helpful ({r.helpful})
                          </Button>
                        </Box>
                      </Box>
                      {r.disputed && <Box sx={{ bgcolor: "#FFF4E6", color: "#C2410C", px: 2, py: 0.5, borderRadius: 2, fontWeight: 700 }}>DISPUTED</Box>}
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSeller(null)}>Close</Button>
          <Button variant="contained" sx={{ background: "linear-gradient(135deg,#33ac6f,#2a8e5b)", color: '#fff', '&:hover': { background: 'linear-gradient(135deg,#2d9962,#257a50)' } }}>Boost This Seller</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RatingsReputationPanel;