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

  // --- PAYMENT CLICK HANDLER ---
  const handleWalletPayment = () => {
    // 1. User Check
    if (!userEmail) {
      toast.error("User not found! Please login again.");
      return;
    }

    // 2. Balance Check (Beautiful Alert)
    if (currentBalance < activationFee) {
      toast.custom((t) => (
        <div className="bg-white border border-red-100 shadow-2xl rounded-2xl p-4 flex items-start gap-3 w-full max-w-sm animate-slideIn">
           <div className="bg-red-50 p-2 rounded-full text-red-500">
             <AlertTriangle size={20} />
           </div>
           <div className="flex-1">
             <h3 className="font-bold text-gray-800 text-sm">Insufficient Funds</h3>
             <p className="text-xs text-gray-500 mt-1">
               Required: <span className="font-bold text-gray-800">${activationFee.toFixed(2)}</span>
               <br />
               Available: <span className="font-bold text-red-500">${currentBalance.toFixed(2)}</span>
             </p>
           </div>
           <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
      ));
      return;
    }

    // 3. Confirmation Toast
    toast.custom((t) => (
      <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-5 w-full max-w-sm animate-slideIn">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-50 p-2 rounded-full text-[#0A1A3A]">
            <CreditCard size={20} />
          </div>
          <h3 className="font-bold text-gray-800">Confirm Payment?</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          You are about to pay <span className="font-bold text-[#0A1A3A]">${activationFee}</span> to become a Seller.
        </p>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              toast.dismiss(t);
              processPayment(); // Confirm Payment Call
            }}
            className="px-4 py-1.5 text-xs font-bold text-white bg-[#0A1A3A] hover:bg-[#1a2e4d] rounded-lg shadow-md transition"
          >
            Confirm Pay
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  // --- API CALL ---
  const processPayment = async () => {
    setLoading(true);
    const toastId = toast.loading("Processing payment...");

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
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-green-100 p-5 flex items-start gap-4 relative overflow-hidden animate-slideIn">
             <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -z-10" />
             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 shadow-sm">
               <ShieldCheck size={26} strokeWidth={2.5} />
             </div>
             <div className="flex-1">
               <h3 className="text-lg font-bold text-gray-900">Upgrade Successful!</h3>
               <p className="text-sm text-gray-500 mt-1">
                 You are now a Seller. <span className="text-orange-600 font-bold">Logging out...</span>
               </p>
               <div className="mt-2 flex gap-2">
                 <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                   PAID: ${activationFee}
                 </span>
               </div>
             </div>
             <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
        ), { duration: 4000 });

        setIsPaymentModalOpen(false);
        
        // Logout & Redirect
        setTimeout(() => {
            handleSafeLogout();
        }, 2000);

      } else {
        toast.error(result.message || "Activation Failed");
      }
    } catch (err) {
      toast.dismiss(toastId);
      console.error(err);
      toast.error("Connection Error. Check Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F4] font-sans text-gray-800 p-4 md:p-8 relative">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0A1A3A]">
          Activate Seller Account
        </h1>
        <p className="text-gray-500 mt-2">
          Start your selling journey by unlocking merchant features.
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12 flex flex-col items-center">
        
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
          <Store size={32} />
        </div>

        <h2 className="text-2xl font-bold text-[#0A1A3A] mb-3">
          Merchant Activation Fee
        </h2>
        <p className="text-gray-500 text-center max-w-lg mb-10">
          One-time payment to verify your identity and enable listing capabilities.
        </p>

        {/* Fee Display */}
        <div className="w-full max-w-md bg-orange-50 border border-orange-200 rounded-xl p-5 flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-orange-600" size={24} />
            <div>
              <p className="font-bold text-[#0A1A3A]">Seller Access</p>
              <p className="text-xs text-gray-500">Lifetime Validity</p>
            </div>
          </div>
          <span className="text-2xl font-black text-orange-600">${activationFee}</span>
        </div>

        <button
          onClick={() => setIsPaymentModalOpen(true)}
          className="w-full max-w-md bg-[#0A1A3A] hover:bg-[#1a2e4d] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95"
        >
          Pay Activation Fee
        </button>
      </div>

      {/* ================= PAYMENT MODAL ================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn relative">
            
            {/* Modal Header */}
            <div className="bg-[#0A1A3A] p-5 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Lock size={18} className="text-orange-500" /> Secure Checkout
              </h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-white/70 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total To Pay</p>
                <h2 className="text-4xl font-black text-[#0A1A3A] my-2">
                  ${activationFee.toFixed(2)}
                </h2>
                
                {/* Balance Indicator with Refresh Logic */}
                <div className="flex items-center justify-center gap-2 mt-2">
                   <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      currentBalance >= activationFee ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"
                    }`}>
                      <Wallet size={14} />
                      Current Balance: ${currentBalance.toFixed(2)}
                   </div>
                   <button 
                      onClick={() => refetch()} 
                      className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition"
                      title="Refresh Balance"
                   >
                      <RefreshCw size={14} />
                   </button>
                </div>
              </div>

              {/* Only Pay with Balance Option */}
              <div className="space-y-3">
                <button
                  onClick={handleWalletPayment}
                  disabled={loading || currentBalance < activationFee}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all group ${
                    currentBalance >= activationFee
                      ? "border-[#0A1A3A] bg-white hover:bg-gray-50 cursor-pointer shadow-sm hover:shadow-md"
                      : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${currentBalance >= activationFee ? "bg-[#0A1A3A] text-white" : "bg-gray-200 text-gray-400"}`}>
                      <Wallet size={20} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-[#0A1A3A]">Pay with Balance</h4>
                      {currentBalance < activationFee ? (
                        <span className="text-xs text-red-500 font-semibold">Insufficient funds</span>
                      ) : (
                        <span className="text-xs text-green-600 font-semibold">Funds Available</span>
                      )}
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-[#0A1A3A] border-t-transparent rounded-full"></div>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${currentBalance >= activationFee ? 'border-[#0A1A3A]' : 'border-gray-300'}`}>
                         {currentBalance >= activationFee && <div className="w-2.5 h-2.5 bg-[#0A1A3A] rounded-full"></div>}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPay;