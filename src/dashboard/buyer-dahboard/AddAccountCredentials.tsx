// src/pages/AddAccountCredentials.tsx
import React, { useState } from "react";
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
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" align="left">
        Sell your account
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Add any account to sell to thousands of customers on our platform
      </Typography>

      {/* NOTE: Stepper moved to left column as a vertical progress indicator */}

      {/* WARNING BANNER */}
      <Alert
        severity="warning"
        sx={{
          mb: 4,
          py: 2,
          borderRadius: 2,
          bgcolor: "#fff9e2",
        }}
      >
        You are in <strong>DEFAULT PLAN</strong>, your account upload limit
        number for today is <strong>40</strong>. If you want to upload more
        account, upgrade your plan.
        <Button size="small" variant="outlined" sx={{ ml: 1 }}>
          Choose Your Plan Here
        </Button>
      </Alert>

      {/* MAIN WRAPPER – TWO COLUMN GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "350px 1fr" },
          gap: 4,
        }}
      >
        {/* LEFT COLUMN: Vertical progress + Account Card */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Stepper activeStep={2} orientation="vertical" sx={{ pr: 2 }}>
              {steps.map((label, idx) => (
                <Step key={label} completed={idx < 2}>
                  <StepLabel sx={{ alignItems: "start" }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        
          <Card
          sx={{
            p: 3,
            borderRadius: 3,
            height: "fit-content",
            border: "1px solid #eee",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Box sx={{ width: 60, height: 60, minWidth: 60 }}>
              {/* Use MyAds-style badge when we have a known platformKey */}
              {selectedAccount.platformKey === "instagram" && renderBadge(FaInstagram as IconType, 48)}
              {selectedAccount.platformKey === "snapchat" && renderBadge(FaSnapchatGhost as IconType, 48)}
              {selectedAccount.platformKey === "facebook" && renderBadge(FaFacebookF as IconType, 48)}
              {!["instagram", "snapchat", "facebook"].includes(selectedAccount.platformKey as string) && (
                <Avatar
                  sx={{
                    bgcolor: selectedAccount.color,
                    width: 60,
                    height: 60,
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <selectedAccount.Icon size={28} color="#fff" />
                </Avatar>
              )}
            </Box>

            <Box>
              <Typography fontWeight="bold">{selectedAccount.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedAccount.platform}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#33ac6f" }}
              >
                ${selectedAccount.price}
              </Typography>
              <Typography variant="caption" color="success.main">
                {selectedAccount.delivery}
              </Typography>
            </Box>
          </Stack>
        </Card>
        </Box>

        {/* RIGHT SIDE – FORM */}
        <Card sx={{ p: 4, borderRadius: 3 }} elevation={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            align="left"
            sx={{ mb: 3 }}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
            />

            {/* Additional Info Section Title */}
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="text.secondary"
              sx={{ mt: 1 }}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <VisibilityOff />
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
            />
          </Stack>

          {/* BUTTONS */}
          <Box
            sx={{
              mt: 5,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                borderColor: "#33ac6f",
                color: "#33ac6f",
                px: 4,
                borderRadius: 3,
              }}
            >
              Review
            </Button>

            <Button
              variant="contained"
              sx={{
                bgcolor: "#33ac6f",
                px: 5,
                borderRadius: 3,
                fontWeight: "bold",
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
          bottom: 30,
          right: 30,
          bgcolor: "#FF6A00",
          width: 65,
          height: 65,
          fontSize: "2rem",
          boxShadow: 4,
        }}
      >
        +
      </Avatar>
    </Container>
  );
};

export default AddAccountCredentials;
