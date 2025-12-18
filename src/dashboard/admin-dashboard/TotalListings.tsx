import {
  ArrowDownward,
  ArrowUpward,
  Close,
  Edit,
  Search,
  Visibility,
  Save,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  alpha,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Divider,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

// এপিআই থেকে আসা ডাটা স্ট্রাকচার অনুযায়ী ইন্টারফেস
interface Listing {
  _id: string;
  category: string;
  categoryIcon: string;
  name: string;
  description: string;
  price: string;
  username: string;
  accountPass: string;
  previewLink: string;
  email: string;
  password: string;
  additionalInfo: string;
  userEmail: string;
  userRole: string;
  status: string;
}

const ITEMS_PER_PAGE = 8;

const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  // ডায়ালগ এবং সিলেক্টেড আইটেম স্টেট
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [newStatus, setNewStatus] = useState("");

  // কম্পোনেন্ট লোড হওয়ার সময় ডাটা ফেচ করা
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3200/product/all-sells");
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // স্ট্যাটাস পরিবর্তনের পর সরাসরি ব্যাকএন্ডে হিট করার ফাংশন
  const handleUpdateStatus = async () => {
    if (!selected) return;
    try {
      const response = await fetch(`http://localhost:3200/product/update-status/${selected._id}`, {
        method: 'PATCH', // ব্যাকএন্ড অনুযায়ী PATCH বা PUT ব্যবহার করুন
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        // ডাটাবেজে আপডেট হলে ফ্রন্টএন্ড স্টেটও আপডেট হবে
        setListings(prev => prev.map(item => item._id === selected._id ? { ...item, status: newStatus } : item));
        setOpenEdit(false);
      } else {
        alert("Failed to update status on server.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Error connecting to backend.");
    }
  };

  const filtered = useMemo(() => {
    return [...listings].filter(l => 
      l.name.toLowerCase().includes(search.toLowerCase()) || 
      l._id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, listings]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  // স্ট্যাটাস অনুযায়ী ডিজাইন স্টাইল
  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return { color: "#34C759", bg: "#E8F9EE" };
      case "pending": return { color: "#FF9500", bg: "#FFF4E6" };
      case "reject": return { color: "#FF3B30", bg: "#FFEBEB" };
      case "sold": return { color: "#007AFF", bg: "#EBF5FF" };
      default: return { color: "#8E8E93", bg: "#F2F2F7" };
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress sx={{ color: '#33ac6f' }} /></Box>;

  return (
    <Box sx={{ p: 4, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
      {/* হেডার এবং সার্চ বার */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #F2F2F2' }}>
        <Typography variant="h5" fontWeight="700" sx={{ color: "#111827" }}>
          Listings ({filtered.length})
        </Typography>
        <Box sx={{ position: 'relative', width: 320 }}>
          <Search sx={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 20 }} />
          <InputBase 
            placeholder="Search title / ID..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            sx={{ 
              bgcolor: '#fff', border: '1px solid #D1D5DB', borderRadius: '10px', 
              pl: 6, pr: 2, py: 1, width: '100%', fontSize: '14px',
              '&:focus-within': { borderColor: '#33ac6f', boxShadow: '0 0 0 2px rgba(51, 172, 111, 0.1)' }
            }}
          />
        </Box>
      </Paper>

      {/* টেবিল ডিজাইন */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #F2F2F2', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F9FAFB" }}>
            <TableRow>
              {["ID", "Title", "Seller", "Category", "Price", "Status", "Actions"].map((head) => (
                <TableCell key={head} sx={{ fontWeight: "600", color: "#6B7280", fontSize: "12px", textTransform: "uppercase" }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row) => {
              const styles = getStatusStyles(row.status);
              return (
                <TableRow key={row._id} sx={{ '&:hover': { bgcolor: '#FBFBFC' } }}>
                  <TableCell sx={{ fontSize: "13px", color: "#6B7280" }}>#{row._id.slice(-5).toUpperCase()}</TableCell>
                  <TableCell sx={{ fontWeight: "500", fontSize: "14px" }}>{row.name}</TableCell>
                  <TableCell sx={{ fontSize: "14px" }}>{row.userEmail.split('@')[0]}</TableCell>
                  <TableCell>
                    <Chip label={row.category} size="small" sx={{ borderRadius: "6px", fontSize: "11px" }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: "700" }}>${parseFloat(row.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-block', px: 1.5, py: 0.4, borderRadius: '20px', bgcolor: styles.bg, color: styles.color, fontSize: '12px', fontWeight: '700' }}>
                      {row.status.toUpperCase()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="View">
                        <IconButton size="small" sx={{ color: "#10B981" }} onClick={() => { setSelected(row); setOpenView(true); }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Status">
                        <IconButton size="small" sx={{ color: "#F59E0B" }} onClick={() => { setSelected(row); setNewStatus(row.status); setOpenEdit(true); }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* পেজিনেশন */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination 
          count={Math.ceil(filtered.length / ITEMS_PER_PAGE)} 
          page={page} 
          onChange={(_, p) => setPage(p)} 
          color="primary"
          shape="rounded"
          sx={{ '& .Mui-selected': { bgcolor: '#33ac6f !important', color: '#fff' } }}
        />
      </Box>

      {/* VIEW DIALOG: শুধুমাত্র তথ্য দেখার জন্য */}
      <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#F9FAFB' }}>
          Product Details
          <IconButton onClick={() => setOpenView(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box sx={{ display: 'grid', gap: 2.5, py: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Product Name</Typography>
                <Typography variant="h6" fontWeight="600">{selected.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Price</Typography>
                  <Typography variant="body1" fontWeight="700" color="primary">${selected.price}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Category</Typography>
                  <Typography variant="body1">{selected.category}</Typography>
                </Box>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Account Credentials</Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#FAFAFA' }}>
                  <Typography variant="body2"><strong>Email:</strong> {selected.email}</Typography>
                  <Typography variant="body2"><strong>Password:</strong> {selected.password}</Typography>
                </Paper>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Description</Typography>
                <Typography variant="body2">{selected.description}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* EDIT STATUS DIALOG: স্ট্যাটাস আপডেট করার জন্য */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} PaperProps={{ sx: { borderRadius: 3, width: '100%', maxWidth: '350px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Update Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            Change status for <strong>{selected?.name}</strong>
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={newStatus} label="Status" onChange={(e) => setNewStatus(e.target.value)}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reject">Reject</MenuItem>
              <MenuItem value="sold">Sold</MenuItem>
            </Select>
          </FormControl>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleUpdateStatus} 
            sx={{ mt: 3, bgcolor: "#33ac6f", borderRadius: 2, py: 1.2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#2a8e5b' } }}
          >
            Confirm Update
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ListingsPage;