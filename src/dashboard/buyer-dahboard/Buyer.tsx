import {
  AccountBalanceWallet,
  Add,
  ArrowDownward,
  ArrowUpward,
  History,
  Remove,
  TrendingUp
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography
} from "@mui/material";

import React from "react";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw";
  amount: string;
  status: "pending" | "completed" | "failed";
  date: string;
  method: string;
}

const COLORS = {
  blue: "#0A1A3A",
  gold: "#D4A643",
  white: "#FFFFFF",
  black: "#111111",
};

const Buyer: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState(0);

  const walletBalance = {
    current: 2456.75,
    previous: 2300.0,
    change: "+156.75 (+6.8%)",
  };

  const recentTransactions: Transaction[] = [
    {
      id: "#TXN001",
      type: "deposit",
      amount: "+ $250.00",
      status: "completed",
      date: "2024-11-28 10:30 AM",
      method: "Stripe Card",
    },
    {
      id: "#TXN002",
      type: "withdraw",
      amount: "- $100.00",
      status: "completed",
      date: "2024-11-27 03:15 PM",
      method: "PayPal",
    },
    {
      id: "#TXN003",
      type: "deposit",
      amount: "+ $500.00",
      status: "pending",
      date: "2024-11-27 11:45 AM",
      method: "Bank Transfer",
    },
    {
      id: "#TXN004",
      type: "deposit",
      amount: "+ $75.00",
      status: "completed",
      date: "2024-11-26 02:20 PM",
      method: "Stripe Card",
    },
    {
      id: "#TXN005",
      type: "withdraw",
      amount: "- $200.00",
      status: "failed",
      date: "2024-11-25 09:10 AM",
      method: "Bank Transfer",
    },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: COLORS.blue,
          text: COLORS.white,
        };
      case "pending":
        return {
          bg: COLORS.gold,
          text: COLORS.black,
        };
      case "failed":
        return {
          bg: COLORS.black,
          text: COLORS.white,
        };
      default:
        return {
          bg: COLORS.black,
          text: COLORS.white,
        };
    }
  };

  return (
    <Box sx={{ backgroundColor: COLORS.white, minHeight: "100vh", p: 4 }}>
      <Box className="max-w-7xl mx-auto">
        {/* HEADER */}
        <Box mb={8}>
          <Typography variant="h3" fontWeight="bold" color={COLORS.blue}>
            Buyer Dashboard
          </Typography>
          <Typography variant="h6" color={COLORS.black}>
            Manage your wallet and track transactions
          </Typography>
        </Box>

        {/* MAIN GRID */}
        <Box className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* WALLET CARD */}
          <Paper
            elevation={2}
            className="lg:col-span-2 p-8 rounded-2xl"
            sx={{
              backgroundColor: COLORS.blue,
              color: COLORS.white,
            }}
          >
            <Box className="flex items-center justify-between mb-6">
              <Box className="flex items-center gap-3">
                <Avatar
                  sx={{
                    bgcolor: COLORS.white,
                    color: COLORS.blue,
                    width: 56,
                    height: 56,
                  }}
                >
                  <AccountBalanceWallet />
                </Avatar>

                <Box>
                  <Typography variant="h6" fontWeight="600">
                    Wallet Balance
                  </Typography>
                  <Typography variant="body2">Available funds</Typography>
                </Box>
              </Box>

              <Chip
                label="Verified"
                sx={{
                  backgroundColor: COLORS.gold,
                  color: COLORS.black,
                }}
                size="small"
              />
            </Box>

            {/* BALANCE */}
            <Box mt={4}>
              <Typography variant="h2" fontWeight="bold">
                ${walletBalance.current.toLocaleString()}
              </Typography>

              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography>
                  Previous balance: ${walletBalance.previous.toLocaleString()}
                </Typography>
                <Chip
                  label={walletBalance.change}
                  sx={{
                    backgroundColor: COLORS.gold,
                    color: COLORS.black,
                  }}
                />
              </Box>

              <LinearProgress
                value={68}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: COLORS.white,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: COLORS.gold,
                  },
                }}
              />

              <Typography variant="caption" mt={1} display="block">
                Wallet usage: 68% of monthly limit
              </Typography>
            </Box>

            {/* ACTION BUTTONS */}
            <Box
              className="grid grid-cols-2 gap-4 mt-8 pt-6"
              borderTop={`1px solid ${COLORS.white}`}
            >
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                sx={{
                  backgroundColor: COLORS.gold,
                  color: COLORS.black,
                  ":hover": { backgroundColor: "#c59a3d" },
                }}
              >
                Deposit
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Remove />}
                sx={{
                  color: COLORS.white,
                  borderColor: COLORS.white,
                  ":hover": {
                    borderColor: COLORS.gold,
                    color: COLORS.gold,
                  },
                }}
              >
                Withdraw
              </Button>
            </Box>
          </Paper>

          {/* STATS CARDS */}
          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
            {/* DEPOSITS CARD */}
            <Paper
              elevation={1}
              className="p-6 rounded-2xl"
              sx={{
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.gold}`,
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography fontWeight="600" color={COLORS.black}>
                    Total Deposits
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={COLORS.blue}
                  >
                    $8,450.00
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: COLORS.gold }}>
                  <ArrowDownward sx={{ color: COLORS.black }} />
                </Avatar>
              </Box>
            </Paper>

            {/* WITHDRAW CARD */}
            <Paper
              elevation={1}
              className="p-6 rounded-2xl"
              sx={{
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.black}`,
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography fontWeight="600" color={COLORS.black}>
                    Total Withdrawals
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={COLORS.black}
                  >
                    $3,250.00
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: COLORS.black }}>
                  <ArrowUpward sx={{ color: COLORS.white }} />
                </Avatar>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* TRANSACTIONS TABLE */}
        <Paper
          elevation={2}
          className="rounded-2xl overflow-hidden border"
          sx={{ borderColor: COLORS.black }}
        >
          <Box
            className="px-6 py-4"
            sx={{
              backgroundColor: COLORS.white,
              borderBottom: `1px solid ${COLORS.black}`,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: COLORS.gold, color: COLORS.black }}>
                  <History />
                </Avatar>

                <Box>
                  <Typography variant="h6" fontWeight="600" color={COLORS.black}>
                    Recent Transactions
                  </Typography>
                  <Typography color={COLORS.black}>
                    Track your deposit and withdrawal history
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                sx={{
                  borderColor: COLORS.black,
                  color: COLORS.black,
                }}
              >
                View All
              </Button>
            </Box>
          </Box>

          <Box px={6} pb={6}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="Deposits" />
              <Tab label="Withdrawals" />
              <Tab label="All Transactions" />
            </Tabs>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: COLORS.white }}>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {recentTransactions.map((txn) => {
                    const style = getStatusChip(txn.status);

                    return (
                      <TableRow key={txn.id}>
                        <TableCell>{txn.id}</TableCell>

                        <TableCell
                          sx={{
                            color:
                              txn.type === "deposit"
                                ? COLORS.blue
                                : COLORS.black,
                            fontWeight: "bold",
                          }}
                        >
                          {txn.amount}
                        </TableCell>

                        <TableCell>{txn.method}</TableCell>

                        <TableCell>
                          <Chip
                            label={txn.status}
                            sx={{
                              backgroundColor: style.bg,
                              color: style.text,
                              textTransform: "capitalize",
                            }}
                          />
                        </TableCell>

                        <TableCell>{txn.date}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>

        {/* ACTIVITY ALERT */}
        <Paper
          elevation={1}
          className="p-6 rounded-2xl mt-8"
          sx={{
            backgroundColor: COLORS.white,
            border: `1px solid ${COLORS.gold}`,
          }}
        >
          <Box display="flex" gap={3}>
            <TrendingUp sx={{ color: COLORS.blue }} />

            <Box flex={1}>
              <Typography fontWeight="600" color={COLORS.black}>
                Your wallet is growing! 🚀
              </Typography>
              <Typography color={COLORS.black}>
                You've made 5 successful transactions this week. Keep it up!
              </Typography>
            </Box>

            <Button
              variant="outlined"
              sx={{
                borderColor: COLORS.black,
                color: COLORS.black,
              }}
            >
              View Analytics
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Buyer;
