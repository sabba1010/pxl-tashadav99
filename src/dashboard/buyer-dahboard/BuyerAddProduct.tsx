// BuyerAddProduct.tsx

import { PhotoCamera } from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import React from "react";

const BuyerAddProduct: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Header */}
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#0A1A3A" }}
      >
        Create New Service
      </Typography>

      <Typography
        variant="body1"
        align="center"
        paragraph
        sx={{ color: "#111111" }}
      >
        Fill in the details below to publish your service
      </Typography>

      <Card
        elevation={4}
        sx={{
          borderRadius: 3,
          border: "1px solid #0A1A3A",
          backgroundColor: "#FFFFFF",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={4}>
            {/* Image Upload */}
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                gutterBottom
                sx={{ color: "#0A1A3A" }}
              >
                Service Image{" "}
                <Chip
                  label="Required"
                  size="small"
                  sx={{
                    backgroundColor: "#33ac6f",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                />
              </Typography>

              <Box
                sx={{
                  border: "2px dashed #0A1A3A",
                  borderRadius: 2,
                  p: 6,
                  textAlign: "center",
                  bgcolor: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <input
                  accept="image/*"
                  id="image-upload"
                  type="file"
                  style={{ display: "none" }}
                />
                <label htmlFor="image-upload">
                  <IconButton component="span" size="large" sx={{ color: "#0A1A3A" }}>
                    <PhotoCamera fontSize="large" />
                  </IconButton>
                </label>

                <Typography sx={{ color: "#111111" }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="body2" sx={{ color: "#111111" }}>
                  PNG, JPG • Max 5MB
                </Typography>
              </Box>
            </Box>

            {/* Title */}
            <TextField
              label="Service Title"
              fullWidth
              required
              placeholder="e.g. I will design a professional logo in 24 hours"
              InputLabelProps={{ sx: { color: "#0A1A3A" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#0A1A3A" },
                  "&:hover fieldset": { borderColor: "#D4A643" },
                },
              }}
            />

            {/* Price */}
            <TextField
              label="Price"
              type="number"
              fullWidth
              required
              placeholder="49.99"
              InputLabelProps={{ sx: { color: "#0A1A3A" } }}
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 1, color: "#0A1A3A" }}>$</Typography>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#0A1A3A" },
                  "&:hover fieldset": { borderColor: "#D4A643" },
                },
              }}
            />

            {/* Description */}
            <TextField
              label="Short Description"
              multiline
              rows={5}
              fullWidth
              required
              placeholder="Explain what you will deliver..."
              InputLabelProps={{ sx: { color: "#0A1A3A" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#0A1A3A" },
                  "&:hover fieldset": { borderColor: "#D4A643" },
                },
              }}
            />

            {/* Delivery Time */}
            <FormControl fullWidth required>
              <InputLabel sx={{ color: "#0A1A3A" }}>Delivery Time</InputLabel>
              <Select
                defaultValue=""
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0A1A3A",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D4A643",
                  },
                }}
              >
                <MenuItem value="1">1 Day (Express)</MenuItem>
                <MenuItem value="3">3 Days (Fast)</MenuItem>
                <MenuItem value="7">7 Days (Standard)</MenuItem>
                <MenuItem value="14">14+ Days (Custom)</MenuItem>
              </Select>
            </FormControl>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "#0A1A3A",
                  color: "#0A1A3A",
                  "&:hover": {
                    borderColor: "#D4A643",
                    color: "#D4A643",
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#33ac6f",
                  color: "#ffffff",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#0A1A3A",
                    color: "#FFFFFF",
                  },
                }}
              >
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
