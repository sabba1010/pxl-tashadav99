import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    FaStar,
    FaArrowLeft,
    FaShoppingBag,
    FaShieldAlt,
    FaCalendarAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaBullhorn,
    FaWhatsapp,
    FaEnvelope,
    FaPlus,
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
    FaYoutube,
    FaSnapchatGhost,
    FaTelegramPlane,
    FaDiscord,
    FaPinterest,
    FaRedditAlien,
    FaPaypal,
    FaCheck,
    FaSearch,
    FaEye,
    FaShoppingCart,
    FaTimes
} from "react-icons/fa";
import {
    SiNetflix,
    SiAmazon,
    SiSteam,
    SiGoogle,
    SiTiktok,
    SiTinder
} from "react-icons/si";
import {
    MdSimCard,
    MdVpnLock,
    MdMail,
    MdPhoneIphone,
    MdLocalOffer
} from "react-icons/md";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";
import { sendNotification } from "../Notification/Notification";
import { useAuthHook } from "../../hook/useAuthHook";

const StarIcon = FaStar as any;
const ShoppingCartIcon = FaShoppingCart as any;
const EyeIcon = FaEye as any;
const TimesIcon = FaTimes as any;
const SearchIcon = FaSearch as any;
const PlusIcon = FaPlus as any;
const CheckIcon = FaCheck as any;
const ArrowLeftIcon = FaArrowLeft as any;
const ShoppingBagIcon = FaShoppingBag as any;
const ShieldAltIcon = FaShieldAlt as any;
const CalendarAltIcon = FaCalendarAlt as any;
const CheckCircleIcon = FaCheckCircle as any;
const ExclamationTriangleIcon = FaExclamationTriangle as any;
const BullhornIcon = FaBullhorn as any;

const SUBICON_MAP: Record<string, any> = {
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
    Shopify: FaShoppingBag,
    "Virtual Cards": MdLocalOffer,
};

const ICON_COLOR_MAP = new Map<any, string>([
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
    [FaPaypal, "#003087"],
    [MdSimCard, "#00A3E0"],
    [MdVpnLock, "#0F172A"],
    [MdMail, "#D44638"],
    [SiTinder, "#FF6B6B"],
]);

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

const RenderIcon = ({
    icon,
    size = 20,
    realTime = false
}: {
    icon: any;
    size?: number;
    realTime?: boolean;
}) => {
    let bg = VIBRANT_GRADIENTS[0];
    const actualIcon = typeof icon === 'string' && SUBICON_MAP[icon] ? SUBICON_MAP[icon] : icon;

    if (typeof actualIcon !== "string") {
        const color = ICON_COLOR_MAP.get(actualIcon);
        if (color) bg = color;
        else
            bg = VIBRANT_GRADIENTS[Math.abs(hashCode(actualIcon?.toString() || "")) % VIBRANT_GRADIENTS.length];
    } else if (typeof actualIcon === 'string' && !actualIcon.startsWith("http")) {
        bg = VIBRANT_GRADIENTS[Math.abs(hashCode(actualIcon)) % VIBRANT_GRADIENTS.length];
    }

    if (typeof actualIcon === "string" && actualIcon.startsWith("http")) {
        return (
            <div style={{ width: size + 12, height: size + 12 }} className="rounded-xl overflow-hidden shadow-sm">
                <img src={actualIcon} alt="" className="w-full h-full object-cover" />
            </div>
        );
    }

    const IconComp = typeof actualIcon !== "string" ? (actualIcon as any) : null;

    return (
        <div
            style={{ width: size + 20, height: size + 20, background: bg }}
            className="rounded-xl flex items-center justify-center shadow-sm text-white font-bold relative"
        >
            {typeof actualIcon === "string" ? (
                <span className="text-xs">{actualIcon[0].toUpperCase()}</span>
            ) : (
                IconComp && <IconComp size={size} />
            )}
            {realTime && (
                <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
            )}
        </div>
    );
};

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3200";

interface SellerReputation {
    sellerEmail: string;
    sellerName: string;
    avgRating: number;
    totalReviews: number;
    reportsCount: number;
    disputesCount: number;
    cancelledOrders: number;
    completedOrders: number;
    completionRate: number;
    reputationScore: number;
    status: string;
    joinedAt: string;
    recentReviews: any[];
}

interface Product {
    id: string;
    title: string;
    desc?: string;
    price: number;
    seller: string;
    sellerEmail: string;
    delivery: string;
    icon: any;
    category: string;
    subcategory?: string;
    realTime?: boolean;
    previewLink?: string;
}

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

const ItemCard: React.FC<{
    item: Product;
    onAddToCart: (item: Product) => void;
    onView: (item: Product) => void;
    isAdded: boolean;
}> = ({
    item,
    onAddToCart,
    onView,
    isAdded,
}) => {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition p-2 flex items-center gap-3 h-full relative group">
                {/* Left: Icon */}
                <div className="flex-shrink-0">
                    <RenderIcon
                        icon={item.icon}
                        size={36}
                        realTime={item.realTime}
                    />
                </div>

                {/* Middle: Info */}
                <div className="flex-1 min-w-0 text-left">
                    <h3 className="font-bold text-sm text-[#0A1A3A] truncate w-full leading-tight" title={item.title}>
                        {item.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 leading-tight">
                        {item.desc || "Premium account • Instant delivery"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[9px] font-medium text-gray-400">
                        <span className="text-gray-500 truncate max-w-[80px]">{item.seller}</span>
                        <span>•</span>
                        <span className="text-green-600 font-bold bg-green-50 px-1 py-0.5 rounded-sm uppercase tracking-tighter">{item.delivery}</span>
                    </div>
                </div>

                {/* Right: Price & Actions */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="text-sm font-black text-[#0A1A3A]">
                        ${item.price.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onAddToCart(item)}
                            disabled={isAdded}
                            className={`w-7 h-7 rounded-md flex items-center justify-center transition border
                                ${isAdded
                                    ? "bg-green-100 text-green-600 border-green-200"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#0A1A3A]"
                                }`}
                            title={isAdded ? "In Cart" : "Add to Cart"}
                        >
                            {isAdded ? <CheckIcon size={10} /> : <ShoppingCartIcon size={12} />}
                        </button>
                        <button
                            onClick={() => onView(item)}
                            className="w-7 h-7 rounded-md flex items-center justify-center transition border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-[#0A1A3A] bg-white"
                            title="View Details"
                        >
                            <EyeIcon size={12} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

const ProductModal: React.FC<{
    item: Product;
    onClose: () => void;
    onBuy: (item: Product) => void;
    onAddToCart: (item: Product) => void;
    isAdded: boolean;
}> = ({ item, onClose, onBuy, onAddToCart, isAdded }) => {
    const [accepted, setAccepted] = useState(false);

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden max-h-[90vh] flex flex-col">
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
                    <h2 className="text-2xl font-bold text-center text-[#0A1A3A] mb-1 break-words max-w-sm mx-auto line-clamp-3" title={item.title}>
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
                                Category: <span className="font-medium text-blue-600">{item.category}</span>
                            </span>
                            <span>
                                Delivery: <span className="font-medium text-green-600">{item.delivery}</span>
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

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => onBuy(item)}
                            disabled={!accepted}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg
                  ${accepted
                                    ? "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            Buy Now
                        </button>
                        <button
                            onClick={() => onAddToCart(item)}
                            disabled={isAdded}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition
                  ${isAdded
                                    ? "bg-green-50 text-green-600 border-green-200"
                                    : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                                }`}
                        >
                            {isAdded ? <CheckIcon /> : <ShoppingCartIcon />}
                            {isAdded ? "In Cart" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const SellerStore: React.FC = () => {
    const { email: sellerEmail } = useParams<{ email: string }>();
    const [reputation, setReputation] = useState<SellerReputation | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<Product | null>(null);
    const [cartCount, setCartCount] = useState(0);
    const [cartItemIds, setCartItemIds] = useState<string[]>([]);
    const [processingIds, setProcessingIds] = useState<string[]>([]);

    const { user: authUser } = useAuth();
    const userEmail = authUser?.email;
    const navigate = useNavigate();
    const { refetch } = useAuthHook();

    useEffect(() => {
        const fetchData = async () => {
            if (!sellerEmail) return;
            setLoading(true);
            try {
                const [repRes, prodRes] = await Promise.all([
                    axios.get<{ success: boolean; data: SellerReputation }>(`${API_URL}/reputation/seller/${sellerEmail}`),
                    axios.get<{ success: boolean; products: any[] }>(`${API_URL}/product/user-products/${sellerEmail}`)
                ]);

                if (repRes.data.success) {
                    setReputation(repRes.data.data);
                }

                if (prodRes.data.success) {
                    const mappedDocs = prodRes.data.products
                        .filter((p: any) => p.status === "active" || p.status === "approved")
                        .map((p: any) => ({
                            id: p._id,
                            title: p.name,
                            desc: p.description,
                            price: Number(p.price) || 0,
                            seller: p.username || p.userEmail,
                            sellerEmail: p.userEmail,
                            delivery: p.deliveryType === 'manual' ? (p.deliveryTime || "Manual") : "Instant",
                            icon: p.categoryIcon || p.category || (p.subcategory ? p.subcategory : "Bullhorn"),
                            category: p.category || "General",
                            subcategory: p.subcategory || p.category,
                            realTime: true,
                            previewLink: p.previewLink
                        }));
                    setProducts(mappedDocs);
                }
            } catch (err) {
                console.error("Error fetching store data:", err);
                toast.error("Failed to load seller store");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sellerEmail]);

    useEffect(() => {
        const fetchCart = async () => {
            if (!userEmail) return;
            try {
                const res = await fetch(`${API_URL}/cart/get/${userEmail}`);
                const data = await res.json();
                if (data.cart) {
                    setCartCount(data.cart.length);
                    setCartItemIds(data.cart.map((c: any) => c.productId));
                }
            } catch (err) {
                console.error("Sync cart failed", err);
            }
        };
        fetchCart();
    }, [userEmail]);

    const handleAddToCart = async (item: Product) => {
        if (!userEmail) {
            toast.error("Please log in!");
            return;
        }

        if (processingIds.includes(item.id)) return;
        setProcessingIds((prev) => [...prev, item.id]);

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
                    UserEmail: userEmail,
                }),
            });

            if (res.ok) {
                setCartItemIds((prev) => [...prev, item.id]);
                setCartCount((prev) => prev + 1);
                toast.success("Added to cart!");
            }
        } catch (err) {
            toast.error("Failed to add to cart");
        } finally {
            setProcessingIds((prev) => prev.filter((id) => id !== item.id));
        }
    };

    const handleBuy = async (item: Product) => {
        if (!userEmail) {
            toast.error("Please log in!");
            return;
        }

        if (processingIds.includes(item.id)) return;
        setProcessingIds((prev) => [...prev, item.id]);

        try {
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
                        UserEmail: userEmail,
                    }),
                });
                setCartItemIds((prev) => [...prev, item.id]);
                setCartCount((prev) => prev + 1);
            }

            const res = await fetch(`${API_URL}/purchase/post`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail }),
            });

            const result = await res.json();

            if (result.success) {
                try {
                    await sendNotification({
                        type: "buy",
                        title: "Purchase Successful!",
                        message: `You bought ${item.title} for $${item.price.toFixed(2)}.`,
                        data: { totalAmount: item.price, itemCount: 1 },
                        userEmail: userEmail,
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "verified": return "text-green-500 bg-green-50 border-green-100";
            case "warning": return "text-orange-500 bg-orange-50 border-orange-100";
            case "at_risk": return "text-red-500 bg-red-50 border-red-100";
            default: return "text-blue-500 bg-blue-50 border-blue-100";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!reputation) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <ExclamationTriangleIcon size={48} className="text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-800">Seller Not Found</h2>
                <Link to="/marketplace" className="mt-4 text-primary font-semibold hover:underline flex items-center gap-2">
                    <ArrowLeftIcon /> Back to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Cover */}
            <div className="bg-gradient-to-r from-[#0A1A3A] to-[#1a2f5a] text-white pt-24 pb-12 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <Link to="/marketplace" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition mb-8 group">
                        <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-4xl font-bold shadow-xl">
                            {reputation.sellerName[0].toUpperCase()}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{reputation.sellerName}</h1>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(reputation.status)}`}>
                                    {reputation.status === 'verified' && <CheckCircleIcon size={12} />}
                                    {reputation.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm mt-4 justify-center md:justify-start">
                                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                    <StarIcon className="text-yellow-400" />
                                    <span className="font-bold text-white">{reputation.avgRating}</span>
                                    <span className="opacity-60">({reputation.totalReviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                    <ShieldAltIcon className="text-blue-400" />
                                    <span className="font-bold text-white">{reputation.reputationScore}%</span>
                                    <span className="opacity-60">Reputation</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                    <CalendarAltIcon className="text-purple-400" />
                                    <span className="opacity-60">Joined: {new Date(reputation.joinedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <ShieldAltIcon className="text-primary" /> Store Stats
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Completion Rate</span>
                                    <span className="font-bold text-green-600">{reputation.completionRate}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${reputation.completionRate}%` }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                        <div className="text-xs text-gray-500 mb-1 leading-tight">Successful Sales</div>
                                        <div className="font-black text-gray-800">{reputation.completedOrders}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                        <div className="text-xs text-gray-500 mb-1 leading-tight">Returns / Lost</div>
                                        <div className="font-black text-red-500">{reputation.disputesCount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Verification Level</h3>
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${getStatusColor(reputation.status)}`}>
                                    <ShieldAltIcon size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800 capitalize leading-none mb-1">{reputation.status}</div>
                                    <p className="text-[10px] text-gray-400 leading-tight">
                                        {reputation.status === 'verified'
                                            ? 'Highest trust level. Consistent performance.'
                                            : 'Active seller meeting standard requirements.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Listings */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingBagIcon className="text-primary" /> Active Listings ({products.length})
                            </h2>
                            {cartCount > 0 && (
                                <Link to="/cart" className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                                    <div className="relative">
                                        <ShoppingCartIcon size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                            {cartCount}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-600">Checkout</span>
                                </Link>
                            )}
                        </div>

                        {products.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                                <ShoppingBagIcon size={48} className="text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">This seller has no active listings at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {products.map((item) => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        onAddToCart={handleAddToCart}
                                        onView={setSelectedItem}
                                        isAdded={cartItemIds.includes(item.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedItem && (
                <ProductModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onBuy={handleBuy}
                    onAddToCart={handleAddToCart}
                    isAdded={cartItemIds.includes(selectedItem.id)}
                />
            )}
        </div>
    );
};

export default SellerStore;
