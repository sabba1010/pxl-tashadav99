import {
    AccountBalanceWallet,
    Add,
    ArrowDownward,
    ArrowUpward,
    History,
    Remove,
    TrendingUp
} from '@mui/icons-material';
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
} from '@mui/material';
import React from 'react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  method: string;
}

const Buyer: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState(0);

  // Demo Data
  const walletBalance = {
    current: 2456.75,
    previous: 2300.00,
    change: '+156.75 (+6.8%)'
  };

  const recentTransactions: Transaction[] = [
    {
      id: '#TXN001',
      type: 'deposit',
      amount: '+ $250.00',
      status: 'completed',
      date: '2024-11-28 10:30 AM',
      method: 'Stripe Card'
    },
    {
      id: '#TXN002',
      type: 'withdraw',
      amount: '- $100.00',
      status: 'completed',
      date: '2024-11-27 03:15 PM',
      method: 'PayPal'
    },
    {
      id: '#TXN003',
      type: 'deposit',
      amount: '+ $500.00',
      status: 'pending',
      date: '2024-11-27 11:45 AM',
      method: 'Bank Transfer'
    },
    {
      id: '#TXN004',
      type: 'deposit',
      amount: '+ $75.00',
      status: 'completed',
      date: '2024-11-26 02:20 PM',
      method: 'Stripe Card'
    },
    {
      id: '#TXN005',
      type: 'withdraw',
      amount: '- $200.00',
      status: 'failed',
      date: '2024-11-25 09:10 AM',
      method: 'Bank Transfer'
    }
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    return type === 'deposit' ? (
      <ArrowDownward className="text-green-500" />
    ) : (
      <ArrowUpward className="text-red-500" />
    );
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <Box className="max-w-7xl mx-auto">
        
        {/* Header */}
        <Box className="mb-8">
          <Typography 
            variant="h3" 
            className="text-gray-900 font-bold mb-2"
          >
            Buyer Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            className="text-gray-600 font-medium"
          >
            Manage your wallet and track transactions
          </Typography>
        </Box>

        <Box className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Wallet Card */}
          <Paper elevation={3} className="lg:col-span-2 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-xl">
            <Box className="flex items-center justify-between mb-6">
              <Box className="flex items-center gap-3">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <AccountBalanceWallet />
                </Avatar>
                <Box>
                  <Typography variant="h6" className="font-semibold opacity-90">
                    Wallet Balance
                  </Typography>
                  <Typography variant="body2" className="opacity-75">
                    Available funds
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label="Verified" 
                className="bg-white/20 backdrop-blur-sm border border-white/30" 
                size="small"
              />
            </Box>

            <Box className="space-y-4">
              <Typography variant="h2" className="font-bold text-4xl">
                ${walletBalance.current.toLocaleString()}
              </Typography>
              <Box className="flex items-center justify-between">
                <Typography variant="body2" className="opacity-75">
                  Previous balance: ${walletBalance.previous.toLocaleString()}
                </Typography>
                <Chip 
                  label={walletBalance.change} 
                  className="bg-green-500/20 text-green-300 border border-green-500/30 font-mono" 
                  size="small"
                />
              </Box>
              
              <LinearProgress 
                value={68} 
                className="h-2 bg-white/20 rounded-full mt-4"
                sx={{
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #10B981, #34D399)'
                  }
                }}
              />
              <Typography variant="caption" className="opacity-75 block mt-1">
                Wallet usage: 68% of monthly limit
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/20">
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add className="text-white" />}
                className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Deposit
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Remove className="text-white" />}
                className="bg-transparent/50 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Withdraw
              </Button>
            </Box>
          </Paper>

          {/* Quick Stats Cards */}
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:col-span-2">
            <Paper elevation={3} className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-200/30">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h6" className="text-emerald-800 font-semibold mb-1">
                    Total Deposits
                  </Typography>
                  <Typography variant="h4" className="font-bold text-emerald-700">
                    $8,450.00
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)' }}>
                  <ArrowDownward className="text-emerald-600" />
                </Avatar>
              </Box>
            </Paper>

            <Paper elevation={3} className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-200/30">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h6" className="text-red-800 font-semibold mb-1">
                    Total Withdrawals
                  </Typography>
                  <Typography variant="h4" className="font-bold text-red-700">
                    $3,250.00
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)' }}>
                  <ArrowUpward className="text-red-600" />
                </Avatar>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Transactions Tabs */}
        <Paper elevation={3} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <Box className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <Box className="flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)' }}>
                  <History className="text-blue-600" />
                </Avatar>
                <Box>
                  <Typography variant="h6" className="font-semibold text-gray-800">
                    Recent Transactions
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Track your deposit and withdrawal history
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                className="border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-xl"
              >
                View All
              </Button>
            </Box>
          </Box>

          <Box className="px-6 pb-6">
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange}
              className="mb-6 -mx-6 px-6 border-b border-gray-200 bg-white"
            >
              <Tab 
                label={
                  <Box className="flex items-center gap-2">
                    <ArrowDownward className="text-green-600" />
                    Deposits
                    <Chip label="12" size="small" className="ml-2 bg-green-100 text-green-800" />
                  </Box>
                } 
                className="font-medium min-h-0 py-3 px-4"
              />
              <Tab 
                label={
                  <Box className="flex items-center gap-2">
                    <ArrowUpward className="text-red-600" />
                    Withdrawals
                    <Chip label="8" size="small" className="ml-2 bg-red-100 text-red-800" />
                  </Box>
                }
                className="font-medium min-h-0 py-3 px-4"
              />
              <Tab 
                label={
                  <Box className="flex items-center gap-2">
                    <History className="text-blue-600" />
                    All Transactions
                    <Chip label="20" size="small" className="ml-2 bg-blue-100 text-blue-800" />
                  </Box>
                }
                className="font-medium min-h-0 py-3 px-4"
              />
            </Tabs>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-semibold text-gray-700 py-4">Transaction ID</TableCell>
                    <TableCell className="font-semibold text-gray-700 py-4">Amount</TableCell>
                    <TableCell className="font-semibold text-gray-700 py-4">Method</TableCell>
                    <TableCell className="font-semibold text-gray-700 py-4">Status</TableCell>
                    <TableCell className="font-semibold text-gray-700 py-4">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell className="font-mono text-sm text-gray-900 py-4">
                        {transaction.id}
                      </TableCell>
                      <TableCell className="font-bold text-lg py-4">
                        <span className={transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 py-4">
                        {transaction.method}
                      </TableCell>
                      <TableCell className="py-4">
                        <Chip
                          label={transaction.status.toUpperCase()}
                          className={`font-medium border capitalize ${getStatusColor(transaction.status)}`}
                          size="small"
                        />
                      </TableCell>
                      <TableCell className="text-gray-600 py-4">
                        {transaction.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Empty State for specific tabs */}
            {currentTab === 0 && recentTransactions.filter(t => t.type === 'deposit').length === 0 && (
              <Box className="text-center py-12">
                <ArrowDownward className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <Typography variant="h6" className="text-gray-500 mb-2">
                  No deposits yet
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  Make First Deposit
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Recent Activity Alert */}
        <Paper elevation={3} className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50">
          <Box className="flex items-start gap-4">
            <TrendingUp className="text-emerald-600 mt-0.5" />
            <Box className="flex-1">
              <Typography variant="h6" className="font-semibold text-gray-900 mb-1">
                Your wallet is growing! 🚀
              </Typography>
              <Typography className="text-gray-600">
                You've made 5 successful transactions this week. Keep it up!
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
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