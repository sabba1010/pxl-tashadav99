import React, { useState } from "react";
import {
  Store,
  Wallet,
  CheckCircle2,
  X,
  Lock,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Alerts এর জন্য

// Hooks
import { useAuth } from "../../context/AuthContext"; 
import { useAuthHook } from "../../hook/useAuthHook"; 
import { sendNotification } from "../../components/Notification/Notification";

// Components
import Loading from "../../components/Loading"; // ✅ আপনার কাস্টম লোডিং কম্পোনেন্ট

const API_URL = "https://vps-backend-server-beta.vercel.app";

const SellerPay = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auth & Context
  const authContext = useAuth() as any;
  const user = authContext.user;
  const logoutFunc = authContext.logOut || authContext.logout || authContext.signOut;

  const { refetch } = useAuthHook();
  const navigate = useNavigate();

  // Balance Logic
  const authHookData = useAuthHook();
  const currentBalance = authHookData?.data?.balance 
    ? Number(authHookData.data.balance) 
    : user?.balance ? Number(user.balance) : 0;
  
  const userEmail = user?.email;
  const activationFee = 15;

  // --- SAFE LOGOUT ---
  const handleSafeLogout = () => {
    if (logoutFunc) logoutFunc();
    else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.clear();
    }
    navigate("/login");
  };

  // --- DIRECT PAYMENT LOGIC ---
  const handleWalletPayment = async () => {
    // 1. User Check
    if (!userEmail) {
      Swal.fire({
        icon: "error",
        title: "User not found",
        text: "Please login again.",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    // 2. Balance Check
    if (currentBalance < activationFee) {
      Swal.fire({
        icon: "error",
        title: "Insufficient Funds",
        text: `You need $${activationFee.toFixed(2)} but have $${currentBalance.toFixed(2)}`,
        confirmButtonColor: "#d33",
      });
      return;
    }

    // 3. START LOADING (Custom Component)
    setLoading(true); // ✅ এটি true হলে নিচে Loading কম্পোনেন্ট রেন্ডার হবে

    try {
      // API Call
      const res = await fetch(`${API_URL}/api/user/become-seller`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          amount: activationFee,
        }),
      });

      const result = await res.json();

      if (result.success) {
        // Notification
        try {
          await sendNotification({
            type: "system",
            title: "Seller Upgrade Successful",
            message: `Paid $${activationFee}. Re-login required.`,
            userEmail: userEmail,
            data: { amount: activationFee }
          } as any);
        } catch (e) { console.error(e); }

        setIsPaymentModalOpen(false);

        // Success Alert
        await Swal.fire({
          icon: 'success',
          title: 'Upgrade Successful!',
          html: `
            <p>You are now a Seller!</p>
            <p style="color: orange; font-weight: bold; margin-top: 10px;">Logging out to apply changes...</p>
          `,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          willClose: () => {
             handleSafeLogout();
          }
        });

      } else {
        // Error from Backend
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: result.message || "Activation Failed",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Could not connect to the server.",
      });
    } finally {
      setLoading(false); // ✅ লোডিং শেষ
    }
  };

  // ✅ যদি লোডিং ট্রু হয়, তাহলে পুরো স্ক্রিনে লোডিং দেখাবে
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#F7F5F4] font-sans text-gray-800 p-4 md:p-8 relative flex items-center justify-center">
      
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-[#0A1A3A]">
            Activate Seller Account
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Start your selling journey by unlocking merchant features.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-12 flex flex-col items-center w-full max-w-4xl mx-auto">
          
          <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Store size={28} className="md:w-8 md:h-8" />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[#0A1A3A] mb-3 text-center">
            Merchant Activation Fee
          </h2>
          <p className="text-gray-500 text-center max-w-lg mb-8 text-sm md:text-base leading-relaxed">
            One-time payment to verify your identity and enable listing capabilities on the marketplace.
          </p>

          {/* Fee Display */}
          <div className="w-full max-w-sm bg-orange-50 border border-orange-200 rounded-2xl p-5 flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-orange-600 shrink-0" size={22} />
              <div>
                <p className="font-bold text-[#0A1A3A] text-sm md:text-base">Seller Access</p>
                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">Lifetime Validity</p>
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-black text-orange-600">${activationFee}</span>
          </div>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full max-w-sm bg-[#0A1A3A] hover:bg-[#1a2e4d] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 text-sm md:text-base"
          >
            Pay Activation Fee
          </button>
        </div>
      </div>

      {/* ================= PAYMENT MODAL ================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="bg-[#0A1A3A] p-5 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Lock size={18} className="text-orange-500" /> Secure Checkout
              </h3>
              <button 
                onClick={() => setIsPaymentModalOpen(false)} 
                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 pb-10 md:pb-6">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Total To Pay</p>
                <h2 className="text-4xl font-black text-[#0A1A3A] mb-3">
                  ${activationFee.toFixed(2)}
                </h2>
                
                {/* Balance Indicator */}
                <div className="flex items-center justify-center gap-2">
                   <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                      currentBalance >= activationFee 
                      ? "bg-green-50 text-green-700 border-green-100" 
                      : "bg-red-50 text-red-600 border-red-100"
                    }`}>
                      <Wallet size={12} />
                      Balance: ${currentBalance.toFixed(2)}
                   </div>
                   <button 
                      onClick={() => refetch()} 
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition active:rotate-180"
                      title="Refresh Balance"
                   >
                      <RefreshCw size={14} />
                   </button>
                </div>
              </div>

              {/* Pay with Balance Button */}
              <div className="space-y-3">
                <button
                  onClick={handleWalletPayment}
                  disabled={loading || currentBalance < activationFee}
                  className={`w-full relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border-2 transition-all group active:scale-[0.98] ${
                    currentBalance >= activationFee
                      ? "border-[#0A1A3A] bg-white hover:bg-gray-50 cursor-pointer shadow-md"
                      : "border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      currentBalance >= activationFee ? "bg-[#0A1A3A] text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                      <Wallet size={20} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-[#0A1A3A] text-sm">Pay with Balance</h4>
                      {currentBalance < activationFee ? (
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wide">INSUFFICIENT FUNDS</span>
                      ) : (
                        <span className="text-[10px] text-green-600 font-bold uppercase tracking-wide">FUNDS AVAILABLE • TAP TO PAY</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Button Icon Indicator */}
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      currentBalance >= activationFee ? 'border-[#0A1A3A]' : 'border-gray-300'
                    }`}>
                         {currentBalance >= activationFee && <div className="w-3 h-3 bg-[#0A1A3A] rounded-full"></div>}
                    </div>
                </button>
              </div>
              
              <p className="text-center text-[10px] text-gray-400">
                Secure transaction processed by Payment Gateway
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPay;