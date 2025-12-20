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
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

interface Listing {
  _id: string;
  category: string;
  categoryIcon: string;
  name: string;
  description: string;
  price: string;
  email: string;
  password: string;
  userEmail: string;
  status: string;
}

const ITEMS_PER_PAGE = 8;

const TotalListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modals & Selection States
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);

  // Form States for Update
  const [newStatus, setNewStatus] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3200/product/all-sells");
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // স্ট্যাটাস পরিবর্তনের সরাসরি ব্যাকএন্ড হিট ফাংশন
  const handleUpdateStatus = async () => {
    if (!selected) return;

    // রিজেক্ট করলে রিজন চেক করা
    if (newStatus === "reject" && !rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3200/product/update-status/${selected._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            rejectReason: newStatus === "reject" ? rejectReason : "",
          }),
        }
      );

      if (response.ok) {
        // UI আপডেট সরাসরি করা হচ্ছে পেজ রিফ্রেশ ছাড়া
        setListings((prev) =>
          prev.map((item) =>
            item._id === selected._id ? { ...item, status: newStatus } : item
          )
        );
        setOpenEdit(false);
        setRejectReason("");
      } else {
        alert("Server error while updating status.");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const filtered = useMemo(() => {
    return [...listings].filter(
      (l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l._id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, listings]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return { color: "#34C759", bg: "#E8F9EE" };
      case "pending":
        return { color: "#FF9500", bg: "#FFF4E6" };
      case "reject":
        return { color: "#FF3B30", bg: "#FFEBEB" };
      case "sold":
        return { color: "#007AFF", bg: "#EBF5FF" };
      default:
        return { color: "#8E8E93", bg: "#F2F2F7" };
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress sx={{ color: "#33ac6f" }} />
      </Box>
    );

  return (
    <Box sx={{ p: 4, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid #F2F2F2",
        }}
      >
        <Typography variant="h5" fontWeight="700">
          Listings ({filtered.length})
        </Typography>
        <Box sx={{ position: "relative", width: 320 }}>
          <Search
            sx={{
              position: "absolute",
              left: 15,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
            }}
          />
          <InputBase
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{
              bgcolor: "#fff",
              border: "1px solid #D1D5DB",
              borderRadius: "10px",
              pl: 6,
              pr: 2,
              py: 1,
              width: "100%",
            }}
          />
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 4, border: "1px solid #F2F2F2" }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#F9FAFB" }}>
            <TableRow>
              {["ID", "Title", "Seller", "Price", "Status", "Actions"].map(
                (head) => (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: "600",
                      color: "#6B7280",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    {head}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row) => {
              const styles = getStatusStyles(row.status);
              return (
                <TableRow key={row._id} hover>
                  <TableCell sx={{ fontSize: "13px", color: "#6B7280" }}>
                    #{row._id.slice(-5).toUpperCase()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "500" }}>{row.name}</TableCell>
                  <TableCell sx={{ fontSize: "14px" }}>
                    {row.userEmail.split("@")[0]}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "700" }}>
                    ${parseFloat(row.price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.4,
                        borderRadius: "20px",
                        bgcolor: styles.bg,
                        color: styles.color,
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {row.status.toUpperCase()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => {
                        setSelected(row);
                        setOpenView(true);
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => {
                        setSelected(row);
                        setNewStatus(row.status);
                        setOpenEdit(true);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(_, p) => setPage(p)}
          color="primary"
        />
      </Box>

      {/* VIEW MODAL */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            display: "flex",
            justifyContent: "space-between",
            bgcolor: "#F9FAFB",
          }}
        >
          Details{" "}
          <IconButton onClick={() => setOpenView(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box sx={{ p: 1 }}>
              <Typography variant="h6" fontWeight="600">
                {selected.name}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {selected.category}
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, bgcolor: "#F8F9FA", mb: 2 }}
              >
                <Typography variant="body2">
                  <strong>Login Email:</strong> {selected.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Password:</strong> {selected.password}
                </Typography>
              </Paper>
              <Typography variant="body2">
                <strong>Seller:</strong> {selected.userEmail}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Description:</strong> {selected.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL WITH REJECT REASON */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        PaperProps={{
          sx: { borderRadius: 3, width: "100%", maxWidth: "380px" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Update Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => {
                setNewStatus(e.target.value);
                if (e.target.value !== "reject") setRejectReason("");
              }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reject">Reject</MenuItem>
              <MenuItem value="sold">Sold</MenuItem>
            </Select>
          </FormControl>

          {/* রিজেক্ট সিলেক্ট করলে এই ইনপুট ফিল্ড আসবে */}
          {newStatus === "reject" && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reject Reason"
              variant="outlined"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              sx={{ mt: 3 }}
              placeholder="Why are you rejecting this?"
            />
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleUpdateStatus}
            sx={{
              mt: 3,
              bgcolor: "#33ac6f",
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              "&:hover": { bgcolor: "#2a8e5b" },
            }}
          >
            Confirm Change
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TotalListings;
