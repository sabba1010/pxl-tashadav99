import React from "react";
import type { IconType } from "react-icons";
import {
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLock,
  FaShoppingCart,
  FaBullhorn,
} from "react-icons/fa";
import { SiNetflix, SiAmazon, SiSteam, SiGoogle } from "react-icons/si";

/**
 * StandoutAccounts (Marketplace-style badges)
 * - Uses same badge rendering as Marketplace component
 * - Round badges, brand color gradients, fallback vibrant gradients
 */

const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaWhatsapp, "#25D366"],
  [SiNetflix, "#E50914"],
  [SiAmazon, "#FF9900"],
  [FaEnvelope, "#D44638"],
  [FaFacebookF, "#1877F2"],
  [FaInstagram, "#E1306C"],
  [FaTwitter, "#1DA1F2"],
  [SiSteam, "#171A21"],
  [SiGoogle, "#4285F4"],
  [FaBullhorn, "#6B46C1"],
  [FaLock, "#0A1A3A"],
  [FaShoppingCart, "#FF6B6B"],
]);

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
  "linear-gradient(135deg,#FCCF31 0%,#F55555 100%)",
  "linear-gradient(135deg,#9BE15D 0%,#00E3AE 100%)",
];

const gradientFromHex = (hex: string) => {
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

type Product = {
  title: string;
  desc: string;
  vendor: string;
  delivery: string;
  price: string;
  icon?: IconType;
};

// Reuse Marketplace-style renderIcon (round badge)
const renderIconBadge = (IconComp: IconType | undefined, size = 28) => {
  const badgeSize = Math.max(48, size + 16);
  const brandHex = IconComp ? ICON_COLOR_MAP.get(IconComp) : undefined;
  const bg = brandHex
    ? gradientFromHex(brandHex)
    : vibrantGradients[(String(IconComp ?? "").length) % vibrantGradients.length];

  if (!IconComp) {
    return (
      <div
        style={{
          width: badgeSize,
          height: badgeSize,
          minWidth: badgeSize,
          borderRadius: 9999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          boxShadow: "0 10px 28px rgba(10,26,58,0.12)",
          border: "2px solid rgba(255,255,255,0.08)",
          mixBlendMode: "normal",
          isolation: "isolate",
        }}
      />
    );
  }

  // Force both color and SVG fill to white so CSS inheritance / blend can't tint it
  const iconEl = React.createElement(IconComp as any, {
    size: Math.round(size * 0.7),
    color: "#fff",
    style: { color: "#fff", fill: "#fff", WebkitTextFillColor: "#fff" },
    className: "standout-icon",
  });

  return (
    <div
      aria-hidden
      style={{
        width: badgeSize,
        height: badgeSize,
        minWidth: badgeSize,
        borderRadius: 9999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 10px 28px rgba(10,26,58,0.12)",
        transition: "transform .16s ease, box-shadow .16s ease",
        border: "2px solid rgba(255,255,255,0.12)",
        cursor: "default",
        mixBlendMode: "normal",
        isolation: "isolate",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-6px) scale(1.04)";
        el.style.boxShadow = "0 18px 44px rgba(10,26,58,0.18)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 10px 28px rgba(10,26,58,0.12)";
      }}
    >
      {iconEl}
    </div>
  );
};

const DATA: Product[] = [
  {
    title: "USA WhatsApp number",
    desc: "USA WhatsApp number for sale, one-time verification code after purchase",
    vendor: "AS Digitals",
    delivery: "Delivers in: 5 mins",
    price: "$4.49",
    icon: FaWhatsapp,
  },
  {
    title: "Facebook Aged Account 2015",
    desc: "Old Facebook account with Marketplace & Ads access",
    vendor: "SocialVault",
    delivery: "Delivers in: 5 mins",
    price: "$45.00",
    icon: FaFacebookF,
  },
  {
    title: "Instagram Active Account",
    desc: "High follower account, active engagement",
    vendor: "InstaPro",
    delivery: "Instant",
    price: "$39.00",
    icon: FaInstagram,
  },
  {
    title: "Twitter Old Active Account",
    desc: "10+ year old account with real followers",
    vendor: "TweetMart",
    delivery: "Instant",
    price: "$55.00",
    icon: FaTwitter,
  },
  {
    title: "Netflix Premium 4K",
    desc: "Family plan, stream in 4K",
    vendor: "StreamZone",
    delivery: "Instant",
    price: "$7.99",
    icon: SiNetflix,
  },
  {
    title: "$50 Amazon Gift Card US",
    desc: "Instant code after purchase",
    vendor: "GiftZone",
    delivery: "Instant",
    price: "$46.50",
    icon: SiAmazon,
  },
  {
    title: "Steam Wallet $20",
    desc: "Region-free Steam wallet code",
    vendor: "GameKeys",
    delivery: "Instant",
    price: "$18.00",
    icon: SiSteam,
  },
  {
    title: "Gmail PVA Aged 2020",
    desc: "Phone-verified aged Gmail",
    vendor: "MailKing",
    delivery: "Delivers in: 3 mins",
    price: "$1.99",
    icon: FaEnvelope,
  },
];

const StandoutAccounts: React.FC = () => {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold text-[#e6c06c] mb-3">Standout Accounts</h2>
          <p className="text-gray-600">Premium verified digital assets • Marketplace-style badges</p>
        </div>

        {/* Desktop table */}
        <div className="overflow-x-auto sm:hidden md:block rounded-2xl shadow border border-gray-200">
          <table className="w-full min-w-[720px] bg-white">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Vendor</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Delivery</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {DATA.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div>{renderIconBadge(p.icon, 26)}</div>
                      <div className="text-lg font-semibold text-gray-900">{p.title}</div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">{p.desc}</td>

                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-medium text-gray-700">{p.vendor}</span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                      {p.delivery}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className="text-xl font-bold text-gray-900">{p.price}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked */}
        <div className="md:hidden space-y-4 mt-8">
          {DATA.map((p, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {renderIconBadge(p.icon, 20)}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{p.title}</h4>
                    <div className="text-sm text-gray-600">{p.vendor}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">{p.price}</div>
                  <div className="text-xs text-[#6B7280] mt-1">{p.delivery}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StandoutAccounts;
