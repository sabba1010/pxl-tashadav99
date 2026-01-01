import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconType } from "react-icons";
import {
  FaWhatsapp,
  FaEnvelope,
  FaPlus,
  FaBullhorn,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLock,
  FaShoppingCart,
  FaTimes,
  FaSearch,
  FaStar,
  FaEye,
  FaLinkedinIn,
  FaYoutube,
  FaSnapchatGhost,
  FaTelegramPlane,
  FaDiscord,
  FaPinterest,
  FaRedditAlien,
  FaPaypal,
  FaCheck,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  SiNetflix,
  SiAmazon,
  SiSteam,
  SiGoogle,
  SiTiktok,
  SiTinder,
} from "react-icons/si";
import {
  MdMail,
  MdSimCard,
  MdPhoneIphone,
  MdVpnLock,
  MdLocalOffer,
} from "react-icons/md";
import { BiSolidPurchaseTag } from "react-icons/bi";

import { sendNotification } from "../Notification/Notification";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { useAuthHook } from "../../hook/useAuthHook";

const StarIcon = FaStar as React.ElementType;
const ShoppingCartIcon = FaShoppingCart as React.ElementType;
const EyeIcon = FaEye as React.ElementType;
const TimesIcon = FaTimes as React.ElementType;
const SearchIcon = FaSearch as React.ElementType;
const PlusIcon = FaPlus as React.ElementType;
const PurchaseIcon = BiSolidPurchaseTag as React.ElementType;
const CheckIcon = FaCheck as React.ElementType;
const ExternalLinkIcon = FaExternalLinkAlt as React.ElementType;

interface Item {
  id: string;
  title: string;
  desc?: string;
  price: number;
  seller: string;
  delivery: string;
  icon: string | IconType;
  category: string;
  subcategory?: string;
  realTime?: boolean;
  previewLink?: string;
}

type SubcatState = Record<string, string[]>;

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3200";

const CATEGORY_MAP: Record<string, string[]> = {
  "Social Media": [
    "Instagram",
    "Facebook",
    "TikTok",
    "Snapchat",
    "Twitter / X",
    "YouTube",
    "WhatsApp",
    "Telegram",
    "Discord",
    "Reddit",
    "Pinterest",
    "LinkedIn",
    "Gmail",
  ],
  "Digital Services & Boosting": [
    "Instagram Boost",
    "TikTok Boost",
    "YouTube Boost",
    "Twitter Boost",
    "Facebook Boost",
    "App Reviews",
  ],
  "eSIM & Mobile Services": [
    "eSIM (US)",
    "eSIM (EU)",
    "Roaming eSIM",
    "Temporary SMS",
    "Disposable Numbers",
  ],
  "Streaming & Entertainment": [
    "Netflix",
    "Spotify",
    "Apple Music",
    "Hulu",
    "Amazon Prime",
    "Disney+",
    "HBO Max",
  ],
  "Gaming Accounts": [
    "PlayStation",
    "Xbox",
    "Steam",
    "Fortnite",
    "PUBG",
    "Roblox",
  ],
  "Finance / Business Tools": [
    "PayPal",
    "Stripe",
    "CashApp",
    "Wise",
    "Business Email",
  ],
  "Productivity & Software": [
    "Office 365",
    "Canva Pro",
    "Adobe CC",
    "Notion",
    "Grammarly",
  ],
  "Dating & Chatting": [
    "Tinder",
    "Bumble",
    "Tantan",
    "WeChat",
    "Azar",
    "InternationalCupid",
  ],
  "Giftcards & Misc": [
    "Amazon",
    "Steam",
    "Google Play",
    "VPN",
    "Virtual Cards",
    "Crypto Wallets",
  ],
  Others: ["Misc"],
};

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
  [FaLinkedinIn, "#0A66C2"],
  [FaYoutube, "#FF0000"],
  [FaSnapchatGhost, "#FFFC00"],
  [SiTiktok, "#000000"],
  [FaTelegramPlane, "#2AABEE"],
  [FaDiscord, "#7289DA"],
  [FaPinterest, "#E60023"],
  [FaRedditAlien, "#FF4500"],
  [FaPaypal, "#003087"],
  [MdSimCard, "#00A3E0"],
  [MdVpnLock, "#0F172A"],
  [MdMail, "#D44638"],
  [SiTinder, "#FF6B6B"],
]);

const SUBICON_MAP: Record<string, IconType> = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  "Twitter / X": FaTwitter,
  TikTok: SiTiktok,
  Snapchat: FaSnapchatGhost,
  LinkedIn: FaLinkedinIn,
  Pinterest: FaPinterest,
  YouTube: FaYoutube,
  WhatsApp: FaWhatsapp,
  Telegram: FaTelegramPlane,
  Discord: FaDiscord,
  Reddit: FaRedditAlien,
  Gmail: MdMail,
  Tinder: SiTinder,
  "eSIM (US)": MdSimCard,
  "eSIM (EU)": MdSimCard,
  "Roaming eSIM": MdSimCard,
  "Temporary SMS": MdPhoneIphone,
  "Disposable Numbers": MdPhoneIphone,
  Netflix: SiNetflix,
  Amazon: SiAmazon,
  Steam: SiSteam,
  PayPal: FaPaypal,
  VPN: MdVpnLock,
  Shopify: FaShoppingCart,
  "Virtual Cards": MdLocalOffer,
  Others: FaBullhorn,
};

const VIBRANT_GRADIENTS = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
  "linear-gradient(135deg,#FCCF31 0%,#F55555 100%)",
  "linear-gradient(135deg,#9BE15D 0%,#00E3AE 100%)",
];

const hashCode = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
};

const useLockBodyScroll = (isLocked: boolean) => {
  useEffect(() => {
    document.body.style.overflow = isLocked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLocked]);
};

const RenderIcon = ({
  icon,
  size = 36,
  realTime = false,
}: {
  icon: string | IconType;
  size?: number;
  realTime?: boolean;
}) => {
  const badgeSize = Math.max(40, size + 8);
  let bg = VIBRANT_GRADIENTS[0];
  if (typeof icon !== "string") {
    const color = ICON_COLOR_MAP.get(icon);
    if (color) bg = color;
    else
      bg =
        VIBRANT_GRADIENTS[
          Math.abs(hashCode(icon.toString())) % VIBRANT_GRADIENTS.length
        ];
  } else if (!icon.startsWith("http")) {
    bg = VIBRANT_GRADIENTS[Math.abs(hashCode(icon)) % VIBRANT_GRADIENTS.length];
  }
  const IconComponent =
    typeof icon !== "string" ? (icon as React.ElementType) : null;

  if (typeof icon === "string" && icon.startsWith("http")) {
    return (
      <div
        style={{ width: size + 12, height: size + 12 }}
        className="rounded-full overflow-hidden shadow-md"
      >
        <img src={icon} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      style={{ width: badgeSize, height: badgeSize, background: bg }}
      className="relative rounded-full flex items-center justify-center shadow-md text-white font-bold"
    >
      {typeof icon === "string" ? (
        <span style={{ fontSize: Math.round(size * 0.6) }}>{icon}</span>
      ) : (
        IconComponent && <IconComponent size={Math.round(size * 0.65)} />
      )}
      {realTime && (
        <span
          className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
          title="Online"
        />
      )}
    </div>
  );
};

const Stars: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`w-3 h-3 ${i < value ? "text-yellow-400" : "text-gray-300"}`}
      />
    ))}
  </div>
);

const CategorySelector: React.FC<{
  selectedSubcats: SubcatState;
  setSelectedSubcats: React.Dispatch<React.SetStateAction<SubcatState>>;
}> = ({ selectedSubcats, setSelectedSubcats }) => {
  const [openMain, setOpenMain] = useState<Record<string, boolean>>({});
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpenMain({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSubcat = (main: string, sub: string) => {
    setSelectedSubcats((prev) => {
      const currentList = prev[main] || [];
      const newList = currentList.includes(sub)
        ? currentList.filter((s) => s !== sub)
        : [...currentList, sub];
      if (newList.length === 0) {
        const { [main]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [main]: newList };
    });
  };

  return (
    <div ref={wrapperRef}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#0A1A3A]">
          Account Category
        </span>
        <button
          onClick={() => setSelectedSubcats({})}
          className="text-xs text-[#0A1A3A] hover:underline"
        >
          Clear
        </button>
      </div>
      <div className="bg-white rounded-lg border divide-y divide-gray-100">
        {Object.entries(CATEGORY_MAP).map(([main, subcats]) => (
          <div key={main}>
            <button
              onClick={() => setOpenMain((p) => ({ ...p, [main]: !p[main] }))}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-800">
                  {main}
                </span>
                {selectedSubcats[main]?.length > 0 && (
                  <span className="text-xs px-1.5 bg-gray-100 rounded text-gray-600">
                    {selectedSubcats[main].length}
                  </span>
                )}
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${
                  openMain[main] ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openMain[main] && (
              <div className="px-3 pb-2 pt-1 space-y-1">
                {subcats.map((sub) => {
                  const Icon = SUBICON_MAP[sub];
                  const SubIconComp = Icon ? (Icon as React.ElementType) : null;
                  const isChecked = selectedSubcats[main]?.includes(sub);
                  return (
                    <label
                      key={sub}
                      className="flex items-center justify-between cursor-pointer py-1 hover:bg-gray-50 rounded px-1"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked || false}
                          onChange={() => toggleSubcat(main, sub)}
                          className="w-4 h-4 rounded text-[#D4A643] focus:ring-[#D4A643]"
                        />
                        <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">
                          {SubIconComp ? (
                            <SubIconComp size={14} className="text-gray-700" />
                          ) : (
                            <span className="text-[10px] font-bold">
                              {sub[0]}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{sub}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ItemCard: React.FC<{
  item: Item;
  viewMode: "list" | "grid";
  onAddToCart: (item: Item) => void;
  onView: (item: Item) => void;
  isProcessing: boolean;
  isAdded: boolean;
}> = ({
  item,
  viewMode,
  onAddToCart,
  onView,
  isProcessing,
  isAdded,
}) => {
  const isList = viewMode === "list";
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition p-4 ${
        isList ? "flex items-center gap-4" : "flex flex-col text-center"
      }`}
    >
      <div className={isList ? "" : "flex justify-center mb-3"}>
        <RenderIcon
          icon={item.icon}
          size={isList ? 40 : 56}
          realTime={item.realTime}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm text-[#0A1A3A] truncate">
          {item.title}
        </h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
          {item.desc || "Premium account • Instant delivery"}
        </p>
        <div className="text-xs text-gray-400 mt-2">
          Verified Seller •{" "}
          <span className="text-green-600">{item.delivery}</span>
        </div>
      </div>
      <div
        className={`flex flex-col ${
          isList ? "items-end text-right" : "mt-4 items-center w-full"
        }`}
      >
        <div className="text-base font-bold text-[#0A1A3A] mb-1">
          ${item.price.toFixed(2)}
        </div>
        <div className="flex items-center gap-1 w-full justify-center">
          <button
            onClick={() => onAddToCart(item)}
            disabled={isAdded}
            className={`p-1.5 border rounded-md transition-all duration-200 flex items-center justify-center
              ${
                isAdded
                  ? "bg-green-100 text-green-600 border-green-200 cursor-default"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            title={isAdded ? "Already in cart" : "Add to Cart"}
          >
            {isAdded ? <CheckIcon size={14} /> : <ShoppingCartIcon size={14} />}
          </button>

          <button
            onClick={() => onView(item)}
            className="p-1.5 border rounded-md hover:bg-gray-50 text-gray-600 flex items-center justify-center"
            title="View Details"
          >
            <EyeIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductModal: React.FC<{
  item: Item;
  onClose: () => void;
  onBuy: (item: Item) => void;
  onAddToCart: (item: Item) => void;
  isProcessing: boolean;
  isAdded: boolean;
}> = ({ item, onClose, onBuy, onAddToCart, isProcessing, isAdded }) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800">Item Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <TimesIcon />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex justify-center mb-4">
            <RenderIcon icon={item.icon} size={72} realTime={item.realTime} />
          </div>
          <h2 className="text-2xl font-bold text-center text-[#0A1A3A] mb-1">
            {item.title}
          </h2>
          <div className="text-3xl font-extrabold text-center text-green-600 mb-6">
            ${item.price.toFixed(2)}
          </div>

          <div className="space-y-4 text-sm bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="font-semibold text-gray-700">Description:</span>
              <p className="text-gray-600 mt-1">
                {item.desc || "No description provided."}
              </p>
            </div>

            <div className="flex justify-between mt-2">
              <span>
                Seller: <span className="font-medium">Verified Seller</span>
              </span>
              <span>
                Category: <span className="font-medium">{item.category}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-yellow-500">
              <Stars value={5} />{" "}
              <span className="text-gray-400 text-xs">(Verified)</span>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
            <input
              type="checkbox"
              id="accept"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1"
            />
            <label
              htmlFor="accept"
              className="text-xs text-gray-700 cursor-pointer select-none"
            >
              I have verified the seller rating and description. I understand
              that transactions outside this platform are not protected.
            </label>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onAddToCart(item)}
              disabled={isAdded}
              className={`py-3 border border-gray-300 rounded-xl font-semibold transition ${
                isAdded
                  ? "bg-green-50 text-green-600 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              {isAdded ? "Added to Cart" : "Add to Cart"}
            </button>
            <button
              onClick={() => accepted && onBuy(item)}
              disabled={!accepted || isProcessing}
              className={`py-3 rounded-xl font-bold text-white transition ${
                accepted
                  ? "bg-[#33ac6f] hover:bg-[#28965e]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isProcessing ? "Processing..." : "Purchase Now"}
            </button>
          </div>

          {item.previewLink && (
            <a
              href={item.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <ExternalLinkIcon size={16} /> Preview Product
            </a>
          )}
        </div>
      </div>
    </>
  );
};

const Marketplace: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcats, setSelectedSubcats] = useState<SubcatState>({});
  const [priceRange, setPriceRange] = useState(100);
  const [showBanner, setShowBanner] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);

  const itemsPerPage = 6;
  const navigate = useNavigate();
  const { refetch } = useAuthHook();
  const user = useAuth();

  useLockBodyScroll(drawerOpen || !!selectedItem || mobileSearchOpen);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${API_URL}/product/all-sells`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const mapped: Item[] = data
          .filter((p: any) => p.status === "active")
          .map((p: any) => ({
            id: p._id,
            title: p.name,
            desc: p.description,
            price: Number(p.price) || 0,
            seller: p.userEmail,
            delivery: "Instant",
            icon: p.categoryIcon || FaBullhorn,
            category: "Social Media",
            subcategory: p.category,
            realTime: true,
            previewLink: p.previewLink,
          }));
        setItems(mapped);
      } catch (err) {
        console.error("Failed to load products", err);
        toast.error("Failed to load marketplace");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user.user?.email) return;
      try {
        const res = await fetch(`${API_URL}/cart?email=${user.user.email}`);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.data || [];
          const ids = items.map((item: any) => item.productId);
          setCartItemIds(ids);
          setCartCount(items.length);
        }
      } catch (err) {
        console.error("Failed to load cart", err);
      }
    };
    fetchCartItems();
  }, [user.user?.email]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.desc?.toLowerCase().includes(q) ||
        item.subcategory?.toLowerCase().includes(q);
      const matchesPrice = item.price <= priceRange;

      const mainFilters = Object.keys(selectedSubcats);
      let matchesCategory = true;
      if (mainFilters.length > 0) {
        const relevantMain = Object.keys(CATEGORY_MAP).find((cat) =>
          CATEGORY_MAP[cat].includes(item.subcategory || "")
        );
        if (relevantMain && mainFilters.includes(relevantMain)) {
          const subs = selectedSubcats[relevantMain] || [];
          if (subs.length > 0 && !subs.includes(item.subcategory || "")) {
            matchesCategory = false;
          }
        } else if (relevantMain && !mainFilters.includes(relevantMain)) {
          matchesCategory = false;
        }
      }

      return matchesSearch && matchesPrice && matchesCategory;
    });
  }, [items, searchQuery, selectedSubcats, priceRange]);

  useEffect(() => setCurrentPage(1), [searchQuery, selectedSubcats, priceRange]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const addToCart = useCallback(
    async (item: Item) => {
      if (!user.user?.email) {
        toast.error("Please login first!");
        return;
      }

      if (cartItemIds.includes(item.id)) {
        toast.warning("Already in cart!");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/cart/post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.id,
            name: item.title,
            price: item.price,
            image: typeof item.icon === "string" ? item.icon : "",
            sellerEmail: item.seller,
            addedAt: new Date(),
            UserEmail: user.user?.email,
          }),
        });

        if (res.ok) {
          setCartCount((c) => c + 1);
          setCartItemIds((ids) => [...ids, item.id]);
          toast.success("Added to cart!");
        } else {
          toast.error("Failed to add");
        }
      } catch (err) {
        toast.error("Network error");
      }
    },
    [user.user?.email, cartItemIds]
  );

  // NOW USING SAME LOGIC AS CART PAGE
  const buyNow = async (item: Item) => {
    const email = user.user?.email;
    if (!email) {
      toast.error("Please log in!");
      return;
    }

    if (processingIds.includes(item.id)) return;
    setProcessingIds((prev) => [...prev, item.id]);

    try {
      // 1. Add item to cart if not already there
      if (!cartItemIds.includes(item.id)) {
        await fetch(`${API_URL}/cart/post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.id,
            name: item.title,
            price: item.price,
            image: typeof item.icon === "string" ? item.icon : "",
            sellerEmail: item.seller,
            addedAt: new Date(),
            UserEmail: email,
          }),
        });
        setCartItemIds((prev) => [...prev, item.id]);
        setCartCount((prev) => prev + 1);
      }

      // 2. Trigger full cart checkout (same as CartPage)
      const res = await fetch(`${API_URL}/purchase/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (result.success) {
        // Notification
        try {
          await sendNotification({
            type: "buy",
            title: "Purchase Successful!",
            message: `You bought ${item.title} for $${item.price.toFixed(2)}.`,
            data: { totalAmount: item.price, itemCount: 1 },
            userEmail: email,
          } as any);
        } catch (notifErr) {
          console.error("Notification failed", notifErr);
        }

        toast.success(`Success! $${result.totalDeducted || item.price} deducted.`);
        setCartItemIds([]);
        setCartCount(0);
        setSelectedItem(null);
        refetch();
        navigate("/purchases");
      } else {
        if (result.message?.includes("Insufficient")) {
          toast.error(`Insufficient balance! Need $${result.required || item.price}`);
        } else {
          toast.error(result.message || "Purchase failed");
        }
      }
    } catch (err) {
      toast.error("Transaction failed");
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | string)[] = [1];
    if (currentPage <= 4) {
      pages.push(2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push("...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#F7F5F4] pb-10">
      {showBanner && (
        <div className="bg-[#33ac6f] text-white px-4 py-3 flex justify-between items-center text-sm font-medium">
          <span>Black Friday is live! All prices discounted.</span>
          <button onClick={() => setShowBanner(false)}>
            <TimesIcon />
          </button>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 bg-white border rounded-md shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1A3A]">Marketplace</h1>
              <p className="text-sm text-gray-500">Verified sellers • Instant delivery</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex bg-white rounded-lg border overflow-hidden p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm ${viewMode === "list" ? "bg-gray-900 text-white" : "text-gray-600"}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm ${viewMode === "grid" ? "bg-gray-900 text-white" : "text-gray-600"}`}
              >
                Grid
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search accounts..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#33ac6f]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-3 bg-white border rounded-lg shadow-sm"
            >
              <SearchIcon />
            </button>
            <Link to="/cart" className="relative p-3 bg-white border rounded-lg shadow-sm">
              <ShoppingCartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="fixed inset-0 z-50 bg-white p-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <SearchIcon className="text-gray-400" />
              <input
                type="text"
                autoFocus
                className="flex-1 outline-none text-lg"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setMobileSearchOpen(false)}>
                <TimesIcon size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Filters</h3>
              <CategorySelector
                selectedSubcats={selectedSubcats}
                setSelectedSubcats={setSelectedSubcats}
              />
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>Price Range</span>
                  <span>${priceRange}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#33ac6f]"
                />
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#33ac6f]"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 text-gray-500 bg-white rounded-xl border">
                No items found matching your filters.
              </div>
            ) : (
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {paginatedItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    onAddToCart={addToCart}
                    onView={setSelectedItem}
                    isProcessing={processingIds.includes(item.id)}
                    isAdded={cartItemIds.includes(item.id)}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 select-none">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, i) =>
                    page === "..." ? (
                      <span key={i} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-semibold border transition-all
                          ${currentPage === page
                            ? "bg-[#33ac6f] border-[#33ac6f] text-white shadow-md"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedItem && (
        <ProductModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onBuy={buyNow}
          onAddToCart={addToCart}
          isProcessing={processingIds.includes(selectedItem.id)}
          isAdded={cartItemIds.includes(selectedItem.id)}
        />
      )}

      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
        <aside className="relative bg-white w-80 h-full overflow-y-auto p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setDrawerOpen(false)}>
              <TimesIcon />
            </button>
          </div>
          <CategorySelector
            selectedSubcats={selectedSubcats}
            setSelectedSubcats={setSelectedSubcats}
          />
          <div className="mt-8">
            <label className="font-semibold block mb-2">Max Price: ${priceRange}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#33ac6f]"
            />
          </div>
        </aside>
      </div>

      <Link
        to="/seller-pay"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#28965e] transition z-40"
      >
        <PlusIcon size={24} />
      </Link>
    </div>
  );
};

export default Marketplace;