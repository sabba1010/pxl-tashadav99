// src/pages/AddAccountCredentials.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Avatar,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Globe } from "lucide-react";
import { FaInstagram, FaSnapchatGhost, FaFacebookF } from "react-icons/fa";
import type { IconType } from "react-icons";

const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaInstagram, "#E1306C"],
  [FaSnapchatGhost, "#FFFC00"],
  [FaFacebookF, "#1877F2"],
]);

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
  "linear-gradient(135deg,#FCCF31 0%,#F55555 100%)",
  "linear-gradient(135deg,#9BE15D 0%,#00E3AE 100%)",
];

const gradientFromHex = (hex?: string | null): string => {
  if (!hex) return vibrantGradients[0];
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.28);
  const r2 = mix(r);
  const g2 = mix(g);
  const b2 = mix(b);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `linear-gradient(135deg, ${hex} 0%, #${toHex(r2)}${toHex(g2)}${toHex(b2)} 100%)`;
};

const renderBadge = (IconComponent: IconType, size = 36): React.ReactElement => {
  const badgeSize = Math.max(36, size + 8);
  const brandHex = ICON_COLOR_MAP.get(IconComponent) ?? null;
  const fallback = vibrantGradients[String(IconComponent).length % vibrantGradients.length];
  const bg = brandHex ? gradientFromHex(brandHex) : fallback;
  const C = IconComponent as unknown as React.ComponentType<any>;

  return (
    <div
      aria-hidden
      style={{
        width: badgeSize,
        height: badgeSize,
        minWidth: badgeSize,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 10px 28px rgba(16,24,40,0.12)",
      }}
    >
      {React.createElement(C, {
        size: Math.round(size * 0.75),
        style: { color: "#fff", fill: "#fff" },
      })}
    </div>
  );
};

const steps = ["Make Payment", "Add account", "Credentials", "Review"];

const AddAccountCredentials: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    previewLink: "",
    attachedEmail: "",
    attachedPassword: "",
    additionalInfo: "",
  });

  const selectedAccount = {
    platform: "Alibaba",
    platformKey: "instagram",
    name: "Premium Alibaba Account",
    price: 120,
    delivery: "Delivery In Minutes",
    Icon: Globe,
    color: "#33ac6f",
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4, md: 5 } }}>
      {/* HEADER */}
      <Typography
        variant="h4"
        fontWeight="bold"
        align="left"
        sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.125rem" }, mb: 1 }}
      >
        Sell your account
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 4, fontSize: { xs: "0.85rem", md: "0.95rem" } }}
      >
        Add any account to sell to thousands of customers on our platform
      </Typography>

      {/* STEPPER */}
      <Box sx={{ display: { xs: "none", md: "block" }, mb: 4 }}>
        <Stepper activeStep={2} sx={{ maxWidth: 500 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* WARNING BANNER */}
      <Alert
        severity="warning"
        sx={{
          mb: 4,
          py: 2,
          borderRadius: 2,
          bgcolor: "#fff9e2",
          fontSize: { xs: "0.8rem", md: "1rem" },
        }}
      >
        You are in <strong>DEFAULT PLAN</strong>, your account upload limit
        number for today is <strong>40</strong>. If you want to upload more
        account, upgrade your plan.
        <Button size="small" variant="outlined" sx={{ ml: 1, fontSize: { xs: "0.7rem", md: "0.875rem" } }}>
          Choose Your Plan Here
        </Button>
      </Alert>

      {/* MAIN WRAPPER – TWO COLUMN GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "350px 1fr" },
          gap: { xs: 2, md: 4 },
        }}
      >
        {/* LEFT ACCOUNT CARD */}
        <Card
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: { xs: 2, md: 3 },
            height: "fit-content",
            border: "1px solid #eee",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, md: 3 }} alignItems={{ xs: "flex-start", sm: "center" }}>
            <Box sx={{ width: { xs: 50, md: 60 }, height: { xs: 50, md: 60 }, minWidth: { xs: 50, md: 60 } }}>
              {/* Use MyAds-style badge when we have a known platformKey */}
              {selectedAccount.platformKey === "instagram" && renderBadge(FaInstagram as IconType, 40)}
              {selectedAccount.platformKey === "snapchat" && renderBadge(FaSnapchatGhost as IconType, 40)}
              {selectedAccount.platformKey === "facebook" && renderBadge(FaFacebookF as IconType, 40)}
              {!["instagram", "snapchat", "facebook"].includes(selectedAccount.platformKey as string) && (
                <Avatar
                  sx={{
                    bgcolor: selectedAccount.color,
                    width: { xs: 50, md: 60 },
                    height: { xs: 50, md: 60 },
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <selectedAccount.Icon size={24} color="#fff" />
                </Avatar>
              )}
            </Box>

            <Box>
              <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                {selectedAccount.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                {selectedAccount.platform}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#33ac6f", fontSize: { xs: "1.1rem", md: "1.5rem" } }}
              >
                ${selectedAccount.price}
              </Typography>
              <Typography variant="caption" color="success.main" sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
                {selectedAccount.delivery}
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* RIGHT SIDE – FORM */}
        <Card sx={{ p: { xs: 3, sm: 4 }, borderRadius: { xs: 2, md: 3 } }} elevation={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            align="left"
            sx={{ mb: 3, fontSize: { xs: "1rem", md: "1.25rem" } }}
          >
            Account Credentials
          </Typography>

          <Stack spacing={3}>
            {/* Username */}
            <TextField
              fullWidth
              label="Username"
              placeholder="tajudeentoyebo95@gmail.com"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              inputProps={{ style: { fontSize: "0.9rem" } }}
            />

            {/* Password */}
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Account Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              inputProps={{ style: { fontSize: "0.9rem" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Preview Link */}
            <TextField
              fullWidth
              label="Preview link of account (optional)"
              value={formData.previewLink}
              onChange={(e) =>
                setFormData({ ...formData, previewLink: e.target.value })
              }
              inputProps={{ style: { fontSize: "0.9rem" } }}
            />

            {/* Additional Info Section Title */}
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="text.secondary"
              sx={{ mt: 1, fontSize: { xs: "0.8rem", md: "0.875rem" } }}
            >
              Additional Information (optional)
            </Typography>

            {/* Attached Email */}
            <TextField
              fullWidth
              label="Email attached to account"
              value={formData.attachedEmail}
              onChange={(e) =>
                setFormData({ ...formData, attachedEmail: e.target.value })
              }
              inputProps={{ style: { fontSize: "0.9rem" } }}
            />

            {/* Attached Password */}
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={formData.attachedPassword}
              onChange={(e) =>
                setFormData({ ...formData, attachedPassword: e.target.value })
              }
              inputProps={{ style: { fontSize: "0.9rem" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <VisibilityOff fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Additional textarea */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional information"
              value={formData.additionalInfo}
              onChange={(e) =>
                setFormData({ ...formData, additionalInfo: e.target.value })
              }
              inputProps={{ style: { fontSize: "0.9rem" } }}
            />
          </Stack>

          {/* BUTTONS */}
          <Box
            sx={{
              mt: 5,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate('/review')}
              sx={{
                borderColor: "#33ac6f",
                color: "#33ac6f",
                px: { xs: 2, md: 4 },
                borderRadius: 3,
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Review
            </Button>

            <Button
              variant="contained"
              sx={{
                bgcolor: "#33ac6f",
                px: { xs: 2, md: 5 },
                borderRadius: 3,
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", md: "1rem" },
                "&:hover": { bgcolor: "#2e7d32" },
              }}
            >
              Add account
            </Button>
          </Box>
        </Card>
      </Box>

      {/* FLOATING + BUTTON */}
      <Avatar
        sx={{
          position: "fixed",
          bottom: { xs: 20, md: 30 },
          right: { xs: 20, md: 30 },
          bgcolor: "#33ac6f",
          width: { xs: 50, md: 65 },
          height: { xs: 50, md: 65 },
          fontSize: { xs: "1.5rem", md: "2rem" },
          boxShadow: 4,
        }}
      >
        +
      </Avatar>
    </Container>
  );
};

export default AddAccountCredentials;
