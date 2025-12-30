import {
  Close,
  Edit,
  Search,
  Visibility,
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
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modals & Selection
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);

  // Edit form states
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

  const uniqueUsers = useMemo(() => {
    const users = Array.from(new Set(listings.map((item) => item.userEmail)));
    return ["all", ...users];
  }, [listings]);

  const statusOptions = ["all", "active", "pending", "reject", "sold"];

  const handleUpdateStatus = async () => {
    if (!selected) return;
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
        (l.name.toLowerCase().includes(search.toLowerCase()) ||
          l._id.toLowerCase().includes(search.toLowerCase())) &&
        (selectedUser === "all" || l.userEmail === selectedUser) &&
        (selectedStatus === "all" ||
          l.status.toLowerCase() === selectedStatus.toLowerCase())
    );
  }, [search, listings, selectedUser, selectedStatus]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

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
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      {/* Header */}
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
        <Typography variant="h5" fontWeight="700" color="#1F2A44">
          Listings ({filtered.length})
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
          <FormControl sx={{ minWidth: 140 }}>
            <Select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setPage(1);
              }}
              displayEmpty
              sx={{
                borderRadius: "12px",
                height: 44,
                bgcolor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              {uniqueUsers.map((user) => (
                <MenuItem key={user} value={user}>
                  {user === "all" ? "All Users" : user.split("@")[0]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              displayEmpty
              sx={{
                borderRadius: "12px",
                height: 44,
                bgcolor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              {[
                "ID",
                "Title",
                "Seller Name",
                "Seller Email",
                "Price",
                "Status",
                "Actions",
              ].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    fontWeight: "600",
                    color: "#6B7280",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    py: 2.5,
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row) => {
              const styles = getStatusStyles(row.status);
              return (
                <TableRow
                  key={row._id}
                  hover
                  sx={{
                    "&:hover": { background: "rgba(51,172,111,0.03)" },
                  }}
                >
                  <TableCell sx={{ fontSize: "13px", color: "#6B7280" }}>
                    #{row._id.slice(-5).toUpperCase()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "500", color: "#1F2A44" }}>
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ color: "#1F2A44" }}>
                    {row.userEmail.split("@")[0]}
                  </TableCell>
                  <TableCell sx={{ color: "#6B7280", fontSize: "14px" }}>
                    {row.userEmail}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#1F2A44" }}>
                    ${parseFloat(row.price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "20px",
                        bgcolor: styles.bg,
                        color: styles.color,
                        fontSize: "12px",
                        fontWeight: "700",
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modern Pagination */}
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

        <Typography
          variant="body2"
          color="#6B7280"
          sx={{ mt: 2.5, fontSize: "0.925rem", letterSpacing: "0.2px" }}
        >
          Page <strong>{page}</strong> of <strong>{totalPages}</strong> • {filtered.length} total listings
        </Typography>
      </Box>

      {/* View Modal */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            display: "flex",
            justifyContent: "space-between",
            bgcolor: "#F9FAFB",
            color: "#1F2A44",
          }}
        >
          Details
          <IconButton onClick={() => setOpenView(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box sx={{ p: 1 }}>
              <Typography variant="h6" fontWeight="600" color="#1F2A44">
                {selected.name}
              </Typography>
              <Typography color="#6B7280" sx={{ mb: 2 }}>
                {selected.category}
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "#F8F9FA",
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <Typography variant="body2" color="#1F2A44">
                  <strong>Login Email:</strong> {selected.email}
                </Typography>
                <Typography variant="body2" color="#1F2A44">
                  <strong>Password:</strong> {selected.password}
                </Typography>
              </Paper>
              <Typography variant="body2" color="#1F2A44">
                <strong>Seller:</strong> {selected.userEmail}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }} color="#6B7280">
                <strong>Description:</strong> {selected.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: "380px",
            background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1F2A44" }}>
          Update Status
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel sx={{ color: "#6B7280" }}>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => {
                setNewStatus(e.target.value);
                if (e.target.value !== "reject") setRejectReason("");
              }}
              sx={{
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reject">Reject</MenuItem>
              <MenuItem value="sold">Sold</MenuItem>
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
              sx={{
                mt: 3,
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
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
              "&:hover": {
                bgcolor: "#2a8e5b",
                boxShadow: "0 4px 12px rgba(51,172,111,0.3)",
              },
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