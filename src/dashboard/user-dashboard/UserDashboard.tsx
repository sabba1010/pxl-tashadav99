// src/components/Sidebar.tsx
import Cookies from "js-cookie";
import { toast } from "sonner";

import React, { useState } from "react";
import Logo from "../../assets/Grupo 1.png";
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
  Lock,
  Merge,
  LocalShipping,
  AddBox,
  Flight,
  LocalTaxi,
  Payment,
  Person,
  ChevronLeft,
  ChevronRight,
  Logout,
} from "@mui/icons-material";
import { useNavigate, useLocation, matchPath, NavLink } from "react-router-dom";
import { Package2 } from "lucide-react";

const drawerWidth = 260;
const collapsedWidth = 65;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard/user-dashboard" },
  { text: "Locker", icon: <Lock />, path: "/dashboard/locker" },
  { text: "Packages", icon: <Package2 />, path: "/dashboard/packages" },
  { text: "Consolidate", icon: <Merge />, path: "/dashboard/consolidate" },
  { text: "Shipments", icon: <LocalShipping />, path: "/dashboard/shipments" },
  {
    text: "Create Shipment",
    icon: <AddBox />,
    path: "/dashboard/create-shipment",
  },
  { text: "Cuba Shipping", icon: <Flight />, path: "/dashboard/cuba-shipping" },
  { text: "Pickup", icon: <LocalTaxi />, path: "/dashboard/pickup" },
  { text: "Payments", icon: <Payment />, path: "/dashboard/payments" },
  { text: "Profile", icon: <Person />, path: "/dashboard/profile" },
];

export default function UserDashboard() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove("currentUser"); // remove cookie
    toast.success("Logged out successfully!", {
      duration: 1500,
    });
    navigate("/"); // redirect to home
  };

  const normalize = (p: string) => (p ? p.replace(/\/+$/, "") : p);

  /* Active color (matches admin sidebar) */
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
      {/* Header - Logo + Toggle */}
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
            <img className="w-2/3" src={Logo} alt="logo" />
          </NavLink>
        </Typography>
        <IconButton onClick={handleToggle} sx={{ color: "#fff" }}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      <Divider sx={{ backgroundColor: "#475569" }} />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => {
          // Make ALL routes use exact matching by default so Dashboard won't stay active on subroutes.
          // If you want prefix behaviour for any path, add it to `prefixMatchPaths`.
          const prefixMatchPaths: string[] = []; // e.g. ['/some-path'] to allow prefix match
          const endMatch = !prefixMatchPaths.includes(item.path); // true => exact match

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

                  // use ACTIVE_COLOR for selected state
                  color: isSelected ? ACTIVE_COLOR : "#fff",

                  // active background uses low-opacity tone of the active color
                  backgroundColor: isSelected ? "rgba(250,146,29,0.10)" : "transparent",

                  "&:hover": {
                    backgroundColor: isSelected
                      ? "rgba(250,146,29,0.12)"
                      : "rgba(250,146,29,0.06)",
                    transform: "translateX(4px)",
                  },

                  "&.active": {
                    backgroundColor: "rgba(250,146,29,0.10)",
                    color: ACTIVE_COLOR,
                  },

                  // ensure child text/icon inherit the active color when selected
                  "& .MuiListItemText-root": {
                    color: isSelected ? ACTIVE_COLOR : "#fff",
                  },
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

      {/* Bottom - Profile + Logout */}
      <Box sx={{ p: 2, borderTop: "1px solid #475569", mt: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: "#4f46e5", width: 40, height: 40 }}>U</Avatar>
          {open && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                John Doe
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                john@cargo.com
              </Typography>
            </Box>
          )}
        </Box>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#fca5a5",
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
