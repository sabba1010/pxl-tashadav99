// BuyerAddProduct.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
  Select,
  Chip,
  Avatar,
} from "@mui/material";

// Brand-colored icons using MUI Avatar + exact brand colors
const categories = [
  { value: "facebook", label: "Facebook", color: "#1877F2", letter: "F" },
  { value: "instagram", label: "Instagram", color: "#E4405F", letter: "IG" },
  { value: "gmail", label: "Gmail", color: "#EA4335", letter: "G" },
  { value: "amazon", label: "Amazon", color: "#FF9900", letter: "A" },
  { value: "discord", label: "Discord", color: "#5865F2", letter: "D" },
  { value: "twitter", label: "Twitter / X", color: "#000000", letter: "X" },
  { value: "tiktok", label: "TikTok", color: "#000000", letter: "TT" },
  { value: "aliexpress", label: "AliExpress", color: "#F57200", letter: "AE" },
  { value: "alibaba", label: "Alibaba", color: "#FF6A00", letter: "AB" },
  { value: "911proxy", label: "911 Proxy", color: "#6366F1", letter: "9" },
  { value: "airchat", label: "Airchat", color: "#10B981", letter: "A" },
];

const BuyerAddProduct: React.FC = () => {
  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [releaseOption, setReleaseOption] = useState<"auto" | "manual">("auto");

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 800,
            borderRadius: 4,
            boxShadow: 4,
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
              Add Account
            </Typography>

            {/* Account Information */}
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 5 }}>
              Account Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You can only select one account at a time
            </Typography>

            {/* Colored Icon Dropdown */}
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel>Select Account Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as string)}
                input={<OutlinedInput label="Select Account Category" />}
                renderValue={(selected) => {
                  const item = categories.find((c) => c.value === selected);
                  if (!item) return "Select Account Category";
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: item.color,
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.letter}
                      </Avatar>
                      <Typography fontWeight="medium">{item.label}</Typography>
                    </Box>
                  );
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: cat.color,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {cat.letter}
                      </Avatar>
                      <Typography>{cat.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Name */}
            <TextField
              fullWidth
              label="Name"
              placeholder="e.g., 4 Years Facebook Account"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* Price */}
            <TextField
              fullWidth
              label="Enter your price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: "text.secondary" }}>$</Typography>,
              }}
              sx={{ mb: 5 }}
            />

            {/* Release Options */}
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Release Options
            </Typography>

            <RadioGroup value={releaseOption} onChange={(e) => setReleaseOption(e.target.value as any)}>
              <Box
                sx={{
                  border: releaseOption === "auto" ? "2px solid #ff9800" : "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 2.5,
                  mb: 2,
                  bgcolor: releaseOption === "auto" ? "#fff8e1" : "transparent",
                }}
              >
                <FormControlLabel
                  value="auto"
                  control={<Radio color="primary" />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontWeight="medium">Auto Confirm Order</Typography>
                      <Chip label="Recommended" size="small" color="success" />
                    </Box>
                  }
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 1 }}>
                  Perfect for products that don’t need your attention. Logins are sent and the order is confirmed automatically — no action required.
                </Typography>
              </Box>

              <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 2.5 }}>
                <FormControlLabel
                  value="manual"
                  control={<Radio />}
                  label={<Typography fontWeight="medium">Manual Release</Typography>}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 1 }}>
                  Ideal for products that need your input – like those requiring a code or extra authentication before access. You’ll manually send login details and confirm orders after each sale.
                </Typography>
              </Box>
            </RadioGroup>

            {/* Continue Button */}
            <Box sx={{ mt: 7, textAlign: "center" }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  minWidth: 280,
                  py: 1.8,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  bgcolor: "#33ac6f",
                  "&:hover": { bgcolor: "#2e7d32" },
                }}
              >
                Continue
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default BuyerAddProduct;