import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaArrowLeft,
  FaShoppingCart,
  FaShieldAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { useAuthHook } from "../../hook/useAuthHook";
// Notification Import
import { sendNotification } from "../../components/Notification/Notification";

// TS2786 FIX
const ArrowLeftIcon = FaArrowLeft as React.ElementType;
const ShoppingCartIcon = FaShoppingCart as React.ElementType;
const TrashIcon = FaTrash as React.ElementType;
const ShieldIcon = FaShieldAlt as React.ElementType;

interface CartItem {
  _id: string;
  name: string;
  price: number;
  sellerEmail: string; // লজিকের জন্য থাকছে, কিন্তু ডিসপ্লে হবে না
  UserEmail: string;
}

const API_URL = "https://vps-backend-server-beta.vercel.app";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refetch } = useAuthHook();

  // Fetch cart items from backend
  const fetchCartData = async () => {
    if (!user?.email) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/cart/getall?email=${user.email}`);
      const data: CartItem[] = await res.json();

      // Optional: Frontend filter if backend doesn't filter
      const userCartItems = data.filter(
        (item) => item.UserEmail === user.email
      );
      setCartItems(userCartItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [user?.email]);

  // Delete item from cart
  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this item?")) return;

    try {
      const response = await fetch(`${API_URL}/cart/delete/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setCartItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0),
    0
  );

  // Handle Purchase with Notification
  const handlePurchase = async () => {
    if (!user?.email || cartItems.length === 0) return;

    try {
      const res = await fetch(`${API_URL}/purchase/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const result = await res.json();

      if (result.success) {
        // --- SEND NOTIFICATION START ---
        try {
          await sendNotification({
            type: "buy",
            title: "Cart Checkout Successful",
            message: `You successfully purchased ${cartItems.length} items for $${total.toFixed(2)}.`,
            data: {
              totalAmount: total,
              itemCount: cartItems.length,
            },
            userEmail: user.email, // Send notification to current user
          } as any);
        } catch (notifErr) {
          console.error("Failed to send notification", notifErr);
        }
        // --- SEND NOTIFICATION END ---

        toast.success(
          `Success! $${result.totalDeducted} deducted. Status: ${result.purchaseStatus}`
        );
        setCartItems([]); // clear cart

        // Refetch user balance and redirect
        refetch();
        navigate("/purchases");
      } else {
        if (result.message.includes("Insufficient")) {
          toast.error(
            `Insufficient balance! You need $${result.required}, you have $${result.available}`
          );
        } else {
          toast.error("Purchase failed: " + result.message);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A017]"></div>
        <p className="mt-4 text-[#0A1D37] font-medium tracking-widest">
          LOADING CART...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FBFC] text-[#0A1D37]">
      {/* Responsive Container: Reduced padding on mobile (px-4 py-6) */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-12">
        
        {/* Breadcrumb & Title */}
        <div className="mb-6 md:mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4A017] transition-all mb-4 group"
          >
            <ArrowLeftIcon
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
              Back to Marketplace
            </span>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              My <span className="text-[#D4A017]">Cart</span>.
            </h1>
            <span className="self-start sm:self-auto text-xs md:text-sm font-bold bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-gray-100">
              {cartItems.length} Items Selected
            </span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty State Responsive
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-10 md:p-20 text-center shadow-xl shadow-gray-100 border border-gray-50">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
              <ShoppingCartIcon size={32} className="md:w-10 md:h-10" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-sm md:text-base text-gray-400 mb-8">
              Add items to your cart to see them here.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#0A1D37] text-white px-8 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-[#D4A017] transition-all shadow-lg shadow-blue-100 text-sm md:text-base"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            {/* Item List */}
            <div className="lg:col-span-8 space-y-4 md:space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  // Mobile: flex-col, Desktop: flex-row
                  className="group bg-white p-4 md:p-6 rounded-[20px] md:rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6"
                >
                  {/* Image & Title Wrapper for better mobile alignment */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-gradient-to-br from-[#0A1D37] to-[#1a3a63] rounded-xl md:rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg">
                      {item.name[0]}
                    </div>
                    
                    {/* Mobile Title logic */}
                    <div className="flex-1 sm:hidden">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-[#D4A017] transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        {/* UPDATE: ইমেইল হাইড করা হয়েছে */}
                        <p className="text-[10px] text-gray-400 font-medium truncate">
                          Verified Seller
                        </p>
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <div className="hidden sm:flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded">
                        Instant Delivery
                      </span>
                    </div>
                    <h3 className="hidden sm:block font-bold text-lg md:text-xl group-hover:text-[#D4A017] transition-colors">
                      {item.name}
                    </h3>
                    {/* UPDATE: ইমেইল হাইড করা হয়েছে */}
                    <p className="hidden sm:block text-xs text-gray-400 font-medium">
                      Verified Seller
                    </p>
                  </div>

                  {/* Price & Action Section: Row on Mobile, Column on Desktop */}
                  <div className="w-full sm:w-auto flex flex-row justify-between sm:flex-col sm:items-end gap-2 md:gap-3 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                    <div className="sm:text-right">
                        <span className="block sm:hidden text-[10px] text-gray-400 uppercase font-bold">Price</span>
                        <p className="text-xl md:text-2xl font-black text-[#0A1D37]">
                          ${Number(item.price).toFixed(2)}
                        </p>
                    </div>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1.5 text-red-400 hover:text-red-600 font-bold text-xs uppercase tracking-tighter"
                    >
                      <TrashIcon size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-[#0A1D37] p-6 md:p-8 rounded-[24px] md:rounded-[32px] text-white shadow-2xl shadow-blue-900/20 sticky top-4 md:top-10">
                <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-2">
                  Checkout <span className="text-[#D4A017]">Details</span>
                </h2>

                <div className="space-y-4 md:space-y-5 mb-8 md:mb-10">
                  <div className="flex justify-between text-gray-400 text-xs md:text-sm">
                    <span>Subtotal Amount</span>
                    <span className="text-white font-bold font-mono">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-xs md:text-sm">
                    <span>Processing Fee</span>
                    <span className="text-[#D4A017] font-bold">FREE</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="font-bold text-sm md:text-base">Total Cost</span>
                    <span className="text-3xl md:text-4xl font-black text-[#D4A017]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl mb-6 md:mb-8 border border-white/10">
                  <ShieldIcon className="text-[#D4A017] mt-1 flex-shrink-0" />
                  <p className="text-[10px] md:text-[11px] text-gray-400 leading-relaxed">
                    Your transaction is secured with 256-bit encryption and
                    instant delivery guarantee.
                  </p>
                </div>

                <button
                  onClick={handlePurchase}
                  className="w-full bg-[#D4A017] text-[#0A1D37] py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-lg hover:shadow-[#D4A017]/40 transition-all hover:scale-[1.02] active:scale-95"
                >
                  PURCHASE NOW
                </button>

                <p className="text-center text-[10px] text-gray-500 mt-6 uppercase tracking-[2px] font-bold">
                  Secure Checkout System
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;