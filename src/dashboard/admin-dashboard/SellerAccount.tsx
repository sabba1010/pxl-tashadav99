import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";

// Interface matching your API response + UI specific fields
interface Seller {
  _id: string;
  name: string;
  email: string;
  role: string;
  accountCreationDate: string; // From API
  phone?: string;
  // Fields below are not in your API sample yet, added defaults for UI
  accountsSold?: number;
  status?: string;
  balance?: number;
}

const SellerAccount: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- Fetch and Filter Data ---
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://vps-backend-server-beta.vercel.app/api/user/getall");
        const data = await response.json();
      console.log(data)
        let allUsers: Seller[] = [];

        // Handle different API response structures (array vs object)
        if (Array.isArray(data)) {
          allUsers = data;
        } else if (data.users && Array.isArray(data.users)) {
          allUsers = data.users;
        }

        // FILTER: Only keep users where role is "seller" (case-insensitive)
        const onlySellers = allUsers.filter(
          (user) => user.role && user.role.toLowerCase() === "seller"
        );

        setSellers(onlySellers);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return (
    <Box className="p-6 min-h-screen" sx={{ width: "100%" }}>
      <Typography variant="h4" className="mb-6 font-bold text-gray-800">
        Sellers Dashboard ({sellers.length})
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={5}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          className="shadow-lg rounded-lg overflow-hidden"
        >
          <Table>
            <TableHead className="bg-[#D1A148] text-white">
              <TableRow>
                <TableCell className="text-white font-bold">ID</TableCell>
                <TableCell className="text-white font-bold">Name</TableCell>
                <TableCell className="text-white font-bold">Email</TableCell>
                <TableCell className="text-white font-bold">Role</TableCell>
                <TableCell className="text-white font-bold">
                  Joined Date
                </TableCell>
                <TableCell className="text-white font-bold">
                  Accounts Sold
                </TableCell>
                <TableCell className="text-white font-bold">Status</TableCell>
                <TableCell className="text-white font-bold text-right">
                  Total Earnings ($)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.length > 0 ? (
                sellers.map((seller) => (
                  <TableRow
                    key={seller._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-gray-500">
                      {seller._id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">{seller.name}</TableCell>
                    <TableCell>{seller.email}</TableCell>
                    <TableCell>
                      <span className="capitalize bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {seller.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(
                        seller.accountCreationDate
                      ).toLocaleDateString()}
                    </TableCell>
                    {/* Placeholder data since API doesn't provide these yet */}
                    <TableCell>{seller.accountsSold || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={seller.status || "Active"}
                        color={
                          seller.status === "Active" || !seller.status
                            ? "success"
                            : "error"
                        }
                        size="small"
                        variant="filled"
                        className="text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-right font-bold text-gray-700">
                      ${seller.balance || 0}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    className="py-8 text-gray-500"
                  >
                    No sellers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SellerAccount;
