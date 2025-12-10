import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip } from '@mui/material';

interface Seller {
  id: number;
  name: string;
  email: string;
  role: string;
  joined: string;
  accountsSold: number;
  status: string;
  lastActivity: string;
  totalEarnings: number;
}

const demoSellers: Seller[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Premium Seller',
    joined: '2023-01-15',
    accountsSold: 45,
    status: 'Active',
    lastActivity: '2025-12-09',
    totalEarnings: 2500,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Standard Seller',
    joined: '2023-06-20',
    accountsSold: 28,
    status: 'Active',
    lastActivity: '2025-12-08',
    totalEarnings: 1500,
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'Admin Seller',
    joined: '2022-11-05',
    accountsSold: 62,
    status: 'Suspended',
    lastActivity: '2025-11-15',
    totalEarnings: 3200,
  },
  {
    id: 4,
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    role: 'New Seller',
    joined: '2024-03-10',
    accountsSold: 12,
    status: 'Active',
    lastActivity: '2025-12-10',
    totalEarnings: 800,
  },
  {
    id: 5,
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    role: 'Premium Seller',
    joined: '2023-09-25',
    accountsSold: 37,
    status: 'Inactive',
    lastActivity: '2025-10-20',
    totalEarnings: 2100,
  },
];

const SellerAccount: React.FC = () => {
  return (
    <Box className="p-6  min-h-screen" sx={{ width: '100%' }}>
      <Typography variant="h4" className="mb-6 font-bold text-gray-800">
        Sellers Dashboard
      </Typography>
      <TableContainer component={Paper} className="shadow-lg rounded-lg overflow-hidden">
        <Table>
          <TableHead className="bg-green-500 text-white">
            <TableRow>
              <TableCell className="text-white font-semibold">ID</TableCell>
              <TableCell className="text-white font-semibold">Name</TableCell>
              <TableCell className="text-white font-semibold">Email</TableCell>
              <TableCell className="text-white font-semibold">Role</TableCell>
              <TableCell className="text-white font-semibold">Accounts Sold</TableCell>
              <TableCell className="text-white font-semibold">Status</TableCell>
              <TableCell className="text-white font-semibold">Total Earnings ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {demoSellers.map((seller) => (
              <TableRow key={seller.id} className="hover:bg-gray-50 transition-colors">
                <TableCell>{seller.id}</TableCell>
                <TableCell>{seller.name}</TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>{seller.role}</TableCell>
                <TableCell>{seller.accountsSold}</TableCell>
                <TableCell>
                  <Chip
                    label={seller.status}
                    color={
                      seller.status === 'Active'
                        ? 'success'
                        : seller.status === 'Suspended'
                        ? 'error'
                        : 'default'
                    }
                    variant="filled"
                    className="text-sm"
                  />
                </TableCell>
                <TableCell>{seller.totalEarnings}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SellerAccount;