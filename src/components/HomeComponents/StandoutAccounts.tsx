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

const StandoutAccounts = () => {
  // Helper: detect platform from title and return matching icon + Tailwind color class
  const resolveIcon = (item: any) => {
    const title = (item.title || "").toLowerCase();
    if (title.includes("facebook"))
      return { Icon: Facebook, colorClass: "text-facebook" };
    if (title.includes("instagram"))
      return { Icon: Instagram, colorClass: "text-instagram" };
    if (title.includes("twitter") || title.includes("x "))
      return { Icon: Twitter, colorClass: "text-twitter" };
    if (title.includes("tiktok"))
      return { Icon: Music, colorClass: "text-tiktok" };
    if (title.includes("youtube") || title.includes("netflix"))
      return { Icon: Youtube, colorClass: "text-youtube" };
    // fallback to provided Icon or Phone and section accent color
    return { Icon: item.Icon || Phone, colorClass: "text-accent" };
  };
  return (
    <>
      {/* Standout Accounts Section - Modern Table Layout */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#daab4c] to-[#b8860b] mb-4">
              Connect With Standout Social Media Influencers
            </h2>
            <p className="text-gray-600 text-lg">
              Premium verified digital assets • Instant delivery available
            </p>
          </div>

          {/* Desktop: Table View | Mobile: Stacked Rows */}
          <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200">
            <table className="w-full min-w-[800px] bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-[#00183b] to-[#002a5c] text-white">
                  <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold uppercase tracking-wider">
                    Price
                  </th>
                  {/* Actions column removed per request */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  {
                    title: "USA WhatsApp number",
                    desc: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase",
                    vendor: "AS Digitals",
                    delivery: "Delivers in: 5 mins",
                    price: "$4.49",
                    Icon: Phone,
                  },
                  {
                    title: "USA WhatsApp number",
                    desc: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase",
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
                ].map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition-all duration-200 group"
                  >
                    {/* Product Title + Icon */}
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        {(() => {
                          const resolved = resolveIcon(item);
                          const IconComp = resolved.Icon;
                          return (
                            <div className="text-3xl">
                              <IconComp
                                className={`w-7 h-7 ${resolved.colorClass}`}
                              />
                            </div>
                          );
                        })()}
                        <div className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-6 text-sm text-gray-600 max-w-md">
                      {item.desc}
                    </td>

                    {/* Vendor */}
                    <td className="px-6 py-6 text-center">
                      <span className="text-sm font-medium text-gray-700">
                        {item.vendor}
                      </span>
                    </td>

                    {/* Delivery Time */}
                    <td className="px-6 py-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        {item.delivery}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-6 text-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {item.price}
                      </span>
                    </td>

                    {/* Actions removed (Add to cart / View) */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Version (Hidden on Desktop) */}
          <div className="md:hidden space-y-4 mt-8">
            {[
              {
                title: "USA WhatsApp number",
                desc: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase",
                vendor: "AS Digitals",
                delivery: "Delivers in: 5 mins",
                price: "$4.49",
                Icon: Phone,
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
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-md"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const resolved = resolveIcon(item);
                      const IconComp = resolved.Icon;
                      return (
                        <IconComp
                          className={`w-7 h-7 ${resolved.colorClass}`}
                        />
                      );
                    })()}
                    <h4 className="text-lg font-bold text-gray-900">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {item.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-gray-700">
                      {item.vendor}
                    </span>
                    <span className="ml-3 text-[#daab4c] font-bold">
                      • {item.delivery}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default StandoutAccounts;
