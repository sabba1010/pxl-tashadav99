import React, { useEffect, useState } from "react";
import { FaTrash, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

// --- TS2786 FIX FOR REACT 18 ---
// আইকনগুলোকে ElementType হিসেবে কাস্ট করা হয়েছে যাতে TypeScript এরর না দেয়
const ArrowLeftIcon = FaArrowLeft as React.ElementType;
const ShoppingCartIcon = FaShoppingCart as React.ElementType;
const TrashIcon = FaTrash as React.ElementType;

// --- Interfaces ---
interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  sellerEmail: string;
  image?: any;
}

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3200";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // লোকাল স্টোরেজ থেকে ইউজারের ইমেইল নেওয়া (এটি Marketplace এ ডেটা পাঠানোর সময় ব্যবহার করা হয়েছিল)
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";

  // ডেটা লোড করার ফাংশন
  const fetchCartData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/cart/getall`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      // শুধুমাত্র এই ইউজারের অ্যাড করা আইটেমগুলো ফিল্টার করা
      const filtered = data.filter((item: CartItem) => item.sellerEmail === userEmail);
      setCartItems(filtered);
    } catch (err) {
      console.error("Cart Loading Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [userEmail]);

  // আইটেম রিমুভ করার ফাংশন (Optional but useful)
  const removeItem = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
        // নোট: ব্যাকএন্ডে ডিলিট রাউট না থাকলে এটি শুধুমাত্র লোকাল স্ট্যাট থেকে রিমুভ করবে
        setCartItems(prev => prev.filter(item => item._id !== id));
        alert("Item removed from view.");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#33ac6f]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F4] pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#33ac6f] transition mb-2">
              <ArrowLeftIcon size={14} /> <span>Back to Marketplace</span>
            </Link>
            <h1 className="text-3xl font-bold text-[#0A1A3A] flex items-center gap-3">
              <ShoppingCartIcon className="text-[#33ac6f]" /> My Shopping Cart
            </h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border text-sm font-medium text-gray-600">
            User: {userEmail}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-16 text-center">
            <div className="flex justify-center mb-6 text-gray-200">
              <ShoppingCartIcon size={80} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any premium accounts yet.</p>
            <Link to="/" className="bg-[#33ac6f] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#28965e] transition shadow-lg">
              Go Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4 hover:shadow-md transition">
                  <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center text-[#33ac6f] font-bold text-xl">
                    {item.name ? item.name[0].toUpperCase() : "A"}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0A1A3A] truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400">Seller: {item.sellerEmail}</p>
                    <div className="mt-1 font-bold text-[#33ac6f] md:hidden">
                      ${Number(item.price).toFixed(2)}
                    </div>
                  </div>

                  <div className="hidden md:block text-right">
                    <div className="font-bold text-lg text-[#0A1A3A]">${Number(item.price).toFixed(2)}</div>
                    <div className="text-[10px] text-green-500 font-bold uppercase">Instant Delivery</div>
                  </div>

                  <button 
                    onClick={() => removeItem(item._id)}
                    className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
                    title="Remove Item"
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-[#0A1A3A] mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({cartItems.length})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Processing Fee</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-2xl font-extrabold text-[#33ac6f]">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-[#33ac6f] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-[#28965e] transition transform active:scale-95">
                  Secure Checkout
                </button>
                
                <p className="text-[10px] text-center text-gray-400 mt-4">
                  By proceeding, you agree to our Terms of Service and Refund Policy.
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