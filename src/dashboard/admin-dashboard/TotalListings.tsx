

import {
  Close,
  Edit,
  Search,
  Visibility,
  Refresh,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

interface Listing {
  _id: string;
  category: string;
  name: string;
  description: string;
  price: string;
  email: string;
  password: string;
  userEmail: string;
  status: string;
  previewLink?: string;
}

interface User {
  email: string;
  userAccountName?: string;
  role?: string;
}

const ITEMS_PER_PAGE = 8;

const TotalListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selected, setSelected] = useState<Listing | null>(null);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listingsRes, usersRes] = await Promise.all([
        fetch("https://tasha-vps-backend-2.onrender.com/product/all-sells"),
        fetch("https://tasha-vps-backend-2.onrender.com/api/user/getall"),
      ]);

      const listingsData = await listingsRes.json();
      const usersData = await usersRes.json();

      setListings(listingsData || []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sellersFromListings = useMemo(() => {
    const uniqueEmails = Array.from(new Set(listings.map((l) => l.userEmail)));

    const sellerOptions = uniqueEmails.map((email) => {
      const user = users.find((u) => u.email === email);
      const displayName = user?.userAccountName || email.split("@")[0];
      return {
        email,
        displayName,
      };
    });

    sellerOptions.sort((a, b) =>
      a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase())
    );

    return sellerOptions;
  }, [listings, users]);

  const statusOptions = useMemo(() => {
    const unique = new Set(
      listings
        .map((l) => (l.status || "").toLowerCase())
        .filter(Boolean)
    );
    return ["all", ...Array.from(unique)];
  }, [listings]);

  const filteredListings = useMemo(() => {
    const filtered = listings.filter(
      (l) =>
        (l.name.toLowerCase().includes(search.toLowerCase()) ||
          l._id.toLowerCase().includes(search.toLowerCase())) &&
        (selectedUser === "all" || l.userEmail === selectedUser) &&
        (selectedStatus === "all" || l.status.toLowerCase() === selectedStatus)
    );

    // Sort by updatedAt (newest first), then by createdAt
    return filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [listings, search, selectedUser, selectedStatus]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredListings, page]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / ITEMS_PER_PAGE));

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return { color: "#34C759", bg: "#E8F9EE" };
      case "pending": return { color: "#FF9500", bg: "#FFF4E6" };
      case "reject":
      case "denied":
        return { color: "#EF4444", bg: "#FFEBEB" };
      default: return { color: "#8E8E93", bg: "#F2F2F7" };
    }
  };

  const getDisplayName = (email: string) => {
    const user = users.find((u) => u.email === email);
    return user?.userAccountName || email.split("@")[0];
  };

  const handleUpdateStatus = async () => {
    if (!selected) return;
    if (newStatus === "reject" && !rejectReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }

    try {
      const res = await fetch(`https://tasha-vps-backend-2.onrender.com/product/update-status/${selected._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          rejectReason: newStatus === "reject" ? rejectReason : "",
        }),
      });

      if (res.ok) {
        setListings((prev) =>
          prev.map((item) =>
            item._id === selected._id
              ? { ...item, status: newStatus, rejectReason: newStatus === "reject" ? rejectReason : "" }
              : item
          )
        );
        setOpenEdit(false);
        setRejectReason("");
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleFilterChange = () => setPage(1);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={10}>
        <CircularProgress sx={{ color: "#33ac6f" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5" fontWeight={700} color="#1F2A44">
              Listings ({filteredListings.length})
            </Typography>
            <IconButton
              size="small"
              onClick={() => fetchData()}
              title="Reload listings"
              sx={{ ml: 0.5, bgcolor: "#33ac6f", border: "1px solid #E5E7EB", color: "#fff", "&:hover": { bgcolor: "#2a8e5b" } }}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            <Box sx={{ position: "relative", width: 280 }}>
              <Search
                sx={{
                  position: "absolute",
                  left: 15,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6B7280",
                }}
              />
              <InputBase
                placeholder="Search listings..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleFilterChange();
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
                  "&:focus-within": {
                    borderColor: "#33ac6f",
                    boxShadow: "0 0 0 3px rgba(51,172,111,0.1)",
                  },
                }}
              />
            </Box>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Seller</InputLabel>
              <Select
                value={selectedUser}
                label="Seller"
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  handleFilterChange();
                }}
                sx={{
                  borderRadius: "12px",
                  height: 44,
                  bgcolor: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <MenuItem value="all">All Sellers</MenuItem>
                {sellersFromListings.map((seller) => (
                  <MenuItem key={seller.email} value={seller.email}>
                    {seller.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                label="Status"
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  handleFilterChange();
                }}
                sx={{
                  borderRadius: "12px",
                  height: 44,
                  bgcolor: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                {statusOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* Table */}
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
              {["ID", "Title", "Seller Name", "Seller Email", "Preview", "Price", "Status", "Actions"].map(
                (h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 600,
                      color: "#6B7280",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      py: 2.5,
                    }}
                  >
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row) => {
              const style = getStatusStyle(row.status);
              return (
                <TableRow
                  key={row._id}
                  hover
                  sx={{ "&:hover": { bgcolor: "rgba(51,172,111,0.03)" } }}
                >
                  <TableCell sx={{ fontSize: "13px", color: "#6B7280" }}>
                    #{row._id.slice(-5).toUpperCase()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "#1F2A44" }}>{row.name}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "#1F2A44" }}>
                    {getDisplayName(row.userEmail)}
                  </TableCell>
                  <TableCell sx={{ color: "#6B7280" }}>{row.userEmail}</TableCell>
                  <TableCell>
                    {row.previewLink ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => window.open(row.previewLink, "_blank")}
                        sx={{ textTransform: "none", borderRadius: 1 }}
                      >
                        Preview
                      </Button>
                    ) : (
                      <Typography variant="caption" color="#9CA3AF">-</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1F2A44" }}>
                    ${parseFloat(row.price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "20px",
                        bgcolor: style.bg,
                        color: style.color,
                        fontSize: "12px",
                        fontWeight: 700,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      {row.status.toUpperCase()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelected(row);
                        setOpenView(true);
                      }}
                      sx={{ "&:hover": { bgcolor: "rgba(51,172,111,0.1)" } }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelected(row);
                        setNewStatus(row.status);
                        setOpenEdit(true);
                      }}
                      sx={{ "&:hover": { bgcolor: "rgba(255,149,0,0.1)" } }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    {/* REPORT ICON REMOVED FROM TABLE */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box mt={5} display="flex" flexDirection="column" alignItems="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, p) => setPage(p)}
          size="large"
          sx={{
            display: "inline-flex",
            p: 1,
            borderRadius: 2,
            bgcolor: "transparent",
            "& .MuiPaginationItem-root": {
              fontSize: "1rem",
              fontWeight: 500,
              minWidth: 40,
              height: 40,
              borderRadius: "12px",
              mx: 0.5,
              color: "#4B5563",
              transition: "all 0.18s",
              bgcolor: "#fff",
              boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
              "&:hover": {
                bgcolor: "#E6F4EA",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(51,172,111,0.12)",
              },
            },
            "& .Mui-selected": {
              bgcolor: "#33ac6f !important",
              color: "#fff",
              fontWeight: 700,
              boxShadow: "0 8px 20px rgba(51,172,111,0.25)",
              minWidth: 40,
              height: 40,
              borderRadius: "10px",
            },
            "& .MuiPaginationItem-previousNext": {
              bgcolor: "#fff",
              border: "1px solid #E5E7EB",
              "&:hover": {
                bgcolor: "#f3f4f6",
                borderColor: "#33ac6f",
                color: "#33ac6f",
              },
            },
          }}
        />
        <Typography color="#6B7280" mt={2.5} fontSize="0.925rem">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong> • {filteredListings.length} listings
        </Typography>
      </Box>

      {/* View Modal */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, background: "linear-gradient(145deg, #ffffff, #f8fafc)" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            bgcolor: "#F9FAFB",
            fontWeight: 700,
            color: "#1F2A44",
          }}
        >
          Details
          <IconButton onClick={() => setOpenView(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box p={1}>
              <Typography variant="h6" fontWeight={600} color="#1F2A44">
                {selected.name}
              </Typography>
              <Typography color="#6B7280" mb={2}>
                {selected.category}
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "#F8F9FA",
                  borderRadius: 2,
                  mb: 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <Typography variant="body2">
                  <strong>Login Email:</strong> {selected.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Password:</strong> {selected.password}
                </Typography>
              </Paper>
              {selected.previewLink && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#F8F9FA", borderRadius: 2, mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Preview Link:</strong>
                  </Typography>
                  <Box display="flex" gap={2} alignItems="center">
                    <a href={selected.previewLink} target="_blank" rel="noreferrer" style={{ color: '#2a8e5b', fontWeight: 700 }}>{selected.previewLink}</a>
                    <Button size="small" onClick={() => window.open(selected.previewLink, '_blank')} variant="contained" sx={{ bgcolor: '#33ac6f', '&:hover': { bgcolor: '#2a8e5b' } }}>Open</Button>
                  </Box>
                </Paper>
              )}
              <Typography variant="body2">
                <strong>Seller:</strong> {selected.userEmail}
              </Typography>
              <Typography mt={1} color="#6B7280">
                <strong>Description:</strong> {selected.description}
              </Typography>

              {/* Optional: You can add Reject button here later if you want */}
              {/* <Box mt={3} display="flex" justifyContent="flex-end">
                {selected.status.toLowerCase() !== "reject" && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setOpenView(false);
                      setNewStatus("reject");
                      setRejectReason("");
                      setOpenEdit(true);
                    }}
                  >
                    Reject This Listing
                  </Button>
                )}
              </Box> */}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit / Status Update Modal */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 380 } }}
      >
        <DialogTitle fontWeight={700} color="#1F2A44">
          Update Status
        </DialogTitle>
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
              sx={{ borderRadius: "12px" }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reject">Reject</MenuItem>
            </Select>
          </FormControl>

          {newStatus === "reject" && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reject Reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              sx={{ mt: 3, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
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
              textTransform: "none",
              "&:hover": { bgcolor: "#2a8e5b", boxShadow: "0 4px 12px rgba(51,172,111,0.3)" },
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