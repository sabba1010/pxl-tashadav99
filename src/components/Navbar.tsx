import React, { useState } from "react";
import { Button, IconButton, Avatar } from "@mui/material";
import { Link, NavLink, useLocation } from "react-router-dom";

import {
  WhatsApp,
  Instagram,
  Facebook,
  Language,
  Menu as MenuIcon,
  Close,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

import PersonIcon from "@mui/icons-material/Person";
import Logo from "../assets/Grupo 1.png";
import { useLanguage } from "../i18n/LanguageContext";
import { useCurrentUser } from "../context/useCurrentUser";

const Navbar: React.FC = () => {
  const { t, toggleLang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const loginUser = useCurrentUser();

  const topNav = [
    { path: "/nuestros", key: "Nuestros", label: "Nuestros" },
    { path: "/quiénes-somos", key: "quienes_somos", label: "Quiénes Somos" },
    { path: "/faqpage", key: "faq", label: "FAQ" },
    { path: "/recogida", key: "recogida", label: "Recogida" },
    { path: "/contacto", key: "contacto", label: "Contacto" },
    {
      path: "/casilleroescritorio",
      key: "CasilleroEscritorio",
      label: "Casillero Escritorio",
    },
    // { path: "/CasilleroVirtual", key: "CasilleroVirtual", label: "Virtual Locker" }
  ];

  return (
    <>
      {/* 🔵 TOP GREEN BAR (LEFT & RIGHT — close together) */}
      <div className="bg-green-800 py-2 px-4 shadow-sm flex justify-between items-center">
        {/* LEFT DIV */}
        <div className="flex items-center gap-2">
          <IconButton sx={{ color: "#fff", padding: "4px" }}>
            <WhatsApp fontSize="small" />
          </IconButton>

          <IconButton sx={{ color: "#fff", padding: "4px" }}>
            <Instagram fontSize="small" />
          </IconButton>

          <IconButton sx={{ color: "#fff", padding: "4px" }}>
            <Facebook fontSize="small" />
          </IconButton>
        </div>

        {/* RIGHT DIV */}
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleLang}
            startIcon={<Language />}
            sx={{
              color: "#fff",
              textTransform: "none",
              paddingX: 1,
              fontSize: 13,
              borderRadius: "9999px",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
            }}
          >
            EN
          </Button>
          <Link to="/login">
            <Button
              startIcon={<LoginIcon fontSize="small" />}
              sx={{
                backgroundColor: "transparent",
                color: "#fff",
                borderRadius: "9999px",
                paddingX: 1.4,
                fontSize: 13,
                border: "1px solid rgba(255,255,255,0.25)",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
              }}
            >
              Login
            </Button>
          </Link>

          <Link to="/register">
            <Button
              startIcon={<PersonAddIcon fontSize="small" />}
              sx={{
                backgroundColor: "transparent",
                color: "#fff",
                borderRadius: "9999px",
                paddingX: 1.4,
                fontSize: 13,
                border: "1px solid rgba(255,255,255,0.25)",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
              }}
            >
              Register
            </Button>
          </Link>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-white sticky top-0 z-[200] shadow">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LOGO */}
            <NavLink to="/" className="flex items-center">
              <img
                src={Logo}
                alt="Expresur Logo"
                className="h-5 w-auto md:h-7 md:w-auto object-contain"
              />
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-10">
              {topNav.map((n) => (
                <NavLink
                  key={n.path}
                  to={n.path}
                  className={({ isActive }) =>
                    `text-base font-semibold transition ${
                      isActive
                        ? "text-[#046838] underline decoration-[#046838] underline-offset-4"
                        : "text-gray-700 hover:text-[#046838]"
                    }`
                  }
                >
                  {/* cast to any to satisfy TypeScript union mismatch */}
                  {(t && t(n.key as any)) || n.key}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-4">
              {/* TRACK BUTTON */}
              <NavLink to="/rasterear">
                <button
                  className={`bg-green-800 hover:bg-[#035230] text-white w-36 md:w-52 text-[12px] md:text-[15px] font-semibold px-4 py-2 rounded-full shadow transition ${
                    location.pathname === "/rasterear"
                      ? "ring-2 ring-[#046838]"
                      : ""
                  }`}
                >
                  {t ? t("rastrear") : "Rastrear"}
                </button>
              </NavLink>

              {/* DASHBOARD ICON */}
              {loginUser ? (
                <NavLink
                  to={
                    loginUser.role === "admin"
                      ? "/dashboard/admin"
                      : "/dashboard/user-dashboard"
                  }
                  style={{ textDecoration: "none" }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "#046838",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(4, 104, 56, 0.2)",
                    }}
                  >
                    <PersonIcon sx={{ color: "#fff", fontSize: 22 }} />
                  </Avatar>
                </NavLink>
              ) : (
                <NavLink to="/login">
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "#046838",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(4, 104, 56, 0.2)",
                    }}
                  >
                    <PersonIcon sx={{ color: "#fff", fontSize: 22 }} />
                  </Avatar>
                </NavLink>
              )}

              {/* MOBILE MENU BUTTON */}
              <div className="xl:hidden">
                <IconButton
                  onClick={() => setMobileMenuOpen(true)}
                  className="text-[#046838]"
                >
                  <MenuIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div
          className="z-[200] fixed inset-0 bg-black bg-opacity-60 xl:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex justify-between items-center">
              <img src={Logo} alt="Expresur" className="h-6" />
              <IconButton onClick={() => setMobileMenuOpen(false)}>
                <Close className="text-[#046838]" />
              </IconButton>
            </div>

            <nav className="p-6 space-y-6">
              <NavLink
                to="/"
                className="block text-xl font-bold text-[#046838]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t ? t("inicio") : "Inicio"}
              </NavLink>

              {topNav.map((n) => (
                <NavLink
                  key={n.path}
                  to={n.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-semibold text-gray-800 hover:text-[#046838]"
                >
                  {/* cast to any here too */}
                  {(t && t(n.key as any)) || n.key}
                </NavLink>
              ))}

              {/* MOBILE DASHBOARD */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <Avatar sx={{ bgcolor: "#046838" }}>
                    <PersonIcon sx={{ color: "#fff" }} />
                  </Avatar>
                  <NavLink
                    to="/dashboard"
                    className="text-sm text-green-800 underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Go to Dashboard
                  </NavLink>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
