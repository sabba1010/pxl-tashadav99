import React, { useEffect, useState } from "react";
import { FaTrash, FaArrowLeft, FaShoppingCart, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

// TS2786 FIX
const ArrowLeftIcon = FaArrowLeft as React.ElementType;
const ShoppingCartIcon = FaShoppingCart as React.ElementType;
const TrashIcon = FaTrash as React.ElementType;
const ShieldIcon = FaShieldAlt as React.ElementType;

interface CartItem {
  _id: string;
  name: string;
  price: number;
  sellerEmail: string;
}

const API_URL = "http://localhost:3200";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartData = async () => {
    try {
      const res = await fetch(`${API_URL}/cart/getall`);
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this item?")) {
      try {
        const response = await fetch(`${API_URL}/cart/delete/${id}`, { method: "DELETE" });
        const result = await response.json();
        if (result.success) {
          setCartItems((prev) => prev.filter((item) => item._id !== id));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const total = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#F8F9FA]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A017]"></div>
      <p className="mt-4 text-[#0A1D37] font-medium tracking-widest">LOADING CART...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FBFC] text-[#0A1D37]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Modern Breadcrumb & Title */}
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4A017] transition-all mb-4 group">
            <ArrowLeftIcon size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-sm font-semibold uppercase tracking-wider">Back to Marketplace</span>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black tracking-tight">
              My <span className="text-[#D4A017]">Cart</span>.
            </h1>
            <span className="text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              {cartItems.length} Items Selected
            </span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[32px] p-20 text-center shadow-xl shadow-gray-100 border border-gray-50">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                <ShoppingCartIcon size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add items to your cart to see them here.</p>
            <Link to="/" className="bg-[#0A1D37] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#D4A017] transition-all shadow-lg shadow-blue-100">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Elegant Item List */}
            <div className="lg:col-span-8 space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="group bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all flex items-center gap-6">
                  {/* Item Icon with Gradient */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#0A1D37] to-[#1a3a63] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {item.name[0]}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded">Instant Delivery</span>
                    </div>
                    <h3 className="font-bold text-xl group-hover:text-[#D4A017] transition-colors">{item.name}</h3>
                    <p className="text-xs text-gray-400 font-medium">Verified Seller: {item.sellerEmail}</p>
                  </div>

                  <div className="text-right flex flex-col items-end gap-3">
                    <p className="text-2xl font-black text-[#0A1D37]">${Number(item.price).toFixed(2)}</p>
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

            {/* Premium Checkout Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-[#0A1D37] p-8 rounded-[32px] text-white shadow-2xl shadow-blue-900/20 sticky top-10">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    Checkout <span className="text-[#D4A017]">Details</span>
                </h2>
                
                <div className="space-y-5 mb-10">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Subtotal Amount</span>
                    <span className="text-white font-bold font-mono">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Processing Fee</span>
                    <span className="text-[#D4A017] font-bold">FREE</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="font-bold">Total Cost</span>
                    <span className="text-4xl font-black text-[#D4A017]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl mb-8 border border-white/10">
                    <ShieldIcon className="text-[#D4A017] mt-1" />
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                        Your transaction is secured with 256-bit encryption and instant delivery guarantee.
                    </p>
                </div>

                <button className="w-full bg-[#D4A017] text-[#0A1D37] py-5 rounded-2xl font-black text-lg shadow-lg hover:shadow-[#D4A017]/40 transition-all hover:scale-[1.02] active:scale-95">
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