import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
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
  Chip,
  Avatar,
  Stack
} from "@mui/material";
import {
  Close,
  Edit,
  Visibility,
  Refresh,
  Search,
  Description,
  Person,
  Link as LinkIcon
} from "@mui/icons-material";

/* ─────────────────────────────────────────────────────────────
 * TYPES
 * ───────────────────────────────────────────────────────────── */
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
  createdAt?: string;
  updatedAt?: string;
  categoryIcon?: string; // Added for product icon
}

interface User {
  email: string;
  userAccountName?: string;
  role?: string;
}

const ITEMS_PER_PAGE = 10;

/* ─────────────────────────────────────────────────────────────
 * COMPONENT
 * ───────────────────────────────────────────────────────────── */
const TotalListings: React.FC = () => {
  /* ── State ── */
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selected, setSelected] = useState<Listing | null>(null);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [rejectReason, setRejectReason] = useState("");

  /* ── Data Fetching (Polling) ── */
  const fetchListingsData = async () => {
    const [listingsRes, usersRes] = await Promise.all([
      fetch("https://tasha-vps-backend-2.onrender.com/product/all-sells"),
      fetch("https://tasha-vps-backend-2.onrender.com/api/user/getall"),
    ]);

    const listingsData = await listingsRes.json();
    const usersData = await usersRes.json();

    return {
      listings: (Array.isArray(listingsData) ? listingsData : []) as Listing[],
      users: (Array.isArray(usersData) ? usersData : []) as User[]
    };
  };

  const { data, isLoading: loading, refetch } = useQuery({
    queryKey: ['adminListings'],
    queryFn: fetchListingsData,
    refetchInterval: 5000,
  });

  const listings = data?.listings || [];
  const users = data?.users || [];

  /* ── Helpers ── */
  const getDisplayName = (email: string) => {
    if (!email) return "Unknown User";
    const user = users.find((u) => u.email === email);
    return user?.userAccountName || email.split("@")[0];
  };

  const sellersFromListings = useMemo(() => {
    const uniqueEmails = Array.from(new Set(listings.map((l) => l.userEmail).filter(Boolean)));
    const sellerOptions = uniqueEmails.map((email) => {
      const user = users.find((u) => u.email === email);
      return {
        email,
        displayName: user?.userAccountName || (email ? email.split("@")[0] : "Unknown"),
      };
    });
    return sellerOptions.sort((a, b) =>
      a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase())
    );
  }, [listings, users]);

  const statusOptions = useMemo(() => {
    const unique = new Set(
      listings
        .map((l) => (l.status || "").toLowerCase())
        .filter(Boolean)
    );
    return ["all", ...Array.from(unique)];
  }, [listings]);

  /* ── Filter & Sort ── */
  const filteredListings = useMemo(() => {
    const filtered = listings.filter(
      (l) =>
        (l.name.toLowerCase().includes(search.toLowerCase()) ||
          l._id.toLowerCase().includes(search.toLowerCase())) &&
        (selectedUser === "all" || l.userEmail === selectedUser) &&
        (selectedStatus === "all" || l.status.toLowerCase() === selectedStatus)
    );

    // Sort by updatedAt (newest first)
    return filtered.sort((a: Listing, b: Listing) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [listings, search, selectedUser, selectedStatus]);

  /* ── Pagination ── */
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredListings, page]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / ITEMS_PER_PAGE));

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
        refetch();
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

  /* ── Render Status Chip ── */
  const renderStatus = (status: string) => {
    // Handle undefined/null status
    if (!status) {
      return (
        <Chip
          label="UNKNOWN"
          size="small"
          color="default"
          variant="outlined"
          sx={{ fontWeight: 700, fontSize: "11px" }}
        />
      );
    }

    const s = status.toLowerCase();
    let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";

    if (s === "active") color = "success";
    else if (s === "pending") color = "warning";
    else if (s === "reject" || s === "denied") color = "error";

    return (
      <Chip
        label={status.toUpperCase()}
        size="small"
        color={color}
        variant={s === 'active' ? 'filled' : 'outlined'}
        sx={{ fontWeight: 700, fontSize: "11px" }}
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header & Filters */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: "1px solid #E2E8F0" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5" fontWeight={700} color="#1E293B">
              Listings Management
            </Typography>
            <Chip label={`${filteredListings.length} Total`} color="primary" size="small" variant="outlined" />
          </Box>

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <IconButton
              onClick={() => refetch()}
              sx={{ bgcolor: "#F1F5F9", border: "1px solid #E2E8F0", '&:hover': { bgcolor: "#E2E8F0" } }}
            >
              <Refresh color="action" />
            </IconButton>

            {/* Filters */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={selectedUser}
                onChange={(e) => { setSelectedUser(e.target.value); handleFilterChange(); }}
                displayEmpty
                sx={{ bgcolor: "white", borderRadius: 2, fontSize: '13px' }}
              >
                <MenuItem value="all">All Sellers</MenuItem>
                {sellersFromListings.map((s) => (
                  <MenuItem key={s.email} value={s.email}>{s.displayName}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); handleFilterChange(); }}
                displayEmpty
                sx={{ bgcolor: "white", borderRadius: 2, fontSize: '13px' }}
              >
                <MenuItem value="all">All Status</MenuItem>
                {statusOptions.map((s) => (
                  <MenuItem key={s} value={s}>{s === "all" ? "All" : s.toUpperCase()}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <InputBase
              placeholder="Search listings..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); handleFilterChange(); }}
              startAdornment={<Search sx={{ color: "#94A3B8", mr: 1 }} />}
              sx={{
                border: "1px solid #CBD5E1",
                borderRadius: "8px",
                px: 2,
                py: 0.5,
                bgcolor: "white",
                minWidth: 250
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid #E2E8F0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "#64748B", fontSize: "12px" }}>LISTING INFO</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B", fontSize: "12px" }}>SELLER</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B", fontSize: "12px" }}>PRICE</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B", fontSize: "12px" }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B", fontSize: "12px" }}>LINKS</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: "#64748B", fontSize: "12px" }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row) => (
              <TableRow key={row._id} hover sx={{ '&:hover': { bgcolor: "#F8FAFC" } }}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      variant="rounded"
                      src={row.categoryIcon}
                      alt={row.name}
                      sx={{ width: 40, height: 40 }} // Adjusted size for better visibility
                    >
                      {/* Fallback to generic icon if no categoryIcon */}
                      {!row.categoryIcon && <Description fontSize="small" />}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600} color="#1E293B">
                        {row.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {row._id.slice(-6).toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person sx={{ fontSize: 16, color: "#94A3B8" }} />
                    <Typography variant="body2" color="#475569">
                      {getDisplayName(row.userEmail)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={700} color="#1E293B">
                    ${parseFloat(row.price).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {renderStatus(row.status)}
                </TableCell>
                <TableCell>
                  {row.previewLink ? (
                    <Button
                      size="small"
                      startIcon={<LinkIcon />}
                      href={row.previewLink}
                      target="_blank"
                      sx={{ textTransform: "none", fontSize: "12px", color: "#3B82F6" }}
                    >
                      Preview
                    </Button>
                  ) : "-"}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton
                      size="small"
                      onClick={() => { setSelected(row); setOpenView(true); }}
                      sx={{ color: "#64748B" }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => { setSelected(row); setNewStatus(row.status); setOpenEdit(true); }}
                      sx={{ color: "#3B82F6" }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="textSecondary">No listings found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, p) => setPage(p)}
          color="primary"
          shape="rounded"
        />
      </Box>

      {/* View Modal */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
          <Typography fontWeight={700}>Listing Details</Typography>
          <IconButton onClick={() => setOpenView(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selected && (
            <Stack spacing={3} mt={1}>
              <Box>
                <Typography variant="caption" color="textSecondary" fontWeight={700}>TITLE</Typography>
                <Typography variant="body1" fontWeight={500}>{selected.name}</Typography>
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography variant="caption" color="textSecondary" fontWeight={700}>CATEGORY</Typography>
                  <Typography variant="body2">{selected.category}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary" fontWeight={700}>PRICE</Typography>
                  <Typography variant="body2" fontWeight={700}>${selected.price}</Typography>
                </Box>
              </Box>

              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#F8FAFC" }}>
                <Typography variant="subtitle2" gutterBottom>Credentials</Typography>
                <Box display="grid" gap={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption" color="textSecondary">Email:</Typography>
                    <Typography variant="body2" fontWeight={500}>{selected.email}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption" color="textSecondary">Password:</Typography>
                    <Typography variant="body2" fontFamily="monospace">{selected.password}</Typography>
                  </Box>
                </Box>
              </Paper>

              <Box>
                <Typography variant="caption" color="textSecondary" fontWeight={700}>DESCRIPTION</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>{selected.description}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Status Modal */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 400, width: '100%' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #E2E8F0' }}>Update Status</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
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
            </Select>
          </FormControl>

          {newStatus === "reject" && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleUpdateStatus}
            sx={{ mt: 3, height: 45, fontWeight: 700 }}
          >
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TotalListings;