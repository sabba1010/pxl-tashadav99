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
  SelectChangeEvent,
  Checkbox,
  ListItemText,
} from "@mui/material";
import React, { useState, ChangeEvent } from "react";

const SOCIAL_OPTIONS = ["Facebook", "Instagram", "Twitter", "LinkedIn"];

const BuyerAddProduct: React.FC = () => {
  // form state
  const [imageSource, setImageSource] = useState<string>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [socialPlatforms, setSocialPlatforms] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");

  // handlers
  const handleImageSourceChange = (e: SelectChangeEvent<string>) => {
    const val = e.target.value;
    setImageSource(val);
    // reset dependent fields
    setSelectedFile(null);
    setPreviewUrl(null);
    setSocialPlatforms([]);
    setImageUrl("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // optional: validate size/type here
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSocialPlatformsChange = (e: SelectChangeEvent<typeof socialPlatforms>) => {
    const value = e.target.value;
    // when multiple, MUI gives string[] or single string depending
    const newVal = typeof value === "string" ? value.split(",") : value;
    setSocialPlatforms(newVal);
  };

  const handleSubmit = () => {
    // Build form data or payload
    const payload = {
      title,
      price,
      description,
      deliveryTime,
      image: {
        source: imageSource,
        fileName: selectedFile?.name ?? null,
        url: imageUrl || previewUrl || null,
        socialPlatforms: socialPlatforms.length ? socialPlatforms : null,
      },
    };

    // For now just log. Replace with API call.
    console.log("Submitting", payload);

    // TODO: perform validation & actual upload (file -> FormData) or send payload to backend
  };

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

      <Typography variant="body1" align="center" paragraph sx={{ color: "#111111" }}>
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
            {/* Image Source Select */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#0A1A3A" }}>Image Source</InputLabel>
              <Select
                value={imageSource}
                label="Image Source"
                onChange={handleImageSourceChange}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0A1A3A",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D4A643",
                  },
                }}
              >
                <MenuItem value="upload">Upload</MenuItem>
                <MenuItem value="social">Social Media</MenuItem>
                <MenuItem value="url">Image URL</MenuItem>
              </Select>
            </FormControl>

            {/* Image Upload / Social Media / URL */}
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
                    ml: 1,
                  }}
                />
              </Typography>

              {/* Upload */}
              {imageSource === "upload" && (
                <Box
                  sx={{
                    border: "2px dashed #0A1A3A",
                    borderRadius: 2,
                    p: 4,
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
                    onChange={handleFileChange}
                  />
                  <label htmlFor="image-upload">
                    <IconButton component="span" size="large" sx={{ color: "#0A1A3A" }}>
                      <PhotoCamera fontSize="large" />
                    </IconButton>
                  </label>

                  <Typography sx={{ color: "#111111" }}>Click to upload or drag and drop</Typography>
                  <Typography variant="body2" sx={{ color: "#111111" }}>
                    PNG, JPG • Max 5MB
                  </Typography>

                  {selectedFile && (
                    <Typography variant="body2" sx={{ mt: 2, color: "#0A1A3A" }}>
                      Selected: {selectedFile.name}
                    </Typography>
                  )}

                  {previewUrl && (
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                      <img
                        src={previewUrl}
                        alt="preview"
                        style={{ maxWidth: "240px", maxHeight: "180px", borderRadius: 8 }}
                      />
                    </Box>
                  )}
                </Box>
              )}

              {/* Social Media selection */}
              {imageSource === "social" && (
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#0A1A3A" }}>Pick Social Platforms</InputLabel>
                  <Select
                    multiple
                    value={socialPlatforms}
                    onChange={handleSocialPlatformsChange}
                    renderValue={(selected) => (selected as string[]).join(", ")}
                    label="Pick Social Platforms"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#0A1A3A" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#D4A643" },
                    }}
                  >
                    {SOCIAL_OPTIONS.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={socialPlatforms.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>

                  <Typography variant="body2" sx={{ mt: 1, color: "#111111" }}>
                    We'll use images from the selected social accounts (you'll be asked to connect accounts on publish).
                  </Typography>
                </FormControl>
              )}

              {/* Image URL */}
              {imageSource === "url" && (
                <TextField
                  label="Image URL"
                  fullWidth
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  InputLabelProps={{ sx: { color: "#0A1A3A" } }}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#0A1A3A" },
                      "&:hover fieldset": { borderColor: "#D4A643" },
                    },
                  }}
                />
              )}
            </Box>

            {/* Title */}
            <TextField
              label="Service Title"
              fullWidth
              required
              placeholder="e.g. I will design a professional logo in 24 hours"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputLabelProps={{ sx: { color: "#0A1A3A" } }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: "#0A1A3A" }}>$</Typography>,
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value as string)}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0A1A3A",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D4A643",
                  },
                }}
              >
                {/* Instant / hours options as requested */}
                <MenuItem value="instant">Instant deliver</MenuItem>
                <MenuItem value="5hours">5 hours</MenuItem>

                {/* existing day-based options */}
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
                onClick={() => {
                  // reset form (optional)
                  setImageSource("upload");
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setSocialPlatforms([]);
                  setImageUrl("");
                  setTitle("");
                  setPrice("");
                  setDescription("");
                  setDeliveryTime("");
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
                onClick={handleSubmit}
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
