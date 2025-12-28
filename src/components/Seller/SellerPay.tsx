import React, { useState } from "react";
import {
  Store,
  Wallet,
  CheckCircle2,
  X,
  Lock,
  RefreshCw,
  ShieldCheck,
  LogOut,
  AlertTriangle,
  CreditCard
} from "lucide-react";
import { toast } from "sonner"; // Toast Library
import { useNavigate } from "react-router-dom";

// Hooks
import { useAuth } from "../../context/AuthContext"; 
import { useAuthHook } from "../../hook/useAuthHook"; 
import { sendNotification } from "../../components/Notification/Notification";

const API_URL = "http://localhost:3200";

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

  // --- PAYMENT LOGIC ---
  const handleWalletPayment = () => {
    // 1. User Check
    if (!userEmail) {
      toast.error("User not found! Please login again.");
      return;
    }

    // 2. Insufficient Funds Alert (Toast)
    if (currentBalance < activationFee) {
      toast.custom((t) => (
        <div className="bg-white border-l-4 border-red-500 shadow-xl rounded-lg p-4 flex items-start gap-3 w-full max-w-[350px] mx-auto animate-in slide-in-from-top-5 duration-300">
           <div className="text-red-500 bg-red-50 p-2 rounded-full shrink-0">
             <AlertTriangle size={20} />
           </div>
           <div className="flex-1 min-w-0">
             <h3 className="font-bold text-gray-900 text-sm">Insufficient Funds</h3>
             <p className="text-xs text-gray-500 mt-1 leading-relaxed">
               Required: <span className="font-bold text-gray-800">${activationFee.toFixed(2)}</span>
               <br />
               Available: <span className="font-bold text-red-500">${currentBalance.toFixed(2)}</span>
             </p>
           </div>
           <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-gray-600 p-1"><X size={16} /></button>
        </div>
      ), { duration: 4000, position: 'top-center' }); // Mobile friendly position
      return;
    }

    // 3. Confirmation Toast (Mobile Friendly Action Sheet Style)
    toast.custom((t) => (
      <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 w-full max-w-[350px] mx-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-[#0A1A3A] text-white p-2 rounded-full shrink-0">
            <CreditCard size={18} />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Confirm Payment?</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          You are about to pay <span className="font-bold text-[#0A1A3A]">${activationFee}</span> to activate your Seller account.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => toast.dismiss(t)}
            className="py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition active:scale-95"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              toast.dismiss(t);
              processPayment();
            }}
            className="py-2.5 text-xs font-bold text-white bg-[#0A1A3A] hover:bg-[#1a2e4d] rounded-xl shadow-md transition active:scale-95"
          >
            Confirm Pay
          </button>
        </div>
      </div>
    ), { duration: 10000, position: 'top-center' });
  };

  // --- API CALL ---
  const processPayment = async () => {
    setLoading(true);
    const toastId = toast.loading("Processing payment...", { position: 'top-center' });

    try {
      const res = await fetch(`${API_URL}/api/user/become-seller`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          amount: activationFee,
        }),
      });

      const result = await res.json();
      toast.dismiss(toastId);

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

        // Success Alert
        toast.custom((t) => (
          <div className="bg-white w-full max-w-[350px] mx-auto rounded-2xl shadow-2xl border border-green-100 p-4 flex items-start gap-3 relative overflow-hidden animate-in fade-in zoom-in-95">
             <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -z-10" />
             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0 text-green-600 shadow-sm">
               <ShieldCheck size={20} strokeWidth={2.5} />
             </div>
             <div className="flex-1 min-w-0">
               <h3 className="text-sm font-bold text-gray-900">Upgrade Successful!</h3>
               <p className="text-xs text-gray-500 mt-1">
                 You are now a Seller. <span className="text-orange-600 font-bold block mt-1">Logging out...</span>
               </p>
             </div>
             <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-gray-600 p-1"><X size={16} /></button>
          </div>
        ), { duration: 3000, position: 'top-center' });

        setIsPaymentModalOpen(false);
        
        // Logout & Redirect
        setTimeout(() => {
            handleSafeLogout();
        }, 2000);

      } else {
        toast.error(result.message || "Activation Failed", { position: 'top-center' });
      }
    } catch (err) {
      toast.dismiss(toastId);
      console.error(err);
      toast.error("Connection Error. Check Backend.", { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F4] font-sans text-gray-800 p-4 md:p-8 relative flex items-center justify-center">
      
      <div className="w-full max-w-6xl mx-auto">
        {/* Header - Mobile Responsive */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-[#0A1A3A]">
            Activate Seller Account
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Start your selling journey by unlocking merchant features.
          </p>
        </div>

        {/* Main Card - Mobile Responsive */}
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

      {/* ================= PAYMENT MODAL (Mobile Optimized) ================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Modal Container */}
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
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wide">Insufficient funds</span>
                      ) : (
                        <span className="text-[10px] text-green-600 font-bold uppercase tracking-wide">Funds Available</span>
                      )}
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-[#0A1A3A] border-t-transparent rounded-full"></div>
                  ) : (
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      currentBalance >= activationFee ? 'border-[#0A1A3A]' : 'border-gray-300'
                    }`}>
                         {currentBalance >= activationFee && <div className="w-3 h-3 bg-[#0A1A3A] rounded-full"></div>}
                    </div>
                  )}
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