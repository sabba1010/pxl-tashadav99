// src/components/StandoutAccounts.tsx
import React from "react";
import {
  Phone,
  Lock,
  Mail,
  Film,
  Gift,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Music,
} from "lucide-react";

/**
 * StandoutAccounts.tsx
 * - Colorful "moogo"-style icon badges for lucide icons
 * - Brand color map -> gradient backgrounds
 * - Hover lift + shadow
 */

const BRAND_COLOR_MAP: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  tiktok: "#010101", // tiktok brand uses mixed; keep dark fallback
  youtube: "#FF0000",
  netflix: "#E50914",
  whatsapp: "#25D366",
  amazon: "#FF9900",
  gmail: "#D44638",
  steam: "#171A21",
};

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

// helper: detect platform from title
const resolveIcon = (item: any) => {
  const title = (item.title || "").toLowerCase();
  if (title.includes("facebook")) return { Icon: Facebook, brandKey: "facebook" };
  if (title.includes("instagram")) return { Icon: Instagram, brandKey: "instagram" };
  if (title.includes("twitter") || title.includes("x ")) return { Icon: Twitter, brandKey: "twitter" };
  if (title.includes("tiktok")) return { Icon: Music, brandKey: "tiktok" };
  if (title.includes("youtube") || title.includes("netflix")) return { Icon: Youtube, brandKey: "youtube" };
  if (title.includes("whatsapp")) return { Icon: Phone, brandKey: "whatsapp" };
  if (title.includes("amazon")) return { Icon: Gift, brandKey: "amazon" };
  if (title.includes("gmail")) return { Icon: Mail, brandKey: "gmail" };
  // fallback: use provided Icon or Phone
  return { Icon: item.Icon || Phone, brandKey: undefined };
};

// render colourful badge for a lucide icon component
const renderIconBadge = (IconComp: React.ComponentType<any>, brandKey?: string, size = 28) => {
  const badgeSize = Math.max(44, size + 16);
  const brandHex = brandKey ? BRAND_COLOR_MAP[brandKey] : undefined;
  const bg = brandHex
    ? gradientFromHex(brandHex)
    : vibrantGradients[String(IconComp).length % vibrantGradients.length];

  return (
    <div
      aria-hidden
      style={{
        width: badgeSize,
        height: badgeSize,
        minWidth: badgeSize,
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 8px 24px rgba(10,26,58,0.12)",
        transition: "transform .16s ease, box-shadow .16s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-4px) scale(1.02)";
        el.style.boxShadow = "0 16px 44px rgba(10,26,58,0.16)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 8px 24px rgba(10,26,58,0.12)";
      }}
    >
      <IconComp size={Math.round(size * 0.9)} color="#ffffff" />
    </div>
  );
};

const data = [
  {
    title: "USA WhatsApp number",
    desc:
      "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase",
    vendor: "AS Digitals",
    delivery: "Delivers in: 5 mins",
    price: "$4.49",
    Icon: Phone,
  },
  {
    title: "Facebook Aged Account 2015",
    desc: "Old Facebook account with Marketplace & Ads access. No restrictions. Clean history.",
    vendor: "SocialVault",
    delivery: "Delivers in: 5 mins",
    price: "$45.00",
    Icon: Facebook,
  },
  {
    title: "1 year Active Pia VPN",
    desc: "1 year pia vpn works with either ios/android, just 1 device.",
    vendor: "lavidamide Logs",
    delivery: "Delivers Instantly",
    price: "$2.98",
    Icon: Lock,
  },
  {
    title: "Gmail PVA Aged 2020",
    desc: "High-quality account • Instant delivery • Full warranty",
    vendor: "MailKing",
    delivery: "Delivers in: 3 mins",
    price: "$1.99",
    Icon: Mail,
  },
  {
    title: "Netflix Premium 4K",
    desc: "High-quality account • Instant delivery • Full warranty",
    vendor: "StreamZone",
    delivery: "Delivers Instantly",
    price: "$7.99",
    Icon: Film,
  },
  {
    title: "$50 Amazon Gift Card US",
    desc: "High-quality account • Instant delivery • Full warranty",
    vendor: "GiftZone",
    delivery: "Delivers Instantly",
    price: "$46.50",
    Icon: Gift,
  },
  {
    title: "Instagram Active Account",
    desc: "High follower account, active engagement",
    vendor: "InstaPro",
    delivery: "Instant",
    price: "$39.00",
    Icon: Instagram,
  },
  {
    title: "Twitter Old Active Account",
    desc: "10+ year old account with real followers",
    vendor: "TweetMart",
    delivery: "Instant",
    price: "$55.00",
    Icon: Twitter,
  },
];

const StandoutAccounts: React.FC = () => {
  return (
    <>
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#daab4c] to-[#b8860b] mb-4">
              Connect With Standout Social Media Influencers
            </h2>
            <p className="text-gray-600 text-lg">Premium verified digital assets • Instant delivery available</p>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200">
            <table className="w-full min-w-[800px] bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-[#00183b] to-[#002a5c] text-white">
                  <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider">Product</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider">Description</th>
                  <th className="px-6 py-5 text-center text-sm font-semibold uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-5 text-center text-sm font-semibold uppercase tracking-wider">Delivery</th>
                  <th className="px-6 py-5 text-center text-sm font-semibold uppercase tracking-wider">Price</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data.map((item, idx) => {
                  const resolved = resolveIcon(item);
                  const IconComp = resolved.Icon;
                  const brandKey = resolved.brandKey as string | undefined;

                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-all duration-200 group">
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{renderIconBadge(IconComp, brandKey, 24)}</div>
                          <div className="text-lg font-semibold text-gray-900">{item.title}</div>
                        </div>
                      </td>

                      <td className="px-6 py-6 text-sm text-gray-600 max-w-md">{item.desc}</td>

                      <td className="px-6 py-6 text-center">
                        <span className="text-sm font-medium text-gray-700">{item.vendor}</span>
                      </td>

                      <td className="px-6 py-6 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          {item.delivery}
                        </span>
                      </td>

                      <td className="px-6 py-6 text-center">
                        <span className="text-2xl font-bold text-gray-900">{item.price}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked view */}
          <div className="md:hidden space-y-4 mt-8">
            {data.map((item, idx) => {
              const resolved = resolveIcon(item);
              const IconComp = resolved.Icon;
              const brandKey = resolved.brandKey as string | undefined;

              return (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {renderIconBadge(IconComp, brandKey, 20)}
                      <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{item.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-gray-700">{item.vendor}</span>
                      <span className="ml-3 text-[#daab4c] font-bold">• {item.delivery}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default StandoutAccounts;
