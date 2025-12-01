import React, { useState } from "react";
import Logo from "../../assets/Grupo 1.png";
import Cookies from "js-cookie";
import { toast } from "sonner";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory2 as InventoryIcon,
  Shuffle as ConsolidateIcon,
  LocalShipping as LocalShippingIcon,
  Flight as FlightIcon,
  LocalTaxi as LocalTaxiIcon,
  Payment as PaymentIcon,
  CurrencyExchange as RatesIcon,
  TrackChanges as TrackingIcon,
  BarChart as ReportsIcon,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Logout,
} from "@mui/icons-material";
import { useNavigate, useLocation, matchPath, NavLink } from "react-router-dom";

type Props = {
  adminName?: string;
  adminEmail?: string;
  avatarUrl?: string;
  defaultOpen?: boolean;
};

const drawerWidth = 260;
const collapsedWidth = 65;

/* menu items */
const adminMenuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard/admin" },
  { text: "Users", icon: <PeopleIcon />, path: "/dashboard/admin-users" },
  { text: "Packages", icon: <InventoryIcon />, path: "/dashboard/admin-packages" },
  {
    text: "Consolidations",
    icon: <ConsolidateIcon />,
    path: "/dashboard/admin-consolidations",
  },
  {
    text: "Shipments",
    icon: <LocalShippingIcon />,
    path: "/dashboard/admin-shipments",
  },
  { text: "Cuba Shipments", icon: <FlightIcon />, path: "/dashboard/admin-cuba" },
  {
    text: "Pickup Requests",
    icon: <LocalTaxiIcon />,
    path: "/dashboard/admin-pickup",
  },
  { text: "Payments", icon: <PaymentIcon />, path: "/dashboard/admin-payments" },
  { text: "Rates", icon: <RatesIcon />, path: "/dashboard/admin-rates" },
  { text: "Tracking", icon: <TrackingIcon />, path: "/dashboard/admin-tracking" },
  { text: "Reports", icon: <ReportsIcon />, path: "/dashboard/admin-reports" },
  { text: "Settings", icon: <SettingsIcon />, path: "/dashboard/admin-settings" },
];

export default function AdminSidebar({
  adminName = "Admin Name",
  adminEmail = "admin@expresur.com",
  avatarUrl,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => setOpen((prev) => !prev);

  const handleLogout = () => {
    Cookies.remove("currentUser");
    toast.success("Logged out successfully!", {
      duration: 1500,
    });
    navigate("/");
  };

  const normalize = (p: string) => (p ? p.replace(/\/+$/, "") : p);

  /* active color */
  const ACTIVE_COLOR = "#fa921d";

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #166534 0%, #166534 100%)",
          color: "#fff",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
          borderRight: "none",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 700,
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s",
            fontFamily: '"Poppins", sans-serif',
          }}
        >
          <NavLink to={"/"} style={{ display: "inline-block" }}>
            <img className="w-2/3" src={Logo} alt="" />
          </NavLink>
        </Typography>
        <IconButton onClick={handleToggle} sx={{ color: "#fff" }}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      <Divider sx={{ backgroundColor: "#475569" }} />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {adminMenuItems.map((item) => {
          const endMatch = item.path === "/dashboard/admin" ? false : true;
          const match = matchPath(
            { path: normalize(item.path), end: endMatch },
            normalize(location.pathname)
          );
          const isSelected = !!match;

          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={(props: any) => (
                  <NavLink {...props} to={item.path} end={endMatch} />
                )}
                selected={isSelected}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  transition: "all 0.2s",
                  color: isSelected ? ACTIVE_COLOR : "#fff",

                  // ACTIVE background uses a low-opacity tone of the active color
                  backgroundColor: isSelected
                    ? "rgba(250,146,29,0.10)"
                    : "transparent",

                  "&:hover": {
                    // subtle hover with active color tint
                    backgroundColor: isSelected
                      ? "rgba(250,146,29,0.12)"
                      : "rgba(250,146,29,0.06)",
                    transform: "translateX(4px)",
                  },

                  // ensure NavLink active class styling also shows
                  "&.active": {
                    backgroundColor: "rgba(250,146,29,0.10)",
                    color: ACTIVE_COLOR,
                  },

                  // ensure child text inherits color
                  "& .MuiListItemText-root": {
                    color: isSelected ? ACTIVE_COLOR : "#fff",
                  },

                  // fallback for small collapsed state
                  "& .MuiListItemIcon-root": {
                    color: isSelected ? ACTIVE_COLOR : "#fff",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: isSelected ? ACTIVE_COLOR : "#fff",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: "opacity 0.2s 0.1s",
                    // text color explicitly set to ensure contrast
                    "& .MuiTypography-root": {
                      color: isSelected ? ACTIVE_COLOR : "#fff",
                      fontWeight: isSelected ? 600 : 500,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Profile + Logout */}
      <Box sx={{ p: 2, borderTop: "1px solid #475569", mt: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src={avatarUrl}
            sx={{ bgcolor: "#4f46e5", width: 40, height: 40 }}
          >
            {!avatarUrl && adminName ? adminName.charAt(0).toUpperCase() : null}
          </Avatar>

          {open && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {adminName}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                {adminEmail}
              </Typography>
            </Box>
          )}
        </Box>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#fca5a5",
            display: "flex",
            alignItems: "center",
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: "#fca5a5",
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            <Logout />
          </ListItemIcon>

          <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}
