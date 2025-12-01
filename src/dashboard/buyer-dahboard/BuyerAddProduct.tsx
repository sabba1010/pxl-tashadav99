import React from 'react';
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Chip,
  Button,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload,
  AttachMoney,
  Schedule,
  Description,
  Delete,
  Image,
  CheckCircle,
  Category
} from '@mui/icons-material';

const BuyerAddProduct: React.FC = () => {
  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Box className="max-w-4xl mx-auto">
        {/* Header with Gradient */}
        <Box className="text-center mb-12">
          <Box className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg mb-6">
            <Category className="text-white" />
            <Typography 
              variant="h4" 
              className="text-white font-bold"
            >
              Create New Service
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            className="text-gray-600 font-medium max-w-3xl mx-auto"
          >
            Craft a compelling service listing that attracts buyers and showcases your expertise
          </Typography>
        </Box>

        <Paper 
          elevation={0} 
          className="p-8 lg:p-12 rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/20"
        >
          <Box className="space-y-10">
            
            {/* Progress Bar */}
            <Box className="flex items-center justify-between">
              <Typography className="text-sm font-medium text-gray-600">
                Form Progress
              </Typography>
              <Box className="w-48">
                <LinearProgress 
                  value={40} 
                  className="h-2 rounded-full bg-gray-200"
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 10,
                      background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Smart Image Upload */}
            <Box className="relative">
              <Box className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 border-2 border-dashed border-blue-200/60 hover:border-blue-400/80 transition-all duration-500 group">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <Box className="text-center relative z-10">
                  <Box className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6">
                    <CloudUpload className="text-white text-2xl" />
                  </Box>
                  
                  <Typography className="text-xl font-bold text-gray-800 mb-2">
                    Upload Service Image
                  </Typography>
                  <Typography className="text-blue-600 font-medium mb-6">
                    Click here or drag & drop
                  </Typography>
                  
                  <Box className="flex justify-center flex-wrap gap-2 mb-6">
                    <Chip 
                      label="PNG" 
                      size="small" 
                      className="bg-blue-100 text-blue-700 border-blue-200" 
                    />
                    <Chip 
                      label="JPG" 
                      size="small" 
                      className="bg-green-100 text-green-700 border-green-200" 
                    />
                    <Chip 
                      label="GIF" 
                      size="small" 
                      className="bg-purple-100 text-purple-700 border-purple-200" 
                    />
                  </Box>
                  
                  <Typography className="text-sm text-gray-500">
                    Recommended: 800x600px, Max 5MB
                  </Typography>
                </Box>

                {/* Animated Background Elements */}
                <Box className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
                <Box className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
              </Box>

              {/* Image Preview Section */}
              <Box className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200/50">
                <Box className="flex items-center justify-between mb-4">
                  <Typography className="font-semibold text-gray-800 flex items-center gap-2">
                    <Image className="text-emerald-600" />
                    Image Preview
                  </Typography>
                  <Chip 
                    label="Ready to Upload" 
                    color="success" 
                    variant="outlined"
                    className="font-medium"
                  />
                </Box>
                <Box className="relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center" 
                    alt="Service preview" 
                    className="w-full h-48 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500"
                  />
                  <IconButton className="absolute -top-3 -right-3 bg-white/90 hover:bg-white shadow-lg border-2 border-gray-200 rounded-full p-2 group-hover:scale-110 transition-all duration-300">
                    <Delete className="text-red-500" fontSize="small" />
                  </IconButton>
                  <Box className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    800 × 600 px
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Form Fields Grid */}
            <Box className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Title Field */}
              <Box className="space-y-4">
                <Box className="flex items-center justify-between">
                  <Typography className="font-semibold text-gray-800 flex items-center gap-2">
                    <Description className="text-blue-600" />
                    Service Title
                  </Typography>
                  <Chip label="Required" color="primary" size="small" />
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g. Professional Logo Design in 24 Hours"
                  variant="outlined"
                  className="bg-white/60 backdrop-blur-sm"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description className="text-gray-400" />
                      </InputAdornment>
                    ),
                    classes: {
                      notchedOutline: 'border-gray-200 rounded-2xl !important'
                    }
                  }}
                  inputProps={{
                    className: 'py-4 text-lg font-semibold'
                  }}
                />
                <Box className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Make it catchy and descriptive</span>
                  <span className="font-mono text-blue-600">0 / 80</span>
                </Box>
              </Box>

              {/* Price Field */}
              <Box className="space-y-4">
                <Box className="flex items-center justify-between">
                  <Typography className="font-semibold text-gray-800 flex items-center gap-2">
                    <AttachMoney className="text-emerald-600" />
                    Price
                  </Typography>
                  <Chip label="Required" color="success" size="small" />
                </Box>
                <TextField
                  fullWidth
                  placeholder="99.99"
                  type="number"
                  variant="outlined"
                  className="bg-gradient-to-r from-emerald-50 to-green-50/50"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney className="text-emerald-500" />
                        <span className="text-sm font-semibold text-gray-700 mr-2">USD</span>
                      </InputAdornment>
                    ),
                    classes: {
                      notchedOutline: 'border-emerald-200 rounded-2xl !important'
                    }
                  }}
                  inputProps={{
                    className: 'py-4 text-2xl font-bold text-gray-900'
                  }}
                />
                <Typography className="text-sm text-gray-600 flex items-center gap-1">
                  <CheckCircle className="text-emerald-500 text-xs" />
                  Set a competitive price to attract more buyers
                </Typography>
              </Box>
            </Box>

            {/* Description Field */}
            <Box className="space-y-4">
              <Box className="flex items-center justify-between">
                <Typography className="font-semibold text-gray-800 flex items-center gap-2">
                  <Description className="text-purple-600" />
                  Short Description
                </Typography>
                <Chip label="Required" color="secondary" size="small" />
              </Box>
              <TextField
                fullWidth
                placeholder="Tell buyers what makes your service unique... Include key features, deliverables, and what they can expect."
                variant="outlined"
                multiline
                rows={4}
                className="bg-white/60 backdrop-blur-sm"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description className="text-gray-400" />
                    </InputAdornment>
                  ),
                  classes: {
                    notchedOutline: 'border-gray-200 rounded-2xl !important'
                  }
                }}
                inputProps={{
                  className: 'py-4 text-base leading-relaxed'
                }}
              />
              <Box className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Highlight your expertise and value</span>
                <span className="font-mono text-purple-600">0 / 300</span>
              </Box>
            </Box>

            {/* Delivery Time */}
            <Box className="space-y-4">
              <Box className="flex items-center justify-between">
                <Typography className="font-semibold text-gray-800 flex items-center gap-2">
                  <Schedule className="text-orange-600" />
                  Delivery Time
                </Typography>
                <Chip label="Required" color="warning" size="small" />
              </Box>
              <FormControl fullWidth className="bg-white/60 backdrop-blur-sm rounded-2xl">
                <InputLabel className="text-gray-700">Select delivery time</InputLabel>
                <Select
                  label="Select delivery time"
                  defaultValue=""
                  className="min-h-[60px] py-3"
                  MenuProps={{
                    PaperProps: {
                      sx: { borderRadius: 2, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }
                    }
                  }}
                >
                  <MenuItem value="1" className="py-3">
                    <Box className="flex items-center gap-3">
                      <Box className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full" />
                      <span className="font-medium">🚀 Express - 1 Day</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="3" className="py-3">
                    <Box className="flex items-center gap-3">
                      <Box className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full" />
                      <span className="font-medium">⚡ Fast - 3 Days</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="7" className="py-3">
                    <Box className="flex items-center gap-3">
                      <Box className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                      <span className="font-medium">✅ Standard - 1 Week</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="14" className="py-3">
                    <Box className="flex items-center gap-3">
                      <Box className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" />
                      <span className="font-medium">⏰ Relaxed - 2 Weeks</span>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Smart Action Buttons */}
            <Box className="pt-10 border-t border-gray-100/50">
              <Box className="flex flex-col lg:flex-row gap-6 justify-center lg:justify-end">
                <Button
                  variant="outlined"
                  size="large"
                  className="flex-1 lg:w-auto px-8 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 min-h-[56px]"
                >
                  Discard Changes
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  className="flex-1 lg:w-auto px-10 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 min-h-[56px]"
                >
                  <CheckCircle className="mr-2 -ml-1" />
                  Publish Service
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Quick Tips */}
        <Paper elevation={0} className="mt-10 p-8 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50/80 border border-rose-200/50">
          <Typography className="font-semibold text-rose-800 mb-4 flex items-center gap-2">
            💡 Quick Tips for Success
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Box className="text-center p-4 rounded-xl bg-white/70">
              <Image className="mx-auto w-10 h-10 text-rose-500 mb-3" />
              <Typography className="font-medium text-gray-800 mb-1">High-Quality Images</Typography>
              <Typography className="text-sm text-gray-600">Use professional photos that showcase your work</Typography>
            </Box>
            <Box className="text-center p-4 rounded-xl bg-white/70">
              <AttachMoney className="mx-auto w-10 h-10 text-emerald-500 mb-3" />
              <Typography className="font-medium text-gray-800 mb-1">Competitive Pricing</Typography>
              <Typography className="text-sm text-gray-600">Research similar services and price accordingly</Typography>
            </Box>
            <Box className="text-center p-4 rounded-xl bg-white/70">
              <Schedule className="mx-auto w-10 h-10 text-blue-500 mb-3" />
              <Typography className="font-medium text-gray-800 mb-1">Fast Delivery</Typography>
              <Typography className="text-sm text-gray-600">Offer quick turnaround times to attract buyers</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BuyerAddProduct;