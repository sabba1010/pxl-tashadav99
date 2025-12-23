import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaArrowLeft,
  FaShoppingCart,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { useAuthHook } from "../../hook/useAuthHook";
import { sendNotification } from "../../components/Notification/Notification";

// TS2786 FIX
const ArrowLeftIcon = FaArrowLeft as React.ElementType;
const ShoppingCartIcon = FaShoppingCart as React.ElementType;
const TrashIcon = FaTrash as React.ElementType;
const ShieldIcon = FaShieldAlt as React.ElementType;
const CheckCircleIcon = FaCheckCircle as React.ElementType;

interface CartItem {
  _id: string;
  name: string;
  price: number;
  sellerEmail: string;
  UserEmail: string;
}

const API_URL = "http://localhost:3200";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refetch } = useAuthHook();

  const fetchCartData = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart/getall?email=${user.email}`);
      const data: CartItem[] = await res.json();
      const userCartItems = data.filter((item) => item.UserEmail === user.email);
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

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Remove this item?")) return;
    try {
      const response = await fetch(`${API_URL}/cart/delete/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setCartItems((prev) => prev.filter((item) => item._id !== id));
        setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const itemsToCheckout = cartItems.filter((item) =>
    selectedItems.includes(item._id)
  );

  const total = itemsToCheckout.reduce(
    (acc, item) => acc + (Number(item.price) || 0),
    0
  );

  const handlePurchase = async () => {
    if (!user?.email || itemsToCheckout.length === 0) {
      toast.error("Please select at least one item to purchase.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/purchase/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, itemIds: selectedItems }),
      });
      const result = await res.json();
      if (result.success) {
        try {
            await sendNotification({
                type: "buy",
                title: "Cart Checkout Successful",
                message: `You successfully purchased ${itemsToCheckout.length} items for $${total.toFixed(2)}.`,
                data: { totalAmount: total, itemCount: itemsToCheckout.length },
                userEmail: user.email,
            } as any);
        } catch (notifErr) { console.error(notifErr); }

        toast.success(`Success! $${result.totalDeducted} deducted.`);
        setCartItems((prev) => prev.filter((item) => !selectedItems.includes(item._id)));
        setSelectedItems([]);
        refetch();
        navigate("/purchases");
      } else {
        if (result.message.includes("Insufficient")) {
          toast.error(`Insufficient balance! Need $${result.required}, have $${result.available}`);
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
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-[#D4A017]"></div>
        <p className="mt-4 text-[#0A1D37] text-sm md:text-base font-medium tracking-widest">
          LOADING CART...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FBFC] text-[#0A1D37]">
      {/* Container: Responsive Padding */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-12">
        
        {/* Header Section */}
        <div className="mb-6 lg:mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4A017] transition-all mb-4 group"
          >
            <ArrowLeftIcon size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs lg:text-sm font-semibold uppercase tracking-wider">
              Back to Marketplace
            </span>
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
              My <span className="text-[#D4A017]">Cart</span>.
            </h1>
            <span className="self-start lg:self-auto text-xs lg:text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              {cartItems.length} Items Total
            </span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[24px] lg:rounded-[32px] p-10 lg:p-20 text-center shadow-xl shadow-gray-100 border border-gray-50">
            <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
              <ShoppingCartIcon className="text-2xl lg:text-4xl" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-sm lg:text-base text-gray-400 mb-8">
              Add items to your cart to see them here.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#0A1D37] text-white px-8 py-3 lg:px-10 lg:py-4 rounded-xl lg:rounded-2xl font-bold hover:bg-[#D4A017] transition-all shadow-lg shadow-blue-100 text-sm lg:text-base"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            
            {/* ITEM LIST */}
            <div className="lg:col-span-8 space-y-4 lg:space-y-6">
              {cartItems.map((item) => {
                const isSelected = selectedItems.includes(item._id);
                return (
                  <div
                    key={item._id}
                    onClick={() => toggleSelection(item._id)}
                    /* LAYOUT LOGIC:
                       Mobile: flex-col (Stack elements)
                       Desktop (sm+): flex-row (Side by side like original)
                    */
                    className={`group bg-white p-4 lg:p-6 rounded-[20px] lg:rounded-[24px] border shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 cursor-pointer relative overflow-hidden
                    ${
                      isSelected
                        ? "border-[#D4A017] ring-1 ring-[#D4A017] bg-yellow-50/10"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {/* Check Icon */}
                    <div className={`absolute top-3 right-3 lg:top-4 lg:right-4 text-xl transition-all ${isSelected ? "text-[#D4A017] scale-100" : "text-gray-200 scale-90 opacity-0 group-hover:opacity-100"}`}>
                        <CheckCircleIcon />
                    </div>

                    {/* Image Area */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#0A1D37] to-[#1a3a63] rounded-xl lg:rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl font-bold shadow-lg shrink-0">
                        {item.name[0]}
                        </div>
                        
                        {/* Mobile Details (Only visible on very small screens if stacked) */}
                        <div className="flex-1 sm:hidden">
                            <h3 className="font-bold text-lg leading-tight group-hover:text-[#D4A017] transition-colors mb-1">
                                {item.name}
                            </h3>
                            {isSelected && (
                                <span className="inline-block px-2 py-0.5 bg-[#D4A017] text-white text-[9px] font-bold uppercase rounded mb-1">
                                Selected
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Desktop Details (Matches Original) */}
                    <div className="hidden sm:block flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded">
                          Instant
                        </span>
                        {isSelected && (
                            <span className="px-2 py-0.5 bg-[#D4A017] text-white text-[10px] font-bold uppercase rounded">
                            Selected
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg lg:text-xl group-hover:text-[#D4A017] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium">
                        Verified Seller: {item.sellerEmail}
                      </p>
                    </div>

                    {/* PRICE & ACTION LOGIC:
                       Mobile: Row (Price Left, Delete Right) with top border
                       Desktop (sm+): Column (Price Top, Delete Bottom Right) - ORIGINAL STYLE
                    */}
                    <div className="w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                      <p className="text-xl lg:text-2xl font-black text-[#0A1D37]">
                        ${Number(item.price).toFixed(2)}
                      </p>
                      <button
                        onClick={(e) => handleDelete(e, item._id)}
                        className="flex items-center gap-1.5 text-red-400 hover:text-red-600 font-bold text-[11px] lg:text-xs uppercase tracking-tighter bg-red-50 sm:bg-transparent px-3 py-1.5 sm:px-0 sm:py-0 rounded-full sm:rounded-none"
                      >
                        <TrashIcon size={12} className="lg:w-[14px] lg:h-[14px]" /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CHECKOUT SIDEBAR */}
            <div className="lg:col-span-4">
              <div className="bg-[#0A1D37] p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] text-white shadow-2xl shadow-blue-900/20 lg:sticky lg:top-10">
                <h2 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8 flex items-center gap-2">
                  Checkout <span className="text-[#D4A017]">Details</span>
                </h2>

                <div className="space-y-4 lg:space-y-5 mb-8 lg:mb-10">
                  <div className="flex justify-between text-gray-400 text-xs lg:text-sm">
                    <span>Selected Items</span>
                    <span className="text-white font-bold">
                      {itemsToCheckout.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-xs lg:text-sm">
                    <span>Subtotal Amount</span>
                    <span className="text-white font-bold font-mono">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-xs lg:text-sm">
                    <span>Processing Fee</span>
                    <span className="text-[#D4A017] font-bold">FREE</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="font-bold text-sm lg:text-base">Total Cost</span>
                    <span className="text-3xl lg:text-4xl font-black text-[#D4A017]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl mb-6 lg:mb-8 border border-white/10">
                  <ShieldIcon className="text-[#D4A017] mt-1 shrink-0" />
                  <p className="text-[10px] lg:text-[11px] text-gray-400 leading-relaxed">
                    Transaction secured with 256-bit encryption.
                  </p>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={itemsToCheckout.length === 0}
                  className={`w-full py-4 lg:py-5 rounded-xl lg:rounded-2xl font-black text-base lg:text-lg shadow-lg transition-all 
                  ${
                    itemsToCheckout.length === 0
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-[#D4A017] text-[#0A1D37] hover:shadow-[#D4A017]/40 hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  {itemsToCheckout.length === 0
                    ? "SELECT ITEMS"
                    : "PURCHASE NOW"}
                </button>
                
                <p className="text-center text-[9px] lg:text-[10px] text-gray-500 mt-6 uppercase tracking-[2px] font-bold">
                  Secure Checkout
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