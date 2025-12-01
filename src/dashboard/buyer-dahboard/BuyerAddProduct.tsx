// BuyerAddProduct.tsx বা AddService.tsx

import { PhotoCamera } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';

const BuyerAddProduct: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Create New Service
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" paragraph>
        Fill in the details below to publish your service
      </Typography>

      <Card elevation={4}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={4}>

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Service Image <Chip label="Required" color="primary" size="small" />
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 6,
                  textAlign: 'center',
                  bgcolor: '#f9f9f9',
                  cursor: 'pointer',
                }}
              >
                <input accept="image/*" id="image-upload" type="file" style={{ display: 'none' }} />
                <label htmlFor="image-upload">
                  <IconButton color="primary" component="span" size="large">
                    <PhotoCamera fontSize="large" />
                  </IconButton>
                </label>
                <Typography>Click to upload or drag and drop</Typography>
                <Typography variant="body2" color="text.secondary">
                  PNG, JPG • Max 5MB
                </Typography>
              </Box>
            </Box>

            {/* Title */}
            <TextField
              label="Service Title"
              placeholder="e.g. I will design a professional logo in 24 hours"
              fullWidth
              required
            />

            {/* Price */}
            <TextField
              label="Price"
              type="number"
              fullWidth
              required
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
              placeholder="49.99"
            />

            {/* Description */}
            <TextField
              label="Short Description"
              multiline
              rows={5}
              fullWidth
              required
              placeholder="Explain what you will deliver, how you work, and why buyers should choose you..."
            />

            {/* Delivery Time */}
            <FormControl fullWidth required>
              <InputLabel>Delivery Time</InputLabel>
              <Select defaultValue="">
                <MenuItem value="1">1 Day (Express)</MenuItem>
                <MenuItem value="3">3 Days (Fast)</MenuItem>
                <MenuItem value="7">7 Days (Standard)</MenuItem>
                <MenuItem value="14">14+ Days (Custom)</MenuItem>
              </Select>
            </FormControl>

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
              <Button variant="outlined" size="large">
                Cancel
              </Button>
              <Button variant="contained" size="large" color="primary">
                Publish Service
              </Button>
            </Box>

          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BuyerAddProduct;