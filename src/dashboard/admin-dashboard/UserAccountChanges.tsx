import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Modal,
  Pagination,
  Chip,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Refresh, Visibility, Close, SearchOutlined } from "@mui/icons-material";
import { toast } from "sonner";

interface AccountChange {
  _id: string;
  userEmail: string;
  fieldName: string;
  oldValue: any;
  newValue: any;
  changeType: string;
  timestamp: string;
  ipAddress: string;
}

const BASE_URL = "https://tasha-vps-backend-2.onrender.com";
const ITEMS_PER_PAGE = 10;

export default function UserAccountChanges() {
  const [allChanges, setAllChanges] = useState<AccountChange[]>([]);
  const [filteredChanges, setFilteredChanges] = useState<AccountChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedChange, setSelectedChange] = useState<AccountChange | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");

  // Fetch all account changes
  const fetchChanges = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ success: boolean; changes: AccountChange[] }>(
        `${BASE_URL}/api/user/all-changes/admin/list?limit=500`
      );
      
      if (response.data.success) {
        setAllChanges(response.data.changes);
        setFilteredChanges(response.data.changes);
      } else {
        toast.error("Failed to fetch changes");
      }
    } catch (error) {
      console.error("Error fetching changes:", error);
      toast.error("Error fetching account changes");
    } finally {
      setLoading(false);
    }
  };

  // Filter changes based on search and filter type
  useEffect(() => {
    let filtered = allChanges;

    // Filter by email
    if (searchEmail.trim()) {
      filtered = filtered.filter((change) =>
        change.userEmail.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    // Filter by change type
    if (filterType !== "all") {
      filtered = filtered.filter((change) => change.changeType === filterType);
    }

    setFilteredChanges(filtered);
    setCurrentPage(1);
  }, [searchEmail, filterType, allChanges]);

  // Pagination
  const paginatedChanges = filteredChanges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredChanges.length / ITEMS_PER_PAGE);

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "update":
        return "warning";
      case "create":
        return "success";
      case "delete":
        return "error";
      default:
        return "default";
    }
  };

  const handleOpenDetails = (change: AccountChange) => {
    setSelectedChange(change);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedChange(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Account Changes
          </h1>
          <p className="text-gray-600">
            Monitor all changes made by users in their account settings
          </p>
        </div>

        {/* Controls */}
        <Paper elevation={0} className="p-4 mb-6 bg-white border border-gray-200">
          <Box className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Email */}
            <Box className="flex-1 flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <SearchOutlined className="text-gray-400 mr-2" />
              <InputBase
                placeholder="Search by user email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                fullWidth
              />
            </Box>

            {/* Filter by Change Type */}
            <FormControl className="w-full md:w-48">
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="update">Updates</MenuItem>
                <MenuItem value="create">Creates</MenuItem>
                <MenuItem value="delete">Deletes</MenuItem>
              </Select>
            </FormControl>

            {/* Refresh Button */}
            <IconButton
              onClick={fetchChanges}
              disabled={loading}
              className="border border-gray-300"
            >
              <Refresh />
            </IconButton>
          </Box>
        </Paper>

        {/* Table */}
        <Paper elevation={0} className="overflow-hidden border border-gray-200">
          {loading && (
            <Box className="flex justify-center items-center h-64">
              <CircularProgress />
            </Box>
          )}

          {!loading && filteredChanges.length === 0 && (
            <Box className="p-8 text-center">
              <Typography className="text-gray-500">
                No account changes found
              </Typography>
            </Box>
          )}

          {!loading && filteredChanges.length > 0 && (
            <>
              <TableContainer>
                <Table>
                  <TableHead style={{ backgroundColor: "#f3f4f6" }}>
                    <TableRow>
                      <TableCell className="font-bold">User Email</TableCell>
                      <TableCell className="font-bold">Field Changed</TableCell>
                      <TableCell className="font-bold">Change Type</TableCell>
                      <TableCell className="font-bold">Timestamp</TableCell>
                      <TableCell className="font-bold" align="center">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedChanges.map((change) => (
                      <TableRow
                        key={change._id}
                        hover
                        className="border-b border-gray-200"
                      >
                        <TableCell className="text-sm text-gray-900">
                          {change.userEmail}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {change.fieldName}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={change.changeType}
                            size="small"
                            variant="outlined"
                            color={getChangeTypeColor(change.changeType) as any}
                          />
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {new Date(change.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDetails(change)}
                            title="View details"
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box className="flex justify-center py-4 border-t border-gray-200">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, value) => setCurrentPage(value)}
                    color="standard"
                  />
                </Box>
              )}
            </>
          )}
        </Paper>

        {/* Details Modal */}
        <Modal open={detailsOpen} onClose={handleCloseDetails}>
          <Box
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            {selectedChange && (
              <Box className="p-6">
                {/* Close button */}
                <Box className="flex justify-between items-center mb-4 border-b pb-4">
                  <Typography variant="h6" className="font-bold">
                    Change Details
                  </Typography>
                  <IconButton size="small" onClick={handleCloseDetails}>
                    <Close />
                  </IconButton>
                </Box>

                {/* Details */}
                <Box className="space-y-4">
                  <Box>
                    <Typography className="text-sm text-gray-500 font-semibold">
                      User Email
                    </Typography>
                    <Typography className="text-sm text-gray-900 mt-1 break-all">
                      {selectedChange.userEmail}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography className="text-sm text-gray-500 font-semibold">
                      Field Changed
                    </Typography>
                    <Typography className="text-sm text-gray-900 mt-1 capitalize">
                      {selectedChange.fieldName}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography className="text-sm text-gray-500 font-semibold">
                      Change Type
                    </Typography>
                    <Box className="mt-1">
                      <Chip
                        label={selectedChange.changeType}
                        size="small"
                        variant="outlined"
                        color={
                          getChangeTypeColor(selectedChange.changeType) as any
                        }
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Typography className="text-sm text-gray-500 font-semibold">
                      Old Value
                    </Typography>
                    <div className="mt-1 p-3 bg-red-50 rounded border border-red-200 max-h-32 overflow-y-auto">
                      <code className="text-xs text-red-900">
                        {typeof selectedChange.oldValue === "object"
                          ? JSON.stringify(selectedChange.oldValue, null, 2)
                          : String(selectedChange.oldValue) || "No value"}
                      </code>
                    </div>
                  </Box>

                  <Box>
                    <Typography className="text-sm text-gray-500 font-semibold">
                      New Value
                    </Typography>
                    <div className="mt-1 p-3 bg-green-50 rounded border border-green-200 max-h-32 overflow-y-auto">
                      <code className="text-xs text-green-900">
                        {typeof selectedChange.newValue === "object"
                          ? JSON.stringify(selectedChange.newValue, null, 2)
                          : String(selectedChange.newValue) || "No value"}
                      </code>
                    </div>
                  </Box>

                  <Box>
                    <Typography className="text-sm text-gray-500 font-semibold">
                      Timestamp
                    </Typography>
                    <Typography className="text-sm text-gray-900 mt-1">
                      {new Date(selectedChange.timestamp).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography className="text-sm text-gray-500 font-semibold">
                      IP Address
                    </Typography>
                    <Typography className="text-sm text-gray-900 mt-1 font-mono">
                      {selectedChange.ipAddress}
                    </Typography>
                  </Box>
                </Box>

                {/* Close Button */}
                <button
                  onClick={handleCloseDetails}
                  className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Close
                </button>
              </Box>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
}
