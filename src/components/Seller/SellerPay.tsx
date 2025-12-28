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
import Swal from "sweetalert2"; // SweetAlert Import

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
  const handleWalletPayment = async () => {
    // 1. User Check
    if (!userEmail) {
      Swal.fire({
        icon: "error",
        title: "User not found",
        text: "Please login again to continue.",
      });
      return;
    }

    // 2. Balance Check (SweetAlert Error)
    if (currentBalance < activationFee) {
      Swal.fire({
        icon: "error",
        title: "Insufficient Funds",
        html: `
          <div style="text-align: left; font-size: 14px;">
            <p>You need: <b>$${activationFee.toFixed(2)}</b></p>
            <p style="color: red;">Available: <b>$${currentBalance.toFixed(2)}</b></p>
            <br/>
            Please deposit funds first.
          </div>
        `,
        confirmButtonColor: "#d33",
        confirmButtonText: "Close"
      });
      return;
    }

    // 3. Confirmation (SweetAlert Confirm)
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to pay $${activationFee} to become a Seller.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0A1A3A',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Pay Now!'
    });

    if (!confirmResult.isConfirmed) return;

    // 4. Processing
    setLoading(true);
    
    // Show Loading Alert
    Swal.fire({
      title: 'Processing Payment...',
      html: 'Please wait while we upgrade your account.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

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

        // 5. Success Alert (Auto Close)
        await Swal.fire({
          icon: 'success',
          title: 'Upgrade Successful!',
          html: `
            <p>You are now a Seller!</p>
            <p style="color: orange; font-weight: bold; margin-top: 10px;">Logging out to apply changes...</p>
          `,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          willClose: () => {
             // Alert বন্ধ হওয়ার পর লগআউট
             handleSafeLogout();
          }
        });

      } else {
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