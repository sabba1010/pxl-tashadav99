import {
  ArrowDownward,
  ArrowUpward,
  Close,
  Edit,
  Search,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Chip,
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
  alpha
} from "@mui/material";
import React, { useMemo, useState } from "react";

interface Listing {
  id: string;
  title: string;
  sellerId: number;
  category: "Electronics" | "Services" | "Home Goods" | "Digital";
  priceUSD: number;
  status: "Active" | "Draft" | "Suspended" | "Sold";
  dateCreated: string;
}

// Mock Data
const mockListings: Listing[] = [
  {
    id: "L1001",
    title: "Vintage Vinyl Player",
    sellerId: 2,
    category: "Home Goods",
    priceUSD: 150.0,
    dateCreated: "2024-05-15",
    status: "Active",
  },
  {
    id: "L1002",
    title: "Premium Logo Design Service",
    sellerId: 7,
    category: "Services",
    priceUSD: 75.0,
    dateCreated: "2024-05-20",
    status: "Active",
  },
  {
    id: "L1003",
    title: "High-speed USB-C Cable (5-pack)",
    sellerId: 9,
    category: "Electronics",
    priceUSD: 19.99,
    dateCreated: "2024-05-22",
    status: "Draft",
  },
  {
    id: "L1004",
    title: "Advanced Data Analysis E-book",
    sellerId: 4,
    category: "Digital",
    priceUSD: 49.99,
    dateCreated: "2024-05-25",
    status: "Sold",
  },
  {
    id: "L1005",
    title: "Custom WordPress Theme Installation",
    sellerId: 2,
    category: "Services",
    priceUSD: 350.0,
    dateCreated: "2024-06-01",
    status: "Suspended",
  },
  {
    id: "L1006",
    title: '4K Monitor 27"',
    sellerId: 11,
    category: "Electronics",
    priceUSD: 599.0,
    dateCreated: "2024-06-05",
    status: "Active",
  },
  {
    id: "L1007",
    title: "Handmade Ceramic Mug Set",
    sellerId: 7,
    category: "Home Goods",
    priceUSD: 25.5,
    dateCreated: "2024-06-10",
    status: "Active",
  },
  {
    id: "L1008",
    title: "Beginner Coding Course Access",
    sellerId: 4,
    category: "Digital",
    priceUSD: 99.0,
    dateCreated: "2024-06-12",
    status: "Active",
  },
  {
    id: "L1009",
    title: "Rare Comic Book Collection",
    sellerId: 9,
    category: "Digital",
    priceUSD: 1200.0,
    dateCreated: "2024-06-15",
    status: "Sold",
  },
  {
    id: "L1010",
    title: "One Hour Fitness Coaching",
    sellerId: 11,
    category: "Services",
    priceUSD: 50.0,
    dateCreated: "2024-06-18",
    status: "Active",
  },
];

const ITEMS_PER_PAGE = 8;

const ListingsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Listing | "">("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [open, setOpen] = useState(false);
  const selected = useState<Listing | null>(null)[0];
  const setSelected = useState<Listing | null>(null)[1];

  // Filtering + Sorting
  const filtered = useMemo(() => {
    let data = mockListings.filter(
      (l) =>
        l.id.toLowerCase().includes(search.toLowerCase()) ||
        l.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy) {
      data.sort((a, b) => {
        const av = a[sortBy];
        const bv = b[sortBy];
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [search, sortBy, sortDir]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleSort = (key: keyof Listing) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const statusColor = (s: Listing["status"]) => {
    const map: Record<Listing["status"], string> = {
      Active: "#33ac6f",
      Draft: "#f59e0b",
      Suspended: "#ef4444",
      Sold: "#3b82f6",
    };
    return map[s];
  };

  return (
    <Box sx={{ p: 3, pb: 8 }}>
      {/* Header + Search */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Listings ({filtered.length})
          </Typography>

          <Box position="relative" width={300}>
            <Search
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "gray.500",
              }}
            />
            <InputBase
              placeholder="Search title / ID..."
              value={search} // ফিক্স ১
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // ফিক্স ২: প্রতিবার সার্চ করলে পেজ ১ এ রিসেট
              }}
              sx={{
                pl: 5,
                pr: 2,
                py: 1.2,
                width: "100%",
                bgcolor: "white",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "gray.300",
                "&:focus-within": {
                  borderColor: "#33ac6f",
                  boxShadow: "0 0 0 3px rgba(51, 172, 111, 0.15)",
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          bgcolor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(51,172,111,0.08)" }}>
              {[
                { label: "ID", key: "id" },
                { label: "Title", key: "" },
                { label: "Seller", key: "" },
                { label: "Category", key: "category" },
                { label: "Price", key: "priceUSD", align: "right" as const },
                { label: "Status", key: "status" },
                { label: "Actions", key: "" },
              ].map((h) => (
                <TableCell
                  key={h.label}
                  align={h.align || "left"}
                  onClick={() => h.key && handleSort(h.key as keyof Listing)}
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    cursor: h.key ? "pointer" : "default",
                    userSelect: "none",
                  }}
                >
                  {h.label}
                  {h.key &&
                    sortBy === h.key &&
                    (sortDir === "asc" ? (
                      <ArrowUpward sx={{ fontSize: 14, ml: 0.5 }} />
                    ) : (
                      <ArrowDownward sx={{ fontSize: 14, ml: 0.5 }} />
                    ))}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((l) => (
              <TableRow
                key={l.id}
                hover
                sx={{ "&:hover": { bgcolor: alpha("#33ac6f", 0.04) } }}
              >
                <TableCell
                  sx={{ fontFamily: "monospace", fontWeight: "medium" }}
                >
                  {l.id}
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium" noWrap>
                    {l.title}
                  </Typography>
                </TableCell>
                <TableCell>User {l.sellerId}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={l.category}
                    size="small"
                    sx={{
                      bgcolor:
                        l.category === "Services" ? "#D1A14822" : undefined,
                      color: l.category === "Services" ? "#D1A148" : undefined,
                    }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  ${l.priceUSD.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={l.status}
                    size="small"
                    sx={{
                      bgcolor: alpha(statusColor(l.status), 0.15),
                      color: statusColor(l.status),
                      fontWeight: "bold",
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View">
                    <IconButton
                      onClick={() => {
                        setSelected(l);
                        setOpen(true);
                      }}
                    >
                      <Visibility sx={{ color: "#33ac6f" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => {
                        setSelected(l);
                        setOpen(true);
                      }}
                    >
                      <Edit sx={{ color: "#D1A148" }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 2,
                bgcolor: page === page ? "#33ac6f" : undefined,
                color: page === page ? "white" : undefined,
              },
            }}
          />
        </Box>
      )}

      {/* Simple Modal (View/Edit) */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selected && (
          <>
            <DialogTitle
              sx={{
                bgcolor: "#33ac6f",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {selected.title}
              <IconButton
                onClick={() => setOpen(false)}
                sx={{ color: "white" }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ py: 4 }}>
              <Box display="grid" gap={3}>
                <Box>
                  <strong>ID:</strong> {selected.id}
                </Box>
                <Box>
                  <strong>Seller:</strong> User {selected.sellerId}
                </Box>
                <Box>
                  <strong>Category:</strong> {selected.category}
                </Box>
                <Box>
                  <strong>Price:</strong> ${selected.priceUSD.toFixed(2)}
                </Box>
                <Box>
                  <strong>Status:</strong>{" "}
                  <Chip
                    label={selected.status}
                    sx={{
                      bgcolor: alpha(statusColor(selected.status), 0.2),
                      color: statusColor(selected.status),
                    }}
                  />
                </Box>
                {/* এখানে চাইলে Edit ফর্ম যোগ করতে পারো – কিন্তু এখন সিম্পল রাখলাম */}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ListingsPage;
